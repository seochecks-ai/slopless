#!/usr/bin/env python3
from __future__ import annotations

import fnmatch
import tomllib
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / ".plans/2026-05-17-215328-negative-slop.md.manifest.toml"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def as_rows(data: dict[str, Any], key: str) -> list[dict[str, Any]]:
    value = data.get(key, [])
    if not isinstance(value, list):
        raise TypeError(f"manifest key {key} must be a list")
    return [row for row in value if isinstance(row, dict)]


def require_text(errors: list[str], path: Path, value: str) -> None:
    if not path.is_file():
        errors.append(f"missing file: {path.relative_to(ROOT)}")
        return
    if value not in read_text(path):
        errors.append(f"{path.relative_to(ROOT)} missing text: {value}")


def verify_required_text(errors: list[str], data: dict[str, Any]) -> None:
    for row in as_rows(data, "required_text"):
        path = ROOT / str(row["path"])
        for value in row.get("values", []):
            require_text(errors, path, str(value))


def verify_forbidden_tree_text(errors: list[str], data: dict[str, Any]) -> None:
    for row in as_rows(data, "forbidden_tree_text"):
        root = ROOT / str(row["root"])
        pattern = str(row["glob"])
        values = [str(value) for value in row.get("values", [])]
        for path in root.rglob("*"):
            if not path.is_file() or not fnmatch.fnmatch(str(path.relative_to(root)), pattern):
                continue
            text = read_text(path)
            for value in values:
                if value in text:
                    errors.append(f"{path.relative_to(ROOT)} contains forbidden text: {value}")


def main() -> int:
    data = tomllib.loads(read_text(MANIFEST))
    errors: list[str] = []
    verify_required_text(errors, data)
    verify_forbidden_tree_text(errors, data)

    if errors:
        print("FAIL negative-slop")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS negative-slop")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
