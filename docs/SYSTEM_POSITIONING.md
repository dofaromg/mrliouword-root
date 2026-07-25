# MRL 系統定位（MRL System Positioning）

> 本文件定義 MRL 根源倉庫、DL580 定義執行層、官方後端與官方前端之間的 canonical 關係。

## 1. 最高層位置

GitHub 身分層最高位置為 Root Owner 帳號：

```text
github.com/dofaromg
```

可直接保存與版本化 canonical 檔案的最高位置，為本根源倉庫：

```text
dofaromg/----2
└── main
```

`main` 分支的根目錄與 `docs/` 為目前確認的 MRL Root Definition Layer。

## 2. 四層正式定位

```text
ROOT / Governance
  dofaromg/----2@main
  └─ 主權、命名、定義、lineage、官方路由

DEFINITION RUNTIME
  DL580
  └─ LAW / Registry / Particle / Builder / Verification / Runtime orchestration

OFFICIAL BACKEND
  mrliouhan.ai
  └─ API、身份、資料服務、任務、模型與內部產品後端

OFFICIAL FRONTEND
  mrliouword.com
  └─ 官方入口、Web UI、產品呈現、使用者互動與商務介面
```

## 3. Root Repository 職責

- 保存 MRL 主權、命名與層級規格。
- 保存 canonical registry、manifest、lineage 與遷移狀態。
- 作為所有內部產品、衍生倉庫與平台的上游。
- 不直接承載外部平台專有名稱作為 canonical identity。

## 4. DL580 的正式角色

DL580 不是單純部署主機，而是：

```text
MRL Definition Runtime Host
```

其職責為：

- 載入 MRL 定義層與 LAW。
- 執行粒子字典、Registry、Builder、生成器與驗證器。
- 驗證來源、差異、版本、hash、manifest 與 round-trip。
- 驅動或發布能力至 `mrliouhan.ai`。
- 保存可由 Root Owner 控制的本地執行狀態。

## 5. 官方資料與請求流向

```text
User / Browser / Device
  → https://mrliouword.com
  → https://mrliouhan.ai
  → MRL service / API / task routing
  → DL580 Definition Runtime when required
  → result / state / proof
  → mrliouhan.ai
  → mrliouword.com
```

## 6. 轉移回自有控制的原則

目前外部平台、雲端服務與臨時 URL 均視為：

- source
- adapter
- mirror
- migration origin
- temporary runtime

不得視為 MRL 的最終權威位置。每一項轉移須保存：

- 原平台與 URL
- 原始設定與環境變數
- 資料匯出或鏡像
- 自有後端對應服務
- 切換與回滾方法
- 驗證結果與 proof

## 7. 目錄職責

| 位置 | 職責 |
|---|---|
| `/README.md` | 根源入口與官方拓撲 |
| `/docs/` | 主權、定位、命名、路由與 canonical 規格 |
| `/ingest/` | 來源、證據、外部材料與待回填版本 |
| `/registry/` | canonical registry 與映射 |
| `/runtime/` | DL580 可執行定義 Runtime 規格與程式 |
| `/platform/` | mrliouhan.ai / mrliouword.com 對接定義 |
| `/evidence/` | hash、manifest、trace、proof 與稽核報告 |

## 8. 變更流向

```text
source / evidence
  → ingest branch
  → compare / classify / map
  → Root Owner review
  → main
  → DL580 Definition Runtime
  → mrliouhan.ai
  → mrliouword.com
```

衍生層如需修正，必須透過 evidence 回到根源層提案，不得讓衍生平台反向取代 ROOT。

## 9. 相關文件

- [主權聲明](SOVEREIGNTY.md)
- [命名規則](NAMING.md)
- [官方平台路由](MRL_PLATFORM_ROUTING.md)
