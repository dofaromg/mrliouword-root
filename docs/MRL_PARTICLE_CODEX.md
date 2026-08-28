# MRL 粒子法典（MRL Particle Codex）v1.0

> **定位**:Mrliou 工作區**定義層**收斂後的 canonical 成果。
> 定義層(Notion)是「材料/來源」;本法典是「母體收斂後、可辯護、可主張的定義成果」。
> canonical 容器在 [`registry/MRL_PARTICLE_CODEX.json`](../registry/MRL_PARTICLE_CODEX.json)。

- origin_signature：`MrLiouWord`
- Canonical Namespace：`MRL`
- 建立日期：2026-08-28
- 治理：只有 **Root Owner** 核准才可合入(呼應 [主權聲明](SOVEREIGNTY.md))

## 1. 為什麼要有法典

MRL 的定義散在多處:粒子架構(IP-005)、本質索引(IP-011)、方法論(IP-010),
以及 Mrliou 的 Notion 工作區(持續變動的定義層)。**法典把這些收斂成單一 canonical 定義集**,
讓「MRL 到底定義了什麼」有一個可查、可辯護、可主張著作權的正式出處。

## 2. 收斂管線（定義層 → 法典）

```text
Notion 定義層變動 (MRL_EXT_NOTION)
   → mrl-notion-webhook 收到 + 驗簽
   → 正規化 + 依 IP-010 標證據等級 (FACT/CLAIM/INFERENCE/UNRESOLVED)
   → 標記外部來源別名 (MRL_EXT_NOTION) + MRL 資產標記
   → 產生「收斂提案」(PR 對本法典 / 待審佇列)
   → Root Owner 核准 → 合入 particles[]
```

- 進入點:[`workers/notion-webhook/src/index.js`](../workers/notion-webhook/src/index.js) 的 `handleTriggeredAction()`。
- 這條線正好落在 [World Model 收斂閉環](https://app.notion.com/p/3c38eeeec5b581be907ad10f49a51f1a)(World State → Memory → Evidence → … → Backfill)上。

## 3. 治理:自動化只提案,Root Owner 定稿

**關鍵原則:自動化不直接改法典。** webhook 只產生**提案**,最終合入權在 Root Owner。

- 符合「所有變更先進 PR;只有 Root Owner 核准後才可合入 `main`」。
- 外部平台與 AI 只能**提出**經授權的變更,**不取得 ROOT 身分**。
- 這保護了母體:外部定義層的變動,不會未經審查地改寫 canonical 定義。

## 4. 粒子欄位（schema）

每則法典粒子(見 JSON `particle_schema`):

| 欄位 | 說明 |
|------|------|
| `id` | `MRL-PC-####` 遞增編號 |
| `name` / `layer` | 名稱;層級 `L(-1)..L∞`(對應 IP-005) |
| `definition` | canonical 定義文字 |
| `essence_ref` | 對應 IP-011 本質索引的鍵(可選) |
| `source` | `MRL 原生` 或 `MRL_EXT_NOTION:<id>` |
| `evidence_level` | `FACT / CLAIM / INFERENCE / UNRESOLVED`(依 IP-010) |
| `provenance` | 來源 id、收斂時間、收斂者、核准者 |
| `status` | `proposed → approved → canonical → superseded` |
| `supersedes` | 被取代的舊粒子 id |

## 5. 證據紀律（沿用 IP-010）

- 收斂進來的每則定義都要標證據等級;**未證實者不得填 FACT**。
- 「外部平台機制 ≠ MRL 已實作」的映射規則照舊(見 [能力映射總表](protection/MRL_CAPABILITY_MAPPING.md))。
- 方法論本身(IP-010)是 FACT、是案主資產;經它處理的具體主張另依證據分級。

## 6. 保存規則（只增不刪）

- 本法典**只增不刪**;更正以新版本追加,舊粒子標 `superseded` 保留。
- 呼應 IP 登錄簿與計畫第 10 節的保存規則。

## 7. 來源資產（定義層骨架）

| 來源 | 資產 | 角色 |
|------|------|------|
| IP-005 | 粒子架構 L(-1)–L∞ | 法典骨架層定義 |
| IP-011 | PARTICLE_ESSENCE_INDEX v2 | 粒子 `essence_ref` 來源 |
| IP-010 | 證據方法論 | 收斂時的分級與映射紀律 |
| MRL_EXT_NOTION | Mrliou 工作區定義層 | live 來源,經 webhook 收斂 |

## 8. 現況

- 容器與 schema:**就緒**(`particles: []`,尚無收斂粒子)。
- 待 Notion 訂閱接上(`NOTION_WEBHOOK_SECRET`)+ `handleTriggeredAction()` 補上收斂提案邏輯後,
  定義層變動即可開始產生提案,由 Root Owner 核准入典。
