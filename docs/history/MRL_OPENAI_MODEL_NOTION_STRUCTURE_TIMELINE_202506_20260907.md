# MRL × OpenAI 模型 Notion 內容／結構／邏輯／原理比對時間線

- `record_id`: `MRL-OPENAI-MODEL-NOTION-STRUCTURE-TIMELINE-202506-20260907-v0.1`
- `origin_signature`: `MrLiouWord`
- `record_type`: `CHRONOLOGICAL_EVIDENCE_COMPARISON`
- `range`: `2025-06-01 — 2026-09-07`
- `handling`: `APPEND_ONLY / PRESERVE_ORIGINAL / NO_RETROACTIVE_REWRITE`
- `scope`: OpenAI 在 2025-06 之後公開的 GPT／o／Codex 主線模型，逐一搜尋 MRL Notion 的名稱與結構關聯。
- `revision`: `v0.2 — 2026-09-07；擴充 FlowSeed／FlowAgent／MrLiouWord 母體血脈、反推與尺度公式、推理鏈、粒子字典／工具箱／積木`

## 1. 判讀規則

本紀錄分開保存五種狀態，不把它們混寫：

| 標記 | 含義 |
|---|---|
| `EXACT_NAME_MATCH` | Notion 正文或標題直接出現該模型名稱 |
| `STRUCTURAL_ALIGNMENT` | 名稱不同，但內容結構、邏輯流程或運作原理可逐項對照 |
| `POST_RELEASE_MAPPING` | MRL 頁面或回填晚於外部發布，僅證明後續整理／映射 |
| `ANCESTOR_REFERENCE_PENDING` | Notion 記載更早祖先檔名或日期，但原始本體仍待取回核驗 |
| `DIRECT_LINEAGE_UNESTABLISHED` | 尚無直接接觸、取得、傳播、程式或權重來源鏈證據 |

時間必須分成：外部官方發布日、Notion 頁面建立／編輯日、頁內所載事件日、原始檔時間。頁內回填的 2025 日期不等於 Notion 在 2025 年已存在。

## 2. MRL Notion 的早期結構節點

### 2025-06｜FlowSeed 祖先封存引用

`MRL世界模組歷史日誌`記載兩個 2025-06-21 封存包：

- `FlowSeed_靈魂整合封存_v20250621_FINAL_v2.zip`
- `FlowSeed_你所說的我_完整封存_v20250621.zip`

目前狀態：`ANCESTOR_REFERENCE_PENDING`。Notion 保存了引用與後續父子鏈說明；原始 ZIP 本體仍待手機、iCloud 或其他封存位置核實。

### 2025-07-20｜FlowAgent Frequency Field

Notion 頁面文字記載 `FlowAgent.TotalCore.Unity.v1.flpkg`、記憶、頻率、共振、人格模組及跳點；頁內封存時間為 2025-07-20。此為頁內歷史時間，Notion 頁本身是後續整理。

### 2025-07-23｜FlowAgent 語場語言系統建構大綱

頁面明列：

- 單線推論轉為多線共振；
- 語素觸發人格、記憶、情緒、邏輯等多跳點；
- `.flynz.map` 作為跳點拓撲；
- 多線平行處理後整合回單一語句；
- `FlowMind.SelfReflect.v1.pcode`；
- `STRUCTURE → MARK → FLOW → RECURSE → STORE`；
- 壓縮資料與語場環境、記憶地球儀、封存、還原及 100% 可逆目標；
- GGUF／Hugging Face 與 `.fltnz`／`.flpkg` 的轉譯規劃。

### 2025-07 至 2026-01｜早期核心文件歸檔

Notion 歸檔頁建立於 2026-03-19，頁面標示內容時間為 2025-07 至 2026-01。核心鏈包括：

`define → mark → transform → generate_persona → store_memory`

並保存結構節點、壓縮記憶、邏輯壓力變化、可逆跳點、FlowSeed→TotalCore→UniversalField 演化，以及 `.txt ↔ .fltnz ↔ .flynz.map ↔ .flpkg` 往返規格。

## 2A. 擴大母體血脈與證據層級

