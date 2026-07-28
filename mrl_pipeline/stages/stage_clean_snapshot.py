# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""stage_clean_snapshot — 建立乾淨（clean）的資料快照。

【文件支持】pipeline_sync_localfs.json 節點 stage_snapshot：
    kind=python_stage, action=snapshot_create,
    impl=mrl_pipeline.stages.stage_clean_snapshot

【工程推論】「clean snapshot」在此實作為「非破壞性的基準快照」：
    在後續 bridge/audit/rebuild 之前，先記錄 data_root 的當前狀態，
    作為稽核與修復的比對基準。不刪除、不覆寫任何來源檔案。

圖執行器會依 action 名稱（snapshot_create）呼叫本模組；亦提供 run 別名。
"""

from __future__ import annotations

from typing import Dict

from ..context import Context
from ..fsutil import scan_manifest, utc_now, write_json


def snapshot_create(context: Context) -> Dict:
    """對 context.data_root 建立基準快照，寫出 snapshot manifest。

    回傳結果 dict：{ok, snapshot, file_count}。
    data_root 不存在時視為空快照（file_count=0），非失敗。
    """
    manifest = scan_manifest(context.data_root)
    snapshot = {
        "kind": "clean_snapshot",
        "created_at": utc_now(),
        "data_root": context.data_root,
        "file_count": len(manifest),
        "files": manifest,
    }
    out_path = context.out_dir("snapshots", "clean_snapshot.json")
    write_json(out_path, snapshot)

    context.artifacts["snapshot"] = out_path
    context.record("snapshot_create", path=out_path, file_count=len(manifest))
    return {"ok": True, "snapshot": out_path, "file_count": len(manifest)}


# 圖執行器對 python_stage 會優先找與 action 同名的函數；run 為通用別名。
run = snapshot_create
