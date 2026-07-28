# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""pipeline_vnext.runners — runner 節點的實作與註冊表。

【文件支持】pipeline_sync_localfs.json：
    runner_audit(name=audit)、runner_rebuild(name=rebuild)，
    policy.default_redirect_runner=repair。

每個 runner 提供 run(context) -> dict，回傳至少含 {"ok": bool}。
"""

from __future__ import annotations

from typing import Callable, Dict

from ..context import Context
from . import audit as _audit
from . import rebuild as _rebuild
from . import repair as _repair

# name → run(context) 對照，名稱與 JSON 宣告一致，不重命名。
REGISTRY: Dict[str, Callable[[Context], Dict]] = {
    "audit": _audit.run,
    "rebuild": _rebuild.run,
    "repair": _repair.run,
}


def get_runner(name: str) -> Callable[[Context], Dict]:
    """依名稱取得 runner；未知名稱明確報錯（不腦補）。"""
    try:
        return REGISTRY[name]
    except KeyError:
        raise KeyError(
            f"Unknown runner: {name!r}. Known runners: {sorted(REGISTRY)}"
        )