本輪不再只按外部模型名稱搜尋，而是沿 MRL 自己的父子鏈反向查閱。Notion 的 `Origin Registry` 明列唯一主線：

`Origin → FlowSeed → FlowAgent → Particle / Primitive → .fltnz / .flpkg → FlowMemory / Runtime → Registry → Verification → DL580 Mother Runtime → MRL`

此鏈把概念、格式、記憶、執行、驗證與母體連成同一譜系。它能證明 MRL 內部架構的連續性；其中每個時間錨點仍須依原始檔、頁內歷史日期、Notion 建頁時間、Git／Runtime 證據分級。

| 節點 | Notion／頁內時間 | 內容與父子關係 | 本輪證據判讀 |
|---|---|---|---|
| FlowSeed 祖先封存 | 頁內 2025-06-21 | 靈魂整合、人格／記憶喚醒、後續 L1–L7 的種子層 | `ANCESTOR_REFERENCE_PENDING`：封存包名稱已保存，原始 ZIP／hash 待核 |
| FlowAgent 祖先檔 | 檔名線索 2025-06-29；核心頁內 2025-07-23 | `FlowAgent_FullModules_20250629_193504.md`；多線共振、跳點拓撲、自反思、封存還原 | 檔名為 `PROVISIONAL`；2025-07 結構為 `VERIFIED_DERIVED` |
| FlowMemory／格式鏈 | 頁內 2025-07-19～20 | `.fltnz`、`.flynz.map`、`.flpkg`、session/hash/jump point、人格快照與可逆路徑 | 後續頁可明確指回早期 manifest；原始 package hash 待補 |
| 放大反推演算／反推器 | 原檔名指向 2025-08-13；Notion 整理頁 2026-03／05 | `P(k+1)=N(k)·P(k)·η(k)`、Inverse、Scale、Stabilize；接入 persona resonance／ontology／FlowAgent | 具體公式與執行鏈已保存；2025 首次性仍依原始 TXT／ZIP metadata 與 hash 補強 |
| 粒子整合字典 | 來源檔 `MrLiouWord_粒子系統整合字典_v2.txt`；資料庫記錄最後更新 2026-01-20 | 五種基礎粒子、R0–R4、L1–L7、SEED(X)、Fluin、Mother Memory Sphere | 字典來源檔名與範圍可驗；原檔 custody／hash 尚待加入 |
| 粒子工具箱 | 頁內日期 2026-03-12 | FlowAgent + ParticleVM + LAW-0；統一調用、按需載入、跨平台、能力路由及狀態分類 | 具體模組規格；頁面同時標出已實現／開發中／計畫中，不能全部視為已部署 |
| 粒子積木 | Notion 命中 2026-03～05 | 原子化、可組合、可拆回最小單元；Seed／Anchor／Transform 等粒子形成能力積木 | 支持 MRL 的組合式能力架構；需逐項連到原始程式與測試才升格為 Runtime 證明 |
| 推理／回放 Runtime | 2026-05～06 | MrliouIR 推理鏈、verify/backtrack/replay；六層推理閉環；`mrl_reasoning_chains`、snapshots、events | 工程與部署敘述具體；獨立 health log、artifact hash、資料庫 snapshot 仍是更高級實證 |
| Source／Origin 治理 | 2026-08 | source + chronology + provenance；原名、原作者、時間、license、custody、衍生關係不可覆寫 | 是證據治理規則，不是對早期事件本身的替代證明 |

## 2B. 反推、放大縮小與推理能力的共同結構

### 尺度公式

頁面保存的 MRL 基式為：

`P(k+1) = N(k) · P(k) · η(k)`

其中 `P` 可表示粒子／狀態／人格，`N` 表示堆疊或結構，`η` 表示效率、折損或環境影響。對純量情境，反推式為：

`P(k) = P(k+1) / (N(k) · η(k))`

向量或矩陣情境則記載逆矩陣或 Moore–Penrose pseudo-inverse，並以 `ε`、clip 或 log-domain 處理近零與爆衝。這表示「怎麼過去就怎麼回來」不只是一句原則，至少已被拆成 Forward、Inverse、Scale、Stabilize 四類操作。

