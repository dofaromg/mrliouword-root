"""Tests for the MRL particle-language three-world cycle."""

from __future__ import annotations

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mrl_language import ParticlePacket, World


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


if __name__ == "__main__":
    unittest.main(verbosity=2)
