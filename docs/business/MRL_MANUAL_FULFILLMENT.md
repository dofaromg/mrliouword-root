# MRL 付款與人工履約核對程序 R01

origin_signature: MrLiouWord  
來源基線: `e024b957392c96adb53117a19cd8480695d7df4d` / PR #21、#23。稽核批次: 2026-10-23，Asia/Taipei。

## 本次核對與可履約邊界

【文件支持／公開觀測】[本批公開證據](MRL_PRICING_FULFILLMENT_AUDIT_20261023.json)保存網址、擷取 ID、200 狀態、節選與完整公開商品目錄；是轉換後的擷取內容，並非原始 HTTP 位元組。`/pricing`、`/pricing.json` 及八條結帳頁皆可取得，價格與目錄一致。目錄 `verified_at` 是原目錄日期，不能當作本次帳戶內核對日期。沒有填表、送出付款或建立訂閱。

| 產品 | 公開結帳網址尾碼／金額 | 已找到交付證據 | 本批判定 |
|---|---|---|---|
| MRL AI Pro | `aFa00i9rBgDMbtJe3kb7y03`／NT$499 月 | 官網功能文案、付款入口；未讀到客戶授權、模型/影片/技能開通回執 | 付款入口已驗證；履約 UNVERIFIED |
| MRL AI Enterprise | `eVqaEWdHR0EO2Xd8J0b7y04`、`fZu14m9rB3R0cxN7EWb7y02`／NT$1,999 月 | 同上；20 席、API、用量與 SLA 履約回執未取得 | 兩入口同品；履約 UNVERIFIED |
| MRL AI | `7sYaEWgU31IS55lf7ob7y06`／NT$299 月 | 未取得可用帳號與登入驗收 | 履約 UNVERIFIED |
| 100 點數包 | `aFa14mfPZdrAapF8J0b7y05`、`cNi28qcDN9bk8hxgbsb7y00`／NT$99 | 未取得帳戶餘額、入帳交易與消耗回執 | 兩入口同品；履約 UNVERIFIED |
| 500 點數包 | `7sY6oG8nxfzI0P52kCb7y01`／NT$399 | 未取得點數入帳/消耗證據 | 履約 UNVERIFIED |
| 1,000 點數包 | `5kQ14meLVfzI55lcZgb7y07`／NT$699 | 未取得點數入帳/消耗證據 | 履約 UNVERIFIED |
| APIWorks Pro | 官網轉介，US$29 月起 | APIWorks 網站 200、存在付款文案；沒有本批可核對的 Checkout→客戶權限→計量回執 | 網站可達；其獨立結帳流程 UNVERIFIED |
| DL580 主權自架／私有雲 | 洽詢，沒有這八條中的付款入口 | [既有歷史工程證據 §3–5](MRL_COMMERCIAL_HISTORICAL_EVIDENCE_BACKFILL_20260905.md)支持 BYOH 建構及商業候選，明列逐硬體/商業 gate 未閉合 | 可承接既有工程準備；報價、授權及特定客戶節點驗收仍需證據 |

【待驗證】本次不能判任何方案已通過客戶履約驗收。這是可存取證據的邊界，不推論其他系統沒有實作。`MRL-APIWORKS-BYOH-DEPLOY-V1` 保留歷史原名；不自動等同網站的 `apiworks-dl580`，兩者精確映射需 Owner 核定。Stripe product/price、catalog item 與 Commercial Ledger 的 canonical `Product_ID` 分開，不能只按名稱推定同一授權。

## 現行正式入口的阻擋

【公開觀測】`https://mrliouword-root.z814241.workers.dev/health` 回 200，`kv_bound=true`、`handshake_key_configured=true`，但 **`stripe_webhook_configured=false`**。依基線 `src/index.js`，此 Worker 缺少 Stripe webhook 密鑰時回 503，不能由 PR #21 已合併推論每筆 live 付款皆已落帳。沒有向正式 webhook 投遞假事件。

【待驗證】Stripe 連線要求重新驗證；本次未讀取目前帳戶內的 endpoints、交易、訂閱、收據設定及 line items。歷史兩個 webhook 的狀態仍未知；私有 `/ledger/payments` 未取得操作者憑證，沒有讀取。本帳本舊節的零交易／零授權是歷史切面，不能當成本次 live 查核結果。

【文件支持】`MRL_OPERATIONS.md` §4 收信測試仍未勾選。官網稱「回覆 Stripe 收據信最可靠」沒有本批收信回執支持；Stripe receipt、Reply-To、客服收件與訂閱取消入口都須獨立驗證。Enterprise 的 Stripe 結帳商品描述仍直接列 SLA 99.9%，沒有官網的草案限定；是否改商品承諾由 Root Owner 裁定，本修正不改文案或付款入口。

## 操作者執行步驟

