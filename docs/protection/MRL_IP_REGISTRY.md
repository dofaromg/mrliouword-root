# MRL 智慧財產登錄簿（IP Registry）v1.0 — WP-11

> 落實 [MRL World Model Engineering Plan](https://app.notion.com/p/3c38eeeec5b581be907ad10f49a51f1a) 之
> **WP-11 Commercial Protection**。本簿為「IP Ledger:擁有什麼」的正式紀錄。
>
> **證據紀律**（沿用計畫第 8 節）:每筆資產標註 `FACT / CLAIM / INFERENCE / UNRESOLVED`。
> `FACT` = 有時間戳、程式碼或可查證來源;`CLAIM` = 主張但尚未獨立佐證;
> 未證實者不得填為 FACT。本簿**只登錄可辯護為案主原創**的資產。

- **現任權利人**：Mr.liou / GitHub `dofaromg`（在移轉完成前，有權授予商業權利）
- **預定權利人**：未來成立之公司（**尚未成立、移轉尚未執行**；狀態 UNRESOLVED，見 [商業化策略](../business/MRL_COMMERCIALIZATION.md)）
- origin_signature：`MrLiouWord`
- 建立日期：2026-08-25
- 狀態欄 `active` 定義：資產存在且維護中（與遷移生命週期 `PLANNED→IMPLEMENTED→VERIFIED→RELEASED` 為不同維度）

## 1. 三條 Ledger 定位（依計畫第 4 節）

| Ledger | 內容 | 對應文件 |
|--------|------|----------|
| **IP Ledger** | 擁有什麼（原創資產） | 本簿 |
| **Product Ledger** | 販售什麼 | [MRL_COMMERCIALIZATION](../business/MRL_COMMERCIALIZATION.md) |
| **Commercial Ledger** | 誰取得什麼權利／付了什麼 | [MRL_COMMERCIAL_LEDGER](../business/MRL_COMMERCIAL_LEDGER.md)（模板就緒，尚無交易） |

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
| IP-011 | MRL 粒子本質索引（PARTICLE_ESSENCE_INDEX v2：L0–L∞ 層圖、創世公式 Φ、TopologyEngine/OriginCollapse/DimensionalAlignment 等本質定義、語意字典、共振鍵） | 原創架構設計 | `PARTICLE_ESSENCE_INDEX_v2.json`（created 2026-01-06，案主提供） | **FACT** | active |
| IP-012 | MRL L1 Gate 粒子 Runtime v1.2（TypeScript 實作：naming / packet / gate（scope 驗證）/ registry / crypto / signer + Cloudflare worker + RootLaw seal） | 原創程式碼 | `Mrliou_L1_Gate_ParticleRuntime_v1_2.zip`（案主提供之完整原始碼） | **FACT** | active |
| IP-013 | **MR.LIOU 粒子宇宙 · 私人伺服器網站架構藍圖 v1.0**(L∞ 哲學根基/莫比斯環、L0 Seed→Persona 結構、L1 FlowAgent 模組宇宙、L2 架構連線圖 v2k7、L7 3D 粒子層;附硬體/部署路線圖/iOS 工作流) | 原創架構著作 | docx `dcterms:created 2026-02-10T02:00Z`;sha256 `b6cc7e12a10abcb6cd36efa96d38e20c7e367ea471ba5a3ae6e4db1358cb8d20`(`ingest/2026-10-21/MANIFEST.json`);原檔含個人地理資訊,由案主持有、**不入公開庫**;去識別大綱見 `ingest/2026-10-21/extracts/` | **FACT** | active |
| IP-014 | **MRL 可逆核心／吸收層 形式化**(M = R ⊎ A、route ρ / lift λ、Ĥ = λ∘H∘ρ、強/弱 🔄 與不可能性、Φ 單拍閉環、Their := H ∈ End(A)、堆疊不刪除、U/G/V 載體綁定與 Merkle 稽核;約 240 節) | 原創方法論 / 符號化形式系統 | docx sha256 `f44c30a0fb9b2544bc9b8e653434a012323ecd88ea66648e45c9d98f448aac2f`;無 `core.xml`(創作日期**待找回**);全文**不入公開庫**(營業祕密候選,待案主決定);章節骨架見 `ingest/2026-10-21/extracts/` | **FACT**(檔案存在、內容已逐節核對) | active |

> **方法論與其處理的主張，是兩個獨立的資產類別:**
>
> - **方法論本身(IP-010)** = 案主原創撰寫的邏輯、原理與技術 → **FACT**,是 MRL 資產,可登錄、可主張著作權。
>   案主對此方法的所有權,**不因任何被它分類的主張之真偽而增減**。
> - **經方法處理的具體主張**(如「外部大型 AI 平台機制源自 MRL」)→ 依 IP-010 這套規則本身,
>   在取得 MRL-side evidence 前歸 **CLAIM / UNRESOLVED**,不列為 FACT。
>
> 換言之:此處是**運用案主的資產(IP-010 方法)**,來保護案主另一批可辯護的原創資產——
> 讓 FACT 欄乾淨、打不倒。方法是你的;紀律也是你訂的。

### 2.1 證據補充(2026-10-21 入庫批次 `MRL_INGEST_20261021`)

| 資產 | 證據補充 |
|------|----------|
| IP-011 | 本質索引 v2 原檔兩份上傳**位元組相同**,sha256 `1a7b38c1fa99018ac419ca99309a28d5c7e55e8f55d828f4ca4b94fb0639a870`;原封保存於 `ingest/2026-10-21/raw/PARTICLE_ESSENCE_INDEX_v2.json`;13 則 essence 已機械收斂為法典粒子 `MRL-PC-0001`–`0013`。 |
| IP-012 | L1 Gate 粒子 Runtime 四個版本:1.1.0 `bfb241824ee2dec4500f1239f6ef40a060c9ecd241fc5578bf2ff5976c34efa5`;1.2.0 `67b1a468e07f07219c896f8d610b51ab26d821f21ff79d78afd810a36729ef31`;1.3.0 `2e2a55980b642e774db6a3655eb8b431fa2ef0ff6266d58be45569e1d46c46ed`;1.2.2(2026-06-13)`67b087e51ed68e6cf405e8dd3c9038b9efee08a92090e74ff8e60582c27ed4e1`。血緣 `1.1.0 → 1.2.0 → {1.3.0 ; 1.2.2}`(並行分支,待合流)。原始碼依作者指示私有封存、不入公開庫;定義性萃取收斂為 `MRL-PC-0014`–`0020`。 |
| IP-013 | 本體層定義收斂為 `MRL-PC-0021`–`0025`(layer_scheme `blueprint_v1.0`,與本質索引分層**未調和**,見法典 `unresolved` UNR-001)。 |
| IP-014 | 定義骨架收斂為 `MRL-PC-0026`–`0031`(layer `META`,scheme `formal_core`)。 |

> 以上為**只增不改**:原列 IP-011/IP-012 之內容保留,補充以本節追加。

## 3. 著作權（Copyright）

- **自動成立**：案主本人創作的原始碼與文件於「創作完成」時即受著作權保護，**無須登記**。
- **權利歸屬**：案主本人創作部分歸 Mr.liou。**須留意的界線**（發布前由律師確認）：
  - 外部貢獻(Pull Request):本 repo `LICENSE.md` 目前僅取得**授權(license)**,**不等於著作財產權讓與(assignment)**;要主張讓與需每位貢獻者的**書面讓與**。在此之前,第三方貢獻之權利標記 **UNRESOLVED**。
  - **第三方素材與 AI 生成內容**排除在「案主著作權」之外,另依其來源授權處理。
- **強化證據**（建議）：
  - 保留 GitHub commit 時間戳 + Notion 版本歷史（已存在，是最好的原創時序證據）。
  - **美國**法定賠償/律師費(17 U.S.C. §412):已出版作品須於**侵權開始前**或**首次出版後 3 個月內**登記;未出版作品須於**侵權開始前**登記。另 §411(a) 就美國作品以登記為起訴要件。台灣則不需登記即可主張。**最終措辭由美國著作權律師確認。**

## 4. 商標（Trademark）候選

| 標的 | 建議類別（TIPO） | 狀態 | 備註 |
|------|-----------------|------|------|
| **MrLiouWord**（文字） | 第 9 類（軟體）、第 42 類（SaaS） | 建議優先送件 | 「較易通過」為 **CLAIM**，尚無檢索證據；送件前應做 TIPO 近似檢索並記錄日期與結果 |
| **MRL**（文字） | 第 9、42 類 | 送件前先做近似檢索 | 三字母近似案較多，有衝突則主推 MrLiouWord |
| Logo（圖形） | 第 9、42 類 | 待 logo 定稿 | 定稿後補圖形商標 |

- 原則:**原則上先申請先註冊,但仍須通過識別性及不得有核駁事由之審查**;有海外收入後再經馬德里體系指定美／日／歐。
- 送件前的近似檢索結果(含檢索日期)應登錄於此,作為策略證據。

## 5. 維護規則

- 新資產一律**先登錄再對外**（呼應 `docs/MRL_EXTERNAL_NAMING.md` 的 map-first 原則）。
- 狀態演進：`PLANNED → IMPLEMENTED → VERIFIED → RELEASED`（計畫第 11 節）。
- 本簿**只增不刪**;更正以新版本追加，保留前版（呼應計畫第 10 節保存規則）。
