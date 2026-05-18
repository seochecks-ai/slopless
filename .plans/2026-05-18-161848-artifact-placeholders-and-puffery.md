# Artifact Placeholders And Puffery

## Goal

Implement the two agreed next areas from the 2026-05-18 research queue:

- artifact placeholders
- puffery and empty evaluative claim frames

## Approach

- Add `orthography:artifact-placeholders` as a new artifact rule.
  - Detect shipped residue such as OpenAI citation markers, sandbox paths, chatgpt UTM markers, unfinished bracket placeholders, `oai_citation`, and `Lorem ipsum`.
  - Check prose text and Markdown link URLs.
  - Skip code through textlint traversal and skip quoted examples where the artifact is only being discussed.

- Add a semantic-thinness pattern file for puffery and evaluative claim frames.
  - Implement bounded templates, not global bans on words like `renowned`, `excellent`, or `unprecedented`.
  - Use the existing semantic-thinness matcher.
  - Keep no-hit controls for cited, dated, quoted, or concrete evaluative language.

- Add cases and corpus coverage.
  - Minimal cases go into `cases/orthography` and `cases/semantic-thinness`.
  - Flowing corpus coverage goes into `editorial-style.md` and `engineering-review.md`.
  - Preserve metadata is updated for every new case.

- Add deterministic verification.
  - Create a manifest for the new rule, new semantic pattern, fixtures, and corpus lines.
  - Add a verifier and wire it into `scripts/verify-all.sh`.

## Key Decisions

- Artifact placeholders belong under `orthography` because they are shipped text artifacts, not prose style.
- Puffery belongs under `semantic-thinness` because the problem is empty evaluation without a concrete basis.
- Broad puffery words remain unsafe as standalone findings.
- If artifact placeholder examples expose colon-dramatic false positives, fix `colon-dramatic` to skip known machine artifact colons rather than accepting duplicate noise.

## Files To Modify

- `.plans/2026-05-18-161848-artifact-placeholders-and-puffery.md.manifest.toml`
- `scripts/verify-artifact-placeholders-and-puffery.py`
- `scripts/verify-all.sh`
- `src/rules/orthography/artifact-placeholders.ts`
- `src/rules/orthography/colon-dramatic.ts`
- `src/registries/orthography.ts`
- `src/presets/everything.ts`
- `package.json`
- `src/rules/semantic-thinness/patterns/puffery-evaluative-claim.json`
- `src/rules/semantic-thinness/private/pattern-data-d.ts`
- `behavior/fixtures/textlint-rules/cases/orthography/hits.md`
- `behavior/fixtures/textlint-rules/cases/orthography/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/editorial-style.md`
- `behavior/fixtures/textlint-rules/corpus/editorial-style.preserve.json`
- `behavior/fixtures/textlint-rules/corpus/engineering-review.md`
- `behavior/fixtures/textlint-rules/corpus/engineering-review.preserve.json`
