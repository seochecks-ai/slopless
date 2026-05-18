# Summary

Added a dedicated semantic-thinness pattern for solution-like nouns framed as boring. The rule now catches frames such as "The strategy is boring:" while preserving ordinary no-hits such as "The audit is boring."

# Decisions Made

- Added `solution-boring-frame` as its own semantic pattern instead of folding it into `hollow-significance`.
- Kept the noun slot to solution-like nouns: answer, approach, choice, fix, method, option, plan, remedy, response, solution, strategy, tactic.
- Excluded path, route, and way because they commonly name literal movement.
- Removed common concrete-colon suppression from semantic-thinness guards. Broad patterns still reject concrete explanation tokens through pattern-specific guarding, while this wrapper can fire even when the colon contains concrete rewrite detail.
- Fixed an encountered CLI bug where an empty string path counted as a file target and could fall through to textlint.

# Key Files For Context

- `.plans/2026-05-18-202925-solution-boring-frame.md`
- `src/rules/semantic-thinness/patterns/solution-boring-frame.json`
- `src/rules/semantic-thinness/private/pattern-data-d.ts`
- `src/rules/semantic-thinness/private/concrete-guards.ts`
- `src/cli.ts`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/linkedin-ai-search.md`

# Verification

- `npm run build`
- `node dist/cli.js ""`
- Direct CLI check for solution-like boring hits and movie, party, audit, report, route no-hits
- `scripts/fixture3.sh check --suite textlint-rules`
- `scripts/fixture3.sh approve --suite textlint-rules --comment "Add solution-like boring frame"`
- `scripts/fixture3.sh check --suite textlint-rules`
- `scripts/verify-all.sh`
- `npm run validate`

# Next Steps

- Watch real draft output for ambiguous nouns like choice, option, response, and tactic. If they produce false positives, split the noun slot into strong unqualified nouns and qualified-only nouns.
