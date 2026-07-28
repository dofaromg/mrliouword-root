# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""audit runner — 稽核本地檔案系統與橋接清單／快照的一致性。

【文件支持】pipeline_sync_localfs.json 節點 runner_audit(name=audit)。

【工程推論】稽核行為：
    1. 重新掃描 context.root 的當前狀態；
    2. 與 bridge/localfs_manifest.json 比對，找出 added / removed / modified；
    3. 檢查是否有無法讀取（error）的檔案 —— 此類為完整性錯誤。

判定：僅在偵測到完整性錯誤（無法讀取檔案）時回傳 ok=False，
    觸發管線 policy 的 redirect → repair。純內容差異（正常增改刪）
    只記錄於報告，不視為失敗。
"""

from __future__ import annotations

import os
from typing import Dict, List

from ..context import Context
from ..fsutil import read_json, scan_manifest, utc_now, write_json


def _index_by_path(entries: List[Dict]) -> Dict[str, Dict]:
    return {e["path"]: e for e in entries}


def run(context: Context) -> Dict:
    current = scan_manifest(context.root)
    cur_idx = _index_by_path(current)

    bridge_path = context.out_dir("bridge", "localfs_manifest.json")
    if os.path.exists(bridge_path):
        baseline = read_json(bridge_path).get("files", [])
    else:
        baseline = []
    base_idx = _index_by_path(baseline)

    added = sorted(set(cur_idx) - set(base_idx))
    removed = sorted(set(base_idx) - set(cur_idx))
    modified = sorted(
        p
        for p in set(cur_idx) & set(base_idx)
        if cur_idx[p].get("sha256") != base_idx[p].get("sha256")
    )
    unreadable = sorted(p for p, e in cur_idx.items() if "error" in e)

    ok = len(unreadable) == 0
    report = {
        "runner": "audit",
        "created_at": utc_now(),
        "root": os.path.abspath(context.root),
        "baseline": bridge_path if os.path.exists(bridge_path) else None,
        "ok": ok,
        "summary": {
            "current": len(current),
            "added": len(added),
            "removed": len(removed),
            "modified": len(modified),
            "unreadable": len(unreadable),
        },
        "added": added,
        "removed": removed,
        "modified": modified,
        "unreadable": unreadable,
    }
    out_path = context.out_dir("reports", "audit_report.json")
    write_json(out_path, report)

    context.artifacts["audit_report"] = out_path
    context.record("audit", ok=ok, unreadable=len(unreadable))
    return {"ok": ok, "report": out_path, "unreadable": len(unreadable)}
