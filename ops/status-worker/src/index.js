// MRL status worker — cron 健康檢查 + status page
// 部署：wrangler deploy（先在 wrangler.toml 填入 KV namespace id）

const TARGETS = [
  { id: "frontend", name: "mrliouword.com（前端）", url: "https://mrliouword.com/", timeoutMs: 8000, latencyLimitMs: 3000 },
  { id: "backend", name: "mrliouhan.ai（後端 API）", url: "https://mrliouhan.ai/health", timeoutMs: 8000, latencyLimitMs: 3000, expectJsonStatus: "ok" },
];

const HISTORY_LIMIT = 288; // 5 分鐘一筆 × 24 小時（次要上限）
const INTERVAL_MS = 5 * 60 * 1000; // cron 間隔
const STALE_MS = 2 * INTERVAL_MS; // 超過此時間未更新即視為 stale（無新證據）
const WINDOW_MS = 24 * 60 * 60 * 1000; // uptime 計算的滾動視窗

async function checkTarget(t) {
  const started = Date.now();
  try {
    const res = await fetch(t.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(t.timeoutMs),
      headers: { "user-agent": "mrl-status-worker/1.0" },
    });
    // 健康契約（見 docs/MRL_OPERATIONS.md 2.1）：恰為 200、延遲低於門檻，
    // health 端點還須回 JSON 且 status 為 ok —— degraded 回應算檢查失敗。
    // 延遲以「完整讀完 body」為準（非 TTFB），故先消費 body 再計時。
    let ok = res.status === 200;
    let note;
    let parsed;
    let bodyErr;
    try {
      const text = await res.text();
      if (t.expectJsonStatus) {
        try {
          parsed = JSON.parse(text);
        } catch {
          bodyErr = "health response is not valid JSON";
        }
      }
    } catch (e) {
      bodyErr = "body read failed: " + String(e);
    }
    const latencyMs = Date.now() - started; // 含 body 消費的完整 GET 時間
    if (ok && latencyMs >= (t.latencyLimitMs || 3000)) {
      ok = false;
      note = "latency over " + (t.latencyLimitMs || 3000) + "ms";
    }
    if (ok && t.expectJsonStatus) {
      if (bodyErr) {
        ok = false;
        note = bodyErr;
      } else if (!parsed || parsed.status !== t.expectJsonStatus) {
        ok = false;
        note = "health status is not '" + t.expectJsonStatus + "'";
      }
    }
    const result = { ok, status: res.status, latencyMs, at: new Date().toISOString() };
    if (note) result.note = note;
    return result;
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: String(err && err.name === "TimeoutError" ? "timeout" : err),
      latencyMs: Date.now() - started,
      at: new Date().toISOString(),
    };
  }
}

async function runChecks(env) {
  for (const t of TARGETS) {
    const result = await checkTarget(t);
    const key = `history:${t.id}`;
    const prev = JSON.parse((await env.STATUS_KV.get(key)) || "[]");
    prev.push(result);
    while (prev.length > HISTORY_LIMIT) prev.shift();
    await env.STATUS_KV.put(key, JSON.stringify(prev));
  }
}

async function readStatus(env) {
  const now = Date.now();
  const services = [];
  for (const t of TARGETS) {
    const history = JSON.parse((await env.STATUS_KV.get(`history:${t.id}`)) || "[]");
    const latest = history[history.length - 1] || null;
    // uptime 只算滾動 24h 視窗內的樣本，避免用過期資料充數
    const windowed = history.filter((h) => h.at && now - Date.parse(h.at) <= WINDOW_MS);
    const okCount = windowed.filter((h) => h.ok).length;
    // 陳舊判定：最後一筆超過 STALE_MS 未更新 → 視為 unknown（無新證據）
    const stale = !latest || !latest.at || now - Date.parse(latest.at) > STALE_MS;
    let up;
    if (stale) up = null;
    else up = latest.ok;
    services.push({
      id: t.id,
      name: t.name,
      up,
      stale,
      latest,
      uptime24h: windowed.length ? +(okCount / windowed.length * 100).toFixed(2) : null,
      samples: windowed.length,
    });
  }
  // 缺資料/陳舊不得謊報正常：任一 down → degraded；無 down 但有 unknown → unknown
  const anyDown = services.some((s) => s.up === false);
  const anyUnknown = services.some((s) => s.up === null);
  const overall = anyDown ? "degraded" : anyUnknown ? "unknown" : "operational";
  return { overall, services, generatedAt: new Date().toISOString() };
}

function renderHtml(status) {
  const rows = status.services
    .map((s) => {
      const dot = s.up === null ? "⚪" : s.up ? "🟢" : "🔴";
      const state = s.up === null ? "無資料" : s.up ? "正常" : "異常";
      const latency = s.latest && s.latest.ok ? `${s.latest.latencyMs} ms` : "—";
      const uptime = s.uptime24h === null ? "—" : `${s.uptime24h}%`;
      return `<tr><td>${dot} ${s.name}</td><td>${state}</td><td>${latency}</td><td>${uptime}</td></tr>`;
    })
    .join("");
  const banner =
    status.overall === "operational" ? "✅ 所有系統正常運作"
    : status.overall === "unknown" ? "⏳ 監測初始化中，尚無完整資料"
    : "⚠️ 部分服務異常";
  return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MRL Status</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:640px;margin:3rem auto;padding:0 1rem;color:#1a1a1a;background:#fafafa}
  .banner{padding:1rem;border-radius:8px;background:${status.overall === "operational" ? "#e6f6e6" : status.overall === "unknown" ? "#f0f0f0" : "#fdeaea"};font-weight:600}
  table{width:100%;border-collapse:collapse;margin-top:1.5rem}
  th,td{text-align:left;padding:.6rem .4rem;border-bottom:1px solid #e2e2e2}
  footer{margin-top:2rem;font-size:.8rem;color:#777}
  @media (prefers-color-scheme: dark){body{background:#111;color:#eee}th,td{border-color:#333}footer{color:#999}}
</style></head><body>
<h1>MRL 服務狀態</h1>
<div class="banner">${banner}</div>
<table><thead><tr><th>服務</th><th>狀態</th><th>延遲</th><th>24h 可用率</th></tr></thead>
<tbody>${rows}</tbody></table>
<footer>每 5 分鐘更新 · 產生於 ${status.generatedAt} · <a href="/api/status">JSON</a></footer>
</body></html>`;
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runChecks(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    const status = await readStatus(env);
    if (url.pathname === "/api/status") {
      return new Response(JSON.stringify(status, null, 2), {
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      });
    }
    return new Response(renderHtml(status), {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  },
};
