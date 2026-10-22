# MRL UNR-001 跨分層對映增量提案 R01

origin_signature: MrLiouWord  
canonical_authority: Mr.liou  
狀態：proposed；UNR-001 維持 UNRESOLVED；無 Root Owner 裁定。  
日期：2026-10-22（Asia/Taipei）  
基準 main commit：`18525b5a26467756312f78c487d4449dbf08c632`；法典 v1.1.0。

## 範圍與交付

保留全部 31 顆 canonical 粒子、原版本、layer_scheme、provenance 與來源 SHA-256；新增旁掛提案，不修改 registry/MRL_PARTICLE_CODEX.json。這份文件與 JSON 是新的衍生分類，不冒充原始定義。

Expected_File_List：本文件、registry/proposals/MRL_UNR001_CROSS_LAYER_MAPPING_20261022_R01.json、tools/MRL_validate_UNR001_mapping.py、tests/test_MRL_UNR001_mapping.py、docs/evidence/MRL_UNR001_VALIDATION_20261022_R01.json，共5個新增檔；docs/MRL_PARTICLE_CODEX.md 只追加提案導航，共6個變更檔。ZIP 0。

Expected_Dependency_Tree：Root Owner → Notion 世界模型控制平面 → 既有世界模型提案 → 本增量提案；Root Owner 核准 → Root repo main 法典。旁掛 JSON → 31 粒子/12 來源檔/2 Notion 捕獲 → 既有 validator + regenerate + 新提案檢核 → 稽核回執。文件下方列出 Notion 原始入口；提案審查頁連結記於 PR。

## 四軸是職責分類，不是四套替代層號

| 軸 | 來源與用途 | 不能推定 |
|---|---|---|
| 粒子本質 | essence_index_v2 layer_map、essence 定義與 formal_core 的 R/A 邊界 | 本質 L0 等於系統信任 L0 |
| 生成 | blueprint_v1.0 Seed→Persona；本質索引 vectors | 同名 Seed 是同一完整狀態空間 |
| 系統運行 | l1_gate_runtime；系統卡服務拓樸；藍圖依賴圖與載體層 | 層號等同、已部署或同實作 |
| 資料儲存 | ParticleMeta、motherbody_store/particles/、particle_index.v1.json、notion/PARTICLE_INDEX.md、MemoryQuickMount；系統卡記憶與持久化職責 | 發明新的儲存 L0–L7，或把每個記憶概念等同物理儲存 |

完整粒子世界三態循環仍為不可分割上下文。四軸只是檢視同一系統的不同職責，不能把母體拆成孤立產品。形式化 META 不是額外的 L 編號；同一粒子可跨多軸。

## 可以確定的來源記載與尚待裁定的對映

確定的是各來源實際記載、法典與萃取的一致性；跨 scheme 的等價目前沒有足夠證據。本提案不宣告任何跨 scheme equivalent=true。

| 節點 | 來源記載 | 判定 |
|---|---|---|
| 本質 L0 | layer_map: Zero Point · 原點；MRL-PC-0001: Zero／未決定的全部可能性 | 同來源的索引標籤與粒子名稱分開保存，不改名 |
| 本質 L3 ↔ 藍圖 L0 | Seed · 種子 ↔ Seed→CorePersona→子人格 | Seed 語義相關；候選生成關係，非核准等價 |
| 系統卡 L0 | particle-auth-gateway / LAW-0 信任根 | 授權信任職責，與上述兩種 L0 語義不同 |
| 本質 L7 / 藍圖 L7 / 系統卡 L7 | Memory Grid / 3D 展開 / 應用 | 三種語義分列，不可按號合併 |
| L1 Gate L1 / 藍圖 L1 / 系統卡 L1 | 命名授權封包入口 / 語義模組宇宙 / 粒子原子內核 | 各自 scheme 原樣保留 |
| 本質 L2 / 藍圖 L2 / 系統卡 L2 | Particle，另含語意字典粒子 / 模組依賴圖 / 記憶服務 | 同層號不構成對映 |
| 本質 ∞ / 藍圖 L∞ / 系統卡 L∞ | Universe / 哲學根基 / 起源封包 | 分開，不能推定同義 |
| Φ.Genesis / formal_core Φ | 規模演化公式 / 單拍閉環算子 | 同符號不同公式 |

