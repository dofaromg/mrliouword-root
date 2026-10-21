# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/mrliouword-root
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
# 依 docs/SOVEREIGNTY.md：本資產所有權歸 MRL 企業；AI 僅受授權執行，無 ROOT／命名主權。
"""codex — MRL 粒子法典的收斂(converge)與驗證(validate)。

原則(docs/MRL_PARTICLE_CODEX.md):
- 法典粒子**只能由 ingest 批次內的原檔/定義性萃取機械重生**(「怎麼過去,就怎麼回來」);
  不得手寫粒子、不得捏造定義。
- 證據紀律(IP-010):FACT 必附 provenance.source_id;狀態只在 proposed/approved/canonical/superseded。
- 只增不刪:supersedes 只能指向既有 id。

來源(固定順序,決定 id 編號):
  1. raw/PARTICLE_ESSENCE_INDEX_v2.json      (IP-011;json-like,含裸 ∞)
  2. extracts/MRL_L1_Gate.definitions.json   (IP-012)
  3. extracts/MRL_Blueprint.definitions.json (IP-013)
  4. extracts/MRL_FormalCore.definitions.json(IP-014)
"""

from __future__ import annotations

import hashlib
import json
import os
import re
from typing import Dict, List, Tuple

EVIDENCE_LEVELS = ("FACT", "CLAIM", "INFERENCE", "UNRESOLVED")
STATUSES = ("proposed", "approved", "canonical", "superseded")
ID_RE = re.compile(r"^MRL-PC-\d{4}$")
# 裸 ∞(不在字串內)→ "∞";只在 [ 或 , 或空白之後、且 ] 或 , 或空白之前
_BARE_INF = re.compile(r"(?<=[\[,\s])∞(?=[\],\s])")

ESSENCE_FILE = os.path.join("raw", "PARTICLE_ESSENCE_INDEX_v2.json")
L1_FILE = os.path.join("extracts", "MRL_L1_Gate.definitions.json")
BLUEPRINT_FILE = os.path.join("extracts", "MRL_Blueprint.definitions.json")
FORMAL_FILE = os.path.join("extracts", "MRL_FormalCore.definitions.json")


def sha256_file(path: str) -> str:
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def load_essence_index(path: str) -> Dict:
    """讀取本質索引。原檔非嚴格 JSON(λ 內含裸 ∞),僅在記憶體中把裸 ∞ 轉為字串 "∞"。"""
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    return json.loads(_BARE_INF.sub('"∞"', text))


def _read_json(path: str) -> Dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _pid(n: int) -> str:
    return f"MRL-PC-{n:04d}"


def _prov(source_id: str, source_file: str, source_path: str, meta: Dict) -> Dict:
    return {
        "source_id": source_id,
        "source_file": source_file,
        "source_path": source_path,
        "converged_at": meta["converged_at"],
        "converged_by": meta["converged_by"],
        "approved_by": meta["approved_by"],
    }


def converge_essence_index(index: Dict, source_sha: str, meta: Dict, start: int = 1) -> List[Dict]:
    out = []
    for i, e in enumerate(index.get("essence", [])):
        attrs = {k: v for k, v in e.items() if k not in ("◎", "∈", "≈")}
        out.append({
            "id": _pid(start + i),
            "name": e["◎"],
            "layer": e.get("∈", ""),
            "layer_scheme": "essence_index_v2",
            "definition": e.get("≈", ""),
            "essence_ref": e["◎"],
            "source": "MRL 原生:PARTICLE_ESSENCE_INDEX_v2.json",
            "evidence_level": "FACT",
            "attributes": attrs,
            "provenance": _prov(source_sha, ESSENCE_FILE, f"$.essence[{i}]", meta),
            "status": meta["status"],
            "supersedes": None,
        })
    return out


