# Summary

Widened existing Slopless rules to catch the 2026 SEO know-how draft that previously passed clean. The draft now reports 16 findings across generic signposting, negation reframe, abstract metaphors, abstract personification, formulaic openers, and paired contrastive aphorisms.

# Decisions Made

- Widened existing rules instead of adding a new family.
- Kept the champagne line out of scope because the user explicitly allowed ignoring it.
- Added `--no-textlintrc` to the CLI invocation after direct verification exposed that target project `.textlintrc` files could break Slopless before bundled rules ran.
- Split meaning reframe detection into `meaning-reframe.ts` after validation showed `negation-reframe-matcher.ts` exceeded the 400-line limit.
- Accepted the new "The lesson was simple." generic-signposting hit in existing corpus output because it follows the same broadened `The X is Y` slop frame.

# Key Files For Context

- `.plans/2026-05-18-224354-widen-know-how-slop.md`
- `src/rules/semantic-thinness/patterns/abstract-metaphor-claim.json`
- `src/rules/semantic-thinness/patterns/abstract-personification-line.json`
- `src/rules/syntactic-patterns/contrast/private/meaning-reframe.ts`
- `src/rules/syntactic-patterns/contrast/private/block-negation-reframe.ts`
- `src/rules/syntactic-patterns/contrast/contrastive-aphorism.ts`
- `src/rules/syntactic-patterns/lead-ins/generic-signposting.ts`
- `src/rules/syntactic-patterns/lead-ins/llm-openers.ts`
- `src/cli.ts`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`
- `behavior/fixtures/textlint-rules/corpus/linkedin-ai-search.md`

# Verification

- `node dist/cli.js /Users/tartakovsky/Projects/websmasher/websmasher/content/linkedin/2026-05-18-2026-seo-know-how-linkedin-posts.md`
- `scripts/fixture3.sh check --suite textlint-rules`
- `scripts/verify-all.sh`
- `npm run validate`

# Next Steps

- Reinstall the package locally before checking this draft through the globally installed `slopless` binary.
