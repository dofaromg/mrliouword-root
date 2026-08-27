# MRL Notion Webhook Receiver

Notion 有變動 → POST 進來 → 驗證 Notion 簽章 → 觸發動作。
給 `mrliouword-root` Cloudflare 專案一個真正可部署的 Worker。

## 端點

| 路徑 | 說明 |
|------|------|
| `POST /notion/webhook` | 接收 Notion 事件(含首次驗證握手) |
| `GET /health` | 健康 + 設定狀態(secret/kv/forward 是否已設) |

## 部署(用你既有的 `mrliouword-root` 專案)

那個 Cloudflare「Workers & Pages」專案原本部署失敗,是因為根目錄 `/` 沒有可部署的東西。改指到這個資料夾就能部署:

1. Cloudflare → Workers & Pages → **mrliouword-root** → 設定 → **根目錄** 從 `/` 改成 `workers/notion-webhook`
2. 部署命令維持 `npx wrangler deploy`
3. 重試組建 → 這次會部署 `mrl-notion-webhook` 這個 Worker

> 部署後的 Worker 名稱由 `wrangler.toml` 的 `name` 決定(`mrl-notion-webhook`)。

## 設定機密(勿寫進程式/勿貼聊天)

1. **建立 Notion integration**(Notion → Settings → Integrations → 新增),取得能存取目標資料庫的權限。
2. **建立 webhook 訂閱**,URL 指向部署後的 `.../notion/webhook`。
3. Notion 首次會送一個 `verification_token`:
   - 本 Worker 會把它印進 **Worker 日誌**(Observability / `wrangler tail`)。
   - 把它 (a) 貼回 Notion 完成訂閱驗證,並 (b) 設成本 Worker 的機密 **`NOTION_WEBHOOK_SECRET`**(Secrets Store binding 或 `npx wrangler secret put NOTION_WEBHOOK_SECRET`)——這是之後驗證事件簽章的金鑰。
4. (可選)`FORWARD_URL`:驗證通過的事件要轉發到哪個「動作」端點。
5. (可選)`EVENTS_KV`:建 KV、填進 `wrangler.toml`,事件會記 30 天。

## 安全設計

- 一般事件**強制驗簽**(HMAC-SHA256,常數時間比較);簽章不符回 401。
- 快速回 200、動作丟背景(`waitUntil`),避免 Notion 逾時重送。
- 所有機密走環境變數 / Secrets Store,程式碼零硬編碼。

## 客製「動作」

預設動作 = 記 KV + 轉發 `FORWARD_URL`。要做特定事(觸發某 worker、寫回 Notion、發通知…),
改 `src/index.js` 的 `handleTriggeredAction()`。
