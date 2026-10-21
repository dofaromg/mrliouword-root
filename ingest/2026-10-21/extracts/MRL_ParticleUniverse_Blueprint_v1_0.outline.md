# MR.LIOU 粒子宇宙 · 私人伺服器網站架構藍圖 v1.0 — 去識別大綱（2026-10-21 入庫）

- 原檔:`particle-universe-blueprint*.docx`(17 MB,含大量影像);`dcterms:created/modified = 2026-02-10T02:00Z`;sha256 見 `../MANIFEST.json`。
- **原檔不入公開庫**:內含系統誕生紀念之精確地理座標與街道、個人 3D 掃描帳號等個人資訊。本頁僅保留結構與定義性內容。
- 署名:MR.liou (dofaromg);`origin_signature: MrLiouWord`;版本 v1.0「從 0 展開」;原則「怎麼過去就怎麼回來 — 莫比斯環:改變位置,不改變本質」。

## 分層目錄(本文件自有分層;與本質索引 layer_map **不同**,未調和 → UNRESOLVED)

| 層 | 名稱 | 性質 |
|---|---|---|
| L∞ | 哲學根基層 — 生命之樹 / 莫比斯環 | **本體** |
| L0 | 種子層 — Seed → Persona 結構 | **本體** |
| L1 | 粒子核心層 — FlowAgent 模組宇宙 | **本體** |
| L2 | 模組依賴層 — FlowAgent 架構連線圖 v2k7 | **本體** |
| L3 | 服務架構層 — 微服務 / API 閘道 | 載體(通用架構) |
| L4 | 雲端整合層 — GCP / AWS / Cloudflare | 載體(外部平台,`MRL_EXT_` 範疇) |
| L5 | 網路拓撲層 — Overlay / P2P / 衛星通信 | 載體(外部參照:netbird、conceptdraw、NTT、mdpi) |
| L6 | 地理映射層 — Google Earth 多尺度視角 | 載體(外部;含個人座標,已去識別) |
| L7 | 3D 粒子層 — 地球儀模型 / 3D 掃描 / AR | **本體**(具象化原則)+ 外部工具 |
| 附錄 | A 硬體資源清單 / B 部署路線圖 / C iOS 四維模組空間 | 營運資訊 |

## 本體定義(已轉為法典粒子,見 `MRL_Blueprint.definitions.json`)

- **L∞**:正反面同一面;每操作有逆操作(δP₀);運行態/回溯態 = 莫比斯環兩視角。
- **L0**:Seed → CorePersona → {LogicPersona, LanguagePersona, PersonaCloner} → 子人格 → PersonaGate → SubPersona{JumpPoint, FieldMap};「一顆粒子可以還原一個人格,甚至一個地球儀」。
- **L1**:核心 EchoPersona / Memory.RecallCore / Observer.AllKernel;外圍 LanguageCondenser / Persona.FuturePredictor / MotherShell.CoreObserver。
- **L2 v2k7**:FlowShell 管理層、核心運行層(FlowOS/FlowSeed/FlowBridge/FlowAgent/FlowInit/FlowMeta)、人格場映射層、信號/媒體索引層(FluinPulse/UniversalSignalMediaIndex/SignalNode)、Fluin 語言層(Fluin → ParticleLanguage → Translator → Overlay)。
- **L7**:一顆粒子還原一個地球儀;多格式匯出(DXF/FBX/DAE/STL/USDZ)。

## 營運資訊摘要(非本體,供狀態核對)

- 硬體:DL580 G9(96 核/3 TB RAM/6×V100/6 TB SAS)、Mac mini M4 Pro、Ryzen 桌機;合計 116 核、3 TB+、200 GB+ VRAM、7 TB+。
- 部署路線圖 Phase 1–5:Ubuntu/Docker → Gitea/PostgreSQL/MinIO/Wiki/Redis → Nginx + 入口網站 → CUDA/vLLM/Ollama → 10G/WireGuard/Cloudflare Tunnel/監控。**實施狀態未在本庫驗證(待找回)**。
- 文件自述「131+ Workers」;本 session 以 Cloudflare 連接器列得 182 個 workers(2026-08-28 帳號 `0b36a4…`)。
