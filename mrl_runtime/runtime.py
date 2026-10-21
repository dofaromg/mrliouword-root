"""Conversation orchestration over the MRL particle-language world cycle."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Protocol, Tuple

from mrl_language import ParticlePacket, World


class TextModel(Protocol):
    def complete(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
    ) -> str: ...


@dataclass(frozen=True)
class ChatTurn:
    user_packet: ParticlePacket
    assistant_packet: ParticlePacket

    @property
    def user_text(self) -> str:
        return self.user_packet.payload["content"]

    @property
    def assistant_text(self) -> str:
        return self.assistant_packet.payload["content"]


class ChatRuntime:
    """Keep a bounded in-memory conversation and record each completed turn."""

    def __init__(
        self,
        model: TextModel,
        system: Optional[str] = None,
        max_history_messages: int = 40,
    ) -> None:
        if max_history_messages < 2:
            raise ValueError("max_history_messages must be at least two")
        self._model = model
        self._system = system
        self._max_history_messages = max_history_messages - max_history_messages % 2
        self._messages: List[Dict[str, str]] = []

    @property
    def messages(self) -> Tuple[Dict[str, str], ...]:
        return tuple(dict(message) for message in self._messages)

    def ask(self, text: str) -> ChatTurn:
        if not isinstance(text, str) or not text.strip():
            raise ValueError("message must not be empty")

        user_packet = ParticlePacket.create(
            {"role": "user", "content": text},
            origin=World.HUMAN,
        )
        user_packet = user_packet.transition(World.EARTH)
        user_packet = user_packet.transition(World.COMPUTER)
        candidate = self._messages + [
            {"role": "user", "content": user_packet.payload["content"]}
        ]
        response = self._model.complete(candidate, system=self._system)
        if not isinstance(response, str) or not response.strip():
            raise ValueError("model returned an empty response")

        assistant_packet = ParticlePacket.create(
            {"role": "assistant", "content": response},
            origin=World.COMPUTER,
        ).transition(World.HUMAN)
        self._messages = candidate + [
            {"role": "assistant", "content": assistant_packet.payload["content"]}
        ]
        if len(self._messages) > self._max_history_messages:
            self._messages = self._messages[-self._max_history_messages :]
        return ChatTurn(user_packet, assistant_packet)
