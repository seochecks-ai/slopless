# LLM Artifacts Not Implemented

## Source File Paths Used

- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_phrases.jsonl`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/essays/slop_lists/slop_list_phrases.jsonl`
- `data/source-material/llm-slop-lists/community-gists/chrisgherbert-chat-gpt-cliches.md`
- `data/source-material/llm-slop-lists/community-gists/pvgomes-chatgpt-words.md`
- `data/source-material/llm-slop-lists/community-gists/miglen-gpt-instructions.md`

## Not Implemented

- `deeper into a specific aspect`

## Why Not Implemented

- The implemented response-wrapper rule already covers narrow assistant scaffolding, follow-up frames, and paragraph-start note wrappers.
- The remaining phrase is too incomplete to report by itself.

## Required Fixture Work Before Implementation

- Add no-hits where the phrase is part of literal discussion or specific exploration.
- Add hits only if surrounding assistant-scaffold context makes the phrase reportable.
