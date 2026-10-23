# MRL Notion Webhook Receiver

Notion 有變動 → POST 進來 → 驗證 Notion 簽章 → 觸發動作。
給 `mrliouword-root` Cloudflare 專案一個真正可部署的 Worker。

## 端點

| 路徑 | 說明 |
|------|------|
| `POST /notion/webhook` | 接收 Notion 事件(含首次驗證握手) |
| `GET /health` | 健康 + 設定狀態(secret/kv/handshake-key/forward 是否已設) |
| `GET /pricing` | **MRL 定價頁**(`mrliouword.com/pricing`,路由見 `wrangler.toml`):8 條 Stripe 付款連結 + MRL APIWorks 方案;目錄資料在 `src/pricing.js`,`GET /pricing.json` 回同一份目錄 |
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
   - 把它貼回 Notion 完成訂閱驗證。**取出的同時它已自動設為驗簽金鑰(存於 KV),不必再手動設機密。**(可選加嚴:另設 Secrets Store 機密 `NOTION_WEBHOOK_SECRET`,有設會優先。)
   - 取完可把 `MRL_HANDSHAKE_KEY` **換掉(輪替)但不要刪除**:它同時是讀取商業帳本 `GET /ledger/payments` 的操作者金鑰。
5. (可選)`FORWARD_URL`:驗證通過的事件要轉發到哪個「動作」端點。
6. `EVENTS_KV`:部署時由 wrangler 自動佈建(id 在 Cloudflare 儀表板 → 儲存 → KV 可查);事件記 30 天、去重、死信、握手暫存。

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

## 收帳入口(Stripe → MRL 商業帳本)

同一支 worker 也是 **MRL 商業帳本的收帳入口**(`docs/business/MRL_COMMERCIAL_LEDGER.md` §4 / §9)。

| 路徑 | 說明 |
|------|------|
| `POST /stripe/webhook` | 接收 Stripe 事件,驗 `Stripe-Signature`(HMAC-SHA256、±300 秒防重放)後**同步**寫入帳本;未設 `STRIPE_WEBHOOK_SECRET` 或未綁 `EVENTS_KV` 回 503、驗簽失敗回 400、KV 寫入失敗回 5xx 讓 Stripe 重送(去重鍵在寫入成功後才寫) |
| `GET /ledger/payments` | 操作者讀取帳本登錄,金鑰走標頭 `Authorization: Bearer <MRL_HANDSHAKE_KEY>`(`?k=` 只保留給瀏覽器手動操作,會進存取日誌,不建議);每頁 100 筆,`?cursor=` 續頁 |

- **登錄哪些事件(8 個)**:`checkout.session.completed / async_payment_succeeded / async_payment_failed`、`invoice.paid / payment_failed`、`refund.created`(單筆退款,`amount_kind=delta`)、`charge.refunded`(Charge 快照累計退款額,`amount_kind=cumulative`,對帳只加 delta 列)、`charge.dispute.created`(`data.object` 是 Dispute,另行映射);其他事件只留 30 天事件紀錄(`MRL:evt:stripe:*`),不進帳本。
- **KV key**:`MRL:ledger:payment:<Payment_ID 或 Order_ID>:<event_id>`,**永久保存、每事件一 key、不覆寫**(帳本只增不刪);去重鍵 `MRL:dedup:stripe:<event_id>`。
- **登錄內容**:`Order_ID / Payment_ID(只放真正的 PaymentIntent;訂閱 checkout、帳外收款為 null) / Customer_ID / amount / amount_kind / tax / currency / status(paid|pending|failed|refunded|disputed) / processor=stripe / refs(session・subscription・invoice・refund・dispute 等 id) / evidence(event id・type・created・livemode)`,外包 MRL 資產信封(`source=MRL_EXT_STRIPE`)。
- **最小蒐集**:不存 email 原文,只存不可逆指紋 `email_fp`;`metadata` 只保留對帳白名單鍵(`sku / asset_id / canonical_product_id / product_id / license_id / order_id / origin_signature` 與 `mrl_*`);客戶細節留在 Stripe。
- **設定**:Stripe 儀表板 → Developers → Webhooks → 新增端點 `https://mrliouword-root.<子網域>.workers.dev/stripe/webhook`、勾上列事件 → 把端點的簽章密鑰放進本 Worker 機密 `STRIPE_WEBHOOK_SECRET`(勿貼聊天、勿進 repo)。`GET /health` 的 `stripe_webhook_configured` 轉 `true` 只代表密鑰已設;**接通的判準**是 Stripe 端點頁「傳送測試事件」回 200,且 `GET /ledger/payments` 看得到對應登錄。
- **測試**:`node --test workers/notion-webhook/test/*.test.mjs`(CI 同步跑)。

## MRL 履約核對（唯讀）

`GET /ledger/fulfillment` 僅接受 `Authorization: Bearer <MRL_HANDSHAKE_KEY>`，不接受單獨 `?k=`；每頁最多 100 個付款事件，沿 `cursor` 續頁，回應 `Cache-Control: no-store`。保留原始帳本信封，將八個 Payment Link ID 對照六個 catalog item；所有列均 `grants_access=false`、`delivery_status=UNVERIFIED`。這不是訂單聚合或授權發放端點，不可直接按列發點數。

實際人工核對、去重、授權範圍及驗收步驟見 [MRL_MANUAL_FULFILLMENT.md](../../docs/business/MRL_MANUAL_FULFILLMENT.md)。缺失/非 paid 的 Checkout 保持 pending；新列存 `refs.payment_status`，舊列原封保留並需重新驗證。重送若帳本 key 已存在則保留第一筆內容，但 KV get/put 非原子，不能宣稱強一致發放。
