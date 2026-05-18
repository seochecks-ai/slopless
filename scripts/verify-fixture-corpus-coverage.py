#!/usr/bin/env python3
from __future__ import annotations

import json
import tomllib
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / ".plans/2026-05-18-095432-source-ledger-and-corpus-coverage.md.manifest.toml"


def fail(errors: list[str]) -> int:
    print("FAIL fixture-corpus-coverage")
    for error in errors:
        print(f"- {error}")
    return 1


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def manifest_rows(data: dict[str, Any], key: str) -> list[dict[str, Any]]:
    value = data.get(key, [])
    if not isinstance(value, list):
        raise TypeError(f"manifest key {key} must be a list")
    return [row for row in value if isinstance(row, dict)]


def non_empty_case_lines(case_root: Path) -> list[tuple[str, int, str, str, str]]:
    rows: list[tuple[str, int, str, str, str]] = []
    for path in sorted(case_root.glob("*/*.md")):
        family = path.parent.name
        bucket = path.stem
        source = str(path.relative_to(case_root.parent)).replace("\\", "/")
        for line_number, line in enumerate(read_text(path).splitlines(), 1):
            text = line.rstrip()
            if text.strip():
                rows.append((source, line_number, text, family, bucket))
    return rows


def preserve_items(corpus_root: Path) -> list[tuple[Path, dict[str, Any]]]:
    rows: list[tuple[Path, dict[str, Any]]] = []
    for path in sorted(corpus_root.glob("*.preserve.json")):
        data = json.loads(read_text(path))
        preserve = data.get("preserve")
        if not isinstance(preserve, list):
            raise TypeError(f"{path.relative_to(ROOT)} preserve must be a list")
        rows.extend((path, item) for item in preserve if isinstance(item, dict))
    return rows


def preserve_to_markdown_path(path: Path) -> Path:
    name = path.name
    if not name.endswith(".preserve.json"):
        raise ValueError(f"unexpected preserve filename: {path}")
    return path.with_name(f"{name.removesuffix('.preserve.json')}.md")


def message_signature(path: Path, message: dict[str, Any]) -> tuple[str, str, str]:
    rule_id = str(message.get("ruleId", ""))
    text = read_text(path)
    match_range = message.get("range")
    snippet = ""
    if (
        isinstance(match_range, list)
        and len(match_range) == 2
        and isinstance(match_range[0], int)
        and isinstance(match_range[1], int)
    ):
        snippet = text[match_range[0] : match_range[1]]
    return (rule_id, str(message.get("message", "")), snippet)


def verify_source_state(data: dict[str, Any], errors: list[str]) -> None:
    classified_paths = {
        str(row["path"]) for row in manifest_rows(data, "source_candidate_file")
    }
    for path in sorted((ROOT / "legacy/source-material/derived").glob("*.md")):
        relative = str(path.relative_to(ROOT))
        if relative not in classified_paths:
            errors.append(f"derived source file is not classified in manifest: {relative}")

    for row in manifest_rows(data, "source_candidate_file"):
        path = ROOT / str(row["path"])
        if not path.is_file():
            errors.append(f"missing source candidate file: {path.relative_to(ROOT)}")
            continue
        text = read_text(path)
        required = str(row["required_phrase"])
        forbidden = str(row["forbidden_phrase"])
        if required not in text:
            errors.append(f"{path.relative_to(ROOT)} missing required phrase: {required}")
        if forbidden in text:
            errors.append(f"{path.relative_to(ROOT)} still contains forbidden phrase: {forbidden}")
        if "Not Implemented" in text:
            errors.append(f"{path.relative_to(ROOT)} still contains obsolete Not Implemented wording")

    for row in manifest_rows(data, "source_ledger_section"):
        path = ROOT / str(row["path"])
        if not path.is_file():
            errors.append(f"missing source ledger file: {path.relative_to(ROOT)}")
            continue
        heading = str(row["heading"])
        if heading not in read_text(path):
            errors.append(f"{path.relative_to(ROOT)} missing ledger heading: {heading}")

    for row in manifest_rows(data, "source_ledger_phrase"):
        path = ROOT / str(row["path"])
        if not path.is_file():
            errors.append(f"missing source ledger file: {path.relative_to(ROOT)}")
            continue
        text = read_text(path)
        required = str(row["required_phrase"])
        forbidden = str(row["forbidden_phrase"])
        if required not in text:
            errors.append(f"{path.relative_to(ROOT)} missing ledger phrase: {required}")
        if forbidden in text:
            errors.append(f"{path.relative_to(ROOT)} still contains forbidden ledger phrase: {forbidden}")

    for row in manifest_rows(data, "source_note"):
        path = ROOT / str(row["path"])
        if not path.is_file():
            errors.append(f"missing source note: {path.relative_to(ROOT)}")
            continue
        text = read_text(path)
        required = str(row["required_phrase"])
        forbidden = str(row["forbidden_phrase"])
        if required not in text:
            errors.append(f"{path.relative_to(ROOT)} missing required phrase: {required}")
        if forbidden in text:
            errors.append(f"{path.relative_to(ROOT)} still contains forbidden phrase: {forbidden}")


