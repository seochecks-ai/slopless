#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
import tomllib
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / ".plans/2026-05-19-141613-adversarial-widening-pass.md.manifest.toml"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def rows(data: dict[str, Any], key: str) -> list[dict[str, Any]]:
    value = data.get(key, [])
    if not isinstance(value, list):
        raise TypeError(f"manifest key {key} must be a list")
    return [row for row in value if isinstance(row, dict)]


def preserve_path_for(corpus_path: Path) -> Path:
    return corpus_path.with_suffix(".preserve.json")


def preserve_has_entry(path: Path, family: str, bucket: str, text: str) -> bool:
    data = json.loads(read_text(path))
    preserve = data.get("preserve")
    if not isinstance(preserve, list):
        return False
    for item in preserve:
        if not isinstance(item, dict):
            continue
        if (
            item.get("family") == family
            and item.get("bucket") == bucket
            and item.get("text") == text
        ):
            return True
    return False


def verify_case_line(errors: list[str], row: dict[str, Any]) -> None:
    family = str(row["family"])
    bucket = str(row["bucket"])
    case_path = ROOT / str(row["path"])
    corpus_path = ROOT / str(row["corpus"])
    text = str(row["text"])

    if not case_path.is_file():
        errors.append(f"missing case file: {case_path.relative_to(ROOT)}")
        return
    if not corpus_path.is_file():
        errors.append(f"missing corpus file: {corpus_path.relative_to(ROOT)}")
        return

    case_lines = set(read_text(case_path).splitlines())
    if text not in case_lines:
        errors.append(f"{case_path.relative_to(ROOT)} missing exact line: {text}")

    if text not in read_text(corpus_path):
        errors.append(f"{corpus_path.relative_to(ROOT)} missing text: {text}")

    preserve_path = preserve_path_for(corpus_path)
    if not preserve_path.is_file():
        errors.append(f"missing preserve file: {preserve_path.relative_to(ROOT)}")
        return
    if not preserve_has_entry(preserve_path, family, bucket, text):
        errors.append(
            f"{preserve_path.relative_to(ROOT)} missing preserve entry: {family}/{bucket}: {text}"
        )


def verify_rule_widening(errors: list[str], row: dict[str, Any]) -> None:
    path = ROOT / str(row["path"])
    if not path.is_file():
        errors.append(f"missing rule file: {path.relative_to(ROOT)}")
        return

    source = read_text(path)
    for required in row["required_text"]:
        if str(required) not in source:
            errors.append(f"{path.relative_to(ROOT)} missing required text: {required}")


def main() -> int:
    data = tomllib.loads(read_text(MANIFEST))
    errors: list[str] = []

    for row in rows(data, "case_line"):
        verify_case_line(errors, row)
    for row in rows(data, "rule_widening"):
        verify_rule_widening(errors, row)

    if errors:
        print("FAIL adversarial-widening")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS adversarial-widening")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
