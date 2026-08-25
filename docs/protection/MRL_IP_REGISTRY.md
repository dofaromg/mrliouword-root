# MRL 智慧財產登錄簿（IP Registry）v1.0 — WP-11

> 落實 [MRL World Model Engineering Plan](https://app.notion.com/p/3c38eeeec5b581be907ad10f49a51f1a) 之
> **WP-11 Commercial Protection**。本簿為「IP Ledger:擁有什麼」的正式紀錄。
>
> **證據紀律**（沿用計畫第 8 節）:每筆資產標註 `FACT / CLAIM / INFERENCE / UNRESOLVED`。
> `FACT` = 有時間戳、程式碼或可查證來源;`CLAIM` = 主張但尚未獨立佐證;
> 未證實者不得填為 FACT。本簿**只登錄可辯護為案主原創**的資產。

- 權利人（Root Owner）：Mr.liou / GitHub `dofaromg`
- origin_signature：`MrLiouWord`
- 建立日期：2026-08-25

## 1. 三條 Ledger 定位（依計畫第 4 節）

| Ledger | 內容 | 對應文件 |
|--------|------|----------|
| **IP Ledger** | 擁有什麼（原創資產） | 本簿 |
| **Product Ledger** | 販售什麼 | [MRL_COMMERCIALIZATION](../business/MRL_COMMERCIALIZATION.md) |
| **Commercial Ledger** | 誰取得什麼權利／付了什麼 | 待建（第一個付費客戶時） |

## 2. 原創資產登錄

| ID | 資產 | 類型 | 證據 | 證據等級 | 狀態 |
|----|------|------|------|----------|------|
| IP-001 | MRL 世界模型工程計畫（21 WP、三 Ledger、收斂閉環） | 架構著作 | Notion 頁 `3c38eeee…`（2026-08-21 時間戳） | **FACT** | active |
| IP-002 | FlowMemory SaaS（MVP 規格、技術實現、獲客計畫） | 軟體產品 | Notion `b4daaf38…` 等（2026-04-15 起） | **FACT** | active |
| IP-003 | FlowMemory_Module — 記憶管理子系統（~1000 行） | 原始碼 | Notion `437eb502…` | **FACT** | active |
| IP-004 | MRL 命名規範 v3.0.0 / NAMING_LAW | 規範體系 | 本 repo `docs/NAMING.md`、Notion registry | **FACT** | active |
| IP-005 | MRL 粒子架構 L(-1)–L∞ / atom_t / SimHash64 / collapse engine | 架構設計 | 本 repo docs、Notion Master Index | **FACT** | active |
| IP-006 | MRL 治理三律（LAW-0/1/2）、主權聲明 | 治理著作 | 本 repo `docs/SOVEREIGNTY.md` | **FACT** | active |
| IP-007 | MRL_MOTHER 母體工程（D:\mrl：77 目錄／628 項目／~32,962 行） | 軟體系統 | 案主自陳 + 跨 session 掃描回報 | **CLAIM**（待案主本機證據固定） | active |
| IP-008 | MetaEnv Control API skill + OpenAPI（9 endpoints） | API 設計 | Notion / skill 檔時間戳 2026-02-03 | **FACT** | active |
| IP-009 | Cloudflare Workers 部署群（帳號內 ~181 workers） | 部署實作 | CF 帳號 workers_list（本 session 查證） | **FACT** | active |
| IP-010 | **MRL 證據方法論與映射規則**（FACT/CLAIM/INFERENCE/UNRESOLVED/RESERVED 紀律、`external mechanism ≠ MRL implementation` 映射規則、evidence-gated `PLANNED→IMPLEMENTED→VERIFIED→RELEASED` 狀態機、World Model 收斂閉環） | **原創方法論 / 技術** | 計畫第 5、8、11、20 節 + 收斂／Backfill 紀錄（Notion 時間戳） | **FACT** | active |

> **方法論與其處理的主張，是兩個獨立的資產類別:**
>
> - **方法論本身(IP-010)** = 案主原創撰寫的邏輯、原理與技術 → **FACT**,是 MRL 資產,可登錄、可主張著作權。
>   案主對此方法的所有權,**不因任何被它分類的主張之真偽而增減**。
> - **經方法處理的具體主張**(如「外部大型 AI 平台機制源自 MRL」)→ 依 IP-010 這套規則本身,
>   在取得 MRL-side evidence 前歸 **CLAIM / UNRESOLVED**,不列為 FACT。
>
> 換言之:此處是**運用案主的資產(IP-010 方法)**,來保護案主另一批可辯護的原創資產——
> 讓 FACT 欄乾淨、打不倒。方法是你的;紀律也是你訂的。

## 3. 著作權（Copyright）

- **自動成立**：上述原始碼與文件於「創作完成」時即受著作權保護，**無須登記**（台灣、美國皆然）。
- **權利歸屬**：全部歸 Root Owner（Mr.liou）。透過 Pull Request 之外部貢獻，依本 repo `LICENSE.md` 授權予 Root Owner。
- **強化證據**（建議）：
  - 保留 GitHub commit 時間戳 + Notion 版本歷史（已存在，是最好的原創時序證據）。
  - 若要在**美國**訴訟主張法定賠償，需先向 U.S. Copyright Office 登記(對美國作品為起訴前提之一);台灣則不需登記即可主張。

## 4. 商標（Trademark）候選

| 標的 | 建議類別（TIPO） | 狀態 | 備註 |
|------|-----------------|------|------|
| **MrLiouWord**（文字） | 第 9 類（軟體）、第 42 類（SaaS） | 建議優先送件 | 比「MRL」易通過（三字母近似案多） |
| **MRL**（文字） | 第 9、42 類 | 送件前先做近似檢索 | 有衝突則主推 MrLiouWord |
| Logo（圖形） | 第 9、42 類 | 待 logo 定稿 | 定稿後補圖形商標 |

- 原則:**先申請先贏**;有海外收入後再經馬德里體系指定美／日／歐。

## 5. 維護規則

- 新資產一律**先登錄再對外**（呼應 `docs/MRL_EXTERNAL_NAMING.md` 的 map-first 原則）。
- 狀態演進：`PLANNED → IMPLEMENTED → VERIFIED → RELEASED`（計畫第 11 節）。
- 本簿**只增不刪**;更正以新版本追加，保留前版（呼應計畫第 10 節保存規則）。
