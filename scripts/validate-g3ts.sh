#!/usr/bin/env bash
set -euo pipefail

if g3ts validate --help | grep -q "workspace"; then
  for family in \
    eslint \
    astro-content \
    astro-mdx \
    astro-seo \
    arch \
    tsconfig \
    jscpd \
    style \
    fmt \
    spelling \
    typecov; do
    g3ts validate workspace --path . --rules-only --family "$family"
  done
  exit 0
fi

exec g3ts validate --path . --rules-only