1. 在既有 Worker 設定該 Stripe endpoint 的 `STRIPE_WEBHOOK_SECRET`，確認 webhook 訂閱事件；密鑰不進 repo、聊天或命令日誌。依 Worker README 的既有投遞驗收，取得「簽章驗證→200→私有帳本同 event id」回執。`/health=true` 只證明設定，不證明投遞。使用隔離測試環境及合成測試事件；測試資料不能發放 live 權限。
2. 本 PR 部署後，於受控操作者環境讀取 `GET /ledger/fulfillment`，標頭 `Authorization: Bearer <MRL_HANDSHAKE_KEY>`。沿 `cursor` 讀到 null，連同 `/ledger/payments` 保存私有回執。本介面拒絕只用 `?k=` 認證，回應 `no-store`。它是**逐事件的核對頁**，不是完整訂單佇列或已交付清單。
3. 核對 Stripe 原付款、line items、金額、幣別、mode、Customer_ID 與 Payment Link。只把明確 `payment_status=paid` 的 Checkout 視為已付款候選；`no_payment_required`、missing、unpaid、折扣/稅/數量造成的金額差異都轉人工核對，不自動拒絕真正客戶。test mode、未知產品、invoice-only、失敗、退款及爭議需各自核對。
4. 以 Order_ID／Payment_ID／subscription／invoice 串聯**所有頁及 Stripe 即時狀態**，排除同一 session 的 completed + async success、同一訂閱的初次 checkout + invoice 重複發放；核對後續退款/爭議/取消。每個事件都保留，不把帳本列加總成收入或點數。KV 分頁不是一致性快照；入帳未出現時重新核對 Stripe 與投遞日誌，不能宣告無付款。
5. Root Owner 核定產品映射、條款版本、授權範圍、期間、席次、點數單位及履約操作者後，追加 Commercial Ledger §3 的 License_ID 關聯；沒有核定不可由商品名稱推定 canonical。**本倉庫沒有可驗證的 grant/credit 管理端點**，不得編造呼叫。操作者必須先提供既有 runtime 的實際管理入口及權限，於該入口執行一次有冪等鍵的開通/點數入帳；做不到則保持 BLOCKED，聯絡客戶的安排須由 Owner 授權。
6. 實際執行後，在私人商業帳本追加開通證據：`License_ID, Customer_ID, Product_ID, catalog_item_id, Stripe product/price, Order_ID, Payment_ID, subscription/invoice, source_event_ids, livemode, operator_id, performed_at, terms_version, grant_scope, idempotency_key, runtime_receipt_uri, runtime_receipt_sha256, acceptance_uri, support_test_uri, parent_evidence`。只有確實有回執才填，不以本文件取代實際授權或交付；不把客戶個資/金鑰放 GitHub。
7. 逐方案驗收：訂閱可登入、可使用承諾模型/功能及額度；Enterprise 加驗席次/API/計量及契約 SLA；點數包驗入帳一次、餘額與一次消耗；BYOH 驗特定節點的建構、封裝及客戶驗收 gate。測試通過與付款成功各自保留，不能取代客戶驗收。
8. 客服需有測試信送出與實際收件證據、明確回覆/取消路徑。未做前維持 UNVERIFIED。後續續約、失敗、取消、退款或爭議以新紀錄關聯原 License_ID，不覆寫原始帳本；自動訂閱生命週期與自動 grant 仍未實作。

## 本次工程修正及驗證

- 缺失/非 paid 的 Checkout payment_status 不再誤標 paid；async failed 保持 failed。新列保留 `refs.payment_status`；歷史列不改寫，舊 paid 列若缺此欄由核對介面要求重新驗證。
- 重送遇去重寫入失敗/過期時，若同 payment key 已存在即保留第一筆位元組與 recorded_at。KV get/put 非原子，**未解決並行競態**，不適合作為 exactly-once 授權發放鎖。
- 唯讀介面對映八個 Payment Link ID 至六個既有 catalog item；`Product_ID/License_ID=null`、`grants_access=false`、`delivery_status=UNVERIFIED`，即使付款正常亦要求真正開通證據。未建立自動授權服務。
- `node --test workers/notion-webhook/test/*.test.mjs`：15/15 通過，包含簽章事件→帳本→受保護分頁核對、八連結映射、非 paid/test/退款/爭議、金額/模式差異及重送不覆寫。全為沙盒合成資料。

## Root Owner 決策與剩餘輸入

【待裁定】是否保留八個付款入口並接受人工履約風險，或限制結帳；是否調整一工作天、SLA、模型/點數等產品承諾。程式與文案均維持 Owner 既有選擇，本 PR 不代決。

【剩餘輸入】重新連接 Stripe；提供既有受控操作者環境來核對私人帳本與 runtime 管理入口。不要將 webhook/operator 密鑰貼聊天。取得這些存取及真實回執前，`CUSTOMER_DELIVERY=UNVERIFIED`，不得宣告商業閉環已完成。
