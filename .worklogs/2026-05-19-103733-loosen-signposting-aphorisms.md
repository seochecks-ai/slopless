## Summary

Accepted the broadened signposting and contrastive aphorism detection that was tested against fixture3. The approved fixture output now includes the new true-positive findings from discourse-evaluation frames and abstract paired aphorisms.

## Decisions made

- Kept the widened "the/this/that/it X is Y" detector behind a discourse-subject gate instead of exact false-positive exceptions. This keeps "the solution is boring" and "the focus is practical" in scope while avoiding ordinary entity judgments such as movies or parties.
- Kept paired "gives you" and "gets one/another" detection behind abstract subject/object gates. This catches slogan-like business prose while avoiding literal measurement and medical-dose pairs.
- Moved the new gates into private helper modules because the widened files exceeded the repository max-lines guardrail. The helpers contain shared classification data and do not change reporting policy.

## Key files for context

- `src/rules/syntactic-patterns/lead-ins/generic-signposting.ts`
- `src/rules/syntactic-patterns/lead-ins/private/discourse-evaluation.ts`
- `src/rules/syntactic-patterns/contrast/contrastive-aphorism.ts`
- `src/rules/syntactic-patterns/contrast/private/abstract-pair-gates.ts`
- `behavior/golden/textlint-rules/approved.normalized.json`
- `.plans/2026-05-19-095143-loosen-signposting-aphorisms.md`

## Verification

- `npm run validate`
- `scripts/fixture3.sh check --suite textlint-rules`
- `scripts/verify-all.sh`

## Next steps

- Review other rules for overtightened gates, especially abstract metaphor claims, negation reframes, repeated predicate endings, LLM openers, and authority padding.