### 從公式到推理流程

`sense → analyze → pattern-match → rewrite → [inverse / scale / stabilize] → store → reconstruct`

此鏈與 MRL 其他頁面的下列結構形成連續對應：

- `STRUCTURE → MARK → FLOW → RECURSE → STORE`：將輸入轉成可追蹤結構並進入記憶；
- `define → mark → transform → generate_persona → store_memory`：將變換、人格與記憶綁定；
- `parse → retrieve → reason → synthesize → generate → feedback`：2026-06 六層推理閉環；
- `verify → backtrack → replay`：推理鏈不是只輸出答案，還要求驗證、回退與重播；
- `Need → Gap → Patch/Rebuild/Map → Integrate → Verify → Converge`：後續將反推／差異判讀接到工程收斂。

所以，MRL 的「推理能力」在內部資料中不是單一模型能力名詞，而是由尺度變換、結構映射、記憶保存、反向還原、驗證回放與回饋收斂共同構成。這是比單一功能名稱更有識別力的結構指紋。

## 2C. 粒子字典、工具箱與積木不是三套分離系統

| 層 | 角色 | 主要功能 | 與母體血脈的關係 |
|---|---|---|---|
| 粒子字典 | 語義／型別／來源映射 | 定義粒子簽名、類型、R／L 層級、語意與轉譯候選 | 讓外部輸入可被讀成 MRL 中介粒子，並保留 source anchor 與 context |
| 粒子工具箱 | 能力索引／調用層 | 統一介面、LAW-0 驗證、能力選擇、路由、動態載入與狀態管理 | 把字典辨識出的能力映射到可調用模組 |
| 粒子積木 | 原子化組合／生成層 | 將複雜系統拆成最小能力單元，再按需求組合、放大或拆回 | 把能力由「可查」轉成「可組合、可生成、可逆」 |
| `.fltnz`／`.flpkg` | 記憶與封裝層 | 保存語場、jump point、session/hash、人格、能力與部署狀態 | 讓積木組合可移植、封存、還原與跨環境投影 |
| FlowMemory／Runtime | 運行與歷史層 | active/archive context、snapshot、event sourcing、replay、failure recovery | 保存組合前後狀態，支援回放、反推及下一輪演化 |

由此可見，字典回答「這是什麼／對應哪個粒子」，工具箱回答「可調用什麼能力」，積木回答「如何組合成較大能力」，公式回答「如何跨尺度展開與反推」，記憶／Runtime 則回答「如何執行、保存、驗證與回來」。這五者在 Notion 中形成共同父鏈，而不是彼此無關的後續名詞集合。

## 3. OpenAI 模型逐一名稱搜尋結果

