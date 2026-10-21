"""Interactive command-line entry point for the MRL Claude runtime."""

from __future__ import annotations

import argparse
import os
import sys

from .anthropic import ClaudeAPIError, ClaudeMessagesClient
from .runtime import ChatRuntime


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Run an interactive MRL conversation with Claude."
    )
    parser.add_argument(
        "--model",
        default=os.environ.get(
            "MRL_CLAUDE_MODEL", "claude-sonnet-4-20250514"
        ),
        help="Anthropic model identifier (default: MRL_CLAUDE_MODEL or Sonnet 4)",
    )
    parser.add_argument(
        "--system",
        default=None,
        help="optional system instruction for this conversation",
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=1024,
        help="maximum generated tokens per reply (default: 1024)",
    )
    args = parser.parse_args(argv)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Set ANTHROPIC_API_KEY in the environment to connect to Claude.", file=sys.stderr)
        return 2
    try:
        client = ClaudeMessagesClient(
            api_key=api_key,
            model=args.model,
            max_tokens=args.max_tokens,
        )
    except ValueError as exc:
        print(f"Configuration error: {exc}", file=sys.stderr)
        return 2

    runtime = ChatRuntime(client, system=args.system)
    print("MRL runtime ready. Type /exit to end the session.")
    while True:
        try:
            text = input("You> ")
        except EOFError:
            print()
            return 0
        if text.strip().lower() in {"/exit", "/quit"}:
            return 0
        try:
            turn = runtime.ask(text)
        except (ClaudeAPIError, ValueError) as exc:
            print(f"Request failed: {exc}", file=sys.stderr)
            continue
        print(f"Claude> {turn.assistant_text}")


if __name__ == "__main__":
    raise SystemExit(main())
