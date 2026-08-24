# MRL Status Worker

自營 status page：Cron 每 5 分鐘檢查官方端點、結果存 KV（保留 24 小時），
對外提供狀態頁與 JSON API。

## 部署（一次性，約 5 分鐘）

```bash
cd ops/status-worker

# 1. 先在 Cloudflare DNS 建立 status.mrliouword.com 的 proxied 記錄
#    （Dashboard → mrliouword.com → DNS → Add record：
#     Type AAAA、Name status、Content 100::、Proxy 開啟）
#    沒有這筆記錄，route 部署後會 ERR_NAME_NOT_RESOLVED。

# 2. 建立 KV namespace，把輸出的 id 填入 wrangler.toml
npx wrangler kv namespace create STATUS_KV

# 3. 部署（含 cron 與 status.mrliouword.com 路由）
npx wrangler deploy
```

前置需求：`wrangler login`，或 `CLOUDFLARE_API_TOKEN`，權限（Cloudflare 正式名稱）：

- Account 範圍：**Workers Scripts: Edit**、**Workers KV Storage: Edit**
- Zone 範圍（mrliouword.com）：**Workers Routes: Edit**
- 若使用 account-owned token，對應選 **Write** 權限

## 端點

| 路徑 | 內容 |
|------|------|
| `https://status.mrliouword.com/` | 狀態頁（HTML） |
| `https://status.mrliouword.com/api/status` | JSON（overall、各服務 up/latency/24h 可用率） |

## 調整監控目標

編輯 `src/index.js` 開頭的 `TARGETS` 陣列即可；`/health` 端點的預期行為
見 `docs/MRL_OPERATIONS.md` 第 3.4 節（降級模式）。