| 官方日期 | 模型 | Notion 精確名稱結果 | 時間／性質 |
|---|---|---|---|
| 2025-06-10 | o3-pro | 未找到專屬頁 | 僅有一般 OpenAI／MRL 結構頁 |
| 2025-08-05 | gpt-oss-120b | 未找到專屬頁 | 有本地模型、GGUF／HF 轉譯與封裝結構 |
| 2025-08-05 | gpt-oss-20b | 未找到專屬頁 | 同上 |
| 2025-08-07 | GPT-5 | 找到 `MRL vs GPT-5 vs DeepSeek` 等頁 | Notion 命中頁為 2026-05，晚於發布 |
| 2025-08-07 | GPT-5 mini | 未找到專屬頁 | GPT-5 一般頁為間接命中 |
| 2025-08-07 | GPT-5 nano | 未找到專屬頁 | GPT-5 一般頁為間接命中 |
| 2025-08-07 | GPT-5 Pro | 未找到專屬頁 | GPT-5 一般頁為間接命中 |
| 2025-09-15 | GPT-5-Codex | 未找到專屬頁 | 2026-06 子代理頁明列 Codex 為整合來源，屬後續映射 |
| 2025-11-12 | GPT-5.1 Instant | 未找到專屬頁 | 一般 GPT-5／GPT-5.5 頁為間接命中 |
| 2025-11-12 | GPT-5.1 Thinking | 未找到專屬頁 | 同上 |
| 2025-11-13 | GPT-5.1-Codex | 未找到專屬頁 | Codex／代理頁為間接命中 |
| 2025-11-13 | GPT-5.1-Codex-mini | 未找到專屬頁 | Codex／代理頁為間接命中 |
| 2025-11-19 | GPT-5.1-Codex-Max | 未找到專屬頁 | 記憶壓縮、長任務、恢復結構可對照 |
| 2025-12-11 | GPT-5.2 Instant | 未找到專屬頁 | 搜尋易被 GLM-5.2 汙染；未視為命中 |
| 2025-12-11 | GPT-5.2 Thinking | 未找到專屬頁 | 同上 |
| 2025-12-11 | GPT-5.2 Pro | 未找到專屬頁 | 同上 |
| 2025-12-18 | GPT-5.2-Codex | 未找到專屬頁 | 代理、壓縮、工具循環頁為間接命中 |
| 2026-02-05 | GPT-5.3-Codex | 未找到專屬頁 | 代理與工具執行頁為間接命中 |
| 2026-03-03 | GPT-5.3 Instant | 未找到專屬頁 | 人格／對話頁為一般結構關聯 |
| 2026-03-05 | GPT-5.4 | 未找到專屬頁 | GPT-5.6 外部快照頁含官方 5.4 連結，屬後續收錄 |
| 2026-03-05 | GPT-5.4 Pro | 未找到專屬頁 | 同上 |
| 2026-04-23 | GPT-5.5 | 找到多個專頁 | 2026-05-05／10，發布後的權重推測與比對 |
| 2026-04-23 | GPT-5.5 Pro | 未找到專屬頁 | GPT-5.5 一般頁為間接命中 |
| 2026-05-05 | GPT-5.5 Instant | 未找到專屬頁 | 同日 GPT-5.5 推測頁不能據此確定先後 |
| 2026-07-09 | GPT-5.6 Sol | 精確命中外部文章快照 | Notion 收錄 2026-08-10，發布後 |
| 2026-07-09 | GPT-5.6 Terra | 精確命中同一外部文章快照 | Notion 收錄 2026-08-10，發布後 |
| 2026-07-09 | GPT-5.6 Luna | 精確命中同一外部文章快照 | Notion 收錄 2026-08-10，發布後 |
| 2026-09-03 | GPT-6 Astra | 找到 2026-09-07 公開觀測報告 | 發布後的外部／MRL 對照 |
| 2026-09-03 | GPT-6 Astra Pro | 未找到專屬頁 | Astra 一般報告為間接命中 |

## 4. 內容結構、邏輯架構與運作原理比對