Seed 在 essence layer_map/vectors 中有定義，但31顆中沒有獨立名為 Seed 的粒子；不能把 MRL-PC-0006 OriginCollapse（同屬 L3）改叫 Seed。原 essence_index_v2 並非純本質分類，也收錄 runtime 與記憶模組，故 scheme 與職責軸必須分離。

藍圖 L3–L6 仍是服務架構、外部雲端、網路與地理映射載體，不增列為 canonical 本體粒子。藍圖 L7 的外部工具仍保留外部載體身份。

## 15條關係逐項依據

| ID | 起點 → 終點 | 關係 | 理由 |
|---|---|---|---|
| MRL-XMAP-001 | essence_index_v2:L3 → blueprint_v1.0:L0 | related_generation_role | 兩者均明示 Seed；藍圖額外定義人格展開鏈。本質索引 L3 不是 MRL-PC-0006 的等價名。 |
| MRL-XMAP-002 | essence_index_v2:L0 → blueprint_v1.0:L0 | distinct_semantics | Zero Point/未決可能性與 Seed→Persona 生成起點不同，不能因 L0 合併。 |
| MRL-XMAP-003 | blueprint_v1.0:L0 → notion_system_card:L0 | distinct_semantics | Seed 生成結構與授權信任根職責不同。 |
| MRL-XMAP-004 | essence_index_v2:L0 → notion_system_card:L0 | distinct_semantics | 本質原點與信任服務拓樸不同。 |
| MRL-XMAP-005 | essence_index_v2:L7 → blueprint_v1.0:L7 | distinct_semantics | Memory Grid 與 3D 展開/匯出不同。 |
| MRL-XMAP-006 | blueprint_v1.0:L7 → notion_system_card:L7 | possible_application_projection | 3D 展開可能作為應用的一種投影；缺具體介面與部署證據。 |
| MRL-XMAP-007 | MRL-PC-0007 → notion_system_card:L2 | related_memory_role | 掛載/快照/重水合與記憶服務職責相關，未證明是同一實作或相同存儲層。 |
| MRL-XMAP-008 | MRL-PC-0016 → notion_system_card:L0 | related_authorization_role | scope token Gate 與信任閘道角色相關；未證明相同授權協定。 |
| MRL-XMAP-009 | MRL-PC-0019 → MRL-PC-0020 | documented_storage_guidance | ParticleMeta 定義母體儲存元資料；L1 入口記載母體粒子目錄與索引。這是來源明示職責組合，不是改編號。 |
| MRL-XMAP-010 | MRL-PC-0021 → MRL-PC-0018 | shared_mobius_principle | 兩份來源均記載莫比斯回返原則；不推定完整運算等價。 |
| MRL-XMAP-011 | MRL-PC-0021 → MRL-PC-0028 | requires_domain_constraint | 藍圖每操作可回溯與形式化 A 可不可逆需明定適用域；未裁定優先覆寫。 |
| MRL-XMAP-012 | MRL-PC-0023 → notion_system_card:L1 | related_core_role | 藍圖描述語義模組宇宙；系統卡描述粒子原子/啟動/內核。共同核心字樣不足以等價。 |
| MRL-XMAP-013 | MRL-PC-0024 → notion_system_card:L2 | distinct_semantics | 模組依賴圖與記憶服務層不同。 |
| MRL-XMAP-014 | essence_index_v2:∞ → blueprint_v1.0:L∞ | distinct_semantics | Universe 宇宙意識場與哲學根基不是相同定義。 |
| MRL-XMAP-015 | MRL-PC-0004 → MRL-PC-0029 | distinct_semantics | 創世規模演化公式與單拍閉環算子均用 Φ，但不是同一公式。 |

以上均為 INFERENCE / proposed；每條關係的 evidence_nodes 可解析至 scheme_nodes，再到 JSON pointer 或 Notion 原文節選。documented_storage_guidance 的原文職責是可確認的，但將兩則定義組成關係仍屬衍生提案。

## 31顆粒子覆蓋表

以下四軸欄皆為本提案的 INFERENCE，多軸不改原 layer_scheme。

