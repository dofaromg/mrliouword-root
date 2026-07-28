# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""mrl_pipeline — MRL 本地檔案同步管線的可執行實作。

本套件的模組名稱、動作名稱與 runner 名稱皆對齊
`ingest/2026-07-25/pipeline/pipeline_sync_localfs.json` 所宣告的介面，
不新增或重命名任何既有定義（依 MRL 工程規範 v1.0 第 6、8 條）。

節點對應：
- python_stage `snapshot_create` → mrl_pipeline.stages.stage_clean_snapshot
- cmd `bridge_localfs`           → cli/main.py 的 bridge_localfs 指令
- runner `audit` / `rebuild` / `repair` → mrl_pipeline.runners
"""

__version__ = "1.0.0"
