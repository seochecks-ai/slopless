#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / ".plans/2026-05-19-165026-fresh-slop-corpus-expansion.md.manifest.toml"


def fail(message: str) -> None:
    print(f"FAIL fresh-slop-corpus: {message}")
    sys.exit(1)


def markdown_case_lines(path: Path) -> list[str]:
    lines: list[str] = []
    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if set(line) <= {"-"}:
            continue
        lines.append(line)
    return lines


def word_count(path: Path) -> int:
    return len(re.findall(r"[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?", path.read_text()))


def main() -> None:
    manifest = tomllib.loads(MANIFEST.read_text())
    root = ROOT / manifest["root"]

    if not root.is_dir():
        fail(f"missing corpus root: {root.relative_to(ROOT)}")

    for row in manifest["required_path"]:
        path = ROOT / row["path"]
        if not path.exists():
            fail(f"missing required path: {row['path']}")

    text_files = [ROOT / row["path"] for row in manifest["text_angle"]]
    missing_texts = [path for path in text_files if not path.exists()]
    if missing_texts:
        missing = ", ".join(str(path.relative_to(ROOT)) for path in missing_texts)
        fail(f"missing text files: {missing}")

    actual_text_words = sum(word_count(path) for path in text_files)
    if len(text_files) < manifest["min_text_files"]:
        fail(f"text file count {len(text_files)} below {manifest['min_text_files']}")
    if actual_text_words < manifest["min_text_words"]:
        fail(f"text word count {actual_text_words} below {manifest['min_text_words']}")

    total_cases = 0
    for family in manifest["family"]:
        hit_path = ROOT / family["hit_path"]
        no_hit_path = ROOT / family["no_hit_path"]
        if not hit_path.exists():
            fail(f"missing hit file for {family['name']}: {family['hit_path']}")
        if not no_hit_path.exists():
            fail(f"missing no-hit file for {family['name']}: {family['no_hit_path']}")

        hit_count = len(markdown_case_lines(hit_path))
        no_hit_count = len(markdown_case_lines(no_hit_path))
        if hit_count < manifest["min_hit_cases_per_family"]:
            fail(f"{family['name']} hit count {hit_count} below {manifest['min_hit_cases_per_family']}")
        if no_hit_count < manifest["min_no_hit_cases_per_family"]:
            fail(f"{family['name']} no-hit count {no_hit_count} below {manifest['min_no_hit_cases_per_family']}")
        total_cases += hit_count + no_hit_count

    if total_cases < manifest["min_total_edge_cases"]:
        fail(f"total edge cases {total_cases} below {manifest['min_total_edge_cases']}")

    accidental_fixture_paths = [
        path
        for path in (ROOT / "behavior" / "fixtures").glob("**/*fresh-slop*")
        if path.is_file()
    ]
    if accidental_fixture_paths:
        paths = ", ".join(str(path.relative_to(ROOT)) for path in accidental_fixture_paths)
        fail(f"generated corpus leaked into behavior fixtures: {paths}")

    print("PASS fresh-slop-corpus")
    print(f"text files: {len(text_files)}")
    print(f"text words: {actual_text_words}")
    print(f"edge cases: {total_cases}")


if __name__ == "__main__":
    main()
