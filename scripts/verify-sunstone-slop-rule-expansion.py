#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
import tomllib
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = (
    ROOT / ".plans/2026-05-17-172332-sunstone-slop-rule-expansion.md.manifest.toml"
)
PACKAGE_JSON = ROOT / "package.json"
PRESET = ROOT / "src/presets/everything.ts"
SEMANTIC_PATTERNS = ROOT / "src/families/semantic-thinness/patterns"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def as_rows(data: dict[str, Any], key: str) -> list[dict[str, Any]]:
    value = data.get(key, [])
    if not isinstance(value, list):
        raise TypeError(f"manifest key {key} must be a list")
    return [row for row in value if isinstance(row, dict)]


def has_object_key(source: str, key: str) -> bool:
    return (
        f'"{key}"' in source
        or f"{key}:" in source
        or re.search(rf"(^|\s){re.escape(key)}\s*[,}}]", source) is not None
    )


def package_exports() -> set[str]:
    package = json.loads(read_text(PACKAGE_JSON))
    exports = package.get("exports", {})
    if not isinstance(exports, dict):
        return set()
    return set(exports)


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


def semantic_pattern_ids() -> set[str]:
    ids: set[str] = set()
    for path in SEMANTIC_PATTERNS.glob("*.json"):
        data = json.loads(read_text(path))
        pattern_id = data.get("id")
        if isinstance(pattern_id, str):
            ids.add(pattern_id)
    return ids


def verify_new_rule(
    errors: list[str],
    row: dict[str, Any],
    exports: set[str],
    preset_text: str,
) -> None:
    rule_id = str(row["id"])
    rule_path = str(row["path"])
    registry = str(row["registry"])
    export = str(row["export"])

    require_file(errors, "new rule", rule_path)
    registry_path = require_file(errors, "registry", registry)
    if registry_path is not None and not has_object_key(read_text(registry_path), rule_id):
        errors.append(f"{registry} missing rule id: {rule_id}")
    if export not in exports:
        errors.append(f"package.json missing export for {rule_id}: {export}")
    if bool(row.get("preset")) and f'"{rule_id}": true' not in preset_text:
        errors.append(f"src/presets/everything.ts missing rule: {rule_id}")

    require_text(errors, "hit cases", str(row["cases_hits"]), list(row["required_hit_text"]))
    require_text(
        errors,
        "no-hit cases",
        str(row["cases_no_hits"]),
        list(row["required_no_hit_text"]),
    )
    require_text(errors, "corpus", str(row["corpus"]), list(row["required_hit_text"]))


def verify_expanded_rule(errors: list[str], row: dict[str, Any]) -> None:
    rule_id = str(row["id"])
    require_file(errors, "expanded rule", str(row["path"]))
    require_text(errors, "hit cases", str(row["cases_hits"]), list(row["required_hit_text"]))
    require_text(
        errors,
        "no-hit cases",
        str(row["cases_no_hits"]),
        list(row["required_no_hit_text"]),
    )
    require_text(errors, "corpus", str(row["corpus"]), list(row["required_hit_text"]))

    if rule_id == "semantic-thinness":
        actual_ids = semantic_pattern_ids()
        for pattern_id in row.get("required_pattern_ids", []):
            if str(pattern_id) not in actual_ids:
                errors.append(f"missing semantic pattern id: {pattern_id}")


def verify_source_record(errors: list[str], row: dict[str, Any]) -> None:
    require_text(errors, "source record", str(row["path"]), list(row["required_text"]))


def main() -> int:
    data = tomllib.loads(read_text(MANIFEST))
    errors: list[str] = []
    exports = package_exports()
    preset_text = read_text(PRESET)

    require_file(errors, "source note", str(data["meta"]["source_note"]))

    for row in as_rows(data, "expanded_rule"):
        verify_expanded_rule(errors, row)
    for row in as_rows(data, "new_rule"):
        verify_new_rule(errors, row, exports, preset_text)
    for row in as_rows(data, "source_record"):
        verify_source_record(errors, row)

    if errors:
        print("FAIL sunstone-slop-rule-expansion")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS sunstone-slop-rule-expansion")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
