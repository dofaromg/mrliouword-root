// MRL 自動化出口 Worker(部署名 mrliouword-root)
//   1) Notion Webhook Receiver:Notion 有變動 → POST 進來 → 驗證簽章 → 觸發動作
//   2) MRL 商業帳本收帳入口:Stripe 付款事件 → 驗簽 → 寫入 MRL 商業帳本(KV,只增不刪)
//
// 端點:
//   POST /notion/webhook     接收 Notion 事件(含首次驗證握手)
//   GET  /notion/handshake   一次性取出 Notion 握手 token(需 MRL_HANDSHAKE_KEY)
//   POST /stripe/webhook     接收 Stripe 事件 → 驗簽 → 商業帳本登錄(docs/business/MRL_COMMERCIAL_LEDGER.md §4)
//   GET  /ledger/payments    操作者讀取帳本登錄(需 MRL_HANDSHAKE_KEY)
//   GET  /health             健康 + 設定狀態
//
// MRL 資產標記原則(治理):
//   這支 worker 是 MRL 系統的「自動化出口」。任何從這裡送出去 / 記下來的資料
//   一律標記為 MRL 資產:namespace=MRL、origin_signature=MrLiouWord。
//   外部來源一律轉 MRL_EXT_ 品牌別名(見 docs/MRL_EXTERNAL_NAMING.md):Notion→MRL_EXT_NOTION、Stripe→MRL_EXT_STRIPE。
//
// 環境變數 / 綁定(都不寫死在程式,見 wrangler.toml / Secrets Store):
//   NOTION_WEBHOOK_SECRET  (可選)Notion 驗簽金鑰;未設時使用握手取出時自動存進 KV 的 token——設在 Secrets Store 會優先
//   STRIPE_WEBHOOK_SECRET  Stripe webhook 端點簽章密鑰(whsec_…);未設時 /stripe/webhook 回 503,不收任何事件
//   FORWARD_URL (可選)     Notion 驗證通過的事件要轉發到哪(你的「動作」端點)
//   EVENTS_KV  (可選)      事件記錄 / 去重 / 死信佇列 / 握手 token 暫存 / 商業帳本 用 KV(有綁才用,沒有就略過)
//   MRL_HANDSHAKE_KEY      你自設的操作者金鑰:一次性取出 Notion 握手 token、讀取帳本——放 Secrets Store

const enc = new TextEncoder();

// ── MRL 資產標記(來源從這裡出去一律標注)──
const MRL = {
  namespace: "MRL",
  origin_signature: "MrLiouWord",
  emitted_by: "mrliouword-root",
  ext_source: "MRL_EXT_NOTION", // 外部來源 Notion 的 MRL 品牌別名
  stripe_source: "MRL_EXT_STRIPE", // 外部金流商 Stripe 的 MRL 品牌別名
};

// KV key 一律加 MRL 前綴,標明是 MRL 資產
const kvKey = (kind, id) => `MRL:${kind}:${id}`;
const DAY = 60 * 60 * 24;

// 把出去的酬載包成 MRL 資產信封:標記命名空間、原始簽章、外部來源別名。
function toMrlAsset(event, source = MRL.ext_source) {
  return {
    mrl_asset: true,
    mrl_namespace: MRL.namespace,
    origin_signature: MRL.origin_signature,
    emitted_by: MRL.emitted_by,
    source,
    event,
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // 回應也標記 MRL 資產出處
      "x-mrl-asset": "true",
      "x-mrl-namespace": MRL.namespace,
      "x-mrl-origin-signature": MRL.origin_signature,
    },
  });
}

