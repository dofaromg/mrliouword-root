# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""graph — 讀取並執行 pipeline JSON（例如 pipeline_sync_localfs.json）。

支援節點種類（對齊 JSON 宣告）：
- python_stage：import `impl` 模組，呼叫與 `action` 同名的函數（否則 run）。
- cmd：以子行程執行 `cmd` 字串。
- runner：依 `name` 從 runners.REGISTRY 取得並執行。

policy：
- on_fail=redirect → 執行 default_redirect_runner（預設 repair），
  記錄 incident 後停止後續節點（重導向即交棒給修復）。
"""

from __future__ import annotations

import importlib
import os
import subprocess
import sys
from typing import Any, Dict, List

from .context import Context
from .fsutil import read_json
from .runners import get_runner


def _run_python_stage(node: Dict, context: Context) -> Dict:
    impl = node["impl"]
    action = node.get("action")
    module = importlib.import_module(impl)
    fn = getattr(module, action, None) if action else None
    if fn is None:
        fn = getattr(module, "run", None)
    if fn is None:
        raise AttributeError(
            f"{impl} 缺少可呼叫入口（action={action!r} 或 run）"
        )
    return fn(context)


def _run_cmd(node: Dict, context: Context, cwd: str) -> Dict:
    cmd = node["cmd"]
    # 以目前 Python 直譯器取代前導 "python"，確保子行程環境一致。
    argv = cmd.split()
    if argv and argv[0] == "python":
        argv[0] = sys.executable
    proc = subprocess.run(
        argv, cwd=cwd, capture_output=True, text=True
    )
    ok = proc.returncode == 0
    return {
        "ok": ok,
        "returncode": proc.returncode,
        "stdout": proc.stdout.strip(),
        "stderr": proc.stderr.strip(),
    }


def _run_runner(node: Dict, context: Context) -> Dict:
    return get_runner(node["name"])(context)


def run_graph(graph_path: str, context: Context) -> Dict:
    """執行整張圖，回傳含每個節點結果與最終狀態的摘要。"""
    graph = read_json(graph_path)
    cwd = os.getcwd()
    policy = graph.get("policy", {})
    nodes: List[Dict] = graph.get("nodes", [])

    results: List[Dict] = []
    final_ok = True

    for node in nodes:
        node_id = node.get("id", node.get("name", "<node>"))
        kind = node.get("kind")
        try:
            if kind == "python_stage":
                res = _run_python_stage(node, context)
            elif kind == "cmd":
                res = _run_cmd(node, context, cwd)
            elif kind == "runner":
                res = _run_runner(node, context)
            else:
                raise ValueError(f"未知節點種類：{kind!r}")
        except Exception as exc:  # noqa: BLE001 - 節點失敗一律進 policy
            res = {"ok": False, "error": f"{type(exc).__name__}: {exc}"}

        res_ok = bool(res.get("ok", False))
        results.append({"node": node_id, "kind": kind, "ok": res_ok, "result": res})

        if not res_ok:
            final_ok = False
            if policy.get("on_fail") == "redirect":
                redirect = policy.get("default_redirect_runner", "repair")
                repair_res = get_runner(redirect)(context) if redirect in _known_runners() else {"ok": False, "error": f"unknown redirect runner {redirect!r}"}
                # 若 repair 支援 incident 參數則帶入。
                results.append({
                    "node": f"redirect:{redirect}",
                    "kind": "runner",
                    "ok": bool(repair_res.get("ok", False)),
                    "result": repair_res,
                    "triggered_by": node_id,
                })
            break  # 重導向即停止後續節點

    summary = {
        "graph_id": graph.get("graph_id"),
        "ok": final_ok,
        "nodes_run": len(results),
        "results": results,
        "artifacts": dict(context.artifacts),
    }
    return summary


def _known_runners():
    from .runners import REGISTRY
    return REGISTRY
