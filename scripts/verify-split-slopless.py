#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
import tomllib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / ".plans/2026-05-16-213424-split-slopless-prosesmasher-repos.md.manifest.toml"


def fail(message: str) -> None:
    print(f"FAIL {message}")
    sys.exit(1)


def main() -> None:
    manifest = tomllib.loads(MANIFEST.read_text())

    for row in manifest.get("required_path", []):
        path = ROOT / row["path"]
        if not path.exists():
            fail(f"missing required path: {row['path']}")

    for row in manifest.get("forbidden_path", []):
        path = ROOT / row["path"]
        if path.exists():
            fail(f"forbidden path exists: {row['path']}")

    package = json.loads((ROOT / "package.json").read_text())
    package_lock = json.loads((ROOT / "package-lock.json").read_text())
    expected = manifest["package_json"]
    checks = {
        "name": package.get("name"),
        "repository_url": package.get("repository", {}).get("url"),
        "homepage": package.get("homepage"),
        "bugs_url": package.get("bugs", {}).get("url"),
        "bin_name": next(iter(package.get("bin", {}).keys()), None),
        "bin_path": package.get("bin", {}).get(expected["bin_name"]),
        "files": package.get("files"),
    }
    for key, actual in checks.items():
        expected_value = expected[key]
        if actual != expected_value:
            fail(f"package.json {key}: expected {expected_value!r}, got {actual!r}")

    version = package.get("version")
    lock_version = package_lock.get("version")
    package_entry_version = package_lock.get("packages", {}).get("", {}).get("version")
    if not isinstance(version, str) or not re.fullmatch(r"\d+\.\d+\.\d+", version):
        fail(f"package.json version is not a semver release version: {version!r}")
    if lock_version != version or package_entry_version != version:
        fail("package-lock.json version does not match package.json version")

    for row in manifest.get("forbidden_text", []):
        path = ROOT / row["path"]
        text = path.read_text()
        if row["pattern"] in text:
            fail(f"forbidden text {row['pattern']!r} found in {row['path']}")

    print("PASS split-slopless manifest")


if __name__ == "__main__":
    main()
