# Slopless Agent Handoff

## What This Is

Slopless is an npm package and CLI for deterministic prose checks on Markdown.

The package name is `slopless`. Users install it with npm and run `npx slopless`. The CLI delegates parsing and reporting to textlint, loads Slopless rules internally, and always writes JSON.

## Current Public Surface

```bash
npm install -D slopless
npx slopless
npx slopless "docs/**/*.md"
npx slopless draft.md > slopless.json
```

Defaults:

- checks `**/*.md` when no path is passed
- output is always JSON
- exit `0` means no findings
- exit `1` means findings exist
- exit `2` means command failure
- no `.textlintrc.json` is required
- no separate `textlint` install is required

## Architecture

- `src/cli.ts`: thin JSON-only wrapper around textlint's CLI
- `src/index.ts`: textlint preset export
- `src/rules`: rule implementations grouped by family
- `src/reporting`: reusable report policies, including density thresholds
- `src/shared`: shared text traversal, matching, and normalization helpers
- `src/presets/everything.ts`: default enabled rule set
- `src/registries`: maps family rule IDs to rule modules
- `behavior/fixtures/textlint-rules`: case and corpus fixtures
- `scripts/behavior-replay.sh`: fixture3 runner
- `scripts/verify-corpus-preserve.py`: confirms corpus preserves reviewed cases

## Release

Patch releases are published from this repo root:

```bash
npm run validate
npm publish --dry-run --access public
npm publish --access public
```

After publishing, verify from a fresh temp project:

```bash
npm install -D slopless@<version>
npx slopless --help
npx slopless sample.md > result.json
```

## Rules

Slopless rules are deterministic. Do not add LLM calls, network calls, or non-repeatable checks.

Prefer textlint AST/source APIs and existing shared helpers over custom parsing.

Keep rule IDs stable. Published JSON consumers depend on them.

## Fixtures

Cases are reviewed minimal examples. Corpus files are readable prose that should cover all case behavior and may contain extra hits.

When changing rules or fixtures:

```bash
fixture3 check --feature textlint-rules
scripts/verify-corpus-preserve.py
npm run validate
```

Fixture approvals are split by family and corpus file so each approved JSON stays below the G3TS staged-file limit.
