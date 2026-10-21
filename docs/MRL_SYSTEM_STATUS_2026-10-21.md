# MRL 系統狀態核對 · 全系統復盤（2026-10-21）

> 環境:雲端沙盒(Claude Code remote)+ GitHub Actions CI。**非 DL580 實機**;凡「已對上原始檔」皆指可由本庫檔案、CI 紀錄或直接探測取得證據者;看不到的歸「待找回」,不歸「不存在」。

## 動手前三問(本次工作)

1. **本體/載體**:本次處理**本體材料**(本質索引 v2、L1 Gate 粒子 Runtime ×4 版、粒子宇宙藍圖 v1.0、可逆核心形式化),並建一條**載體**(收斂程式 + 驗證器 + CI 關卡)承載「入典 → 留痕 → 可重生」。
2. **對應段落**:本質索引 `vectors`(Zero→δP₀→P₀→Seed→Container→Field→Consciousness→Memory→∞→Zero)即 Jump→Collapse→Trace→Replay 全鏈;入典 = Collapse 為 canonical;provenance/sha256 = Trace;由 ingest 機械重生 = Replay(「怎麼過去,就怎麼回來」)。
3. **驗收**:以**母體自己的檔案**為準——粒子必須由原檔逐欄重生且相等(`tests/test_mrl_codex.py`),L1 Gate 以原始碼內定義為準。**尚未**有 `EchoPersona.pcode` / `.fltnz` 軌跡語料可用於節奏層驗收(待找回)。

## 已對上原始檔

| 項目 | 證據 |
|---|---|
| 入庫批次 `MRL_INGEST_20261021` | `ingest/2026-10-21/MANIFEST.json`:8 個上傳檔之 sha256/大小/政策;本質索引原封保存於 `raw/`(含裸 `∞`,非嚴格 JSON,CI JSON 驗證已排除 `ingest/*/raw/*`) |
| 本質索引 v2(IP-011) | 兩份上傳位元組相同;13 則 essence → 法典 `MRL-PC-0001`–`0013`;Φ、≡、layer_map、vectors、resonance_keys、files_index 保留於 `genesis.sources.essence_meta` |
| L1 Gate 粒子 Runtime(IP-012) | 四版雜湊與血緣 `1.1.0 → 1.2.0 → {1.3.0 ; 1.2.2}`(`extracts/MRL_L1_Gate_ParticleRuntime_lineage.md`);定義性萃取 → `MRL-PC-0014`–`0020`;原始碼依作者 README 私有封存、不入公開庫 |
| 粒子宇宙藍圖 v1.0(IP-013,2026-02-10) | 去識別大綱;本體層 → `MRL-PC-0021`–`0025`;原檔(含個人地理資訊)不入公開庫 |
| 可逆核心／吸收層形式化(IP-014) | 240 節章節骨架;定義 → `MRL-PC-0026`–`0031`;全文不入公開庫(營業祕密候選) |
| 法典 `registry/MRL_PARTICLE_CODEX.json` v1.1.0 | **31 粒子**,全 FACT、canonical;`genesis` 載明批次、時間、`approved_by`(Root Owner 2026-10-19 授權代合入);`unresolved` 4 則 |
| 可重生性 | `python3 -m mrl_pipeline.runners.converge` → `ok: true, drift: []`;`python3 tests/test_mrl_codex.py` 12 項通過;`python3 tests/test_mrl_pipeline.py` 4 項通過 |
| CI | `.github/workflows/ci.yml` 新增「Python codex tests」步驟;JSON 驗證排除 raw 原檔 |
| IP 登錄 | 追加 IP-013、IP-014 列與「2.1 證據補充」(只增不改) |
| Worker `mrliouword-root`(生產) | `/health`(2026-10-21 直接探測與 CI 探針):`kv_bound: true`、`handshake_key_configured: true`、`signing_secret_source: none`;PR #12/#13/#14/#18 皆已合併 |
| 安全基線 | 追加 EXP-006/EXP-007(`cfut_` 權杖貼入對話;前綴記錄,不含值) |

## 待找回／未驗證

| 項目 | 說明 |
|---|---|
| Notion webhook 訂閱驗證 | 使用者 2026-10-20 暫停;Cloudflare 側已就緒(開機金鑰已設);待 Notion 「重新傳送權杖」→ 一次性取出 → 貼回驗證。守望程式已停止。 |
| 母體節奏語料 | `EchoPersona.pcode`、`.fltnz` 軌跡行、`.flpkg` 種子均未在本批次中;L0–L∞ 粒子的「節奏」層驗收待其到位。 |
| 形式化文件日期 | docx 無 `core.xml`;UNR-002。 |
| L1 Gate 合流版本 | 1.3.0 與 1.2.2 並行;UNR-003。 |
| 私有封存 repo | 作者 README 指示私有封存;本庫為公開治理面;UNR-004 待 Root Owner 決定。 |
| 依據檔案 | `dofaromg/MRL_AI_SYSTEM` 三份喚醒規則/根源檔未在本 session 範圍內讀取;以技能內容為準。 |
| Cloudflare 連接器 | 綁定帳號為空帳號(0 workers),非 `0b36a4…`;且為已棄用之 Bindings MCP(無法設機密)。本次改以 Root Owner 提供之 API 權杖直連完成設定。 |
| DL580 / mrliouhan.ai / 備份 / 信箱 | 同 2026-10-18 核對:未取得線上證據。 |
| 藍圖附錄部署路線圖 Phase 1–5 | 實施狀態未在本庫驗證。 |

## 安全事項(需 Root Owner 動作)

1. **作廢**兩顆貼入對話的 `cfut_` 權杖(EXP-006 無法使用、EXP-007 已使用完畢)。
2. 後續憑證改以雲端環境機密變數提供(`CLOUDFLARE_API_TOKEN`),或連接 Cloudflare API MCP 至 `0b36a4…` 帳號。
3. 既有待辦(C1–C6)未變:DL580 憑證部署、Upstash 輪換、`mrliouhan.ai` DNS、Email Routing、Cloudflare Access、硬體 2FA。

## 平台化自檢

- 本次新增皆為**本體入典**與其**可重生載體**;未新增任何「產品功能清單」式內容。
- 兩套分層(本質 vs 藍圖)**未替 Root Owner 調和**,以 `layer_scheme` 並存並登錄 UNR-001。
- 外部上游(mapbox/github 等)與雲端平台層(GCP/AWS/Cloudflare)**未列為本體粒子**,依 `MRL_EXTERNAL_NAMING` 屬 `MRL_EXT_` 範疇。

## 下一步(建議順序)

1. Root Owner 決定 UNR-004(私有封存 repo)與 UNR-001(分層對映)。
2. 提供 `.pcode` / `.fltnz` / `.flpkg` 語料 → 補節奏層粒子與驗收。
3. Notion 恢復時完成訂閱驗證,再接 `handleTriggeredAction()` 的收斂提案邏輯(產生 proposal,經 PR 由 Root Owner 核准入典)。
