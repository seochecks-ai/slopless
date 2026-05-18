# Remaining Source Candidates

## Goal

Implement the remaining source-derived candidates that are precise enough to ship:

- redundancy exact phrases
- wordiness exact phrases
- narrative slop candidate phrases through density-gated reporting

Do not implement single-hit narrative bans for ordinary physical actions.

## Approach

1. Add the remaining redundancy phrases to `src/rules/phrases/data/redundancy-patterns.json`.
   - Keep exact phrase matching only.
   - Add hit and no-hit fixtures for emergency, software, literal pooling/coupling, and exact redundant phrases.

2. Add the remaining wordiness phrases to `src/rules/phrases/data/wordiness-patterns.json`.
   - Keep exact phrase matching only.
   - Add hit and no-hit fixtures for legal, policy, scheduling, capacity, opportunity, and formal review contexts.

3. Add narrative candidate phrases to `src/rules/narrative-slop/body-action-density.ts`.
   - Add them as candidate detections only.
   - Report only through the existing density policy in `src/reporting/report-density.ts`.
   - Add hit fixtures where the stock beats cluster.
   - Add no-hit fixtures where the same phrases are concrete, medical, performance, task-oriented, or isolated.

4. Update source tracking.
   - Remove newly implemented items from `legacy/source-material/derived/*.md`.
   - Update `legacy/source-material/incorporation-record.md`.
   - Update manifest checks if needed.

## Key Decisions

- Redundancy and wordiness are safe enough as exact phrase rules because the matcher already skips quoted examples and reports exact spans.
- Narrative candidates are not safe as exact single-sentence rules because breathing, voice level, and smiles are normal in prose.
- Density-gated narrative detection is the correct boundary because the existing reporting layer already owns repeated event reporting.

## Files To Modify

- `src/rules/phrases/data/redundancy-patterns.json`
- `src/rules/phrases/data/wordiness-patterns.json`
- `src/rules/narrative-slop/body-action-density.ts`
- `behavior/fixtures/textlint-rules/cases/phrases/hits.md`
- `behavior/fixtures/textlint-rules/cases/phrases/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/editorial-style.md`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.md`
- `legacy/source-material/derived/redundancy-pattern-candidates.md`
- `legacy/source-material/derived/wordiness-pattern-candidates.md`
- `legacy/source-material/derived/narrative-slop-candidates.md`
- `legacy/source-material/incorporation-record.md`
