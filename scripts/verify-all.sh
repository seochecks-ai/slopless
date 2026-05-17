#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

scripts/verify-source-material.py
scripts/verify-source-pattern-expansion.py
scripts/verify-sunstone-slop-rule-expansion.py
scripts/verify-emotion-substance-and-density-expansion.py
scripts/verify-negative-slop.py
scripts/verify-rules-reporting-architecture.py
scripts/verify-corpus-preserve.py
scripts/verify-split-slopless.py
