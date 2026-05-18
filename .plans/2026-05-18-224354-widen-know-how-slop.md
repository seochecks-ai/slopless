# Goal

Catch the slop still passing in `2026-05-18-2026-seo-know-how-linkedin-posts.md` by widening existing rules, not adding a new family or a pile of one-off rules.

# Approach

- Extend semantic-thinness pattern data:
  - `deictic-summary`: catch "That means X is the wrong level of question" and similar wrong-question summaries.
  - `hollow-significance`: catch "The focus is practical" through the existing hollow summary language.
  - `abstract-metaphor-claim`: catch abstract/business artifacts doing metaphor work, including `outsources its answer`, `wearing a nice jacket over an empty shirt`, `plumbing with consequences`, `trust filter`, and `another layer to the diagnosis`.
  - `abstract-personification-line` or emotional weather: catch abstract emotion/personification lines such as "sadness entered the room".
- Extend syntactic-pattern matchers:
  - `negation-reframe`: catch `That does not make X Y. It does mean Z.` as a meaning reframe variant.
  - `generic-signposting`: catch wrong/better operating question and grown-up answer frames.
  - `contrastive-aphorism`: catch paired `X gives you A. Y gives you B.` and `X gets one fix. Y gets another.` frames.
- Update case fixtures:
  - Add the new desired hits to semantic-thinness and syntactic-patterns case files.
  - Add no-hit controls where the widened pattern could plausibly overfire.
  - Put the new cases into the existing LinkedIn corpus fixture and preserve metadata.
- Verify:
  - Build and run the draft directly.
  - Run no-hit fixtures directly.
  - Run fixture3 check, approve expected fixture changes, then rerun fixture3.
  - Run `scripts/verify-all.sh` and `npm run validate`.

# Key decisions

- Do not add a new family. These are semantic-thinness, generic signposting, negation reframe, and contrastive aphorism problems.
- Prefer broad templates with constrained slots over exact sentence literals.
- Keep "Champagne almost happens" out of scope because the user explicitly allowed ignoring it.

# Files to modify

- `src/rules/semantic-thinness/patterns/*.json`
- `src/rules/syntactic-patterns/lead-ins/generic-signposting.ts`
- `src/rules/syntactic-patterns/contrast/contrastive-aphorism.ts`
- `src/rules/syntactic-patterns/contrast/private/negation-reframe-matcher.ts`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/linkedin-ai-search.md`
- `behavior/fixtures/textlint-rules/corpus/linkedin-ai-search.preserve.json`
