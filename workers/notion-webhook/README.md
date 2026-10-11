# MRL Notion Webhook Receiver

Notion 有變動 → POST 進來 → 驗證 Notion 簽章 → 觸發動作。
給 `mrliouword-root` Cloudflare 專案一個真正可部署的 Worker。

## 端點

| 路徑 | 說明 |
|------|------|
| `POST /notion/webhook` | 接收 Notion 事件(含首次驗證握手) |
| `GET /health` | 健康 + 設定狀態(secret/kv/handshake-key/forward 是否已設) |
| `GET /notion/handshake?k=<MRL_HANDSHAKE_KEY>` | 一次性取出 Notion 握手 token(取出即刪,重放無效) |

## 部署(用你既有的 `mrliouword-root` 專案)

那個 Cloudflare「Workers & Pages」專案原本部署失敗,是因為根目錄 `/` 沒有可部署的東西。

**已修好:** repo 根目錄現在有一份 `wrangler.toml`,指向本 worker 的原始碼,所以
`npx wrangler deploy` 在根目錄 `/` 就能部署——**不必再手動改 Cloudflare 專案根目錄**。
直接重試組建即可,會部署出 `mrliouword-root` 這個 Worker(與 Cloudflare 專案同名)。

> (替代作法)也可把專案 **根目錄** 改成 `workers/notion-webhook`,用這裡的 `wrangler.toml`;
> 兩份設定的 `name` 都是 `mrliouword-root`(與 Cloudflare 服務同名,消除設定不一致警告),部署到同一個 Worker。
> 部署後的 Worker 名稱由 `wrangler.toml` 的 `name` 決定。

## 設定機密(勿寫進程式/勿貼聊天)

1. **建立 Notion integration**(Notion → Settings → Integrations → 新增),取得能存取目標資料庫的權限。
2. **建立 webhook 訂閱**,URL 指向部署後的 `.../notion/webhook`。
3. **先設一把開機金鑰** `MRL_HANDSHAKE_KEY`(你自己隨便產一串長亂數,設進本 Worker 機密)。這把鑰匙只用來安全取出握手 token。
4. Notion 首次會送一個 `verification_token`。**它就是之後驗簽的 HMAC 金鑰,本 Worker 絕不把它整串印進日誌**(日誌只留遮罩指紋):
   - Worker 把它存進 KV(10 分鐘後自動消失)。
   - 你在瀏覽器開 `https://<worker>/notion/handshake?k=<MRL_HANDSHAKE_KEY>` → **只會顯示一次**,顯示後即從 KV 刪除。
   - 把它 (a) 貼回 Notion 完成訂閱驗證,並 (b) 設成本 Worker 的機密 **`NOTION_WEBHOOK_SECRET`**(Secrets Store binding 或 `npx wrangler secret put NOTION_WEBHOOK_SECRET`)。
   - 取完可把 `MRL_HANDSHAKE_KEY` 換掉或刪除。
5. (可選)`FORWARD_URL`:驗證通過的事件要轉發到哪個「動作」端點。
6. `EVENTS_KV`:已綁 `MRL_EVENTS`(事件記 30 天、去重、死信、握手暫存)。

## 安全設計

- 一般事件**強制驗簽**(HMAC-SHA256,常數時間比較);簽章不符回 401。
- 快速回 200、動作丟背景(`waitUntil`),避免 Notion 逾時重送。
- 所有機密走環境變數 / Secrets Store,程式碼零硬編碼。

## MRL 資產標記(來源從這裡出去一律標注)

這支 worker 是 MRL 系統的**自動化出口**。任何從這裡送出去的資料一律標記為 MRL 資產:

- **轉發酬載**包成 MRL 資產信封:`mrl_asset / mrl_namespace=MRL / origin_signature=MrLiouWord / source=MRL_EXT_NOTION`。
- **HTTP 回應與轉發**都帶 `x-mrl-asset / x-mrl-namespace / x-mrl-origin-signature`(轉發另帶 `x-mrl-source`)。
- **KV key** 一律加 `MRL:` 前綴(`MRL:evt:… / MRL:dedup:… / MRL:deadletter:…`)。
- 外部來源 Notion 依 `docs/MRL_EXTERNAL_NAMING.md` 轉品牌別名 `MRL_EXT_NOTION`。

## 可靠性

- **去重(冪等)**:以 event id 為鍵,Notion 重送時略過重複轉發(需綁 `EVENTS_KV`)。
- **不吞失敗**:轉發會檢查 `response.ok`;失敗(網路錯誤或 4xx/5xx)寫進 KV 死信佇列
  `MRL:deadletter:…` 供重試,而非默默丟棄。

## 客製「動作」

預設動作 = 去重 → 記 KV → 轉發 `FORWARD_URL`(全程標記 MRL 資產)。要做特定事
(觸發某 worker、寫回 Notion、**收斂進 MRL 粒子法典**…),改 `src/index.js` 的 `handleTriggeredAction()`。
