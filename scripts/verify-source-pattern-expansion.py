#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import tomllib
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = (
    ROOT / ".plans/2026-05-17-134353-source-pattern-expansion-plan.md.manifest.toml"
)
PACKAGE_JSON = ROOT / "package.json"
PRESET = ROOT / "src/presets/everything.ts"
BEHAVIOR_REPLAY = ROOT / "scripts/behavior-replay.sh"


def has_object_key(source: str, key: str) -> bool:
    return (
        f'"{key}"' in source
        or f"{key}:" in source
        or re.search(rf"(^|\s){re.escape(key)}\s*[,}}]", source) is not None
    )


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def as_rows(data: dict[str, Any], key: str) -> list[dict[str, Any]]:
    value = data.get(key, [])
    if not isinstance(value, list):
        raise TypeError(f"manifest key {key} must be a list")
    return [row for row in value if isinstance(row, dict)]


def package_exports() -> set[str]:
    package = json.loads(read_text(PACKAGE_JSON))
    exports = package.get("exports", {})
    if not isinstance(exports, dict):
        return set()
    return set(exports)


def replay_rulesdirs() -> set[str]:
    rulesdirs: set[str] = set()
    for line in read_text(BEHAVIOR_REPLAY).splitlines():
        stripped = line.strip()
        prefix = '--rulesdir "$ROOT/'
        if stripped.startswith(prefix) and stripped.endswith('"'):
            rulesdirs.add(stripped.removeprefix(prefix).removesuffix('"'))
    return rulesdirs


def check_path_exists(errors: list[str], label: str, path: str) -> None:
    full_path = ROOT / path
    if not full_path.exists():
        errors.append(f"missing {label}: {path}")


def check_contains(
    errors: list[str], label: str, path: str, needle: str, reason: str
) -> None:
    full_path = ROOT / path
    if not full_path.exists():
        errors.append(f"missing {label}: {path}")
        return
    if needle not in read_text(full_path):
        errors.append(f"{path} missing {reason}: {needle}")


def verify_manifest(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    exports = package_exports()
    preset_text = read_text(PRESET)
    replay_dirs = replay_rulesdirs()

    rule_ids: set[str] = set()

    for family in as_rows(data, "family"):
        family_id = str(family["id"])
        registry = str(family["registry"])
        check_path_exists(errors, "family registry", registry)
        check_path_exists(errors, "family hit cases", str(family["cases_hits"]))
        check_path_exists(errors, "family no-hit cases", str(family["cases_no_hits"]))
        rulesdirs = family.get("rulesdirs", [family.get("rulesdir")])
        if not isinstance(rulesdirs, list):
            errors.append(
                f"family {family_id} rulesdir/rulesdirs must be a list or string"
            )
            rulesdirs = []
        for rulesdir in rulesdirs:
            if not isinstance(rulesdir, str) or rulesdir not in replay_dirs:
                errors.append(
                    "scripts/behavior-replay.sh missing exact rulesdir "
                    f"for {family_id}: {rulesdir}"
                )

        index_export = family.get("index_export")
        if isinstance(index_export, str):
            check_contains(
                errors,
                "index",
                "src/index.ts",
                index_export,
                f"rules export for {family_id}",
            )

    for rule in as_rows(data, "rule"):
        rule_id = str(rule["id"])
        family_id = str(rule["family"])
        path = str(rule["path"])
        export = str(rule["export"])

        if rule_id in rule_ids:
            errors.append(f"duplicate rule id in manifest: {rule_id}")
        rule_ids.add(rule_id)

        check_path_exists(errors, "rule file", path)

        registry = str(rule.get("registry", "")) or next(
            (
                str(family["registry"])
                for family in as_rows(data, "family")
                if str(family["id"]) == family_id
            ),
            "",
        )
        if registry == "":
            errors.append(f"rule {rule_id} references unknown family {family_id}")
        else:
            registry_text = (
                read_text(ROOT / registry) if (ROOT / registry).exists() else ""
            )
            if not has_object_key(registry_text, rule_id):
                errors.append(f"{registry} missing {rule_id}")

        if export not in exports:
            errors.append(f"package.json missing export for {rule_id}: {export}")

        if (
            bool(rule.get("preset"))
            and f'"{rule_id}": true' not in preset_text
            and f"{rule_id}: true" not in preset_text
        ):
            errors.append(f"preset missing enabled rule: {rule_id}")

    for pattern in as_rows(data, "pattern_data"):
        pattern_path = str(pattern["path"])
        check_path_exists(errors, "pattern data", pattern_path)
        check_path_exists(errors, "source note", str(pattern["source_note"]))
        used_by = pattern.get("used_by", [])
        if not isinstance(used_by, list) or len(used_by) == 0:
            errors.append(f"pattern data {pattern_path} missing used_by")
            continue
        import_name = Path(pattern_path).name.removesuffix(".json")
        for rule_path in used_by:
            if not isinstance(rule_path, str):
                errors.append(
                    f"pattern data {pattern_path} has non-string used_by entry"
                )
                continue
            check_path_exists(errors, "pattern data consumer", rule_path)
            if (ROOT / rule_path).exists() and import_name not in read_text(
                ROOT / rule_path
            ):
                errors.append(
                    f"{rule_path} does not import/use pattern data {pattern_path}"
                )

    for corpus in as_rows(data, "fixture_corpus"):
        check_path_exists(errors, "fixture corpus", str(corpus["path"]))

    for forbidden in as_rows(data, "forbidden_rule"):
        rule_id = str(forbidden["id"])
        for relative in ["src", "package.json", "scripts", "behavior/fixtures"]:
            base = ROOT / relative
            paths = (
                [base]
                if base.is_file()
                else sorted(path for path in base.rglob("*") if path.is_file())
            )
            for path in paths:
                if rule_id in read_text(path):
                    errors.append(f"forbidden rule is present in {path.relative_to(ROOT)}: {rule_id}")
        if f"/{rule_id}" in json.dumps(sorted(exports)):
            errors.append(f"forbidden rule is exported: {rule_id}")

    return errors


def main() -> int:
    data = tomllib.loads(read_text(MANIFEST))
    errors = verify_manifest(data)

    if errors:
        print("FAIL source-pattern-expansion")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS source-pattern-expansion")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
