# Narrative Slop Candidates

## Source file paths used

- `data/source-material/llm-slop-lists/slop-forensics/slop_list_bigrams.json`
- `data/source-material/llm-slop-lists/slop-forensics/slop_list_trigrams.json`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_bigrams.json`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_trigrams.json`
- `data/source-material/llm-slop-lists/community-gists/chrisgherbert-chat-gpt-cliches.md`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.md`

## Candidate templates or exact phrases

- `{character} took a deep breath`
- `{character} let out a breath`
- `{heart} {poundedVerb} in {chest}`
- `{chill} ran down {spine}`
- `{shiver} ran down {spine}`
- `{voice} was barely a whisper`
- `{voice} was low`
- `{words} hung in the air`
- `{air} was thick with {abstractNoun}`
- `{lightSource} cast long shadows`
- `{days} turned into {weeks}`
- `{smile} played on {lips}`

## Slots

- `character`: pronoun or named character before the phrase, capped at 4 tokens.
- `heart`: `heart`, `pulse`
- `poundedVerb`: `pounded`, `raced`, `hammered`, `skipped`
- `chest`: `his chest`, `her chest`, `their chest`, `my chest`
- `chill`: `a chill`, `the chill`, `cold`
- `shiver`: `a shiver`, `the shiver`
- `spine`: `his spine`, `her spine`, `their spine`, `my spine`
- `voice`: `his voice`, `her voice`, `their voice`, `my voice`, `the voice`
- `words`: `the words`, `his words`, `her words`, `their words`
- `air`: `the air`, `the room`
- `abstractNoun`: `tension`, `fear`, `dread`, `anticipation`, `unease`
- `lightSource`: `the sun`, `the moon`, `the lamp`, `the fire`
- `days`: `days`
- `weeks`: `weeks`
- `smile`: `a smile`, `the smile`
- `lips`: `his lips`, `her lips`, `their lips`

## Risk controls

- Keep this family separate from general prose rules.
- Prefer passage density or repeated use before reporting ordinary physical actions.
- Do not flag a single breath or heartbeat when the surrounding sentence gives concrete consequence.
- Require exact phrase frames from the source ngrams.
- Add no-hit cases for medical, sports, and literal scene descriptions.

## Hit example lines

- `Mara took a deep breath before answering the impossible question.`
- `His heart pounded in his chest as the door opened.`
- `The words hung in the air between them.`
- `The air was thick with tension after the confession.`

## No-hit example lines

- `The nurse asked Mara to take a deep breath before the spirometry test.`
- `His heart pounded at 152 beats per minute during the sprint interval.`
- `The banner hung in the air shaft on two steel hooks.`
- `The air was thick with smoke from the failed kiln vent.`
