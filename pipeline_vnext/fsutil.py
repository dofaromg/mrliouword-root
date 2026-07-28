# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""共用檔案系統工具（供 stages / runners / cli 重用，避免重複實作）。

來源：pipeline_sync_localfs.json 的節點需要對 --data-root / --root 做
掃描、雜湊與清單輸出。此模組只提供純工具函數，不含業務決策。
"""

from __future__ import annotations

import hashlib
import json
import os
from datetime import datetime, timezone
from typing import Dict, Iterator, List, Optional


def utc_now() -> str:
    """回傳 UTC ISO8601 時間戳。"""
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: str, chunk_size: int = 65536) -> str:
    """計算單一檔案的 SHA-256。"""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()


def iter_files(root: str, ignore_dirs: Optional[set] = None) -> Iterator[str]:
    """遞迴列出 root 下所有檔案的絕對路徑，略過 .git 等目錄。"""
    ignore = {".git", "__pycache__", ".mypy_cache", ".pytest_cache"}
    if ignore_dirs:
        ignore |= set(ignore_dirs)
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ignore]
        for name in filenames:
            yield os.path.join(dirpath, name)


def scan_manifest(root: str, ignore_dirs: Optional[set] = None) -> List[Dict]:
    """掃描 root 產生檔案清單：相對路徑、大小、mtime、sha256。

    無法讀取的檔案以 error 欄位標記，不中斷掃描（由呼叫端決定是否視為失敗）。
    """
    root = os.path.abspath(root)
    entries: List[Dict] = []
    for abspath in iter_files(root, ignore_dirs):
        rel = os.path.relpath(abspath, root)
        entry: Dict = {"path": rel.replace(os.sep, "/")}
        try:
            st = os.stat(abspath)
            entry["size"] = st.st_size
            entry["mtime"] = st.st_mtime
            entry["sha256"] = sha256_file(abspath)
        except OSError as exc:  # 讀取失敗 → 標記，不腦補內容
            entry["error"] = str(exc)
        entries.append(entry)
    entries.sort(key=lambda e: e["path"])
    return entries


def ensure_dir(path: str) -> str:
    """建立目錄（含父層），回傳該路徑。"""
    os.makedirs(path, exist_ok=True)
    return path


def write_json(path: str, data: object) -> str:
    """以 UTF-8、縮排 2、保留非 ASCII 寫出 JSON，回傳路徑。"""
    ensure_dir(os.path.dirname(os.path.abspath(path)))
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)
    return path


def read_json(path: str) -> object:
    """讀取 JSON 檔。"""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
