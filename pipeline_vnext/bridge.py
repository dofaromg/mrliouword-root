# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""bridge_localfs — 把本地檔案系統橋接進管線資料區。

【文件支持】pipeline_sync_localfs.json 節點 bridge_localfs：
    cmd = "python cli/main.py --data-root data bridge_localfs --root ."

【工程推論】橋接行為：掃描 --root 產生 localfs 清單，寫入
    <data_root>/bridge/localfs_manifest.json，作為 audit / rebuild 的來源。
    僅讀取來源、只寫入 data_root，不修改被橋接的檔案。
"""

from __future__ import annotations

import os
from typing import Dict

from .context import Context
from .fsutil import scan_manifest, utc_now, write_json


def bridge_localfs(context: Context) -> Dict:
    """掃描 context.root，輸出 localfs 橋接清單。"""
    files = scan_manifest(context.root)
    manifest = {
        "kind": "localfs_bridge",
        "created_at": utc_now(),
        "root": os.path.abspath(context.root),
        "file_count": len(files),
        "files": files,
    }
    out_path = context.out_dir("bridge", "localfs_manifest.json")
    write_json(out_path, manifest)

    context.artifacts["bridge"] = out_path
    context.record("bridge_localfs", path=out_path, file_count=len(files))
    return {"ok": True, "manifest": out_path, "file_count": len(files)}
