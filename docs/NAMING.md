# 命名規則（Naming Conventions）

> 本文件定義本倉庫及其衍生系統中，各類名稱的命名規則。

## 1. 總則

1. 名稱應**見名知義**：看到名稱即可判斷內容與層級。
2. 同一層級內的名稱風格保持一致。
3. 核心文件使用英文大寫檔名（如 `SOVEREIGNTY.md`），一般內容使用小寫。
4. 避免使用空格與特殊符號；以 `-`（連字號）或 `_`（底線）分隔。

## 2. 檔案命名

| 類型 | 規則 | 範例 |
|------|------|------|
| 核心定義文件 | 全大寫 + `.md`，置於 `docs/` | `SOVEREIGNTY.md`、`NAMING.md` |
| 一般文件 | 小寫 kebab-case | `setup-guide.md` |
| 筆記本 | 首字大寫、底線分隔主題 | `Input_structure_for_QC_calculations.ipynb` |
| 範例檔 | 置於 `examples/`，命名同筆記本規則 | `examples/Spatial_understanding_3d.ipynb` |

## 3. 分支命名

格式：`<類型>/<簡述>`，簡述使用小寫 kebab-case。

| 類型 | 用途 | 範例 |
|------|------|------|
| `feature/` | 新增內容或功能 | `feature/add-dft-examples` |
| `docs/` | 文件新增或修訂 | `docs/update-naming-rules` |
| `fix/` | 修正錯誤 | `fix/notebook-import-error` |
| `claude/` | AI 協作工具的工作分支 | `claude/sovereignty-positioning-naming-ynz6e1` |

主分支固定為 `main`，為根源層的最終依據，不直接推送，僅接受 Pull Request 合入。

## 4. 提交訊息（Commit Message）

格式：`<類型>: <簡述>`

| 類型 | 用途 |
|------|------|
| `docs` | 文件變更 |
| `feat` | 新增內容或功能 |
| `fix` | 修正 |
| `chore` | 雜項維護 |

- 簡述以動詞開頭，說明「做了什麼」，中英文皆可。
- 範例：`docs: 新增主權聲明與系統定位文件`

## 5. 衍生倉庫命名

- 衍生倉庫建議格式：`<根源名稱>-<用途>`，例如根源倉庫名為 `core` 時，衍生為 `core-app`、`core-mirror`。
- 衍生倉庫的 README 首段應標明其根源倉庫，並附回鏈。

## 6. 版本標籤（Tag）

- 採語意化版本：`v<主版本>.<次版本>.<修訂>`，例如 `v1.0.0`。
- 核心定義文件的重大修訂應提升主版本號。

## 7. 相關文件

- [主權聲明](SOVEREIGNTY.md)
- [系統定位](SYSTEM_POSITIONING.md)