def verify_case_text_in_corpus(
    case_rows: list[tuple[str, int, str, str, str]], corpus_root: Path, errors: list[str]
) -> None:
    corpus_texts = {
        path: read_text(path) for path in sorted(corpus_root.glob("*.md"))
    }
    for source, line_number, text, _family, _bucket in case_rows:
        if not any(text in corpus_text for corpus_text in corpus_texts.values()):
            errors.append(f"case line missing from corpus: {source}:{line_number}: {text}")


def verify_preserve_metadata(
    case_rows: list[tuple[str, int, str, str, str]], corpus_root: Path, errors: list[str]
) -> None:
    expected = Counter((source, line_number, text) for source, line_number, text, _family, _bucket in case_rows)
    expected_meta = {
        (source, line_number, text): (family, bucket)
        for source, line_number, text, family, bucket in case_rows
    }
    actual = Counter()

    for preserve_path, item in preserve_items(corpus_root):
        source = item.get("source")
        line = item.get("line")
        text = item.get("text")
        family = item.get("family")
        bucket = item.get("bucket")
        key = (source, line, text)
        actual[key] += 1

        if key not in expected_meta:
            errors.append(
                "preserve item does not match current case line: "
                f"{preserve_path.relative_to(ROOT)} -> {source}:{line}: {text}"
            )
            continue

        expected_family, expected_bucket = expected_meta[key]
        if family != expected_family or bucket != expected_bucket:
            errors.append(
                "preserve item has wrong family/bucket: "
                f"{preserve_path.relative_to(ROOT)} -> {source}:{line}"
            )

        corpus_text = read_text(preserve_to_markdown_path(preserve_path))
        if isinstance(text, str) and text not in corpus_text:
            errors.append(
                f"preserve text missing from owning corpus: {preserve_path.relative_to(ROOT)} -> {text}"
            )

    missing = expected - actual
    extra = actual - expected
    for source, line, text in missing:
        errors.append(f"missing preserve item for case line: {source}:{line}: {text}")
    for source, line, text in extra:
        errors.append(f"extra preserve item: {source}:{line}: {text}")


def verify_approved_output(data: dict[str, Any], errors: list[str]) -> None:
    rows = manifest_rows(data, "fixture_output")
    if len(rows) != 1:
        errors.append("manifest must contain exactly one fixture_output row")
        return

    row = rows[0]
    approved = ROOT / str(row["approved"])
    document_level_rules = set(row.get("document_level_rules", []))
    if not approved.is_file():
        errors.append(f"missing approved output: {approved.relative_to(ROOT)}")
        return

    case_messages: Counter[tuple[str, str, str]] = Counter()
    corpus_messages: Counter[tuple[str, str, str]] = Counter()
    for file_result in json.loads(read_text(approved)):
        path = Path(str(file_result["filePath"]))
        target = corpus_messages if "/corpus/" in str(path) else case_messages
        for message in file_result.get("messages", []):
            rule_id = str(message.get("ruleId", ""))
            if rule_id in document_level_rules:
                continue
            target[message_signature(path, message)] += 1

    missing = case_messages - corpus_messages
    for (rule_id, message, snippet), count in missing.items():
        errors.append(
            "case finding missing from corpus approved output: "
            f"{count} x {rule_id} | {message} | {snippet}"
        )


def main() -> int:
    data = tomllib.loads(read_text(MANIFEST))
    errors: list[str] = []

    verify_source_state(data, errors)

    case_rows_manifest = manifest_rows(data, "fixture_cases")
    corpus_rows_manifest = manifest_rows(data, "fixture_corpus")
    if len(case_rows_manifest) != 1 or len(corpus_rows_manifest) != 1:
        errors.append("manifest must contain exactly one fixture_cases row and one fixture_corpus row")
    else:
        case_root = ROOT / str(case_rows_manifest[0]["root"])
        corpus_root = ROOT / str(corpus_rows_manifest[0]["root"])
        case_rows = non_empty_case_lines(case_root)
        verify_case_text_in_corpus(case_rows, corpus_root, errors)
        verify_preserve_metadata(case_rows, corpus_root, errors)

    verify_approved_output(data, errors)

    if errors:
        return fail(errors)

    print("PASS fixture-corpus-coverage")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