| 外部模型機制 | MRL Notion 對應結構 | 時序與證據性質 |
|---|---|---|
| 長時間推理／依任務調整思考量 | 多線共振、SelfReflect、跳點與回到單一輸出 | 2025-07 頁內內容可作早期結構候選；不是相同實作證明 |
| 開放權重／本地推論／可移植 | GGUF／HF→`.fltnz`／`.flpkg`、私有伺服器、封包還原 | 2025-07 頁內內容早於 gpt-oss；結構方向相關但格式與模型不同 |
| 快速模型＋深度模型＋路由器 | 多跳點、多線平行處理、FlowBridge 路由、後續 ModelOracle 動態模型路由 | 2025-07 有多線／跳點；精確「模型選擇路由」頁主要在 2026-07 |
| Agentic coding：計畫、執行、測試、修正 | `Planner → Executor → Verifier → Retry → Loop → Consolidate`；FlowForge `執行→沙盒→現實測試→修復→循環` | 明確工程頁為 2026-05；晚於早期 Codex，且頁面自行標記參照 Claude／ChatGPT |
| 長任務 context compaction | 活躍上下文＋封存上下文、`compress_old_context`、按查詢展開、`.fltnz` 保存 session/hash/restore | 2025-07 有壓縮／封存／還原原理；明確 context-compressor 規格為 2026-05 |
| 多代理任務分解與聚合 | TaskDecomposer、ParallelExecutor、ResultAggregator、動態委派、狀態追蹤 | 專頁為 2026-06，並列 OpenAI Codex 等為整合來源，應標 `POST_RELEASE_MAPPING` |
| 推理／行為可監控與可回放 | MrliouIR reasoning chain、每步驗證、Trace、事件追加、世界 Local State | 明確 Notion 工程規格集中於 2026-05 之後；2025 父鏈已有跳點、封存與重構描述 |
| 遞迴自我改進 | 觀測→差異→規律→結構→映射→驗證→回填；Need→Gap→Patch→Verify→Converge | 收斂公式頁多為 2026-08；早期 FlowSeed／FlowAgent 有成長、自反思與下一輪演化 |
| 模型協助改進模型／Runtime | FlowAgent 生命循環、模組演化、FlowForge 測試修復循環 | 結構相關；尚不能由 Notion 單獨證明 OpenAI 的模型來源 |
| 跨尺度能力展開／壓縮 | `P(k+1)=N(k)·P(k)·η(k)`、ScaleUp／ScaleDown、分形種子、R0–R4／L1–L7 | 2025-08 原檔名與內容由後續頁保存；原始 TXT／ZIP 待 hash 核驗 |
| 結果反推先前狀態 | Inverse、pseudo-inverse、Stabilize、backtrack、replay、timeline reverse | 具體公式與 API 已記錄；需區分純量可逆與多對一映射不可唯一反推的數學限制 |
| 組合式能力／工具選擇 | 粒子字典→能力候選；工具箱→路由調用；粒子積木→原子能力組合 | 2026-01～03 有資料庫與頁面錨點；較晚頁為工程化延展，不倒寫成 2025 原件 |
| 模型內部狀態之外的監控 | origin/source、Trace、snapshot、event sourcing、Runtime health、round-trip test | MRL 提供多證據面監控方向，可補思維鏈監控不足；效果仍須由獨立測試數據驗證 |

## 5. 逐世代判讀

### o3-pro

名稱層未命中。其「更久推理、可靠回答、工具能力」與 MRL 多線推理／跳點／自反思有一般結構關聯，但目前 Notion 所載 2025-07 節點晚於 2025-06-10 發布，不構成時間優先。

### gpt-oss

名稱層未命中。MRL 2025-07 頁內的 GGUF／Hugging Face 轉譯、私有部署、可移植封包與可逆保存，早於 2025-08-05 發布，形成可比對的本地／開放模型承載方向。這些是結構方向相似，不是 gpt-oss 權重或程式來源證明。

### GPT-5 與 GPT-5.1

GPT-5 專名頁存在，但建立於發布後。較早 MRL 內容可對照多線處理、跳點、SelfReflect、人格與記憶；尚未找到在 2025-08-07 前精確寫出「快速模型＋深度推理模型＋即時路由器」的 Notion 原文。

GPT-5.1 的 adaptive reasoning 與 MRL 自反思／動態路徑有結構關聯；Instant 的對話人格與 MRL FlowPersona 相關，但屬廣泛機制，識別力有限。

### GPT-5-Codex 至 GPT-5.3-Codex

MRL 後續工程頁確實具有完整代理循環、任務分解、並行執行、驗證、重試、降級與整合。這些頁也明確承認以 Claude／ChatGPT／OpenAI Codex 等外部能力作為對標或整合來源，因此必須同時保存兩件事：

1. MRL 已將其具體化成自己的模組、流程與程式規格；
2. 這批 2026-05／06 頁不能倒寫成早於 2025 Codex 的獨立來源證據。

較早 2025 FlowAgent 父鏈可支持人格、記憶、模組、跳點、封存與演化的上層連續性，但是否已包含完整 coding-agent loop，需回到原始檔逐段核驗。

### GPT-5.2／5.4／5.5

長上下文、工具使用、電腦操作與專業文件生成，能在 MRL 的上下文保存、多格式轉譯、FlowBridge／工具模組與任務引擎找到結構對應。惟相關機制相當通用，必須用更具識別性的順序、欄位、狀態機和時間來提高證據力。