// 常數時間比較,避免計時側信道
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacHex(secret, body) {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 驗證 Notion 的 X-Notion-Signature(HMAC-SHA256(verification_token, raw_body))
async function verifySignature(secret, rawBody, header) {
  if (!secret || !header) return false;
  const provided = header.replace(/^sha256=/i, "").trim().toLowerCase();
  const expected = (await hmacHex(secret, rawBody)).toLowerCase();
  return timingSafeEqual(provided, expected);
}

// 驗證 Stripe 的 Stripe-Signature:`t=<unix>,v1=<hex>[,v1=…]`,
// 簽的是 `${t}.${raw_body}`(HMAC-SHA256,端點密鑰 whsec_…),並限制時間差(防重放)。
const STRIPE_TOLERANCE_SEC = 300;
async function verifyStripeSignature(secret, rawBody, header, nowSec = Math.floor(Date.now() / 1000)) {
  if (!secret || !header) return false;
  let t = "";
  const v1s = [];
  for (const part of header.split(",")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k === "t") t = v;
    else if (k === "v1" && v) v1s.push(v.toLowerCase());
  }
  const ts = Number(t);
  if (!t || !v1s.length || !Number.isFinite(ts)) return false;
  if (Math.abs(nowSec - ts) > STRIPE_TOLERANCE_SEC) return false;
  const expected = (await hmacHex(secret, `${t}.${rawBody}`)).toLowerCase();
  let ok = false;
  for (const sig of v1s) if (timingSafeEqual(sig, expected)) ok = true;
  return ok;
}

// ── Notion 握手 token 的安全處理 ──
// token 本體就是之後驗簽的 HMAC 金鑰,絕不可整串進日誌(CWE-532)。
// 作法:日誌只留遮罩指紋;token 存 KV(10 分鐘 TTL),由持有 MRL_HANDSHAKE_KEY 的
// 操作者透過 GET /notion/handshake 一次性取出,取出即刪、重放無效。
const HANDSHAKE_KV_KEY = "MRL:handshake:token";
// 驗簽金鑰:優先 Secrets Store(NOTION_WEBHOOK_SECRET);未設時退回 KV 中「操作者持金鑰取出時」寫入的 token。
// 只在持 MRL_HANDSHAKE_KEY 的一次性取出時才寫入,未經授權的假握手 POST 無法覆蓋驗簽金鑰。
const SIGNING_KV_KEY = "MRL:notion:signing_secret";
async function getSigningSecret(env) {
  if (env.NOTION_WEBHOOK_SECRET) return env.NOTION_WEBHOOK_SECRET;
  if (env.EVENTS_KV) return (await env.EVENTS_KV.get(SIGNING_KV_KEY)) || "";
  return "";
}

async function fingerprint(value) {
  const hex = await sha256Hex(value);
  return `${value.slice(0, 7)}…(sha256:${hex.slice(0, 8)}, len ${value.length})`;
}

// 操作者金鑰檢查(MRL_HANDSHAKE_KEY):查詢字串 ?k=;常數時間比較;未設或不符一律 404(不洩漏端點存在)。
function operatorAuthorized(url, env) {
  const key = url.searchParams.get("k") || "";
  return !!env.MRL_HANDSHAKE_KEY && timingSafeEqual(key, env.MRL_HANDSHAKE_KEY);
}

// 轉發到動作端點,並保存失敗結果(不吞掉)。
// P1:驗證 response.ok;失敗(網路錯誤或 4xx/5xx)寫進 KV 死信佇列供重試,
// 而非默默丟棄——因為我們對 Notion 已快速回 200,Notion 不會再重送。
async function forwardWithDeadLetter(env, asset, eid, ts) {
  const headers = {
    "content-type": "application/json",
    // 送出去的資料標記為 MRL 資產
    "x-mrl-asset": "true",
    "x-mrl-namespace": MRL.namespace,
    "x-mrl-origin-signature": MRL.origin_signature,
    "x-mrl-source": MRL.ext_source,
  };
  try {
    const resp = await fetch(env.FORWARD_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(asset),
    });
    if (!resp.ok) throw new Error(`forward responded ${resp.status}`);
  } catch (err) {
    console.error("[notion-webhook] forward failed:", String(err));
    if (env.EVENTS_KV) {
      await env.EVENTS_KV.put(
        kvKey("deadletter", `${eid}:${ts}`),
        JSON.stringify({ asset, error: String(err), failed_at: new Date().toISOString() }),
        { expirationTtl: 30 * DAY },
      );
    }
  }
}

