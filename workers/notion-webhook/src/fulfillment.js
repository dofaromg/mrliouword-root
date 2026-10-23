// MRL 付款→商品核對。origin_signature: MrLiouWord
// 證據來源: PRICING_CATALOG / MRL_COMMERCIAL_LEDGER §3, §9.6。
// 不推定 canonical Product_ID、License_ID 或真正交付;無副作用。
import { PRICING_CATALOG } from "./pricing.js";

export function fulfillmentReview(asset) {
  const entry = asset?.entry;
  const evidence = entry?.evidence;
  const trusted = asset?.origin_signature === "MrLiouWord"
    && asset?.source === "MRL_EXT_STRIPE" && !!evidence?.event_id;
  const matches = PRICING_CATALOG.sections.flatMap((s) => s.items).filter((item) =>
    item.stripe && [item.stripe.payment_link, ...(item.stripe.alt_payment_links || [])]
      .includes(entry?.refs?.payment_link));
  const item = matches.length === 1 ? matches[0] : null;
  const checkout = ["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(evidence?.event_type);
  const mode = item?.interval ? "subscription" : "payment";
  let status = "payment_review_required";
  if (!trusted) status = "invalid_evidence";
  else if (evidence.livemode !== true) status = "test_event_no_live_fulfillment";
  else if (["refunded", "disputed", "failed"].includes(entry.status)) status = "exception_review_required";
  else if (entry.status !== "paid" || entry.refs?.payment_status !== "paid") status = "payment_not_verified";
  else if (!checkout || !item) status = "product_mapping_review_required";
  else if (entry.refs.mode !== mode || entry.currency !== item.currency || entry.amount !== item.price) status = "payment_terms_review_required";
  else status = "manual_fulfillment_evidence_required";

  return {
    payment: asset, // 原始信封完整保留,不修改歷史
    catalog_item_id: item?.id || null,
    stripe_product_id: item?.stripe.product || null,
    stripe_price_id: item?.stripe.price || null,
    Product_ID: null, License_ID: null,
    review_status: status,
    grants_access: false,
    delivery_status: "UNVERIFIED",
    required_evidence: ["owner_approved_product_mapping", "license_scope_and_term", "runtime_grant_or_credit_receipt", "customer_acceptance", "tested_support_channel"],
  };
}