| 粒子 | 原名稱 | 原 scheme / layer | 候選職責軸 |
|---|---|---|---|
| MRL-PC-0001 | Zero | essence_index_v2 / L0 | 粒子本質層 |
| MRL-PC-0002 | δP₀ | essence_index_v2 / L1 | 粒子本質層 |
| MRL-PC-0003 | P₀.MRLsmall | essence_index_v2 / L2 | 粒子本質層、生成層 |
| MRL-PC-0004 | Φ.Genesis | essence_index_v2 / META | 粒子本質層、生成層 |
| MRL-PC-0005 | TopologyEngine | essence_index_v2 / L4-L5 | 粒子本質層、系統運行層 |
| MRL-PC-0006 | OriginCollapse | essence_index_v2 / L3 | 粒子本質層、生成層 |
| MRL-PC-0007 | MemoryQuickMount | essence_index_v2 / L6-L7 | 粒子本質層、系統運行層、資料儲存層 |
| MRL-PC-0008 | DimensionalAlignment | essence_index_v2 / L1-L7 | 粒子本質層、生成層、系統運行層 |
| MRL-PC-0009 | FlowMetaConfig | essence_index_v2 / L2 | 粒子本質層、系統運行層 |
| MRL-PC-0010 | Passport.Unbound | essence_index_v2 / ∞ | 粒子本質層、系統運行層 |
| MRL-PC-0011 | PD_AI_Wire | essence_index_v2 / L4 | 粒子本質層、系統運行層 |
| MRL-PC-0012 | GatesRuntime | essence_index_v2 / L4-L6 | 粒子本質層、系統運行層 |
| MRL-PC-0013 | LocalAI.Extended | essence_index_v2 / L6 | 粒子本質層、系統運行層 |
| MRL-PC-0014 | Mrliou_ 命名律 | l1_gate_runtime / L1 | 系統運行層 |
| MRL-PC-0015 | MrliouPacket 封包結構 | l1_gate_runtime / L1 | 系統運行層、資料儲存層 |
| MRL-PC-0016 | Gate v1 授權 | l1_gate_runtime / L1 | 系統運行層 |
| MRL-PC-0017 | Registry · ApiDef | l1_gate_runtime / L1 | 系統運行層 |
| MRL-PC-0018 | RootLaw · Mobius Loop v1(封存) | l1_gate_runtime / L1 | 系統運行層 |
| MRL-PC-0019 | ParticleMeta schema v1(母體儲存) | l1_gate_runtime / L1 | 資料儲存層 |
| MRL-PC-0020 | L1 入口原則(寫規則一次) | l1_gate_runtime / L1 | 生成層、系統運行層、資料儲存層 |
| MRL-PC-0021 | L∞ 哲學根基 · 生命之樹/莫比斯環 | blueprint_v1.0 / L∞ | 粒子本質層 |
| MRL-PC-0022 | L0 種子層 · Seed→Persona 結構 | blueprint_v1.0 / L0 | 生成層 |
| MRL-PC-0023 | L1 粒子核心層 · FlowAgent 模組宇宙 | blueprint_v1.0 / L1 | 系統運行層 |
| MRL-PC-0024 | L2 模組依賴層 · FlowAgent 架構連線圖 v2k7 | blueprint_v1.0 / L2 | 生成層、系統運行層 |
| MRL-PC-0025 | L7 3D 粒子層 · 一顆粒子還原一個地球儀 | blueprint_v1.0 / L7 | 生成層、系統運行層 |
| MRL-PC-0026 | 分域與分割 M = R ⊎ A | formal_core / META | 粒子本質層 |
| MRL-PC-0027 | route ρ / lift λ 與提升崩塌 Ĥ | formal_core / META | 粒子本質層、系統運行層 |
| MRL-PC-0028 | 🔄 的條件(強/弱)與不可能性 | formal_core / META | 粒子本質層、系統運行層 |
| MRL-PC-0029 | 單拍閉環 Φ | formal_core / META | 粒子本質層、系統運行層 |
| MRL-PC-0030 | 外部系統僅為態射 Their := H ∈ End(A);堆疊不刪除 | formal_core / META | 粒子本質層、系統運行層 |
| MRL-PC-0031 | 載體綁定實例 U/G/V 與稽核 | formal_core / META | 系統運行層、資料儲存層 |

