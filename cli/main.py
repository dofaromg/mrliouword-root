# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""cli/main.py — MRL 管線命令列入口。

【文件支持】pipeline_sync_localfs.json 節點 bridge_localfs：
    cmd = "python cli/main.py --data-root data bridge_localfs --root ."

全域參數：
    --data-root  管線資料輸出根目錄（預設 data）

子指令：
    bridge_localfs --root <path>   橋接本地檔案系統（延伸對接）
    snapshot                       建立乾淨基準快照
    audit                          稽核一致性
    rebuild                        重建索引
    repair                         執行修復
    run --graph <path>             依 JSON 圖執行整條管線
"""

from __future__ import annotations

import argparse
import json
import os
import sys

# 允許以 `python cli/main.py` 從 repo 根目錄直接執行時找到 pipeline_vnext。
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pipeline_vnext.bridge import bridge_localfs  # noqa: E402
from pipeline_vnext.context import Context  # noqa: E402
from pipeline_vnext.graph import run_graph  # noqa: E402
from pipeline_vnext.runners import get_runner  # noqa: E402
from pipeline_vnext.stages import stage_clean_snapshot  # noqa: E402


def _emit(result: object) -> None:
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="cli/main.py", description="MRL pipeline CLI")
    parser.add_argument("--data-root", default="data", help="管線資料輸出根目錄")
    sub = parser.add_subparsers(dest="command", required=True)

    p_bridge = sub.add_parser("bridge_localfs", help="橋接本地檔案系統")
    p_bridge.add_argument("--root", default=".", help="要橋接的本地根目錄")

    sub.add_parser("snapshot", help="建立乾淨基準快照")

    for name in ("audit", "rebuild", "repair"):
        p = sub.add_parser(name, help=f"執行 {name} runner")
        p.add_argument("--root", default=".", help="目標本地根目錄")

    p_run = sub.add_parser("run", help="依 JSON 圖執行整條管線")
    p_run.add_argument("--graph", required=True, help="pipeline 圖 JSON 路徑")
    p_run.add_argument("--root", default=".", help="目標本地根目錄")

    return parser


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    ctx = Context(data_root=args.data_root, root=getattr(args, "root", "."))

    if args.command == "bridge_localfs":
        result = bridge_localfs(ctx)
    elif args.command == "snapshot":
        result = stage_clean_snapshot.snapshot_create(ctx)
    elif args.command in ("audit", "rebuild", "repair"):
        result = get_runner(args.command)(ctx)
    elif args.command == "run":
        result = run_graph(args.graph, ctx)
    else:  # argparse required=True 已擋，保底
        _emit({"ok": False, "error": f"unknown command {args.command!r}"})
        return 2

    _emit(result)
    return 0 if result.get("ok", False) else 1


if __name__ == "__main__":
    raise SystemExit(main())
