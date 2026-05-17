# LLM Artifact Candidates

## Source file paths used

- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_phrases.jsonl`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/essays/slop_lists/slop_list_phrases.jsonl`
- `data/source-material/llm-slop-lists/community-gists/chrisgherbert-chat-gpt-cliches.md`
- `data/source-material/llm-slop-lists/community-gists/pvgomes-chatgpt-words.md`
- `data/source-material/llm-slop-lists/community-gists/miglen-gpt-instructions.md`
- `src/families/phrases/llm-disclaimer.ts`
- `src/families/syntactic-patterns/llm-artifacts/response-wrapper.ts`

## Candidate templates or exact phrases

- `let's delve into`
- `okay, let's delve`
- `want me to delve deeper`
- `delve deeper into a specific aspect`
- `deeper into a specific aspect`
- `break this down step by step`
- `feel free to ask`
- `please let me know`
- `let me know if you have any questions`
- `let me know if you have any further questions`
- `hope this message finds you well`
- `anything else I can help`
- `last knowledge update`
- `knowledge cutoff date`
- `it's important to note`
- `it is important to note`
- `it's worth noting that`
- `it is worth noting`
- `this is not an exhaustive list`

## Slots

- `delveVerb`: `delve`, `dive`
- `followupVerb`: `ask`, `share`, `provide`
- `questionNoun`: `questions`, `further questions`, `clarification`
- `noteLead`: `it is`, `it's`
- `noteAdjective`: `important`, `worth`

## Risk controls

- Match exact phrase or narrow phrase templates only.
- Keep `as an AI language model` and direct capability disclaimers in `llm-disclaimer`.
- Keep response-scaffolding sentence starts in `response-wrapper`.
- Do not flag article text that quotes or discusses LLM artifacts.
- Add no-hit cases for literal exploration, customer-support copy, and quoted examples.

## Hit example lines

- `Okay, let's delve into the main themes of the novel.`
- `Feel free to ask if you need more examples.`
- `Please let me know if you have any further questions.`
- `My last knowledge update was in 2024.`

## No-hit example lines

- `The training page lists "please let me know" as a phrase to avoid.`
- `The diver will delve into the cave after the safety check.`
- `Support agents should ask customers whether they have any further questions.`
- `The changelog records the last knowledge update for the index file.`
