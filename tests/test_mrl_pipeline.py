# 產品：MRL Local-FS Sync Pipeline（MRL 企業所屬）｜root_repository: dofaromg/----2
# origin_signature: MrLiouWord｜canonical_namespace: MRL｜Root Owner: Mr.liou / dofaromg
"""端對端測試：MRL Local-FS Sync Pipeline。

無外部依賴，直接用 stdlib unittest。可用 `python tests/test_mrl_pipeline.py`
或 `pytest tests/ -q` 執行。
"""

from __future__ import annotations

import os
import sys
import tempfile
import unittest

# 讓測試從 repo 根目錄或 tests/ 目錄執行皆可匯入 mrl_pipeline。
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mrl_pipeline.bridge import bridge_localfs
from mrl_pipeline.context import Context
from mrl_pipeline.fsutil import read_json, write_json
from mrl_pipeline.graph import run_graph
from mrl_pipeline.runners import audit, rebuild, repair
from mrl_pipeline.stages import stage_clean_snapshot


class PipelineEndToEndTest(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.base = self._tmp.name
        # 建立要橋接的來源檔案樹。
        self.src = os.path.join(self.base, "src")
        os.makedirs(os.path.join(self.src, "sub"))
        with open(os.path.join(self.src, "a.txt"), "w", encoding="utf-8") as f:
            f.write("hello")
        with open(os.path.join(self.src, "sub", "b.txt"), "w", encoding="utf-8") as f:
            f.write("world")
        self.data_root = os.path.join(self.base, "data")

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def _ctx(self) -> Context:
        return Context(data_root=self.data_root, root=self.src)

    def test_stage_bridge_audit_rebuild_flow(self) -> None:
        ctx = self._ctx()

        snap = stage_clean_snapshot.snapshot_create(ctx)
        self.assertTrue(snap["ok"])
        self.assertTrue(os.path.exists(snap["snapshot"]))

        bridged = bridge_localfs(ctx)
        self.assertTrue(bridged["ok"])
        self.assertEqual(bridged["file_count"], 2)
        manifest = read_json(bridged["manifest"])
        self.assertEqual({e["path"] for e in manifest["files"]}, {"a.txt", "sub/b.txt"})

        audited = audit.run(ctx)
        self.assertTrue(audited["ok"])  # 無不可讀檔 → 通過
        report = read_json(audited["report"])
        # bridge 後立即稽核，內容一致：無 added/removed/modified。
        self.assertEqual(report["summary"]["modified"], 0)
        self.assertEqual(report["summary"]["removed"], 0)

        rebuilt = rebuild.run(ctx)
        self.assertTrue(rebuilt["ok"])
        self.assertEqual(rebuilt["entry_count"], 2)
        index = read_json(rebuilt["index"])["index"]
        self.assertIn("a.txt", index)
        self.assertIn("sub/b.txt", index)

    def test_repair_is_non_destructive(self) -> None:
        ctx = self._ctx()
        res = repair.run(ctx, failed_node="x", reason="unit-test")
        self.assertTrue(res["ok"])
        self.assertTrue(os.path.exists(res["report"]))
        # 來源檔案不得被修復流程刪除。
        self.assertTrue(os.path.exists(os.path.join(self.src, "a.txt")))

    def test_run_graph_success(self) -> None:
        # 一張只跑 snapshot + runner 的成功圖（不含 cmd，避免依賴 cwd）。
        graph = {
            "graph_id": "test_ok",
            "nodes": [
                {"id": "s", "kind": "python_stage",
                 "action": "snapshot_create",
                 "impl": "mrl_pipeline.stages.stage_clean_snapshot"},
                {"id": "a", "kind": "runner", "name": "audit"},
            ],
            "policy": {"on_fail": "redirect", "default_redirect_runner": "repair"},
        }
        gpath = os.path.join(self.base, "graph_ok.json")
        write_json(gpath, graph)
        summary = run_graph(gpath, self._ctx())
        self.assertTrue(summary["ok"])
        self.assertEqual(summary["nodes_run"], 2)

    def test_run_graph_redirect_to_repair_on_failure(self) -> None:
        # 未知 runner 名稱會讓節點失敗，policy 應重導向 repair。
        graph = {
            "graph_id": "test_fail",
            "nodes": [
                {"id": "boom", "kind": "runner", "name": "does_not_exist"},
                {"id": "never", "kind": "runner", "name": "audit"},
            ],
            "policy": {"on_fail": "redirect", "default_redirect_runner": "repair"},
        }
        gpath = os.path.join(self.base, "graph_fail.json")
        write_json(gpath, graph)
        summary = run_graph(gpath, self._ctx())
        self.assertFalse(summary["ok"])
        # 失敗節點後應出現 redirect:repair，且後續節點 never 未執行。
        node_ids = [r["node"] for r in summary["results"]]
        self.assertIn("boom", node_ids)
        self.assertIn("redirect:repair", node_ids)
        self.assertNotIn("never", node_ids)
        repair_res = summary["results"][-1]
        self.assertTrue(repair_res["ok"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