// 你的「動作」掛勾:預設 = 去重 → 記 KV → 轉發 FORWARD_URL(全程標記 MRL 資產)。
// 要客製(例如收斂進 MRL 粒子法典)就改這裡。
async function handleTriggeredAction(event, env, ctx) {
  const eid = event?.id || "unknown";
  const ts = event?.timestamp || "";
  const asset = toMrlAsset(event);

  // P2:以 event id 做去重 / 冪等鍵,避免 Notion 重送造成重複轉發。
  // (Workers KV 非強一致,get→put 為務實作法;非冪等下游仍建議自帶去重。)
  if (env.EVENTS_KV && eid !== "unknown") {
    const dedupK = kvKey("dedup", eid);
    const seen = await env.EVENTS_KV.get(dedupK);
    if (seen) {
      console.log("[notion-webhook] duplicate event skipped:", eid);
      return;
    }
    await env.EVENTS_KV.put(dedupK, ts || "1", { expirationTtl: 30 * DAY });
  }

  // 記錄(可選 KV),key 與內容皆標記為 MRL 資產
  if (env.EVENTS_KV) {
    await env.EVENTS_KV.put(kvKey("evt", `${eid}:${ts}`), JSON.stringify(asset), {
      expirationTtl: 30 * DAY,
    });
  }

  // 轉發到動作端點(可選),失敗保存進死信佇列
  if (env.FORWARD_URL) {
    await forwardWithDeadLetter(env, asset, eid, ts);
  }

  // TODO(收斂進 MRL 粒子法典 registry/MRL_PARTICLE_CODEX.json):把 Mrliou 工作區
  // 定義層的變動正規化 + 依 IP-010 標證據等級後,產生「收斂提案」(開 PR / 寫待審佇列),
  // 由 Root Owner 核准才進 particles[]。管線與 schema 見 docs/MRL_PARTICLE_CODEX.md。
}

// ── MRL 商業帳本(Commercial Ledger)收帳入口 ──
// 對應 docs/business/MRL_COMMERCIAL_LEDGER.md §4 Order / Payment Ledger schema:
//   Order_ID / Payment_ID / Customer_ID / 金額 / 幣別 / 金流商 / 狀態 / 證據。
// 紀律:Payment Config ≠ Transaction——只有 Stripe 送來、驗簽通過的事件才登錄;
//       帳本只增不刪——每個事件各寫一個 key、永不覆寫、不設 TTL。
//       最小蒐集——不存 email 原文,只存不可逆指紋(email_fp),客戶細節留在金流商。
const LEDGER_SCHEMA = "MRL_COMMERCIAL_LEDGER.v1/§4";
const LEDGER_EVENT_STATUS = {
  "checkout.session.completed": "paid",
  "checkout.session.async_payment_succeeded": "paid",
  "checkout.session.async_payment_failed": "failed",
  "invoice.paid": "paid",
  "invoice.payment_failed": "failed",
  "charge.refunded": "refunded",
  "charge.dispute.created": "disputed",
};

async function emailFingerprint(email) {
  if (!email) return null;
  return (await sha256Hex(String(email).trim().toLowerCase())).slice(0, 16);
}

