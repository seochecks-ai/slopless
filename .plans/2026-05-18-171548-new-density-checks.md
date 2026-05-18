# New Density And Structural Checks

## Goal

Implement the next researched checks using the refactored detector/reporting model.

Each rule should detect individual local signals first. One-to-one rules should report every detection. Density rules should report only when a reporting policy sees enough detections in a short span.

## Approach

- Add `formal-transition-density` as a density rule over formal transition openers.
- Add `repeated-sentence-starts` as a density rule over repeated sentence-start frames.
- Add `uncited-authority` as a one-to-one rule for authority claims with no nearby citation or named source.
- Add fixtures in family case files and corpus files.
- Review fixture output before accepting new golden output.

## Key Decisions

- Do not ban transition words one by one. A single "however" or "therefore" is normal.
- Do not flag repeated starts across long passages. The report policy should require a short paragraph/window.
- Do not flag all mentions of research. `uncited-authority` should require an authority phrase and absence of evidence markers.
- Keep all three under existing families unless implementation proves a new family is required.

## Files To Modify Later

- `src/rules/syntactic-patterns/lead-ins/formal-transition-density.ts`
- `src/rules/syntactic-patterns/repetition/repeated-sentence-starts.ts`
- `src/rules/syntactic-patterns/authority/uncited-authority.ts`
- `src/registries/syntactic-patterns/lead-ins.ts`
- `src/registries/syntactic-patterns/repetition.ts`
- `src/registries/syntactic-patterns/authority.ts`
- `src/presets/everything.ts`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/*.md`