def converge_definitions(doc: Dict, rel_file: str, source_label: str, source_sha: str, meta: Dict,
                         start: int, per_item_sha: Dict | None = None) -> List[Dict]:
    out = []
    for i, d in enumerate(doc.get("definitions", [])):
        sid = source_sha
        if per_item_sha and d.get("source_file") in per_item_sha:
            sid = per_item_sha[d["source_file"]]
        attrs = dict(d.get("attributes", {}))
        for k in ("source_file", "present_in_versions"):
            if k in d:
                attrs[k] = d[k]
        out.append({
            "id": _pid(start + i),
            "name": d["name"],
            "layer": d.get("layer", ""),
            "layer_scheme": doc.get("layer_scheme", ""),
            "definition": d["definition"],
            "essence_ref": None,
            "source": source_label,
            "evidence_level": "FACT",
            "attributes": attrs,
            "provenance": _prov(sid, rel_file, f"$.definitions[{i}]", meta),
            "status": meta["status"],
            "supersedes": None,
        })
    return out


def build_particles(ingest_dir: str, meta: Dict) -> Tuple[List[Dict], Dict]:
    """由 ingest 批次機械重生全部粒子。回傳 (particles, sources)。"""
    essence_path = os.path.join(ingest_dir, ESSENCE_FILE)
    essence = load_essence_index(essence_path)
    essence_sha = sha256_file(essence_path)
    parts = converge_essence_index(essence, essence_sha, meta, start=1)

    l1 = _read_json(os.path.join(ingest_dir, L1_FILE))
    parts += converge_definitions(l1, L1_FILE, "MRL 原生:" + l1["source"], sha256_file(os.path.join(ingest_dir, L1_FILE)),
                                  meta, start=len(parts) + 1, per_item_sha=l1.get("file_sha256"))
    bp = _read_json(os.path.join(ingest_dir, BLUEPRINT_FILE))
    parts += converge_definitions(bp, BLUEPRINT_FILE, "MRL 原生:" + bp["source"], bp["source_sha256"], meta, start=len(parts) + 1)
    fm = _read_json(os.path.join(ingest_dir, FORMAL_FILE))
    parts += converge_definitions(fm, FORMAL_FILE, "MRL 原生:" + fm["source"], fm["source_sha256"], meta, start=len(parts) + 1)

    sources = {
        "essence_index": {"file": ESSENCE_FILE, "sha256": essence_sha, "signature": essence.get("signature"),
                          "created": essence.get("created"), "count": len(essence.get("essence", []))},
        "l1_gate": {"file": L1_FILE, "count": len(l1.get("definitions", []))},
        "blueprint": {"file": BLUEPRINT_FILE, "sha256": bp["source_sha256"], "count": len(bp.get("definitions", []))},
        "formal_core": {"file": FORMAL_FILE, "sha256": fm["source_sha256"], "count": len(fm.get("definitions", []))},
        "essence_meta": {k: essence.get(k) for k in ("∴", "≡", "Φ", "layer_map", "vectors", "resonance_keys", "files_index")},
    }
    return parts, sources


def validate_codex(codex: Dict, essence_names: List[str] | None = None) -> List[str]:
    errs: List[str] = []
    seen = set()
    parts = codex.get("particles", [])
    for n, p in enumerate(parts, start=1):
        pid = p.get("id", "")
        if not ID_RE.match(pid):
            errs.append(f"{pid or n}: bad id")
        if pid in seen:
            errs.append(f"{pid}: duplicate id")
        seen.add(pid)
        if pid != _pid(n):
            errs.append(f"{pid}: not sequential (expected {_pid(n)})")
        for k in ("name", "layer", "definition", "source", "evidence_level", "provenance", "status"):
            if not p.get(k):
                errs.append(f"{pid}: missing {k}")
        if p.get("evidence_level") not in EVIDENCE_LEVELS:
            errs.append(f"{pid}: bad evidence_level")
        if p.get("status") not in STATUSES:
            errs.append(f"{pid}: bad status")
        prov = p.get("provenance") or {}
        if p.get("evidence_level") == "FACT" and not prov.get("source_id"):
            errs.append(f"{pid}: FACT without provenance.source_id")
        if essence_names is not None and p.get("essence_ref") and p["essence_ref"] not in essence_names:
            errs.append(f"{pid}: essence_ref not in index")
    for p in parts:
        sup = p.get("supersedes")
        if sup and sup not in seen:
            errs.append(f"{p['id']}: supersedes unknown {sup}")
    return errs
