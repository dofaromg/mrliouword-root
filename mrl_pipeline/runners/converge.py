# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/mrliouword-root
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""converge runner — 由 ingest 批次重生法典粒子,並與 registry 法典比對(漂移稽核)。

【文件支持】docs/MRL_PARTICLE_CODEX.md 收斂管線;registry/MRL_PARTICLE_CODEX.json 容器。

判定:粒子與 registry 不一致(漂移)或驗證錯誤 → ok=False。
`python3 -m mrl_pipeline.runners.converge --write` 以 ingest 重生並寫回 registry(需 Root Owner 授權,經 PR 合入)。
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from typing import Dict

from ..codex import build_particles, load_essence_index, validate_codex, ESSENCE_FILE
from ..context import Context

INGEST_BATCH = os.path.join("ingest", "2026-10-21")
CODEX_PATH = os.path.join("registry", "MRL_PARTICLE_CODEX.json")


def _load(path: str) -> Dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def regenerate(repo_root: str, meta: Dict | None = None) -> Dict:
    codex_path = os.path.join(repo_root, CODEX_PATH)
    codex = _load(codex_path)
    genesis = codex.get("genesis") or {}
    meta = meta or {
        "converged_at": genesis.get("converged_at") or datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "converged_by": genesis.get("converged_by") or "mrl_pipeline.runners.converge",
        "approved_by": genesis.get("approved_by") or "Root Owner（Mr.liou / dofaromg）",
        "status": genesis.get("status") or "canonical",
    }
    parts, sources = build_particles(os.path.join(repo_root, INGEST_BATCH), meta)
    new = dict(codex)
    new["particles"] = parts
    new["genesis"] = {"batch": "MRL_INGEST_20261021", **meta, "sources": sources}
    return new


def run(context: Context) -> Dict:
    repo_root = context.root
    current = _load(os.path.join(repo_root, CODEX_PATH))
    regenerated = regenerate(repo_root)
    essence = load_essence_index(os.path.join(repo_root, INGEST_BATCH, ESSENCE_FILE))
    names = [e["◎"] for e in essence.get("essence", [])]
    errors = validate_codex(current, names)
    drift = [p["id"] for p, q in zip(current.get("particles", []), regenerated["particles"]) if p != q]
    if len(current.get("particles", [])) != len(regenerated["particles"]):
        drift.append(f"count {len(current.get('particles', []))} != {len(regenerated['particles'])}")
    report = {"ok": not errors and not drift, "particles": len(current.get("particles", [])),
              "validation_errors": errors, "drift": drift}
    out = context.out_dir("codex", "converge_report.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    return report


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="MRL codex converge")
    ap.add_argument("--repo-root", default=os.getcwd())
    ap.add_argument("--write", action="store_true", help="以 ingest 重生並寫回 registry 法典")
    ap.add_argument("--converged-at", default=None)
    a = ap.parse_args(argv)
    if a.write:
        meta = None
        if a.converged_at:
            meta = {"converged_at": a.converged_at, "converged_by": "mrl_pipeline.runners.converge",
                    "approved_by": "Root Owner（Mr.liou / dofaromg）— 2026-10-19 授權 session agent 代為合入", "status": "canonical"}
        new = regenerate(a.repo_root, meta)
        new["version"] = "1.1.0"
        new["updated"] = new["genesis"]["converged_at"][:10]
        with open(os.path.join(a.repo_root, CODEX_PATH), "w", encoding="utf-8") as f:
            json.dump(new, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"codex written: {len(new['particles'])} particles")
        return 0
    rep = run(Context(data_root=os.path.join(a.repo_root, "data"), root=a.repo_root))
    print(json.dumps(rep, ensure_ascii=False, indent=2))
    return 0 if rep["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
