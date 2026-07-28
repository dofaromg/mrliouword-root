# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""rebuild runner — 由當前橋接清單重建路徑→雜湊索引。

【文件支持】pipeline_sync_localfs.json 節點 runner_rebuild(name=rebuild)。

【工程推論】重建行為：以 bridge/localfs_manifest.json 為來源（若不存在則
    直接掃描 context.root），產生一份正規化索引 index.json：
    path → {sha256, size}，供下游查詢與去重使用。
    對齊 logic_pipeline.py 中 rebuild_fn 的語意（由壓縮態還原為可用結構），
    但此處針對檔案系統索引，不改動既有 logic_pipeline 模組。
"""

from __future__ import annotations

import os
from typing import Dict, List

from ..context import Context
from ..fsutil import read_json, scan_manifest, utc_now, write_json


def _load_source(context: Context) -> List[Dict]:
    bridge_path = context.out_dir("bridge", "localfs_manifest.json")
    if os.path.exists(bridge_path):
        return read_json(bridge_path).get("files", [])
    return scan_manifest(context.root)


def run(context: Context) -> Dict:
    files = _load_source(context)
    index = {
        e["path"]: {"sha256": e.get("sha256"), "size": e.get("size")}
        for e in files
        if "error" not in e
    }
    result = {
        "runner": "rebuild",
        "created_at": utc_now(),
        "entry_count": len(index),
        "index": index,
    }
    out_path = context.out_dir("index", "index.json")
    write_json(out_path, result)

    context.artifacts["index"] = out_path
    context.record("rebuild", entry_count=len(index))
    return {"ok": True, "index": out_path, "entry_count": len(index)}
