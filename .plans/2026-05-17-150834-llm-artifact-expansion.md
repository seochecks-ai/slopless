# Goal

Expand existing LLM artifact detection without creating a new rule family.

The end state is stricter ownership:

- `phrases/llm-disclaimer` reports assistant identity, knowledge cutoff, and real-time access disclaimers.
- `syntactic-patterns/llm-artifacts/response-wrapper` reports chat wrapper and response scaffold language.
- No new fixture output is accepted in this change.

# Approach

1. Move response-scaffold candidates out of `llm-disclaimer` data.
   - Keep knowledge/capability phrases in `src/families/phrases/data/llm-disclaimer-expansions.json`.
   - Remove chat follow-up and scaffold phrases from that data to prevent duplicate or misleading rule ownership.

2. Add response-wrapper source data.
   - Create `src/families/syntactic-patterns/llm-artifacts/data/response-wrapper-patterns.json`.
   - Include exact sentence starts and contains patterns from `data/source-material/derived/llm-artifact-candidates.md`.
   - Keep this narrow: no single-word vocabulary and no broad topic slots.

3. Update `response-wrapper.ts`.
   - Preserve existing capability-wrapper logic.
   - Add source-derived exact starts and contains patterns.
   - Report the specific wrapper subtype and matched phrase.
   - Avoid matching quoted/link examples where the existing paragraph-sentence machinery makes that practical by only using sentence-start or narrow contains frames.

4. Add fixtures.
   - Add hit lines under `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`.
   - Add no-hit lines under `behavior/fixtures/textlint-rules/cases/syntactic-patterns/no-hits.md`.
   - Mirror the same material into existing corpus files with preserve entries only if needed for corpus parity.

5. Verify.
   - Run `npm run validate`.
   - Regenerate received fixture output for review only.
   - Run `scripts/verify-all.sh`.
   - Do not run fixture accept.

# Key Decisions

- No new `llm-artifacts` family: it already exists under syntactic patterns.
- No direct LLM vocabulary rule: broad word lists are too noisy as user-facing lint hits.
- No broad `delve` rule: only fixed chat-scaffold frames such as `let's delve into`.

# Files To Modify

- `src/families/phrases/data/llm-disclaimer-expansions.json`
- `src/families/syntactic-patterns/llm-artifacts/response-wrapper.ts`
- `src/families/syntactic-patterns/llm-artifacts/data/response-wrapper-patterns.json`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/no-hits.md`
- corpus/preserve files if parity verification requires it
- `data/source-material/incorporation-record.md`
