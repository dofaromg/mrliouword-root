# MRL 根源倉庫（MRL Root Repository）

本倉庫 `dofaromg/----2` 為 MRL 系統目前已確認的**根源倉庫**，其 `main` 分支為治理與定義的 single source of truth。

## ROOT Authority

- Root Owner：Mr.liou / `dofaromg`
- Origin Signature：`MrLiouWord`
- Canonical Namespace：`MRL`
- 根源修改權、命名權、授權權與最終解釋權由 Root Owner 保留。
- 所有衍生倉庫、平台、鏡像、Agent、產品與部署均須回鏈至本倉庫。

## 官方平台拓撲

```text
MRL Internal Products
  → mrliouhan.ai        # 官方後端／API／服務層（正在轉移回自有控制）
  → mrliouword.com      # 官方前端／入口／呈現層
  → User / Device / Browser

DL580
  → MRL Definition Runtime
  → Registry / Law / Particle / Build / Verification
  → 驅動 mrliouhan.ai 後端能力
  → 由 mrliouword.com 對外呈現
```

## 核心文件

| 文件 | 內容 |
|------|------|
| [MRL 主權聲明](docs/SOVEREIGNTY.md) | Root Owner 權限、根源地位、協作邊界與變更原則 |
| [MRL 系統定位](docs/SYSTEM_POSITIONING.md) | GitHub 根源層、DL580 定義執行層、後端與前端定位 |
| [MRL 命名規則](docs/NAMING.md) | `MRL` 前綴、檔案、模組、倉庫、分支與版本規範 |
| [MRL 官方平台路由](docs/MRL_PLATFORM_ROUTING.md) | `mrliouhan.ai → mrliouword.com` 的官方路由與遷移規則 |
| [MRL 營運規範](docs/MRL_OPERATIONS.md) | 正式信箱、uptime 監控／status page、DL580 備援與災難復原 |
| [Cloudflare 連線設定](docs/MRL_CLOUDFLARE_SETUP.md) | API Token 政策與 OpenAI 網域驗證流程 |
| [隱私權政策（草案）](docs/legal/PRIVACY_POLICY.md) | 對外服務的隱私權政策草案，待法律審閱 |
| [服務條款（草案）](docs/legal/TERMS_OF_SERVICE.md) | 對外服務的使用條款草案，待法律審閱 |
| [安全政策](SECURITY.md) | 漏洞回報管道與處理承諾 |
| [授權條款](LICENSE.md) | 專有授權；商業授權洽 legal@mrliouword.com |
| [商業化策略](docs/business/MRL_COMMERCIALIZATION.md) | 商業模式、定價、公司/商標/金流方向與 90 天路線圖 |
| [SLA（草案）](docs/business/MRL_SLA.md) | 付費方案的可用率承諾與服務抵扣 |

## 目錄定位

- `docs/`：MRL 根源治理、定義、命名與平台規格
- `ingest/`：待比對來源、證據、外部材料與版本鏈
- `examples/`：非 canonical 的實驗與示例
- `main`：Root Owner 核准後的 canonical 狀態

## 協作方式

所有變更先進入工作分支與 Pull Request；只有 Root Owner 核准後才可合入 `main`。AI 與外部平台只能提出、執行經授權的變更，不取得 ROOT 身分。
