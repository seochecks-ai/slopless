# Narrative Slop Candidates

## Source File Paths Used

- `data/source-material/llm-slop-lists/slop-forensics/slop_list_bigrams.json`
- `data/source-material/llm-slop-lists/slop-forensics/slop_list_trigrams.json`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_bigrams.json`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_trigrams.json`
- `data/source-material/llm-slop-lists/community-gists/chrisgherbert-chat-gpt-cliches.md`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.md`

## Current State

No remaining narrative slop candidates are waiting in this file.

The previously listed breath, low-voice, and smile-played frames were implemented as density-gated candidate cues in `src/rules/narrative-slop/body-action-density.ts`.

## Implementation Boundary

- Breathing, low voice, and smiles are ordinary physical actions in isolation.
- They are reportable only through repeated body-cue density, not as one-off literal phrase matches.
- Medical, sports, performance, and task-oriented no-hits were added with the implementation.
