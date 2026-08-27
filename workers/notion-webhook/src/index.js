// MRL Notion Webhook Receiver
// Notion 有變動 → POST 進來 → 驗證簽章 → 觸發動作
//
// 端點:
//   POST /notion/webhook  接收 Notion 事件(含首次驗證握手)
//   GET  /health          健康 + 設定狀態
//
// 環境變數 / 綁定(都不寫死在程式,見 wrangler.toml / Secrets Store):
//   NOTION_WEBHOOK_SECRET  Notion 首次握手給的 verification_token(HMAC 簽章金鑰)——放 Secrets Store
//   FORWARD_URL (可選)     驗證通過的事件要轉發到哪(你的「動作」端點)
//   EVENTS_KV  (可選)      事件記錄用 KV(有綁才記,沒有就略過)

const enc = new TextEncoder();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
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

// 你的「動作」掛勾:預設 = 記 KV + 轉發 FORWARD_URL。要客製就改這裡。
async function handleTriggeredAction(event, env, ctx) {
  // 1) 記錄(可選 KV)
  if (env.EVENTS_KV) {
    const id = `evt:${event?.id || "unknown"}:${event?.timestamp || ""}`;
    ctx.waitUntil(env.EVENTS_KV.put(id, JSON.stringify(event), { expirationTtl: 60 * 60 * 24 * 30 }));
  }
  // 2) 轉發到你的動作端點(可選)
  if (env.FORWARD_URL) {
    ctx.waitUntil(
      fetch(env.FORWARD_URL, {
        method: "POST",
        headers: { "content-type": "application/json", "x-mrl-source": "notion-webhook" },
        body: JSON.stringify(event),
      }).catch(() => {}),
    );
  }
  // 3) TODO(你告訴我具體動作後補在這):例如觸發某個 worker、寫回 Notion、發通知…
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        service: "mrl-notion-webhook",
        origin_signature: "MrLiouWord",
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
