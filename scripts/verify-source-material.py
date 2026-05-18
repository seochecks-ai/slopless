#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import subprocess
import sys
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "legacy" / "source-material"


def fail(message: str) -> None:
    raise SystemExit(message)


def count_csv_rows(path: Path) -> int:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return sum(1 for _ in csv.reader(handle)) - 1


def count_lines(path: Path) -> int:
    return sum(1 for line in path.read_text(encoding="utf-8", errors="ignore").splitlines() if line.strip())


def require_file(relative: str) -> Path:
    path = DATA / relative
    if not path.is_file():
        fail(f"missing source-material file: {relative}")
    if path.stat().st_size == 0 and relative != "style-guides/google/rules/vocab.txt":
        fail(f"empty source-material file: {relative}")
    return path


def require_count(label: str, actual: int, expected: int) -> None:
    if actual != expected:
        fail(f"{label}: expected {expected}, got {actual}")


def verify_json_files() -> None:
    for path in DATA.rglob("*.json"):
        json.loads(path.read_text(encoding="utf-8"))


def verify_yaml_files() -> None:
    for path in list(DATA.rglob("*.yml")) + list(DATA.rglob("*.yaml")):
        yaml.safe_load(path.read_text(encoding="utf-8"))


def verify_no_failed_downloads() -> None:
    needles = ("404: Not Found", "Bad Gateway", "Invalid URL")
    for path in DATA.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".html", ".md", ".txt", ".csv", ".json", ".yml", ".yaml"}:
            text = path.read_text(encoding="utf-8", errors="ignore")
            for needle in needles:
                if needle in text:
                    fail(f"failed-download marker {needle!r} in {path.relative_to(ROOT)}")


def verify_counts() -> None:
    require_count(
        "berenslab excess_words rows",
        count_csv_rows(require_file("llm-excess-vocab/berenslab/excess_words.csv")),
        900
    )
    require_count(
        "detect-chatgpt lemma rows",
        count_csv_rows(require_file("llm-excess-vocab/detect-chatgpt/ges_selected_lemma.csv")),
        983
    )
    require_count(
        "llm-cliches adjectives",
        count_lines(require_file("llm-slop-lists/llm-cliches/adjectives.txt")),
        40
    )
    require_count(
        "llm-cliches nouns",
        count_lines(require_file("llm-slop-lists/llm-cliches/nouns.txt")),
        16
    )
    require_count(
        "llm-cliches verbs",
        count_lines(require_file("llm-slop-lists/llm-cliches/verbs.txt")),
        21
    )
    require_count(
        "detect-ai-text-easily lines",
        count_lines(require_file("llm-slop-lists/detect-ai-text-easily/ai_words.txt")),
        74
    )
    require_count(
        "slop-forensics root words",
        len(json.loads(require_file("llm-slop-lists/slop-forensics/slop_list.json").read_text(encoding="utf-8"))),
        1000
    )
    require_count(
        "slop-forensics root bigrams",
        len(json.loads(require_file("llm-slop-lists/slop-forensics/slop_list_bigrams.json").read_text(encoding="utf-8"))),
        200
    )
    require_count(
        "slop-forensics root trigrams",
        len(json.loads(require_file("llm-slop-lists/slop-forensics/slop_list_trigrams.json").read_text(encoding="utf-8"))),
        200
    )
    require_count(
        "slop-forensics essays phrases",
        count_lines(require_file("llm-slop-lists/slop-forensics/results_by_domain/essays/slop_lists/slop_list_phrases.jsonl")),
        2973
    )
    require_count(
        "slop-forensics varied-prompts phrases",
        count_lines(require_file("llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_phrases.jsonl")),
        2427
    )
    require_count(
        "style-guide YAML files",
        len(list((DATA / "style-guides").rglob("*.yml"))) + len(list((DATA / "style-guides").rglob("*.yaml"))),
        119
    )
    require_count(
        "proselint selected files",
        sum(1 for path in (DATA / "prose-linters" / "proselint").rglob("*") if path.is_file()),
        55
    )
    require_count(
        "npm prose source files",
        sum(1 for path in (DATA / "prose-linters" / "npm-packages").rglob("*") if path.is_file()),
        24
    )
    require_count(
        "HSS tortured fingerprints rows",
        count_csv_rows(require_file("academic-slop/tortured-phrases/humanities-social-sciences-zenodo/20241114_social_sciences_fingerprints.csv")),
        42
    )
    require_count(
        "HSS tortured abbreviation rows",
        count_csv_rows(require_file("academic-slop/tortured-phrases/humanities-social-sciences-zenodo/Tortured_abbreviations.csv")),
        121
    )


def verify_zip() -> None:
    path = require_file("academic-slop/tortured-phrases/cabanac-zenodo/20210721_TorturedPhrases_supplmat.zip")
    result = subprocess.run(["unzip", "-t", str(path)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        fail(f"invalid zip archive: {path.relative_to(ROOT)}\n{result.stderr}")


def verify_binary_implementation_state() -> None:
    text = require_file("derived/sunstone-slop-cases.md").read_text(encoding="utf-8")
    implemented_examples = [
        "It was no longer a target. It was noise.",
        "Liska turned her head. Her brown eyes looked tired. She crossed her arms over her chest and waited.",
        "The anger finally melted out of her posture.",
        "Remal walked over to the window. The heavy African golden cat stopped next to Cassia. He looked up at the small girl on the sill.",
        "The rest of the drill was a blur. Cassia tied her hitches with trembling paws. She didn't hear Marius's instructions."
    ]
    for example in implemented_examples:
        if example in text:
            fail(f"implemented example remains in not-implemented source material: {example}")


def main() -> None:
    if not DATA.is_dir():
        fail("missing legacy/source-material directory")
    verify_no_failed_downloads()
    verify_json_files()
    verify_yaml_files()
    verify_counts()
    verify_zip()
    verify_binary_implementation_state()
    print("source material verification passed")


if __name__ == "__main__":
    main()
