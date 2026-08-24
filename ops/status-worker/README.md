# MRL Status Worker

自營 status page：Cron 每 5 分鐘檢查官方端點、結果存 KV（保留 24 小時），
對外提供狀態頁與 JSON API。

## 部署（一次性，約 5 分鐘）

```bash
cd ops/status-worker

# 1. 建立 KV namespace，把輸出的 id 填入 wrangler.toml
npx wrangler kv namespace create STATUS_KV

# 2. 部署（含 cron 與 status.mrliouword.com 路由）
npx wrangler deploy
```

前置需求：`wrangler login`（或 `CLOUDFLARE_API_TOKEN`，權限含 Workers Scripts:Edit、
Workers KV Storage:Edit、Zone Workers Routes:Edit）。

## 端點

| 路徑 | 內容 |
|------|------|
| `https://status.mrliouword.com/` | 狀態頁（HTML） |
| `https://status.mrliouword.com/api/status` | JSON（overall、各服務 up/latency/24h 可用率） |

## 調整監控目標

編輯 `src/index.js` 開頭的 `TARGETS` 陣列即可；`/health` 端點的預期行為
見 `docs/MRL_OPERATIONS.md` 第 3.4 節（降級模式）。
