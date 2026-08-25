# MRL 外部材料命名規則（External Material Naming）v1.0

> 本文件落實 Root Owner 指令：**所有外部材料來源，一律轉為 MRL 品牌相關名稱替代。**
> 本規則是 [MRL 命名規則](NAMING.md) 的延伸，兩者衝突時以本文件為準。

## 1. 核心規則

1. 任何外部來源材料（程式碼、文件、筆記本、封包、範例）進入 MRL 體系時，
   **必須取得 MRL 品牌別名（canonical alias）**，此後倉庫內一律以別名稱呼。
2. 外部原始名稱作為 repository-facing 識別名**只允許**出現在兩個地方；
   **法律要求保留的 `LICENSE`、`NOTICE`、版權與署名文字（其中可能含原專案／作者名）不受此限制,不得移除或改寫**：
   - `registry/MRL_EXTERNAL_NAME_MAP.json` 的 `previous_name` / `origin` 欄位
   - ingest 批次的歷史證據記錄（不回溯改寫）
3. 改名必須**先登錄映射、再實際遷移**——沒有映射記錄的改名視為來源斷裂，禁止。

## 2. 別名格式

```text
MRL_EXT_<領域>_<主題>_v<N>[.副檔名]
```

| 欄位 | 說明 | 範例 |
|------|------|------|
| `MRL_EXT_` | 固定前綴，標示「MRL 品牌名、外部來源」 | — |
| `<領域>` | PascalCase 領域代號 | `Vision`、`QC`、`Tooling`、`Legal` |
| `<主題>` | PascalCase 主題 | `Spatial3D`、`InputStructure` |
| `v<N>` | 進入 MRL 體系後的版本 | `v1` |

範例：`MRL_EXT_Vision_Spatial3D_v1.ipynb`

衍生服務／模組若源自外部專案，用 runtime 形式：`mrl-ext-<kebab-主題>`。

## 3. 映射 Registry

唯一權威映射表：[`registry/MRL_EXTERNAL_NAME_MAP.json`](../registry/MRL_EXTERNAL_NAME_MAP.json)。
每筆必填欄位：

```json
{
  "canonical_name": "MRL_EXT_<...>",
  "previous_name": "<原始檔名或專案名>",
  "origin": { "provider": "", "url": "", "license": "" },
  "sha256": "<進入時的內容雜湊，如有>",
  "ingest_batch": "<批次 ID，如 MRL_INGEST_20260725>",
  "migration_status": "mapped | migrated | retired"
}
```

- `mapped`：已登錄別名，實體檔案尚未改名。
- `migrated`：實體檔案已改用 MRL 別名。
- `retired`：材料已移出體系，映射保留作歷史。

## 4. 權利邊界（重要）

MRL 品牌別名是**內部 canonical 代號，不改變外部著作的權利歸屬**：

- 外部材料的原始授權條款與署名義務**繼續有效**；改名不得移除材料內含的
  版權聲明與授權文字。
- 本倉庫 `LICENSE.md` 的專有授權**不及於**外部來源材料；
  其授權以 `MRL_EXTERNAL_NAME_MAP.json` 的 `origin.license` 為準。
- 商業產品若內含外部材料，出貨前依其授權完成義務（署名、附授權文、或替換自製）。

## 5. 流程

```text
外部材料 → ingest/<日期>/（原名保存，登錄 sha256）
        → 取 MRL_EXT_ 別名，寫入 MRL_EXTERNAL_NAME_MAP.json（mapped）
        → git mv 實際改名（migrated）
        → 倉庫內文件、程式一律引用 MRL 別名
```

## 6. 既有材料的處置

首批映射已登錄於 registry（見映射表 v1）：兩個外部筆記本已實體改名，
`ingest/2026-07-25` 的四個 external-source 封包保持歷史原名（證據記錄不回溯改寫），
狀態為 `mapped`，待其內容實際解壓使用時再以別名遷移。
