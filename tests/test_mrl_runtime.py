"""Offline tests for the MRL Claude runtime."""

from __future__ import annotations

import json
import os
import sys
import unittest
import urllib.error
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mrl_language import World
from mrl_runtime.anthropic import ClaudeAPIError, ClaudeMessagesClient
from mrl_runtime.runtime import ChatRuntime


class FakeModel:
    def __init__(self, responses: list[str] | None = None) -> None:
        self.responses = list(responses or ["reply"])
        self.calls = []

    def complete(self, messages, system=None):
        self.calls.append((messages, system))
        response = self.responses.pop(0)
        if isinstance(response, Exception):
            raise response
        return response


class FakeHTTPResponse:
    def __init__(self, payload: dict) -> None:
        self.body = json.dumps(payload).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self):
        return self.body


class MRLRuntimeTest(unittest.TestCase):
    def test_turn_uses_world_packets_and_conversation_context(self) -> None:
        model = FakeModel(["first", "second"])
        runtime = ChatRuntime(model, system="system", max_history_messages=4)

        first = runtime.ask("hello")
        second = runtime.ask("follow up")

        self.assertEqual(first.user_packet.origin, World.HUMAN)
        self.assertEqual(first.user_packet.current, World.COMPUTER)
        self.assertEqual(first.user_packet.trace, (
            World.HUMAN, World.EARTH, World.COMPUTER
        ))
        self.assertEqual(first.assistant_packet.origin, World.COMPUTER)
        self.assertEqual(first.assistant_packet.current, World.HUMAN)
        self.assertEqual(second.assistant_text, "second")
        self.assertEqual(len(model.calls[1][0]), 3)
        self.assertEqual(model.calls[1][0][0], {
            "role": "user", "content": "hello"
        })
        self.assertEqual(model.calls[1][1], "system")
        self.assertEqual(len(runtime.messages), 4)

    def test_failed_model_call_does_not_commit_partial_turn(self) -> None:
        model = FakeModel([ClaudeAPIError("offline")])
        runtime = ChatRuntime(model)
        with self.assertRaisesRegex(ClaudeAPIError, "offline"):
            runtime.ask("hello")
        self.assertEqual(runtime.messages, ())

    def test_empty_user_message_is_rejected(self) -> None:
        runtime = ChatRuntime(FakeModel())
        with self.assertRaisesRegex(ValueError, "must not be empty"):
            runtime.ask("  ")


class ClaudeMessagesClientTest(unittest.TestCase):
    def test_sends_authenticated_messages_request_and_extracts_text(self) -> None:
        client = ClaudeMessagesClient("test-secret", model="test-model")
        response = FakeHTTPResponse({
            "content": [
                {"type": "text", "text": "你好"},
                {"type": "text", "text": "！"},
            ]
        })
        with patch("urllib.request.urlopen", return_value=response) as urlopen:
            result = client.complete(
                [{"role": "user", "content": "hello"}],
                system="system",
            )

        request = urlopen.call_args.args[0]
        body = json.loads(request.data.decode("utf-8"))
        self.assertEqual(result, "你好！")
        self.assertEqual(request.full_url, client.endpoint)
        self.assertEqual(request.get_header("X-api-key"), "test-secret")
        self.assertEqual(request.get_header("Anthropic-version"), "2023-06-01")
        self.assertEqual(body["model"], "test-model")
        self.assertEqual(body["system"], "system")

    def test_http_failure_is_sanitized(self) -> None:
        client = ClaudeMessagesClient("never-print-this")
        error = urllib.error.HTTPError(
            client.endpoint, 401, "unauthorized", {}, None
        )
        with patch("urllib.request.urlopen", side_effect=error):
            with self.assertRaisesRegex(ClaudeAPIError, "HTTP 401") as raised:
                client.complete([{"role": "user", "content": "hello"}])
        self.assertNotIn("never-print-this", str(raised.exception))

    def test_tool_request_is_not_executed(self) -> None:
        client = ClaudeMessagesClient("test-secret")
        response = FakeHTTPResponse({
            "content": [{"type": "tool_use", "name": "anything", "input": {}}]
        })
        with patch("urllib.request.urlopen", return_value=response):
            with self.assertRaisesRegex(ClaudeAPIError, "no tools enabled"):
                client.complete([{"role": "user", "content": "hello"}])


if __name__ == "__main__":
    unittest.main(verbosity=2)