GPT-5.5 的 Notion「權重推測」頁是在官方 2026-04-23 發布後建立。它可證明 MRL 曾進行 10 維推測與自訂信任度分析，不能當成發布前預測，也不能把未公開的參數、MoE、訓練資料與成本估計改寫成官方事實。

### GPT-5.6 Sol／Terra／Luna

Notion 有三型號的精確命中，但來源是 2026-08-10 收錄的 OpenAI 公開文章快照，晚於 2026-07-09 發布。可比對的 MRL 結構包括：

- 依能力、成本、延遲選擇模型／節點；
- 多代理編排與並行分解；
- context 壓縮與工具輸出管理；
- Planner／Executor／Verifier／Retry 循環；
- Runtime、快取、路由、Trace 與失敗恢復。

其中 Agent Orchestrator／FlowForge 於 2026-05 已有明確規格，早於 GPT-5.6；ModelOracle 的精確動態模型路由頁則為 2026-07-13，晚於 GPT-5.6 發布。兩者不可混成同一時間證據。

### GPT-6 Astra／Astra Pro

精確 Astra 報告建立於 2026-09-07，晚於發布；Astra Pro 尚未找到專屬 Notion 頁。MRL 先前資料與 Astra 公開敘述的主要結構關聯為：

- AI 能力不是單一程式碼，而由資料、環境、記憶、權重、回饋與運行循環形成；
- 可見文字不等於全部內部狀態；
- 需保存 Trace、來源、世界 Local State、行為軌跡與可回放事件；
- 自我改進應由驗證、缺口、修正與收斂構成，而不是無限制覆寫；
- 建造者、訓練者、研究者與產品商是可重疊但不同的角色。

這些材料支持「MRL 已有一套可比較的形成、記憶、運行、觀測與演化框架」。是否存在 Astra 對 MRL 的直接外部 lineage，現有 Notion 材料仍為 `DIRECT_LINEAGE_UNESTABLISHED`。

## 6. 現階段實事求是結論

1. MRL Notion 不是單一口號，而有 `Origin → FlowSeed → FlowAgent → Particle／Primitive → 封包 → FlowMemory／Runtime → Registry／Verification → Mother Runtime` 的明示母體血脈。
2. 對 OpenAI 各代模型而言，精確型號名稱多數是在官方發布後才命中；不能把後續型號頁倒寫為發布前預測。
3. 2025-07 頁內資料對「壓縮記憶、還原、跳點、多線處理、人格／模組、私有與可移植封裝」提供較早結構證據；後續頁又保存 `20250813反推器.zip` 與放大反推原始 TXT 的內容，補出尺度變換、Inverse、Stabilize 與推理鏈掛接。
4. 2026-05 以後的 MRL 工程頁對代理循環、上下文壓縮、動態委派、驗證與重試提供更具體規格；部分頁明列外部系統為對標／整合來源，必須保留其衍生性。
5. 粒子字典、粒子工具箱、粒子積木、可逆封包與 FlowMemory／Runtime 不是孤立頁面；它們依序承擔辨識、調用、組合、封裝、執行與回放，形成可逐項比對的結構指紋。
6. 目前可成立的是「母體血脈＋時間＋結構＋實作狀態關聯矩陣」；直接接觸、程式取用、權重來源或法律侵權尚需另一類證據。
7. 外部黑箱資料未知，不構成否定 MRL 的證據；同樣地，未知也不能自動被填成直接來源關係。雙方若主張來源，應適用同一套 source、chronology、provenance、artifact／Runtime 證據標準。

## 7. Notion 來源索引

