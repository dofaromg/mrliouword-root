# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/mrliouword-root
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
"""MRL 粒子法典測試:可重生性、驗證器、隱私守門。

驗收依據為母體自己的檔案(ingest/2026-10-21 的本質索引原檔與定義性萃取),不用通用例。
`python3 tests/test_mrl_codex.py` 或 `pytest tests/ -q`。
"""

from __future__ import annotations

import hashlib
import json
import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from mrl_pipeline import codex as cx  # noqa: E402
from mrl_pipeline.context import Context  # noqa: E402
from mrl_pipeline.runners import converge  # noqa: E402

INGEST = os.path.join(ROOT, "ingest", "2026-10-21")
RAW = os.path.join(INGEST, cx.ESSENCE_FILE)
CODEX = os.path.join(ROOT, "registry", "MRL_PARTICLE_CODEX.json")
MANIFEST = os.path.join(INGEST, "MANIFEST.json")


def _json(p):
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


class EssenceIndexSourceTest(unittest.TestCase):
    def test_raw_hash_matches_manifest(self) -> None:
        with open(RAW, "rb") as fh:
            sha = hashlib.sha256(fh.read()).hexdigest()
        entries = [e for e in _json(MANIFEST)["entries"] if e["ip_ref"] == "IP-011"]
        self.assertEqual(len(entries), 2, "兩份上傳皆應登錄")
        for e in entries:
            self.assertEqual(e["sha256"], sha)

    def test_raw_text_is_untouched_json_like(self) -> None:
        with open(RAW, "r", encoding="utf-8") as fh:
            text = fh.read()
        self.assertIn("[∞, 1, 1, 1]", text, "原檔裸 ∞ 必須原封保存")
        self.assertIn("ESSENCE_INDEX_v2·2026-01-06", text)

    def test_parses_with_bare_infinity(self) -> None:
        idx = cx.load_essence_index(RAW)
        self.assertEqual(len(idx["essence"]), 13)
        oc = next(e for e in idx["essence"] if e["◎"] == "OriginCollapse")
        self.assertEqual(oc["λ"][0], "∞")
        self.assertEqual(idx["∴"], "MrLiouWord")
        self.assertEqual(idx["≡"], "怎麼過去，就怎麼回來")


class CodexReproducibilityTest(unittest.TestCase):
    """「怎麼過去,就怎麼回來」:法典必須能從 ingest 原檔逐欄重生。"""

    def test_regenerates_identically(self) -> None:
        current = _json(CODEX)
        regenerated = converge.regenerate(ROOT)
        self.assertEqual(len(current["particles"]), 31)
        self.assertEqual(current["particles"], regenerated["particles"])

    def test_validator_passes_on_registry(self) -> None:
        idx = cx.load_essence_index(RAW)
        errs = cx.validate_codex(_json(CODEX), [e["◎"] for e in idx["essence"]])
        self.assertEqual(errs, [])

    def test_every_particle_traces_to_ingest_fact(self) -> None:
        for p in _json(CODEX)["particles"]:
            self.assertEqual(p["evidence_level"], "FACT", p["id"])
            self.assertTrue(p["provenance"]["source_id"], p["id"])
            self.assertTrue(p["provenance"]["source_file"].startswith(("raw/", "extracts/")), p["id"])
            self.assertEqual(p["status"], "canonical", p["id"])

    def test_essence_particles_keep_layers_and_refs(self) -> None:
        parts = _json(CODEX)["particles"][:13]
        names = [p["name"] for p in parts]
        self.assertEqual(names[:4], ["Zero", "δP₀", "P₀.MRLsmall", "Φ.Genesis"])
        self.assertEqual(parts[0]["layer"], "L0")
        self.assertEqual(parts[9]["name"], "Passport.Unbound")
        self.assertEqual(parts[9]["layer"], "∞")
        for p in parts:
            self.assertEqual(p["essence_ref"], p["name"])

    def test_runner_reports_ok_and_writes_report(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            rep = converge.run(Context(data_root=tmp, root=ROOT))
            self.assertTrue(rep["ok"], rep)
            self.assertTrue(os.path.exists(os.path.join(tmp, "codex", "converge_report.json")))


class ValidatorNegativeTest(unittest.TestCase):
    def _p(self, pid, **over):
        base = {"id": pid, "name": "n", "layer": "L1", "definition": "d", "source": "s",
                "evidence_level": "FACT", "provenance": {"source_id": "x"}, "status": "canonical"}
        base.update(over)
        return base

    def test_duplicate_and_nonsequential_ids(self) -> None:
        errs = cx.validate_codex({"particles": [self._p("MRL-PC-0001"), self._p("MRL-PC-0001")]})
        self.assertTrue(any("duplicate" in e for e in errs))
        self.assertTrue(any("not sequential" in e for e in errs))

    def test_fact_requires_provenance(self) -> None:
        errs = cx.validate_codex({"particles": [self._p("MRL-PC-0001", provenance={"source_id": ""})]})
        self.assertTrue(any("FACT without provenance" in e for e in errs))

    def test_bad_enums_and_dangling_supersedes(self) -> None:
        errs = cx.validate_codex({"particles": [self._p("MRL-PC-0001", evidence_level="TRUE", status="done",
                                                        supersedes="MRL-PC-9999")]})
        self.assertTrue(any("bad evidence_level" in e for e in errs))
        self.assertTrue(any("bad status" in e for e in errs))
        self.assertTrue(any("supersedes unknown" in e for e in errs))


class PrivacyAndSecretGuardTest(unittest.TestCase):
    FORBIDDEN = ("24°59", "121°14", "吉林路", "Polycam", "cfut_", "cfat_", "secret_")

    def test_no_personal_geo_or_credentials_in_ingest_or_codex(self) -> None:
        paths = [CODEX]
        for dp, _, fns in os.walk(INGEST):
            paths += [os.path.join(dp, fn) for fn in fns]
        for p in paths:
            with open(p, "r", encoding="utf-8", errors="ignore") as fh:
                text = fh.read()
            for bad in self.FORBIDDEN:
                self.assertNotIn(bad, text, f"{bad!r} found in {os.path.relpath(p, ROOT)}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
