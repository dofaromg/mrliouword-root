# 根源倉庫（Root Repository）

本倉庫為系統的**根源層**：存放核心定義文件，作為所有衍生工作的唯一依據（single source of truth）。

## 核心文件

| 文件 | 內容 |
|------|------|
| [主權聲明](docs/SOVEREIGNTY.md) | 主權歸屬、根源地位、協作邊界與變更原則 |
| [系統定位](docs/SYSTEM_POSITIONING.md) | 層級結構（根源層／工作層／衍生層）與資訊流向 |
| [命名規則](docs/NAMING.md) | 檔案、分支、提交訊息、衍生倉庫與版本的命名規範 |

## 內容

- `Input_structure_for_QC_calculations.ipynb` — 量子化學計算的輸入結構筆記本（RDKit + PySCF）
- `examples/` — 範例筆記本

## 協作方式

依[命名規則](docs/NAMING.md)建立分支，透過 Pull Request 提案，經擁有者核准後合入 `main`。詳見[主權聲明](docs/SOVEREIGNTY.md)之協作邊界。
