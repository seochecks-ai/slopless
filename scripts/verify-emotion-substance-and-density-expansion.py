#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
import tomllib
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = (
    ROOT
    / ".plans/2026-05-17-181310-emotion-substance-and-density-expansion.md.manifest.toml"
)
PATTERN_DATA_DIR = ROOT / "src/rules/semantic-thinness/private"
GOLDEN_ROOT = ROOT / "behavior/golden"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def as_rows(data: dict[str, Any], key: str) -> list[dict[str, Any]]:
    value = data.get(key, [])
    if not isinstance(value, list):
        raise TypeError(f"manifest key {key} must be a list")
    return [row for row in value if isinstance(row, dict)]


def require_file(errors: list[str], label: str, relative: str) -> Path | None:
    path = ROOT / relative
    if not path.is_file():
        errors.append(f"missing {label}: {relative}")
        return None
    return path


def require_text(
    errors: list[str], label: str, relative: str, required: list[str]
) -> None:
    path = require_file(errors, label, relative)
    if path is None:
        return
    text = read_text(path)
    for item in required:
        if item not in text:
            errors.append(f"{relative} missing text: {item}")


def line_numbers_for_text(relative: str, required: list[str]) -> dict[str, int]:
    lines = read_text(ROOT / relative).splitlines()
    return {item: lines.index(item) + 1 for item in required if item in lines}


def approved_messages() -> list[dict[str, Any]]:
    messages: list[dict[str, Any]] = []

    for golden_output in sorted(
        GOLDEN_ROOT.glob("textlint-rules-*/approved.normalized.json")
    ):
        output = json.loads(read_text(golden_output))
        if not isinstance(output, list):
            continue
        for result in output:
            if not isinstance(result, dict):
                continue
            file_path = str(result.get("filePath", ""))
            for message in result.get("messages", []):
                if isinstance(message, dict):
                    messages.append({"filePath": file_path, **message})

    return messages


def require_semantic_pattern_output(
    errors: list[str],
    row: dict[str, Any],
    messages: list[dict[str, Any]],
) -> None:
    marker = f"({row['id']})"
    case_path = str(row["cases_hits"])
    require_output_marker(
        errors,
        messages,
        case_path,
        list(row["required_hit_text"]),
        "semantic-thinness",
        marker,
    )
    require_output_marker(
        errors,
        messages,
        str(row["corpus"]),
        list(row["required_hit_text"]),
        "semantic-thinness",
        marker,
    )


def require_output_marker(
    errors: list[str],
    messages: list[dict[str, Any]],
    relative: str,
    required: list[str],
    rule_id: str,
    message_marker: str | None = None,
) -> None:
    for text, line in line_numbers_for_text(relative, required).items():
        matching = [
            message
            for message in messages
            if str(message.get("filePath", "")).endswith(relative)
            and message.get("line") == line
            and message.get("ruleId") == rule_id
            and (
                message_marker is None
                or message_marker in str(message.get("message", ""))
            )
        ]
        if not matching:
            marker_text = "" if message_marker is None else f" marker {message_marker}"
            errors.append(f"{relative}:{line} missing {rule_id}{marker_text}: {text}")


def require_no_output(
    errors: list[str],
    messages: list[dict[str, Any]],
    relative: str,
    required: list[str],
) -> None:
    for text, line in line_numbers_for_text(relative, required).items():
        matching = [
            message
            for message in messages
            if str(message.get("filePath", "")).endswith(relative)
            and message.get("line") == line
        ]
        if matching:
            rule_ids = ", ".join(
                sorted(
                    str(message.get("ruleId", "unknown")) for message in matching
                )
            )
            errors.append(f"{relative}:{line} expected no output but got {rule_ids}: {text}")


def verify_source_note(errors: list[str], row: dict[str, Any]) -> None:
    require_text(errors, "source note", str(row["path"]), list(row["required_text"]))


def verify_semantic_pattern(errors: list[str], row: dict[str, Any]) -> None:
    pattern_path = require_file(errors, "semantic pattern", str(row["path"]))
    if pattern_path is not None:
        pattern = json.loads(read_text(pattern_path))
        if pattern.get("id") != row["id"]:
            errors.append(f"{row['path']} has wrong id: {pattern.get('id')}")
        slots = pattern.get("slots", {})
        if not isinstance(slots, dict):
            errors.append(f"{row['path']} slots must be an object")
        else:
            for slot in row.get("required_slots", []):
                if str(slot) not in slots:
                    errors.append(f"{row['path']} missing slot: {slot}")
        pattern_data = "\n".join(
            read_text(path) for path in sorted(PATTERN_DATA_DIR.glob("pattern-data-*.ts"))
        )
        if pattern_path.name.removesuffix(".json") not in pattern_data:
            errors.append(f"pattern data does not import {pattern_path.name}")

    require_text(errors, "hit cases", str(row["cases_hits"]), list(row["required_hit_text"]))
    require_text(
        errors,
        "no-hit cases",
        str(row["cases_no_hits"]),
        list(row["required_no_hit_text"]),
    )
    require_text(errors, "corpus", str(row["corpus"]), list(row["required_hit_text"]))


def verify_narrative_rule(
    errors: list[str],
    row: dict[str, Any],
    messages: list[dict[str, Any]],
) -> None:
    require_file(errors, "narrative rule", str(row["path"]))
    require_text(errors, "hit cases", str(row["cases_hits"]), list(row["required_hit_text"]))
    require_text(
        errors,
        "no-hit cases",
        str(row["cases_no_hits"]),
        list(row["required_no_hit_text"]),
    )
    require_text(errors, "corpus", str(row["corpus"]), list(row["required_hit_text"]))
    require_output_marker(
        errors,
        messages,
        str(row["cases_hits"]),
        list(row["required_hit_text"]),
        str(row["id"]),
    )
    require_output_marker(
        errors,
        messages,
        str(row["corpus"]),
        list(row["required_hit_text"]),
        str(row["id"]),
    )


def verify_source_record(errors: list[str], row: dict[str, Any]) -> None:
    require_text(errors, "source record", str(row["path"]), list(row["required_text"]))


def main() -> int:
    data = tomllib.loads(read_text(MANIFEST))
    errors: list[str] = []
    messages = approved_messages()

    for row in as_rows(data, "source_note"):
        verify_source_note(errors, row)
    for row in as_rows(data, "semantic_pattern"):
        verify_semantic_pattern(errors, row)
        require_semantic_pattern_output(errors, row, messages)
        require_no_output(
            errors,
            messages,
            str(row["cases_no_hits"]),
            list(row["required_no_hit_text"]),
        )
    for row in as_rows(data, "narrative_rule"):
        verify_narrative_rule(errors, row, messages)
        require_no_output(
            errors,
            messages,
            str(row["cases_no_hits"]),
            list(row["required_no_hit_text"]),
        )
    for row in as_rows(data, "source_record"):
        verify_source_record(errors, row)

    if errors:
        print("FAIL emotion-substance-and-density-expansion")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS emotion-substance-and-density-expansion")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