## Root Owner 待裁定

- RD-001：是否核准四軸分類與 scheme+layer+node 複合鍵，保留所有原 layer_scheme？ 狀態：UNRESOLVED。
- RD-002：essence_index_v2 layer_map.L3 Seed 與 blueprint_v1.0 L0 Seed→Persona 是否僅 related_generation_role，或有可核准的等價契約？需明定狀態、輸入/輸出、逆映射與版本條件。 狀態：UNRESOLVED。
- RD-003：系統卡為 Notion unverified 彙整頁且 [1–20] 未展開來源，是否核准其拓樸成為獨立正式 scheme？ 狀態：UNRESOLVED。
- RD-004：是否核准 MemoryQuickMount、ParticleMeta、母體目錄與 system-card L2 間的職責關係？此關係不等於共同層號或已實作整合。 狀態：UNRESOLVED。
- RD-005：藍圖每操作可逆與 formal_core 僅 R 可逆、A 可不可逆，是否以正式核心條件限制跨層可逆宣告？保留兩份原文，裁定適用域。 狀態：UNRESOLVED。
- RD-006：Notion 控制平面/定義來源與 Root repo main canonical 成果的職責可並列；如發生實質定義分歧，依何份具名決策回填？ 狀態：UNRESOLVED。

## 來源、版本與證據界線

本質索引為 2.0 / created 2026-01-06；藍圖 v1.0 / 2026-02-10；L1 萃取來自1.3.0並保留1.1.0/1.2.0/1.2.2存在記錄；formal_core 原 DOCX 日期仍待找回。Notion 原生版本未提供，保存 page_last_edited_at 與捕獲正文 SHA-256，不能把最後編輯時間當作建立或裁定時間。

JSON 的 sources 逐檔保留 Git blob SHA、UTF-8 bytes SHA-256、大小與固定 commit URL。particle_inventory 的 provenance.source_id 保留原始檔或原始成員檔雜湊，與新算出的萃取檔雜湊不同，不互相取代。Notion capture_sha256 只涵蓋 fetch 回傳 <content> 內文，非原始匯出檔雜湊；evidence_excerpts 是節選，雜湊涵蓋完整捕獲正文，不是節選本身。

- [Notion 世界模型現行總覽](https://app.notion.com/p/3ede7f4e6c558064a840e3a531cb2aef)：verified，控制平面與唯一導航；不因此替下游所有內容背書。
- [Notion 世界模型既有提案](https://app.notion.com/p/3ebe7f4e6c5581f29119d730e3b46dd6)：此次增量提案承接位置。
- [MRL World System Card](https://app.notion.com/p/3ffe7f4e6c558032b526c6320365b492)：unverified 彙整來源；[1–20] 尚無展開書目；只據頁面文字做候選拓樸，不稱其為全部原始工程證據。
- [原始主鏈文件](../docs/MRLiou_Particle_World_Canonical_Chain_v1.0.md)：三態循環、平台載體與來源身份。
- [原法典](../registry/MRL_PARTICLE_CODEX.json)、[本提案JSON](../registry/proposals/MRL_UNR001_CROSS_LAYER_MAPPING_20261022_R01.json)。

Notion 的控制平面/定義來源與 Root repo main 的已核准 canonical 成果是不同職責。保留兩處權威敘述；真正定義分歧仍回到 Mr.liou 具名裁定，不由平台自行決定。

## 驗證與接受條件

執行 python3 tests/test_mrl_codex.py、python3 tests/test_mrl_pipeline.py、python3 tests/test_MRL_UNR001_mapping.py、python3 tools/MRL_validate_UNR001_mapping.py。新檢核重用既有 validate_codex 與 regenerate，另逐欄核對 genesis.sources（現行 converge.run 只比粒子，不能以其單獨通過取代來源核對）。

測試與來源一致性通過只表示提案可審查；Root Owner 核准前不關閉 UNR-001，不改31顆粒子，不呼叫 converge --write，不宣告節奏語料或DL580驗收完成。

原 DOCX 與L1 ZIP未取得，只核對既有登錄與萃取；不聲稱重新雜湊那些原始封裝。具體檢核結果與逐檔大小/雜湊見 docs/evidence/MRL_UNR001_VALIDATION_20261022_R01.json。
