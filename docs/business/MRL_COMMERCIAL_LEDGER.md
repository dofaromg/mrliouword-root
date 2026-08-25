# MRL 商業帳本（Commercial Ledger）v1.0 — WP-11 / WP-19

> 落實 [MRL World Model Engineering Plan](https://app.notion.com/p/3c38eeeec5b581be907ad10f49a51f1a)
> 第 4 節「三條 Ledger」之第三條:**Commercial Ledger — 誰取得什麼權利、支付什麼、使用什麼。**
> 搭配 [IP 登錄簿](../protection/MRL_IP_REGISTRY.md)（IP Ledger）與
> [商業化策略](MRL_COMMERCIALIZATION.md)（Product Ledger）。
>
> **證據紀律**（計畫第 8 節）:`FACT / CLAIM / INFERENCE / UNRESOLVED`。
> `Forecast ≠ Revenue`、`Payment Config ≠ Transaction`、`Historical ≠ Current Live`。
> **目前狀態:尚無付費交易**,本檔為**待填模板 + schema**,第一筆交易發生時依此登錄。

- 權利人（現任）：Mr.liou / GitHub `dofaromg`（在移轉完成前有權授予商業權利）
- 建立日期：2026-08-25
- 狀態：**ACTIVE（模板就緒，尚無交易資料）**

## 1. 商業保護核心鏈（計畫第 4 節）

```text
IP_ID  →  Product_ID  →  License_ID  →  Order_ID  →  Payment_ID  →  Customer_ID
                                                            ↓
                                                     Usage Evidence
                                                            ↓
                                                     Revenue Evidence
```

每一筆商業關係都應能從 Customer 一路回溯到它用到的 IP 資產（IP Ledger 的 IP-0xx），
並附上使用與收入的可查證證據。

## 2. Product Ledger（販售什麼）— 目前定義

> 來源:[商業化策略](MRL_COMMERCIALIZATION.md)。此處只登錄「已定義可售」的產品線；
> 尚未上線者狀態為 `PLANNED`。

| Product_ID | 產品 | 方案 | 對應 IP | 狀態 |
|------------|------|------|---------|------|
| PRD-API | `mrliouhan.ai` API（金鑰制） | Free / Pro / Enterprise | IP-009、IP-005 等 | **PLANNED**（計費計量未落地） |
| PRD-SAAS | FlowMemory SaaS | Free / Pro | IP-002、IP-003 | **PLANNED** |
| PRD-LICENSE | MRL 定義系統授權/白牌 | 年約議價 | IP-001、IP-005、IP-010 | **PLANNED** |

## 3. License / Entitlement Ledger（誰取得什麼權利）

Schema（每筆授權一列）:

| 欄位 | 說明 |
|------|------|
| `License_ID` | 唯一識別（如 `LIC-2026-0001`） |
| `Customer_ID` | 對應第 5 節客戶 |
| `Product_ID` | 對應第 2 節產品 |
| 授權範圍 | 方案、額度上限、席次、允許用途 |
| 期間 | 起訖日 / 是否自動續約 |
| 狀態 | `active / suspended / expired / revoked` |
| 依據 | 條款版本（ToS/SLA 版本號）、簽署或點擊接受紀錄 |

**目前資料：無（尚無授權發放）。**

## 4. Order / Payment Ledger（支付什麼）

Schema:

| 欄位 | 說明 |
|------|------|
| `Order_ID` | 訂單識別 |
| `Payment_ID` | 金流交易識別（MoR/金流商回傳） |
| `Customer_ID` / `License_ID` | 關聯 |
| 金額 / 幣別 / 稅 | 含稅務處理（見商業化策略第 3 節，會計師核實） |
| 金流商 | Paddle / Lemon Squeezy（MoR）/ 綠界 / Stripe 等 |
| 狀態 | `pending / paid / refunded / disputed / failed` |
| 發票 | 統一發票號碼 / 開立日 |

**目前資料：無（尚無訂單與交易）。**
> 提醒:金流商設定完成 ≠ 有交易（`Payment Config ≠ Transaction`）。

## 5. Customer Ledger（誰）

Schema:

| 欄位 | 說明 |
|------|------|
| `Customer_ID` | 唯一識別 |
| 類型 | Free / Pro / Enterprise |
| 主體 | 個人 / 公司（B2B 需統編、簽約窗口） |
| 聯絡 | 帳號 email、支援管道 |
| 合規 | 是否需 DPA、資料落點要求 |
| 狀態 | `active / churned / trial` |

**目前資料：無。**
> 個資處理依 [隱私政策](../legal/PRIVACY_POLICY.md);最小蒐集、可刪除。

## 6. Usage & Revenue Evidence（使用什麼 / 收入證據）

- **Usage Evidence**：每筆計費單位（API 呼叫數或 token 數）之計量紀錄。
  **前置條件**：gateway 層需先落地用量計量（商業化策略第 2 節)——**尚未實作,狀態 UNRESOLVED**。
- **Revenue Evidence**：金流商對帳單 + 發票 + 銀行入帳,三方對得起來才算 Revenue。
  `Forecast ≠ Revenue`——預估、報價、MRR 推算都不得登錄為已實現收入。

| 指標 | 目前值 | 等級 |
|------|--------|------|
| 已實現收入 | 0 | FACT |
| 付費客戶數 | 0 | FACT |
| 用量計量是否上線 | 否 | FACT（待落地 → UNRESOLVED 為前置） |

## 7. 啟用此帳本的前置（依商業化 90 天路線圖）

第一筆交易發生前需先完成:
- [ ] gateway 用量計量落地（否則 Usage/Revenue 無法舉證）
- [ ] 金流商串接（建議先 MoR：Paddle / Lemon Squeezy）
- [ ] ToS / SLA / Privacy 經律師審後正式發布並版本化
- [ ] 定價頁上線

## 8. 維護規則

- 交易發生**當下即登錄**,不事後補記;每筆保留可查證證據（金流回傳、發票、對帳）。
- 本帳本**只增不改**;更正以新列/新版本追加，保留原紀錄（呼應計畫第 10 節）。
- 每筆 Customer 應能回溯到其 License → Product → IP 資產,形成完整血緣。
