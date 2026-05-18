#!/usr/bin/env python3
from __future__ import annotations

import json
import tomllib
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / ".plans/2026-05-18-161848-artifact-placeholders-and-puffery.md.manifest.toml"
PACKAGE_JSON = ROOT / "package.json"
PRESET = ROOT / "src/presets/everything.ts"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def rows(data: dict[str, Any], key: str) -> list[dict[str, Any]]:
    value = data.get(key, [])
    if not isinstance(value, list):
        raise TypeError(f"manifest key {key} must be a list")
    return [item for item in value if isinstance(item, dict)]


def require_file(errors: list[str], path: str) -> str:
    full_path = ROOT / path
    if not full_path.is_file():
        errors.append(f"missing file: {path}")
        return ""
    return read_text(full_path)


def require_text(errors: list[str], path: str, required: list[Any]) -> None:
    text = require_file(errors, path)
    for needle in required:
        if str(needle) not in text:
            errors.append(f"{path} missing text: {needle}")


def package_exports() -> set[str]:
    data = json.loads(read_text(PACKAGE_JSON))
    exports = data.get("exports", {})
    if not isinstance(exports, dict):
        return set()
    return set(exports)


def verify_new_rules(errors: list[str], data: dict[str, Any]) -> None:
    exports = package_exports()
    preset_text = read_text(PRESET)

    for rule in rows(data, "new_rule"):
        path = str(rule["path"])
        registry = str(rule["registry"])
        rule_id = str(rule["id"])
        export = str(rule["export"])

        require_text(errors, path, rule.get("required_text", []))
        require_text(errors, registry, [rule_id])

        if export not in exports:
            errors.append(f"package.json missing export: {export}")

        if bool(rule.get("preset")) and f'"{rule_id}": true' not in preset_text:
            errors.append(f"preset missing enabled rule: {rule_id}")


def verify_semantic_patterns(errors: list[str], data: dict[str, Any]) -> None:
    for pattern in rows(data, "semantic_pattern"):
        path = str(pattern["path"])
        imported_by = str(pattern["imported_by"])
        pattern_id = str(pattern["id"])

        require_text(errors, path, pattern.get("required_text", []))
        require_text(errors, imported_by, [pattern_id])


def verify_required_text_groups(errors: list[str], data: dict[str, Any]) -> None:
    for key in ["rule_adjustment", "fixture_case", "fixture_corpus"]:
        for row in rows(data, key):
            require_text(errors, str(row["path"]), row.get("required_text", []))


def main() -> int:
    data = tomllib.loads(read_text(MANIFEST))
    errors: list[str] = []

    verify_new_rules(errors, data)
    verify_semantic_patterns(errors, data)
    verify_required_text_groups(errors, data)

    if errors:
        print("FAIL artifact-placeholders-and-puffery")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS artifact-placeholders-and-puffery")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
