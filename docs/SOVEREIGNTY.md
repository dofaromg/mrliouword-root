# MRL 主權聲明（MRL Sovereignty Statement）

> 本文件說明 MRL 根源倉庫、平台、Runtime、資料與衍生產品的主權歸屬及使用邊界。

## 1. Root Owner

- Root Owner：Mr.liou / GitHub `dofaromg`
- Root Repository：`dofaromg/mrliouword-root`
- Origin Signature：`MrLiouWord`
- Canonical Namespace：`MRL`

Root Owner 保留以下權利：

- 定義權
- 新增與修改權
- 命名與更名權
- 授權與撤回授權權
- 合併與拒絕合併權
- 平台路由與部署決定權
- 最終解釋權

## 2. 根源地位

- 本倉庫 `main` 分支為目前確認的 MRL single source of truth。
- 所有衍生倉庫、分支、鏡像、平台、Agent、產品與部署都必須回鏈至本倉庫。
- 發生衝突時，以 Root Owner 核准並合入 `main` 的 canonical 狀態為準。
- GitHub 帳號、第三方雲端、AI 工具與部署平台均不因託管或執行而取得 ROOT 身分。

## 3. 官方平台主權邊界

- `mrliouword.com`：MRL 官方前端、產品入口與呈現層。
- `mrliouhan.ai`：MRL 官方後端、API、服務與資料交換層。
- DL580：MRL Definition Runtime Host，負責定義、LAW、Registry、Builder、驗證與本地運行。
- 外部平台只能作為 source、adapter、mirror、migration origin 或 temporary runtime。

## 4. 協作邊界

| 角色 | 權限 | 說明 |
|---|---|---|
| Root Owner | 完整主權 | 定義、修改、命名、授權、部署、合併與最終裁定 |
| 協作者 | 提案權 | 經分支與 Pull Request 提案 |
| AI 工具 | 受授權執行權 | 可依明確指令新增、修改與整理，但不能自行取得 ROOT 或合併主權 |
| 外部平台 | 執行／託管權 | 不取得 canonical identity、命名權或根源地位 |

## 5. 變更與存證原則

1. 核心規格變更必須保留 Git 歷史。
2. 不以刪除掩蓋衝突；以新增映射、遷移紀錄與修訂處理。
3. 更名必須保存 `previous_name`、`canonical_name`、來源 commit 與 migration status。
4. 外部來源必須隔離於 evidence、external、adapter 或 provenance 區域。
5. 只有 Root Owner 核准後，變更才可進入 `main`。

## 6. 相關文件

- [系統定位](SYSTEM_POSITIONING.md)
- [命名規則](NAMING.md)
- [官方平台路由](MRL_PLATFORM_ROUTING.md)
