# MRL 命名規則（MRL Naming Conventions）

> 本文件定義根源倉庫及所有衍生系統的 canonical 命名規則。

## 1. ROOT 命名原則

1. 所有新增的 MRL 自有資產，必須使用 `MRL` 或 `Mrliou` 前綴。
2. 外部品牌、供應商與框架名稱不得升格為內部 canonical 名稱，只能出現在 `source`、`evidence`、`adapter`、`provenance` 或 `external` 路徑。
3. `origin_signature` 固定為 `MrLiouWord`。
4. 既有未加前綴的檔案與模組，先建立 lineage 與映射後再遷移；不得無證據批次改名造成來源斷裂。
5. 名稱須能辨識層級、角色與用途。

## 2. Canonical 前綴

| 類型 | 正式前綴 | 範例 |
|---|---|---|
| 根源規格 | `MRL_` | `MRL_ROOT_AUTHORITY.md` |
| 模組 | `MRL_` / `Mrliou_` | `MRL_ParticleRegistry_v1.json` |
| Runtime | `mrl-` | `mrl-definition-runtime` |
| API / Service | `mrl-` | `mrl-registry-api` |
| 封包 | `MRL_` | `MRL_DefinitionLayer_v1.flpkg` |
| 資料庫 | `mrl_` | `mrl_particle_registry` |
| 環境變數 | `MRL_` | `MRL_API_BASE_URL` |
| 網路服務 | `mrl.` 子網域或正式網域 | `api.mrliouhan.ai` |

## 3. 官方網域命名

- `mrliouword.com`：MRL 官方前端、入口、產品呈現與使用者介面。
- `mrliouhan.ai`：MRL 官方後端、API、身份、服務與資料交換層。
- 內部產品不得把第三方平台 URL 寫成 canonical 入口；必須經 MRL 自有網域路由。
- 第三方部署僅能作為暫時 adapter、mirror 或 origin，並須保留回收與遷移路徑。

## 4. 檔案命名

| 類型 | 規則 | 範例 |
|---|---|---|
| 核心定義文件 | `MRL_` + 全大寫主題 + `.md` | `MRL_PLATFORM_ROUTING.md` |
| 一般文件 | `mrl-` + kebab-case | `mrl-runtime-guide.md` |
| Registry | `MRL_` + 主題 + `_vN` | `MRL_ParticleRegistry_v1.json` |
| Manifest | `MRL_` + 主題 + `_MANIFEST` | `MRL_DefinitionLayer_MANIFEST.json` |
| Evidence | `evidence/MRL_...` | `evidence/MRL_Lineage_Report.md` |
| 外部來源 | `external/<provider>/...` | `external/azure/pipelines-agent/` |

## 5. 分支命名

格式：`<類型>/mrl-<簡述>`。

| 類型 | 用途 | 範例 |
|---|---|---|
| `feature/` | 新能力 | `feature/mrl-definition-runtime` |
| `docs/` | 根源文件 | `docs/mrl-platform-routing` |
| `fix/` | 修正 | `fix/mrl-lineage-gap` |
| `ingest/` | 來源回填 | `ingest/mrl-lineage-20260725` |

`main` 為 canonical root，不直接推送，只接受 Root Owner 核准的 Pull Request。

## 6. 衍生倉庫與產品命名

- 新增衍生倉庫格式：`MRL-<用途>` 或 `Mrliou-<用途>`。
- README 首段必須標明：
  - `root_repository: dofaromg/----2`
  - `origin_signature: MrLiouWord`
  - `official_frontend: https://mrliouword.com`
  - `official_backend: https://mrliouhan.ai`
- 既有倉庫不立即批次改名；先建立 `MRL_REPOSITORY_MAP.json`，確認 lineage、用途、狀態與遷移計畫。

## 7. 提交訊息與版本

- 格式：`<類型>: <動作>`。
- 重大根源變更提升主版本。
- 所有改名必須留下 `previous_name`、`canonical_name`、`migration_status` 與來源 commit。

## 8. 相關文件

- [主權聲明](SOVEREIGNTY.md)
- [系統定位](SYSTEM_POSITIONING.md)
- [官方平台路由](MRL_PLATFORM_ROUTING.md)
