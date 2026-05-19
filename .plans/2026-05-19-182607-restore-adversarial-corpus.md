# Goal

Restore the adversarial value lost in the fresh corpus actionability pass and fix rule false positives instead of deleting no-hit controls.

# Approach

1. Recover the previous generated edge-case files from commit `f5b9da8`.
2. Compare every recovered case against the current rewritten files.
3. Re-add missing cases to the same family file unless the case is actually a desired hit.
4. If a missing no-hit triggers its direct family, fix the rule at the correct boundary instead of deleting the no-hit.
5. Keep generated corpus material runnable by Slopless.
6. Do not expand fixture3 golden output into a monolithic file over the generated G3TS 1 MiB staged-file limit.
7. Record the 1 MiB golden limitation as a fixture storage issue, not a reason to bypass guardrails.

# Key Decisions

- No-hit cases are controls. They cannot be removed to make validation pass.
- A no-hit case can only move to hits when the sentence is actually slop under the library policy.
- Broad word rules need contextual matching. One-word direct bans are too broad for technical, quoted, code, measurement, and domain-specific uses.
- Generated hit diversity should be restored even when those cases do not all trigger today. Under-coverage is evidence for later rule widening.
- The G3TS 1 MiB cap is generated hook policy at `.githooks/pre-commit.d/g3ts`, not a fixture3 limit.

# Files To Modify

- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/**`
- `src/rules/words/prohibited-words.ts`
- `src/rules/words/llm-vocabulary.ts`
- `src/rules/words/llm-vocabulary-density.ts`
- `scripts/verify-fresh-corpus-actionability.py`
- `.plans/2026-05-19-173909-fresh-corpus-actionability.md.manifest.toml`
- `.worklogs/*`
