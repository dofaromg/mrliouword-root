// origin_signature: MrLiouWord — 合成事件,不呼叫 Stripe、不發放服務。
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import worker, { ledgerEntryFromEvent } from "../src/index.js";
import { fulfillmentReview } from "../src/fulfillment.js";
import { PRICING_CATALOG } from "../src/pricing.js";

const secret = "whsec_synthetic_only";
const ctx = { waitUntil() {} };
class KV {
  m = new Map();
  async get(k) { return this.m.get(k) ?? null; }
  async put(k, v) { this.m.set(k, v); }
  async list({ prefix, cursor }) {
    const keys = [...this.m.keys()].filter((k) => k.startsWith(prefix)).sort();
    const offset = Number(cursor || 0);
    return { keys: keys.slice(offset, offset + 1).map((name) => ({ name })), list_complete: offset + 1 >= keys.length, cursor: String(offset + 1) };
  }
}
function event(item, link, id = "evt_synthetic") {
  return { id, type: "checkout.session.completed", created: 1, livemode: true,
    data: { object: { id: "cs_synthetic", payment_intent: "pi_synthetic", customer: "cus_synthetic",
      payment_status: "paid", mode: item.interval ? "subscription" : "payment",
      payment_link: link, amount_total: item.price, currency: item.currency } } };
}
const item = PRICING_CATALOG.sections[0].items[0];
async function asset(e) {
  return { origin_signature: "MrLiouWord", source: "MRL_EXT_STRIPE", entry: await ledgerEntryFromEvent(e) };
}
async function post(e, env) {
  const body = JSON.stringify(e), t = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  return worker.fetch(new Request("https://x/stripe/webhook", { method: "POST", body,
    headers: { "stripe-signature": `t=${t},v1=${signature}` } }), env, ctx);
}

test("all eight primary/legacy Payment Links map to six catalog items, never to a grant", async () => {
  let count = 0;
  for (const s of PRICING_CATALOG.sections) for (const it of s.items) {
    if (!it.stripe) continue;
    for (const link of [it.stripe.payment_link, ...(it.stripe.alt_payment_links || [])]) {
      const a = await asset(event(it, link));
      const before = JSON.stringify(a);
      const review = fulfillmentReview(a);
      assert.equal(review.catalog_item_id, it.id);
      assert.equal(review.stripe_price_id, it.stripe.price);
      assert.equal(review.review_status, "manual_fulfillment_evidence_required");
      assert.equal(review.grants_access, false);
      assert.equal(review.delivery_status, "UNVERIFIED");
      assert.equal(review.License_ID, null);
      assert.equal(JSON.stringify(a), before);
      count++;
    }
  }
  assert.equal(count, 8);
});

test("missing/unpaid/unknown payment status cannot become paid, including async success", async () => {
  for (const type of ["checkout.session.completed", "checkout.session.async_payment_succeeded"]) {
    for (const value of [undefined, null, "", "unpaid", "no_payment_required", "unexpected"]) {
      const e = event(item, item.stripe.payment_link); e.type = type;
      e.data.object.payment_status = value;
      const a = await asset(e);
      assert.equal(a.entry.status, "pending");
      assert.equal(fulfillmentReview(a).review_status, "payment_not_verified");
    }
  }
  const e = event(item, item.stripe.payment_link); e.type = "checkout.session.async_payment_failed";
  assert.equal((await ledgerEntryFromEvent(e)).status, "failed");
});

test("unknown links, test events, mismatched terms, historical paid rows and exceptions require review", async () => {
  const good = await asset(event(item, item.stripe.payment_link));
  for (const [mutate, status] of [
    [(a) => { a.entry.evidence.livemode = false; }, "test_event_no_live_fulfillment"],
    [(a) => { a.entry.refs.payment_link = "plink_unknown"; }, "product_mapping_review_required"],
    [(a) => { a.entry.currency = "usd"; }, "payment_terms_review_required"],
    [(a) => { a.entry.amount = 1; }, "payment_terms_review_required"],
    [(a) => { a.entry.refs.mode = "setup"; }, "payment_terms_review_required"],
    [(a) => { delete a.entry.refs.payment_status; }, "payment_not_verified"],
    [(a) => { a.entry.status = "refunded"; }, "exception_review_required"],
    [(a) => { a.entry.status = "disputed"; }, "exception_review_required"],
    [(a) => { a.origin_signature = "other"; }, "invalid_evidence"],
  ]) {
    const a = structuredClone(good); mutate(a);
    assert.equal(fulfillmentReview(a).review_status, status);
    assert.equal(fulfillmentReview(a).grants_access, false);
  }
  assert.equal(fulfillmentReview({ raw: "corrupt" }).review_status, "invalid_evidence");
});

test("signed webhook → authenticated paginated review; reads do not write or grant", async () => {
  const kv = new KV(), env = { EVENTS_KV: kv, STRIPE_WEBHOOK_SECRET: secret, MRL_HANDSHAKE_KEY: "operator" };
  const e = event(item, item.stripe.payment_link);
  assert.equal((await post(e, env)).status, 200);
  const asyncEvent = structuredClone(e); asyncEvent.id = "evt_synthetic_async"; asyncEvent.type = "checkout.session.async_payment_succeeded";
  assert.equal((await post(asyncEvent, env)).status, 200);
  const snapshot = JSON.stringify([...kv.m]);
  for (const headers of [{}, { authorization: "Bearer wrong" }]) {
    assert.equal((await worker.fetch(new Request("https://x/ledger/fulfillment?k=operator", { headers }), env, ctx)).status, 404);
  }
  const headers = { authorization: "Bearer operator" };
  const r = await worker.fetch(new Request("https://x/ledger/fulfillment", { headers }), env, ctx);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("cache-control"), "no-store");
  const page = await r.json();
  assert.equal(page.scope, "payment_event_page_not_order_queue");
  assert.equal(page.entries[0].review_status, "manual_fulfillment_evidence_required");
  assert.equal(page.count, 1); assert.equal(page.cursor, "1");
  const next = await (await worker.fetch(new Request(`https://x/ledger/fulfillment?cursor=${page.cursor}`, { headers }), env, ctx)).json();
  assert.equal(next.cursor, null); assert.equal(next.count, 1);
  assert.equal(JSON.stringify([...kv.m]), snapshot);
});

test("retry after dedup write failure preserves the first payment evidence bytes", async () => {
  const kv = new KV(), env = { EVENTS_KV: kv, STRIPE_WEBHOOK_SECRET: secret };
  const original = kv.put.bind(kv); let fail = true;
  kv.put = async (k, v) => { if (fail && k.startsWith("MRL:dedup:stripe:")) { fail = false; throw Error("dedup failed"); } return original(k, v); };
  const e = event(item, item.stripe.payment_link);
  await assert.rejects(post(e, env));
  const key = "MRL:ledger:payment:pi_synthetic:evt_synthetic";
  const first = await kv.get(key);
  const changed = structuredClone(e); changed.data.object.amount_total = 1;
  assert.equal((await post(changed, env)).status, 200);
  assert.equal(await kv.get(key), first);
  assert.ok(await kv.get("MRL:dedup:stripe:evt_synthetic"));
});
