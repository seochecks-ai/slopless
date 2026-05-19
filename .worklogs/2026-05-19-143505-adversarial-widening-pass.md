# Summary

Added a manifest-controlled adversarial widening pass for semantic thinness, syntactic patterns, and narrative slop. The pass adds hard positive cases, adversarial no-hit controls, matching corpus prose, preservation metadata, widened rules, a verifier, and approved Fixture3 output.

# Decisions Made

- Added no-hit controls before widening so broad rules had concrete failure cases.
- Kept body, perception, and action signals density-based instead of reporting single cues.
- Widened existing families instead of adding a new rule family.
- Split same-sentence contrast matching into a private module to keep the main rule under the 400-line lint limit.
- Tightened concrete-evidence gates for the widened semantic and syntactic rules so the new no-hit controls stay clean.

# Key Files

- `.plans/2026-05-19-141613-adversarial-widening-pass.md`
- `.plans/2026-05-19-141613-adversarial-widening-pass.md.manifest.toml`
- `scripts/verify-adversarial-widening.py`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/no-hits.md`
- `src/rules/semantic-thinness/private/pattern-matcher.ts`
- `src/rules/syntactic-patterns/contrast/private/same-sentence-contrast.ts`
- `src/rules/narrative-slop/flat-action-cadence.ts`

# Verification

- `scripts/verify-adversarial-widening.py`
- `scripts/fixture3.sh check --suite textlint-rules`
- `scripts/verify-corpus-preserve.py`
- `scripts/verify-all.sh`
- `npm run validate`

# Behavior Review

- New no-hit findings: 0.
- Added findings after approval: 51.
- Added case findings include semantic thinness, same-sentence contrast, negation reframe, generic signposting, flat action cadence, body-action density, and perception density.
- Added corpus findings are expected because the new case lines were inserted into topic-relevant corpus prose.
- Removed findings are message/template replacements on existing slop lines plus a readability score change after adding corpus text.

# Next Steps

- Continue widening rule by rule using the same fixture-first flow.
- If future widening changes document-level readability scores again, separate corpus additions into shorter paragraphs before approval to avoid unrelated metric churn.
