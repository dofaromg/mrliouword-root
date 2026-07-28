# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""執行情境（Context）：在 stage / runner / graph 之間傳遞狀態。

不含業務邏輯，只是一個具型別的載體。
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class Context:
    """管線執行情境。

    data_root: 管線資料輸出根目錄（對應 cli 的 --data-root，預設 data）。
    root:      要橋接／稽核的本地檔案系統根目錄（對應 --root）。
    artifacts: 各階段產出物路徑（key → 檔案路徑）。
    log:       執行事件列表，供稽核與可追溯性使用。
    """

    data_root: str = "data"
    root: str = "."
    artifacts: Dict[str, str] = field(default_factory=dict)
    log: List[Dict[str, Any]] = field(default_factory=list)

    def out_dir(self, *parts: str) -> str:
        """回傳 data_root 下的子路徑（不建立目錄）。"""
        return os.path.join(self.data_root, *parts)

    def record(self, event: str, **fields: Any) -> None:
        """附加一筆可追溯的執行事件。"""
        entry = {"event": event}
        entry.update(fields)
        self.log.append(entry)
