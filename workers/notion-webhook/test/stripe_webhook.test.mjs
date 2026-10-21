// MRL 收帳入口單元測試:Stripe 驗簽 + 商業帳本登錄(node --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import worker, { verifyStripeSignature, ledgerEntryFromEvent, LEDGER_SCHEMA } from "../src/index.js";

const SECRET = "whsec_test_only_not_a_real_secret";
const now = () => Math.floor(Date.now() / 1000);
const sign = (body, secret = SECRET, t = now()) =>
  `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;

class MemKV {
  constructor() { this.m = new Map(); }
  async get(k) { return this.m.has(k) ? this.m.get(k) : null; }
  async put(k, v) { this.m.set(k, v); }
  async delete(k) { this.m.delete(k); }
  async list({ prefix = "", limit = 1000 } = {}) {
    const keys = [...this.m.keys()].filter((k) => k.startsWith(prefix)).sort().slice(0, limit).map((name) => ({ name }));
    return { keys, list_complete: true, cursor: undefined };
  }
}
const ctx = { waitUntil() {} };
const post = (path, body, headers = {}) =>
  new Request(`https://mrliouword-root.example${path}`, { method: "POST", body, headers });

const checkoutEvent = (id = "evt_1") => ({
  id, object: "event", type: "checkout.session.completed", created: 1760000000, livemode: true,
  data: { object: {
    id: "cs_live_1", object: "checkout.session", mode: "payment", payment_status: "paid",
    payment_intent: "pi_1", customer: "cus_1", amount_total: 9900, currency: "twd",
    payment_link: "plink_1", client_reference_id: "ORD-1", metadata: { sku: "MRL-X", mrl_license: "LIC-1", email: "leak@example.org", note: "customer typed this" },
    total_details: { amount_tax: 471, amount_discount: 0, amount_shipping: 0 },
    customer_details: { email: "Buyer@Example.com", name: "should not be stored" },
  } },
});

test("verifyStripeSignature: valid / tampered / stale / missing / multi-v1", async () => {
  const body = JSON.stringify({ id: "evt_sig" });
  assert.equal(await verifyStripeSignature(SECRET, body, sign(body)), true);
  assert.equal(await verifyStripeSignature(SECRET, body + " ", sign(body)), false);
  assert.equal(await verifyStripeSignature("whsec_other", body, sign(body)), false);
  assert.equal(await verifyStripeSignature(SECRET, body, sign(body, SECRET, now() - 3600)), false);
  assert.equal(await verifyStripeSignature(SECRET, body, ""), false);
  assert.equal(await verifyStripeSignature("", body, sign(body)), false);
  assert.equal(await verifyStripeSignature(SECRET, body, "garbage"), false);
  assert.equal(await verifyStripeSignature(SECRET, body, `${sign(body)},v1=deadbeef`), true);
  assert.equal(await verifyStripeSignature(SECRET, body, `t=${now()},v1=deadbeef,v0=x`), false);
});

test("ledgerEntryFromEvent: checkout.session.completed → §4 schema, no raw email", async () => {
  const e = await ledgerEntryFromEvent(checkoutEvent());
  assert.equal(e.Order_ID, "cs_live_1");
  assert.equal(e.Payment_ID, "pi_1");
  assert.equal(e.Customer_ID, "cus_1");
  assert.equal(e.amount, 9900);
  assert.equal(e.currency, "twd");
  assert.equal(e.status, "paid");
  assert.equal(e.processor, "stripe");
  assert.equal(e.refs.payment_link, "plink_1");
  assert.equal(e.refs.client_reference_id, "ORD-1");
  assert.equal(e.evidence.event_id, "evt_1");
  assert.equal(e.evidence.event_type, "checkout.session.completed");
  assert.equal(e.tax, 471);
  assert.equal(e.amount_kind, "delta");
  assert.deepEqual(e.refs.metadata, { sku: "MRL-X", mrl_license: "LIC-1" }); // 白名單外的 metadata 不落帳
  assert.match(e.email_fp, /^[0-9a-f]{16}$/);
  const dump = JSON.stringify(e);
  assert.ok(!dump.includes("Example.com") && !dump.includes("should not be stored") && !dump.includes("leak@") && !dump.includes("customer typed"));
});

