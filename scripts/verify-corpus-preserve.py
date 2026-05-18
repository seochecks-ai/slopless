#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
FIXTURE_ROOT = ROOT / "behavior/fixtures/textlint-rules"
CASES_ROOT = FIXTURE_ROOT / "cases"
CORPUS_ROOT = FIXTURE_ROOT / "corpus"
RECEIVED_OUTPUT = ROOT / ".fixture3/textlint-rules/received.normalized.json"
DOCUMENT_LEVEL_RULES = {
    "avg-sentence-length",
    "coleman-liau",
    "flesch-kincaid",
    "gunning-fog",
    "paragraph-length",
    "recommended-terms",
    "required-terms",
    "word-repetition",
}


def read_case_entries() -> set[tuple[str, str, str]]:
    entries: set[tuple[str, str, str]] = set()
    for path in sorted(CASES_ROOT.glob("*/*.md")):
        family = path.parent.name
        bucket = path.stem
        for line in path.read_text(encoding="utf-8").splitlines():
            text = line.strip()
            if text:
                entries.add((family, bucket, text))
    return entries


def read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path}: preserve file must contain a JSON object")
    return data


def read_received_results() -> list[dict[str, Any]]:
    data = json.loads(RECEIVED_OUTPUT.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError(f"{RECEIVED_OUTPUT}: received output must contain a JSON list")

    results: list[dict[str, Any]] = []
    for index, item in enumerate(data):
        if not isinstance(item, dict):
            raise ValueError(f"{RECEIVED_OUTPUT}: result[{index}] must be an object")
        results.append(item)
    return results


def rule_ids_for(results: list[dict[str, Any]], path_part: str) -> set[str]:
    rule_ids: set[str] = set()
    for result in results:
        file_path = result.get("filePath")
        if not isinstance(file_path, str) or path_part not in file_path:
            continue

        messages = result.get("messages")
        if not isinstance(messages, list):
            raise ValueError(f"{RECEIVED_OUTPUT}: messages for {file_path} must be a list")

        for message in messages:
            if not isinstance(message, dict):
                raise ValueError(f"{RECEIVED_OUTPUT}: message for {file_path} must be an object")

            rule_id = message.get("ruleId")
            if isinstance(rule_id, str) and rule_id not in DOCUMENT_LEVEL_RULES:
                rule_ids.add(rule_id)
    return rule_ids


def main() -> int:
    case_entries = read_case_entries()
    preserved_entries: set[tuple[str, str, str]] = set()
    errors: list[str] = []

    for preserve_path in sorted(CORPUS_ROOT.glob("*.preserve.json")):
        data = read_json(preserve_path)
        corpus_name = data.get("corpus")
        if not isinstance(corpus_name, str):
            errors.append(f"{preserve_path}: corpus must be a string")
            continue

        corpus_path = preserve_path.with_name(corpus_name)
        if not corpus_path.exists():
            errors.append(f"{preserve_path}: missing corpus file {corpus_name}")
            continue

        corpus_text = corpus_path.read_text(encoding="utf-8")
        preserve = data.get("preserve")
        if not isinstance(preserve, list):
            errors.append(f"{preserve_path}: preserve must be a list")
            continue

        for index, item in enumerate(preserve):
            if not isinstance(item, dict):
                errors.append(f"{preserve_path}: preserve[{index}] must be an object")
                continue

            family = item.get("family")
            bucket = item.get("bucket")
            text = item.get("text")
            if not isinstance(family, str) or not isinstance(bucket, str) or not isinstance(text, str):
                errors.append(f"{preserve_path}: preserve[{index}] needs family, bucket, and text strings")
                continue

            entry = (family, bucket, text)
            if entry not in case_entries:
                errors.append(f"{preserve_path}: preserve[{index}] is not present in cases: {entry!r}")
            if text not in corpus_text:
                errors.append(f"{preserve_path}: preserve[{index}] text missing from {corpus_name}: {text!r}")
            preserved_entries.add(entry)

    missing = case_entries - preserved_entries
    for family, bucket, text in sorted(missing):
        errors.append(f"missing preserved case: {family}/{bucket}: {text!r}")

    if RECEIVED_OUTPUT.exists():
        results = read_received_results()
        case_rule_ids = rule_ids_for(results, "/cases/")
        corpus_rule_ids = rule_ids_for(results, "/corpus/")
        missing_rule_ids = case_rule_ids - corpus_rule_ids
        for rule_id in sorted(missing_rule_ids):
            errors.append(f"corpus missing case rule id: {rule_id}")

    if errors:
        for error in errors:
            print(error)
        return 1

    print(f"preserved cases: {len(preserved_entries)}")
    print(f"corpus files: {len(list(CORPUS_ROOT.glob('*.md')))}")
    if RECEIVED_OUTPUT.exists():
        print(f"case rule ids: {len(rule_ids_for(results, '/cases/'))}")
        print(f"corpus rule ids: {len(rule_ids_for(results, '/corpus/'))}")
    print("status: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