// 把 Stripe 事件正規化成帳本登錄(不是帳本事件回 null,只留事件紀錄)。
async function ledgerEntryFromEvent(event) {
  const type = event?.type;
  const obj = event?.data?.object;
  if (!type || !obj || !(type in LEDGER_EVENT_STATUS)) return null;

  let status = LEDGER_EVENT_STATUS[type];
  const base = {
    processor: "stripe",
    status,
    currency: obj.currency || null,
    refs: {},
    evidence: {
      event_id: event.id || null,
      event_type: type,
      event_created: event.created || null,
      livemode: !!event.livemode,
    },
  };

  let email = null;
  if (type.startsWith("checkout.session.")) {
    // Checkout(含 Payment Link)完成:非同步付款未入帳時先記 pending,入帳事件再補一筆 paid。
    if (type === "checkout.session.completed" && obj.payment_status && obj.payment_status !== "paid") status = "pending";
    email = obj.customer_details?.email || obj.customer_email || null;
    Object.assign(base, {
      status,
      Order_ID: obj.id,
      Payment_ID: obj.payment_intent || obj.subscription || obj.id,
      Customer_ID: obj.customer || null,
      amount: obj.amount_total ?? null,
      refs: {
        mode: obj.mode || null,
        payment_link: obj.payment_link || null,
        subscription: obj.subscription || null,
        client_reference_id: obj.client_reference_id || null,
        metadata: obj.metadata || {},
      },
    });
  } else if (type.startsWith("invoice.")) {
    email = obj.customer_email || null;
    Object.assign(base, {
      Order_ID: obj.id,
      Payment_ID: obj.payment_intent || obj.id,
      Customer_ID: obj.customer || null,
      amount: (type === "invoice.paid" ? obj.amount_paid : obj.amount_due) ?? null,
      refs: {
        subscription: obj.subscription || obj.parent?.subscription_details?.subscription || null,
        invoice_number: obj.number || null,
        metadata: obj.metadata || {},
      },
    });
  } else if (type.startsWith("charge.")) {
    email = obj.billing_details?.email || obj.receipt_email || null;
    Object.assign(base, {
      Order_ID: obj.invoice || obj.payment_intent || obj.id,
      Payment_ID: obj.payment_intent || obj.id,
      Customer_ID: obj.customer || null,
      amount: (type === "charge.refunded" ? obj.amount_refunded : obj.amount) ?? null,
      refs: { charge: obj.id, metadata: obj.metadata || {} },
    });
  }
  base.email_fp = await emailFingerprint(email);
  return base;
}

// 收帳處理:去重 → 正規化 → 寫入 KV(同步完成;失敗讓 Stripe 重送,帳本不能漏)。
async function handleStripeEvent(event, env) {
  const eid = event?.id || "unknown";
  if (env.EVENTS_KV && eid !== "unknown") {
    const dedupK = kvKey("dedup:stripe", eid);
    if (await env.EVENTS_KV.get(dedupK)) return { duplicate: true, recorded: false };
    await env.EVENTS_KV.put(dedupK, String(event?.created || "1"), { expirationTtl: 30 * DAY });
  }

  const entry = await ledgerEntryFromEvent(event);
  const summary = { id: eid, type: event?.type || null, created: event?.created || null, livemode: !!event?.livemode };
  if (env.EVENTS_KV) {
    if (entry) {
      // 帳本登錄:永久保存(無 TTL)、每事件一 key、不覆寫既有 key。
      const asset = { ...toMrlAsset(summary, MRL.stripe_source), ledger: "commercial", schema: LEDGER_SCHEMA, entry, recorded_at: new Date().toISOString() };
      await env.EVENTS_KV.put(kvKey("ledger:payment", `${entry.Payment_ID}:${eid}`), JSON.stringify(asset));
    } else {
      await env.EVENTS_KV.put(kvKey("evt:stripe", eid), JSON.stringify(toMrlAsset(summary, MRL.stripe_source)), { expirationTtl: 30 * DAY });
    }
  }
  return { duplicate: false, recorded: !!entry, status: entry?.status || null };
}

// 操作者讀取帳本(最多 100 筆 / 頁,?cursor= 續頁)。
async function listLedgerPayments(env, cursor) {
  const prefix = kvKey("ledger:payment", "");
  const page = await env.EVENTS_KV.list({ prefix, limit: 100, cursor: cursor || undefined });
  const entries = [];
  for (const k of page.keys) {
    const raw = await env.EVENTS_KV.get(k.name);
    if (raw) { try { entries.push(JSON.parse(raw)); } catch { entries.push({ key: k.name, raw }); } }
  }
  return { count: entries.length, entries, cursor: page.list_complete ? null : page.cursor || null };
}