test("ledgerEntryFromEvent: subscription checkout has no Payment_ID; dispute and refund.created map from their own objects", async () => {
  const sub = checkoutEvent("evt_sub");
  Object.assign(sub.data.object, { id: "cs_sub", mode: "subscription", payment_intent: null, subscription: "sub_1" });
  const se = await ledgerEntryFromEvent(sub);
  assert.equal(se.Payment_ID, null);
  assert.equal(se.Order_ID, "cs_sub");
  assert.equal(se.refs.subscription, "sub_1");

  const dp = await ledgerEntryFromEvent({ id: "evt_dp", type: "charge.dispute.created", created: 1, livemode: true,
    data: { object: { id: "dp_1", object: "dispute", charge: "ch_1", payment_intent: "pi_9", amount: 1000, currency: "twd", reason: "fraudulent", status: "needs_response" } } });
  assert.equal(dp.status, "disputed"); assert.equal(dp.Payment_ID, "pi_9"); assert.equal(dp.Order_ID, "pi_9");
  assert.equal(dp.refs.dispute, "dp_1"); assert.equal(dp.refs.charge, "ch_1"); assert.equal(dp.amount, 1000);

  const rf = await ledgerEntryFromEvent({ id: "evt_rf", type: "refund.created", created: 1, livemode: true,
    data: { object: { id: "re_1", object: "refund", charge: "ch_1", payment_intent: "pi_9", amount: 100, currency: "twd", status: "succeeded" } } });
  assert.equal(rf.status, "refunded"); assert.equal(rf.amount, 100); assert.equal(rf.amount_kind, "delta"); assert.equal(rf.refs.refund, "re_1");

  const oob = await ledgerEntryFromEvent({ id: "evt_oob", type: "invoice.paid", created: 1, livemode: true,
    data: { object: { id: "in_2", customer: "cus_2", amount_paid: 500, amount_due: 500, currency: "twd", paid_out_of_band: true, total_taxes: [{ amount: 20 }, { amount: 4 }] } } });
  assert.equal(oob.Payment_ID, null); assert.equal(oob.refs.paid_out_of_band, true); assert.equal(oob.tax, 24);
});

test("ledgerEntryFromEvent: pending / invoice / refund / unknown", async () => {
  const pending = checkoutEvent(); pending.data.object.payment_status = "unpaid";
  assert.equal((await ledgerEntryFromEvent(pending)).status, "pending");

  const inv = await ledgerEntryFromEvent({ id: "evt_inv", type: "invoice.paid", created: 1, livemode: true,
    data: { object: { id: "in_1", payment_intent: "pi_9", customer: "cus_2", amount_paid: 49900, amount_due: 49900, currency: "twd", subscription: "sub_1", number: "QHKZ-0001" } } });
  assert.equal(inv.Payment_ID, "pi_9"); assert.equal(inv.amount, 49900); assert.equal(inv.refs.subscription, "sub_1"); assert.equal(inv.status, "paid");

  const ref = await ledgerEntryFromEvent({ id: "evt_ref", type: "charge.refunded", created: 1, livemode: true,
    data: { object: { id: "ch_1", payment_intent: "pi_9", customer: "cus_2", amount: 49900, amount_refunded: 49900, currency: "twd" } } });
  assert.equal(ref.status, "refunded"); assert.equal(ref.amount, 49900); assert.equal(ref.refs.charge, "ch_1");
  assert.equal(ref.amount_kind, "cumulative"); // Charge 快照的累計退款額

  assert.equal(await ledgerEntryFromEvent({ id: "x", type: "customer.created", data: { object: { id: "cus_3" } } }), null);
  assert.equal(await ledgerEntryFromEvent(null), null);
});

