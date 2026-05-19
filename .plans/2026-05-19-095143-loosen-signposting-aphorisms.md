# Goal

Run an exploratory loosening pass for the two cautious rule areas from the previous change: generic `The X is Y` signposting and paired contrastive aphorisms. First inspect the intentionally over-broad output, then keep the broadening only where a reusable semantic gate removes ordinary concrete statements without adding exact exceptions.

# Approach

- Widen `generic-signposting`:
  - Let short `the/this/that/it ... is/are/was/were ...` evaluation frames match without requiring the subject noun to be in `FRAME_NOUNS`.
  - Expand evaluation tails beyond the previous small list.
- Widen `contrastive-aphorism`:
  - Remove the thin-object allowlist from `X gives you Y. Z gives you W.`
  - Remove the `fix` requirement from `X gets one ... Y gets another ...`
- Add reusable gates after the first run:
  - `generic-signposting` should require a discourse, decision, problem, solution, or deictic subject instead of any noun.
  - paired aphorisms should require an abstract/process subject or abstract outcome object instead of any concrete tool/output pair.
- Move reusable gate data into private helper files if the widened rule files exceed the repository line-count guardrail.
- Run the suite and accept the broadened fixture output only after the no-hit files remain clean.

# Files to modify

- `src/rules/syntactic-patterns/lead-ins/generic-signposting.ts`
- `src/rules/syntactic-patterns/contrast/contrastive-aphorism.ts`
- `src/rules/syntactic-patterns/lead-ins/private/discourse-evaluation.ts`
- `src/rules/syntactic-patterns/contrast/private/abstract-pair-gates.ts`

# Verification

- `npm run validate`
- `scripts/fixture3.sh check --suite textlint-rules`
- `scripts/verify-all.sh`