export { verifyStripeSignature, ledgerEntryFromEvent, LEDGER_SCHEMA };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      const signingSecret = await getSigningSecret(env);
      return json({
        service: "mrliouword-root",
        mrl_asset: true,
        mrl_namespace: MRL.namespace,
        origin_signature: MRL.origin_signature,
        secret_configured: !!signingSecret,
        signing_secret_source: env.NOTION_WEBHOOK_SECRET ? "secrets_store" : (signingSecret ? "kv" : "none"),
        kv_bound: !!env.EVENTS_KV,
        handshake_key_configured: !!env.MRL_HANDSHAKE_KEY,
        forward_configured: !!env.FORWARD_URL,
        stripe_webhook_configured: !!env.STRIPE_WEBHOOK_SECRET,
      });
    }

    // 一次性取出握手 token:需 MRL_HANDSHAKE_KEY(你自設的開機金鑰)。取出即刪,重放無效。
    if (url.pathname === "/notion/handshake" && request.method === "GET") {
      if (!env.EVENTS_KV || !operatorAuthorized(url, env)) return json({ ok: false, error: "not found" }, 404);
      const token = await env.EVENTS_KV.get(HANDSHAKE_KV_KEY);
      if (!token) return json({ ok: false, error: "no pending handshake token" }, 404);
      await env.EVENTS_KV.delete(HANDSHAKE_KV_KEY);
      // 操作者已以開機金鑰授權取出 → 同時把它設為驗簽金鑰(不必再手動設機密)
      await env.EVENTS_KV.put(SIGNING_KV_KEY, token);
      return json({
        ok: true,
        verification_token: token,
        note: "shown once and now deleted. Paste into Notion. It is now the signing secret (stored in KV); setting NOTION_WEBHOOK_SECRET in Secrets Store is optional and takes precedence.",
      });
    }

    if (url.pathname === "/notion/webhook" && request.method === "POST") {
      const raw = await request.text();
      let body;
      try { body = JSON.parse(raw); } catch { body = null; }

      // 首次驗證握手:Notion 送 { verification_token } 且沒有簽章
      const sig = request.headers.get("x-notion-signature");
      if (body && body.verification_token && !sig) {
        const token = String(body.verification_token);
        // 絕不印整串 token(它就是 HMAC 金鑰);日誌只留遮罩指紋
        console.log("[notion-webhook] verification_token received:", await fingerprint(token));
        if (env.EVENTS_KV) {
          await env.EVENTS_KV.put(HANDSHAKE_KV_KEY, token, { expirationTtl: 600 });
          return json({ ok: true, note: "verification_token stored; retrieve once via GET /notion/handshake" });
        }
        console.warn("[notion-webhook] EVENTS_KV not bound — token not stored; bind KV to enable secure retrieval");
        return json({ ok: true, note: "verification_token received but not stored (bind EVENTS_KV)" });
      }

      // 一般事件:必須驗簽
      const signingSecret = await getSigningSecret(env);
      const valid = await verifySignature(signingSecret, raw, sig);
      if (!valid) {
        return json({ ok: false, error: "invalid signature" }, 401);
      }

      // 快速回 200,動作丟背景做(避免 Notion 逾時重送)
      ctx.waitUntil(handleTriggeredAction(body, env, ctx));
      return json({ ok: true });
    }

    // Stripe 收帳入口:未設密鑰 → 503(不收任何事件);驗簽失敗 → 400;通過 → 同步登錄帳本。
    if (url.pathname === "/stripe/webhook" && request.method === "POST") {
      if (!env.STRIPE_WEBHOOK_SECRET) return json({ ok: false, error: "stripe webhook not configured" }, 503);
      const raw = await request.text();
      const valid = await verifyStripeSignature(env.STRIPE_WEBHOOK_SECRET, raw, request.headers.get("stripe-signature"));
      if (!valid) return json({ ok: false, error: "invalid signature" }, 400);
      let event;
      try { event = JSON.parse(raw); } catch { return json({ ok: false, error: "invalid json" }, 400); }
      const result = await handleStripeEvent(event, env);
      return json({ ok: true, ...result });
    }

    if (url.pathname === "/ledger/payments" && request.method === "GET") {
      if (!env.EVENTS_KV || !operatorAuthorized(url, env)) return json({ ok: false, error: "not found" }, 404);
      const page = await listLedgerPayments(env, url.searchParams.get("cursor"));
      return json({ ok: true, mrl_asset: true, ledger: "commercial", schema: LEDGER_SCHEMA, ...page });
    }

    return json({ ok: false, error: "not found" }, 404);
  },
};
