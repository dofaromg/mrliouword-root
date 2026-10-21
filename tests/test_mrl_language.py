"""Tests for the MRL particle-language three-world cycle."""

from __future__ import annotations

import os
import json
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mrl_language import ParticlePacket, World
from mrl_language.verify import verify_payload


class ParticleLanguageTest(unittest.TestCase):
    def test_payload_survives_full_world_cycle(self) -> None:
        payload = {"文字": "粒子", "items": [1, True, None]}
        packet = ParticlePacket.create(payload)

        returned = (
            packet.transition(World.COMPUTER)
            .transition(World.HUMAN)
            .transition(World.EARTH)
        )

        self.assertEqual(returned.payload, payload)
        self.assertEqual(returned.current, packet.origin)
        self.assertTrue(returned.completed_round_trip)
        self.assertEqual(returned.trace, (
            World.EARTH, World.COMPUTER, World.HUMAN, World.EARTH
        ))

    def test_return_to_origin_works_from_each_world(self) -> None:
        for origin in World:
            with self.subTest(origin=origin):
                packet = ParticlePacket.create({"value": 7}, origin=origin)
                returned = packet.return_to_origin()
                self.assertEqual(returned.current, origin)
                self.assertEqual(returned.payload, {"value": 7})
                self.assertTrue(returned.completed_round_trip)

    def test_rejects_skipped_world(self) -> None:
        packet = ParticlePacket.create("payload")
        with self.assertRaisesRegex(ValueError, "expected computer"):
            packet.transition(World.HUMAN)

    def test_rejects_non_json_payload(self) -> None:
        with self.assertRaisesRegex(ValueError, "finite JSON values"):
            ParticlePacket.create(float("nan"))

    def test_verifier_reports_round_trip_and_integrity_checks(self) -> None:
        report = verify_payload({"message": "可逆驗證"})
        self.assertEqual(report["status"], "PASS")
        self.assertTrue(all(report["checks"].values()))
        self.assertEqual(len(report["traces"]["earth"]), 4)

    def test_cli_passes_for_json_file(self) -> None:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", suffix=".json"
        ) as payload_file:
            json.dump({"message": "verify"}, payload_file)
            payload_file.flush()
            result = subprocess.run(
                [sys.executable, "-m", "mrl_language", payload_file.name],
                capture_output=True,
                text=True,
                check=False,
            )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "PASS")

    def test_cli_fails_for_invalid_json(self) -> None:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", suffix=".json"
        ) as payload_file:
            payload_file.write("{invalid")
            payload_file.flush()
            result = subprocess.run(
                [sys.executable, "-m", "mrl_language", payload_file.name],
                capture_output=True,
                text=True,
                check=False,
            )

        self.assertEqual(result.returncode, 1)
        self.assertEqual(json.loads(result.stdout)["status"], "FAIL")


if __name__ == "__main__":
    unittest.main(verbosity=2)