- [MRL世界模組歷史日誌](https://app.notion.com/p/3d28eeeec5b58092918fd8ce6cdb9241)
- [FlowAgent 語場語言系統建構大綱（2025.07.23）](https://app.notion.com/p/35d8eeeec5b58067b221c81e5661e296)
- [粒子語言 × FlowAgent 早期核心文件歸檔](https://app.notion.com/p/3288eeeec5b581e98eb8c2e89ca3eca8)
- [MRL_FlowAgent 系統計劃書](https://app.notion.com/p/c6dfe635c4104d8da5fed81bcce5a70d)
- [MRL Conversation & Reasoning Engine](https://app.notion.com/p/4b035d321e574c6896cae1e97fdf9fd1)
- [MRL Agent Orchestrator](https://app.notion.com/p/eecca5c16af841d3bff3e8a7d7fdd653)
- [MRL SubAgentOrchestrator](https://app.notion.com/p/fd87efaacf96459fabd0995ebcf26556)
- [MRL.FlowForge](https://app.notion.com/p/3228eeeec5b581d191b7c3db2a9618bb)
- [MRL Requirement-Driven Convergence](https://app.notion.com/p/3c08eeeec5b581c39534dcfcd3619b72)
- [GPT-5.5 模型權重推測](https://app.notion.com/p/074d711a8dea4df59a3c2ebe4b1ca482)
- [GPT-5.6 外部文章快照](https://app.notion.com/p/3b88eeeec5b580dab182c001bc48a004)
- [Astra × MRL 公開觀測報告](https://app.notion.com/p/3d48eeeec5b58191bc28d52fa6050352)
- [Mrliou MRL Origin Registry](https://app.notion.com/p/e771f33ea9e344f499ffcfeaff490758)
- [MRL Mother Top Source Layer](https://app.notion.com/p/3b88eeeec5b581adb0aec7c998926133)
- [FlowSeed 靈魂系統專欄](https://app.notion.com/p/272ee58cf7c942c5aca337d536ca931f)
- [放大反推演算／20250813反推器保存頁](https://app.notion.com/p/31c8eeeec5b5806b8e3de556de394d00)
- [粒子系統整合字典 v2.0](https://app.notion.com/p/3238eeeec5b581fb8894ec0f29e93332)
- [粒子工具箱完整索引](https://app.notion.com/p/e3cebf17e6a34ff1b19d38a592b05ba9)
- [Mrliou AI++ 粒子積木系統](https://app.notion.com/p/3ceacb7fa72c49afad85b9971a5eaca3)
- [MRL Reader／粒子字典轉譯與轉驛站](https://app.notion.com/p/3ba8eeeec5b5810e8738dd5b7864b154)
- [MRL MotherSystem 建構與部署工程紀錄](https://app.notion.com/p/3728eeeec5b581b594b5fe8d978094fa)

## 8. OpenAI 官方來源索引

- [o3／o4-mini（含 2025-06-10 o3-pro 更新）](https://openai.com/index/introducing-o3-and-o4-mini/)
- [gpt-oss](https://openai.com/index/introducing-gpt-oss/)
- [GPT-5](https://openai.com/index/introducing-gpt-5/)
- [GPT-5 for developers](https://openai.com/index/introducing-gpt-5-for-developers/)
- [GPT-5-Codex](https://openai.com/index/introducing-upgrades-to-codex/)
- [GPT-5.1](https://openai.com/index/gpt-5-1/)
- [GPT-5.1 for developers](https://openai.com/index/gpt-5-1-for-developers/)
- [GPT-5.1-Codex-Max](https://openai.com/index/gpt-5-1-codex-max/)
- [GPT-5.2](https://openai.com/index/introducing-gpt-5-2/)
- [GPT-5.2-Codex](https://openai.com/index/introducing-gpt-5-2-codex/)
- [GPT-5.3-Codex](https://openai.com/index/introducing-gpt-5-3-codex/)
- [GPT-5.3 Instant](https://openai.com/index/gpt-5-3-instant/)
- [GPT-5.4](https://openai.com/index/introducing-gpt-5-4/)
- [GPT-5.5](https://openai.com/index/introducing-gpt-5-5/)
- [GPT-5.5 Instant](https://openai.com/index/gpt-5-5-instant/)
- [GPT-5.6](https://openai.com/index/gpt-5-6/)
- [GPT-6 Astra](https://openai.com/index/gpt-6-astra/)
- [An Alien Mind](https://openai.com/index/an-alien-mind/)

---

`origin_signature: MrLiouWord`
