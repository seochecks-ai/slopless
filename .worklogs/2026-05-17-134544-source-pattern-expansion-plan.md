# Summary

Created a detailed plan for expanding archived slop source material into careful Slopless pattern rules.

The plan separates wordiness, redundancy, cliche templates, assistant artifacts, corporate abstraction, semantic thinness, narrative slop, academic slop, and LLM vocabulary so source-derived checks do not collapse into one vague rule family.

# Decisions Made

- Kept literal phrases, token templates, rhetorical sentence patterns, and word-level vocabulary as separate implementation paths.
- Recommended new `wordiness`, `redundancy`, and `assistant-artifacts` phrase rules because these report local spans.
- Recommended separate `narrative-slop` and `academic-slop` families only if fixture review proves they are precise enough.
- Rejected broad direct use of empirical LLM word lists because those words are too noisy as standalone findings.
- Deferred extracting a shared token-template matcher until at least two families need the semantic-thinness JSON matcher behavior.

# Key Files For Context

- `.plans/2026-05-17-134353-source-pattern-expansion-plan.md`
- `legacy/source-material/incorporation-record.md`
- `legacy/source-material/README.md`
- `src/families/semantic-thinness/private/pattern-matcher.ts`
- `src/shared/matchers/prose-patterns.ts`
- `behavior/fixtures/textlint-rules/cases/`
- `behavior/fixtures/textlint-rules/corpus/`

# Verification

- `npm run format:check`

# Next Steps

- Convert source material into `legacy/source-material/derived/*-candidates.md`.
- Implement the lowest-risk batch first: `wordiness`, `redundancy`, and `assistant-artifacts`.
- Run fixture3 after each batch and inspect the received normalized output before accepting.