test("POST /stripe/webhook: 503 without secret, 400 bad signature, 200 + ledger key, replay dedup", async () => {
  const kv = new MemKV();
  const body = JSON.stringify(checkoutEvent());

  let r = await worker.fetch(post("/stripe/webhook", body, { "stripe-signature": sign(body) }), { EVENTS_KV: kv }, ctx);
  assert.equal(r.status, 503);
  // 有密鑰但沒綁 KV 也要 503:回 200 等於告訴 Stripe 已收妥,實際上什麼都沒記
  r = await worker.fetch(post("/stripe/webhook", body, { "stripe-signature": sign(body) }), { STRIPE_WEBHOOK_SECRET: SECRET }, ctx);
  assert.equal(r.status, 503);

  const env = { EVENTS_KV: kv, STRIPE_WEBHOOK_SECRET: SECRET, MRL_HANDSHAKE_KEY: "op-key" };
  r = await worker.fetch(post("/stripe/webhook", body, { "stripe-signature": sign(body, "whsec_wrong") }), env, ctx);
  assert.equal(r.status, 400);
  assert.equal(kv.m.size, 0);

  r = await worker.fetch(post("/stripe/webhook", body, { "stripe-signature": sign(body) }), env, ctx);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("x-mrl-asset"), "true");
  assert.deepEqual(await r.json(), { ok: true, duplicate: false, recorded: true, status: "paid" });
  const stored = JSON.parse(await kv.get("MRL:ledger:payment:pi_1:evt_1"));
  assert.equal(stored.mrl_asset, true);
  assert.equal(stored.source, "MRL_EXT_STRIPE");
  assert.equal(stored.origin_signature, "MrLiouWord");
  assert.equal(stored.schema, LEDGER_SCHEMA);
  assert.equal(stored.entry.Payment_ID, "pi_1");
  assert.ok(await kv.get("MRL:dedup:stripe:evt_1"));

  const sizeBefore = kv.m.size;
  r = await worker.fetch(post("/stripe/webhook", body, { "stripe-signature": sign(body) }), env, ctx);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true, duplicate: true, recorded: false });
  assert.equal(kv.m.size, sizeBefore);

  // 非帳本事件:只留 30 天事件紀錄,不進帳本
  const other = JSON.stringify({ id: "evt_c", type: "customer.created", created: 2, data: { object: { id: "cus_x" } } });
  r = await worker.fetch(post("/stripe/webhook", other, { "stripe-signature": sign(other) }), env, ctx);
  assert.deepEqual(await r.json(), { ok: true, duplicate: false, recorded: false, status: null });
  assert.ok(await kv.get("MRL:evt:stripe:evt_c"));
  assert.equal([...kv.m.keys()].filter((k) => k.startsWith("MRL:ledger:payment:")).length, 1);

  // 沒有 Payment_ID 的登錄(訂閱 checkout)用 Order_ID 當 key
  const sub = checkoutEvent("evt_sub"); Object.assign(sub.data.object, { id: "cs_sub", mode: "subscription", payment_intent: null, subscription: "sub_1" });
  const subBody = JSON.stringify(sub);
  r = await worker.fetch(post("/stripe/webhook", subBody, { "stripe-signature": sign(subBody) }), env, ctx);
  assert.equal(r.status, 200);
  assert.ok(await kv.get("MRL:ledger:payment:cs_sub:evt_sub"));

  // 操作者讀帳本:無金鑰 404、有金鑰 200
  r = await worker.fetch(new Request("https://x/ledger/payments"), env, ctx);
  assert.equal(r.status, 404);
  r = await worker.fetch(new Request("https://x/ledger/payments?k=wrong"), env, ctx);
  assert.equal(r.status, 404);
  r = await worker.fetch(new Request("https://x/ledger/payments?k=op-key"), env, ctx);
  assert.equal(r.status, 200);
  const page = await r.json();
  assert.equal(page.count, 2);
  assert.deepEqual(page.entries.map((e) => e.entry.Order_ID).sort(), ["cs_live_1", "cs_sub"]);
  // 標頭優先:Bearer 正確 → 200;Bearer 錯誤即使 ?k= 正確也 404(標頭存在時不退回查詢字串)
  r = await worker.fetch(new Request("https://x/ledger/payments", { headers: { authorization: "Bearer op-key" } }), env, ctx);
  assert.equal(r.status, 200);
  r = await worker.fetch(new Request("https://x/ledger/payments?k=op-key", { headers: { authorization: "Bearer nope" } }), env, ctx);
  assert.equal(r.status, 404);
});

test("POST /stripe/webhook: ledger write failure leaves no dedup key, so Stripe's retry still records", async () => {
  const kv = new MemKV();
  let failNext = true;
  const realPut = kv.put.bind(kv);
  kv.put = async (k, v, o) => { if (failNext && k.startsWith("MRL:ledger:payment:")) { failNext = false; throw new Error("kv transient"); } return realPut(k, v, o); };
  const env = { EVENTS_KV: kv, STRIPE_WEBHOOK_SECRET: SECRET };
  const body = JSON.stringify(checkoutEvent("evt_retry"));
  await assert.rejects(worker.fetch(post("/stripe/webhook", body, { "stripe-signature": sign(body) }), env, ctx));
  assert.equal(await kv.get("MRL:dedup:stripe:evt_retry"), null);
  const r = await worker.fetch(post("/stripe/webhook", body, { "stripe-signature": sign(body) }), env, ctx);
  assert.deepEqual(await r.json(), { ok: true, duplicate: false, recorded: true, status: "paid" });
  assert.ok(await kv.get("MRL:ledger:payment:pi_1:evt_retry"));
  assert.ok(await kv.get("MRL:dedup:stripe:evt_retry"));
});

test("GET /health reports stripe_webhook_configured", async () => {
  let r = await worker.fetch(new Request("https://x/health"), {}, ctx);
  let h = await r.json();
  assert.equal(h.stripe_webhook_configured, false);
  assert.equal(h.kv_bound, false);
  r = await worker.fetch(new Request("https://x/health"), { STRIPE_WEBHOOK_SECRET: SECRET, EVENTS_KV: new MemKV() }, ctx);
  h = await r.json();
  assert.equal(h.stripe_webhook_configured, true);
  assert.equal(h.signing_secret_source, "none");
});
