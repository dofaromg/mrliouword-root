// MRL Notion Webhook Receiver
// Notion 有變動 → POST 進來 → 驗證簽章 → 觸發動作
//
// 端點:
//   POST /notion/webhook  接收 Notion 事件(含首次驗證握手)
//   GET  /health          健康 + 設定狀態
//
// MRL 資產標記原則(治理):
//   這支 worker 是 MRL 系統的「自動化出口」。任何從這裡送出去的資料
//   (轉發、記錄)一律標記為 MRL 資產:namespace=MRL、origin_signature=MrLiouWord。
//   外部來源(Notion)一律轉 MRL_EXT_ 品牌別名(見 docs/MRL_EXTERNAL_NAMING.md)。
//
// 環境變數 / 綁定(都不寫死在程式,見 wrangler.toml / Secrets Store):
//   NOTION_WEBHOOK_SECRET  Notion 首次握手給的 verification_token(HMAC 簽章金鑰)——放 Secrets Store
//   FORWARD_URL (可選)     驗證通過的事件要轉發到哪(你的「動作」端點)
//   EVENTS_KV  (可選)      事件記錄 / 去重 / 死信佇列用 KV(有綁才用,沒有就略過)

const enc = new TextEncoder();

// ── MRL 資產標記(來源從這裡出去一律標注)──
const MRL = {
  namespace: "MRL",
  origin_signature: "MrLiouWord",
  emitted_by: "mrl-notion-webhook",
  ext_source: "MRL_EXT_NOTION", // 外部來源 Notion 的 MRL 品牌別名
};

// KV key 一律加 MRL 前綴,標明是 MRL 資產
const kvKey = (kind, id) => `MRL:${kind}:${id}`;
const DAY = 60 * 60 * 24;

// 把出去的酬載包成 MRL 資產信封:標記命名空間、原始簽章、外部來源別名。
function toMrlAsset(event) {
  return {
    mrl_asset: true,
    mrl_namespace: MRL.namespace,
    origin_signature: MRL.origin_signature,
    emitted_by: MRL.emitted_by,
    source: MRL.ext_source,
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

// 驗證 Notion 的 X-Notion-Signature(HMAC-SHA256(verification_token, raw_body))
async function verifySignature(secret, rawBody, header) {
  if (!secret || !header) return false;
  const provided = header.replace(/^sha256=/i, "").trim().toLowerCase();
  const expected = (await hmacHex(secret, rawBody)).toLowerCase();
  return timingSafeEqual(provided, expected);
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

  // TODO(收斂進 MRL 粒子法典):把 Mrliou 工作區定義層的變動正規化後,
  // 產生「收斂提案」(開 PR / 寫待審佇列),由 Root Owner 核准才進法典。
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        service: "mrl-notion-webhook",
        mrl_asset: true,
        mrl_namespace: MRL.namespace,
        origin_signature: MRL.origin_signature,
        secret_configured: !!env.NOTION_WEBHOOK_SECRET,
        kv_bound: !!env.EVENTS_KV,
        forward_configured: !!env.FORWARD_URL,
      });
    }

    if (url.pathname === "/notion/webhook" && request.method === "POST") {
      const raw = await request.text();
      let body;
      try { body = JSON.parse(raw); } catch { body = null; }

      // 首次驗證握手:Notion 送 { verification_token } 且沒有簽章
      const sig = request.headers.get("x-notion-signature");
      if (body && body.verification_token && !sig) {
        // 把 token 印進 Worker 日誌,方便你複製去 (a) 在 Notion 完成訂閱 (b) 設進 Secrets Store 當 NOTION_WEBHOOK_SECRET
        console.log("[notion-webhook] verification_token received — copy it to Notion & set as NOTION_WEBHOOK_SECRET:", body.verification_token);
        return json({ ok: true, note: "verification_token received; check Worker logs" });
      }

      // 一般事件:必須驗簽
      const valid = await verifySignature(env.NOTION_WEBHOOK_SECRET, raw, sig);
      if (!valid) {
        return json({ ok: false, error: "invalid signature" }, 401);
      }

      // 快速回 200,動作丟背景做(避免 Notion 逾時重送)
      ctx.waitUntil(handleTriggeredAction(body, env, ctx));
      return json({ ok: true });
    }

    return json({ ok: false, error: "not found" }, 404);
  },
};
