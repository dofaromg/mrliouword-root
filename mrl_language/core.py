"""Lossless particle packets and the documented three-world transition cycle."""

from __future__ import annotations

import hashlib
import json
import uuid
from dataclasses import dataclass
from enum import Enum
from typing import Any, Tuple


class World(str, Enum):
    """The three contexts documented by the particle-world canonical chain."""

    EARTH = "earth"
    COMPUTER = "computer"
    HUMAN = "human"


_WORLD_CYCLE = (World.EARTH, World.COMPUTER, World.HUMAN)


def _next_world(world: World) -> World:
    return _WORLD_CYCLE[(_WORLD_CYCLE.index(world) + 1) % len(_WORLD_CYCLE)]


def _serialize_payload(payload: Any) -> str:
    try:
        return json.dumps(
            payload,
            ensure_ascii=False,
            allow_nan=False,
            sort_keys=True,
            separators=(",", ":"),
        )
    except (TypeError, ValueError) as exc:
        raise ValueError("payload must contain only finite JSON values") from exc


@dataclass(frozen=True)
class ParticlePacket:
    """A JSON payload with origin, current world, and a verifiable transition trace.

    A packet records movement through the documented cycle. It does not perform
    world-specific interpretation or claim to implement external adapters.
    """

    packet_id: str
    origin: World
    current: World
    payload_json: str
    payload_sha256: str
    trace: Tuple[World, ...]

    def __post_init__(self) -> None:
        if not self.trace or self.trace[0] != self.origin:
            raise ValueError("trace must begin at the packet origin")
        if self.trace[-1] != self.current:
            raise ValueError("trace must end at the current world")
        if any(right != _next_world(left) for left, right in zip(self.trace, self.trace[1:])):
            raise ValueError("trace contains an invalid world transition")
        actual_hash = hashlib.sha256(self.payload_json.encode("utf-8")).hexdigest()
        if actual_hash != self.payload_sha256:
            raise ValueError("payload checksum mismatch")
        try:
            json.loads(self.payload_json)
        except json.JSONDecodeError as exc:
            raise ValueError("payload_json must contain valid JSON") from exc

    @classmethod
    def create(cls, payload: Any, origin: World = World.EARTH) -> "ParticlePacket":
        """Create a packet at its origin from a JSON-compatible value."""
        serialized = _serialize_payload(payload)
        checksum = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
        return cls(
            packet_id=str(uuid.uuid4()),
            origin=origin,
            current=origin,
            payload_json=serialized,
            payload_sha256=checksum,
            trace=(origin,),
        )

    @property
    def payload(self) -> Any:
        """Return the payload after checking its integrity."""
        actual_hash = hashlib.sha256(self.payload_json.encode("utf-8")).hexdigest()
        if actual_hash != self.payload_sha256:
            raise ValueError("payload checksum mismatch")
        return json.loads(self.payload_json)

    @property
    def completed_round_trip(self) -> bool:
        """Whether at least one complete three-transition cycle has returned."""
        transitions = len(self.trace) - 1
        return transitions > 0 and transitions % len(_WORLD_CYCLE) == 0

    def transition(self, target: World) -> "ParticlePacket":
        """Move one step forward in the canonical cycle without changing payload."""
        expected = _next_world(self.current)
        if target != expected:
            raise ValueError(
                f"invalid transition from {self.current.value} to {target.value}; "
                f"expected {expected.value}"
            )
        return ParticlePacket(
            packet_id=self.packet_id,
            origin=self.origin,
            current=target,
            payload_json=self.payload_json,
            payload_sha256=self.payload_sha256,
            trace=self.trace + (target,),
        )

    def return_to_origin(self) -> "ParticlePacket":
        """Advance the shortest valid path back to the packet's origin."""
        packet = self
        while packet.current != packet.origin or len(packet.trace) == 1:
            packet = packet.transition(_next_world(packet.current))
        return packet
