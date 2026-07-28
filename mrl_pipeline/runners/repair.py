# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""repair runner — 管線失敗時的預設重導向目標。

【文件支持】pipeline_sync_localfs.json：
    policy.on_fail=redirect, default_redirect_runner=repair。

【工程推論】修復行為（非破壞性）：
    1. 重新建立一份乾淨快照，重建可信基準；
    2. 記錄觸發修復的失敗節點與原因（incident）；
    3. 寫出 repair_report.json。
    不刪除來源檔案、不覆寫使用者資料，只重建管線自身的基準與報告。
"""

from __future__ import annotations

from typing import Dict, Optional

from ..context import Context
from ..fsutil import utc_now, write_json
from ..stages import stage_clean_snapshot


def run(context: Context, failed_node: Optional[str] = None,
        reason: Optional[str] = None) -> Dict:
    # 重建乾淨基準快照。
    snap = stage_clean_snapshot.snapshot_create(context)

    report = {
        "runner": "repair",
        "created_at": utc_now(),
        "trigger": {"failed_node": failed_node, "reason": reason},
        "actions": ["rebuilt_clean_snapshot"],
        "snapshot": snap.get("snapshot"),
        "ok": True,
    }
    out_path = context.out_dir("reports", "repair_report.json")
    write_json(out_path, report)

    context.artifacts["repair_report"] = out_path
    context.record("repair", failed_node=failed_node, reason=reason)
    return {"ok": True, "report": out_path}
