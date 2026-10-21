"""Minimal Anthropic Messages API client using only the Python standard library."""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional


class ClaudeAPIError(RuntimeError):
    """A sanitized API, transport, or response error."""


class ClaudeMessagesClient:
    endpoint = "https://api.anthropic.com/v1/messages"
    api_version = "2023-06-01"

    def __init__(
        self,
        api_key: str,
        model: str = "claude-sonnet-4-20250514",
        timeout: float = 60.0,
        max_tokens: int = 1024,
    ) -> None:
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY must not be empty")
        if not model:
            raise ValueError("model must not be empty")
        if timeout <= 0:
            raise ValueError("timeout must be greater than zero")
        if max_tokens <= 0:
            raise ValueError("max_tokens must be greater than zero")
        self._api_key = api_key
        self.model = model
        self.timeout = timeout
        self.max_tokens = max_tokens

    def complete(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
    ) -> str:
        """Send a conversation and return its text response."""
        body: Dict[str, Any] = {
            "model": self.model,
            "max_tokens": self.max_tokens,
            "messages": messages,
        }
        if system:
            body["system"] = system

        request = urllib.request.Request(
            self.endpoint,
            data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
            headers={
                "content-type": "application/json",
                "x-api-key": self._api_key,
                "anthropic-version": self.api_version,
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                response_body = response.read()
        except urllib.error.HTTPError as exc:
            raise ClaudeAPIError(
                f"Claude API returned HTTP {exc.code}"
            ) from None
        except (urllib.error.URLError, TimeoutError, OSError):
            raise ClaudeAPIError("Could not connect to the Claude API") from None

        try:
            data = json.loads(response_body)
        except (UnicodeDecodeError, json.JSONDecodeError):
            raise ClaudeAPIError("Claude API returned invalid JSON") from None

        if not isinstance(data, dict) or not isinstance(data.get("content"), list):
            raise ClaudeAPIError("Claude API response is missing content")

        text_parts = []
        for block in data["content"]:
            if isinstance(block, dict) and block.get("type") == "text":
                text = block.get("text")
                if isinstance(text, str):
                    text_parts.append(text)
            elif isinstance(block, dict) and block.get("type") == "tool_use":
                raise ClaudeAPIError(
                    "Claude requested a tool, but this runtime has no tools enabled"
                )
        result = "".join(text_parts)
        if not result:
            raise ClaudeAPIError("Claude API returned no text response")
        return result
