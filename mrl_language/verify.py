"""Executable verification of the particle-language packet invariants."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import replace
from typing import Any, Dict, TextIO

from .core import ParticlePacket, World


def verify_payload(payload: Any) -> Dict[str, Any]:
    """Exercise payload preservation, cycle closure, and rejection invariants."""
    packet = ParticlePacket.create(payload)
    worlds = tuple(World)
    checks: Dict[str, bool] = {}
    traces = {}

    for origin in worlds:
        cycle_packet = ParticlePacket.create(payload, origin=origin)
        for _ in range(len(worlds)):
            next_world = worlds[(worlds.index(cycle_packet.current) + 1) % len(worlds)]
            cycle_packet = cycle_packet.transition(next_world)
        checks[f"{origin.value}_round_trip"] = (
            cycle_packet.current == origin
            and cycle_packet.completed_round_trip
            and cycle_packet.payload == payload
            and cycle_packet.payload_sha256 == packet.payload_sha256
        )
        traces[origin.value] = [world.value for world in cycle_packet.trace]

    try:
        packet.transition(World.HUMAN)
    except ValueError:
        checks["invalid_transition_rejected"] = True
    else:
        checks["invalid_transition_rejected"] = False

    try:
        replace(packet, payload_json=packet.payload_json + " ")
    except ValueError:
        checks["tampered_payload_rejected"] = True
    else:
        checks["tampered_payload_rejected"] = False

    return {
        "status": "PASS" if all(checks.values()) else "FAIL",
        "payload_sha256": packet.payload_sha256,
        "checks": checks,
        "traces": traces,
    }


def _load_payload(source: str, stdin: TextIO) -> Any:
    if source == "-":
        return json.load(stdin)
    with open(source, "r", encoding="utf-8") as file:
        return json.load(file)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Verify a JSON payload through the MRL three-world cycle."
    )
    parser.add_argument(
        "payload",
        help="path to a JSON file, or - to read JSON from standard input",
    )
    args = parser.parse_args(argv)

    try:
        payload = _load_payload(args.payload, sys.stdin)
        report = verify_payload(payload)
    except (OSError, UnicodeError, json.JSONDecodeError, ValueError) as exc:
        report = {"status": "FAIL", "error": f"{type(exc).__name__}: {exc}"}

    print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))
    return 0 if report["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
