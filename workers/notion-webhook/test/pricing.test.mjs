// MRL 定價頁測試:8 條 Stripe 付款連結全部接上、APIWorks 方案有連、目錄與頁面一致
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { PRICING_CATALOG, paymentLinks, pricingHtml } from "../src/pricing.js";

const EXPECTED_LINKS = [
  "https://buy.stripe.com/cNi28qcDN9bk8hxgbsb7y00",
  "https://buy.stripe.com/7sY6oG8nxfzI0P52kCb7y01",
  "https://buy.stripe.com/fZu14m9rB3R0cxN7EWb7y02",
  "https://buy.stripe.com/aFa00i9rBgDMbtJe3kb7y03",
  "https://buy.stripe.com/eVqaEWdHR0EO2Xd8J0b7y04",
  "https://buy.stripe.com/aFa14mfPZdrAapF8J0b7y05",
  "https://buy.stripe.com/7sYaEWgU31IS55lf7ob7y06",
  "https://buy.stripe.com/5kQ14meLVfzI55lcZgb7y07",
];
const ctx = { waitUntil() {} };

test("catalog wires all 8 live Stripe payment links exactly once", () => {
  const links = paymentLinks();
  assert.deepEqual([...links].sort(), [...EXPECTED_LINKS].sort());
  assert.equal(new Set(links).size, 8);
  for (const s of PRICING_CATALOG.sections) for (const it of s.items) {
    assert.ok(it.url && it.cta && it.name, `item ${it.id} incomplete`);
    if (it.url.startsWith("https://buy.stripe.com/")) assert.ok(it.stripe?.payment_link && it.stripe?.price, `item ${it.id} lacks stripe ids`);
  }
});

test("GET /pricing renders every link, APIWorks plans, merchant, MRL headers", async () => {
  const r = await worker.fetch(new Request("https://mrliouword.com/pricing"), {}, ctx);
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-type"), /text\/html/);
  assert.equal(r.headers.get("x-mrl-origin-signature"), "MrLiouWord");
  const body = await r.text();
  for (const u of EXPECTED_LINKS) assert.ok(body.includes(`href="${u}"`), `missing ${u}`);
  assert.ok(body.includes("https://mrl-apiworks.z814241.workers.dev/#pricing"));
  assert.ok(body.includes("Mrliouword, LLC"));
  assert.ok(body.includes("NT$") && body.includes("US$"));
  assert.ok(!body.includes("undefined") && !body.includes("[object"));
  assert.equal(body, pricingHtml());
  const r2 = await worker.fetch(new Request("https://mrliouword.com/pricing/"), {}, ctx);
  assert.equal(r2.status, 200);
});

test("GET /pricing.json returns the same catalog as an MRL asset", async () => {
  const r = await worker.fetch(new Request("https://mrliouword.com/pricing.json"), {}, ctx);
  assert.equal(r.status, 200);
  const j = await r.json();
  assert.equal(j.mrl_asset, true);
  assert.equal(j.origin_signature, "MrLiouWord");
  assert.equal(j.emitted_by, "mrliouword-root");
  assert.equal(paymentLinks(j).length, 8);
});
