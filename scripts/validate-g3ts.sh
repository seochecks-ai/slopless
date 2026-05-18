#!/usr/bin/env bash
set -euo pipefail

if g3ts validate --help | grep -q "workspace"; then
  exec g3ts validate workspace --path . --rules-only
fi

exec g3ts validate --path . --rules-only
