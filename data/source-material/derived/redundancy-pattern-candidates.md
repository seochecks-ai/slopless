# Redundancy Pattern Candidates

## Source file paths used

- `data/source-material/prose-linters/proselint/proselint/checks/redundancy/misc.py`
- `data/source-material/prose-linters/proselint/proselint/checks/redundancy/garner`
- `data/source-material/prose-linters/proselint/proselint/checks/redundancy/after-the-deadline`
- `data/source-material/prose-linters/npm-packages/too-wordy-0.3.6/too-wordy.js`
- `data/source-material/style-guides/microsoft/rules/Wordiness.yml`
- `data/source-material/style-guides/elastic/rules/Wordiness.yml`

## Candidate templates or exact phrases

- `{redundantModifier} {baseNoun}`
- `{joinVerb} together`
- `{repeatVerb} again`
- `{returnVerb} back`
- `{continueVerb} on`
- `surrounded on all sides`
- `throughout the entire`
- `while at the same time`
- `interact with each other`
- `the whole entire nation`

## Slots

- `redundantModifier + baseNoun`: `basic fundamentals`, `actual fact`, `true facts`, `future plans`, `free gift`, `serious crisis`, `close proximity`, `new innovation`, `absolute necessity`, `complete stranger`, `emergency situation`, `software program`, `visible to the eye`
- `joinVerb`: `blend`, `collaborate`, `combine`, `connect`, `consolidate`, `couple`, `gather`, `meld`, `merge`, `mingle`, `mix`, `pool`
- `repeatVerb`: `repeat`, `repeats`, `repeated`, `reiterate`, `reiterates`, `reiterated`, `restate`, `restates`, `restated`
- `returnVerb`: `refer`, `regress`, `repay`, `retreat`, `return`
- `continueVerb`: `continue`, `continues`, `continued`

## Risk controls

- Keep this to fixed pairs and small verb slots.
- Do not add a general adjective-plus-noun redundancy detector.
- Do not flag every use of `together`, `again`, `back`, or `on`.
- Require the redundant modifier and base noun in sequence for pair matches.
- Add no-hit cases for ordinary motion or direction, such as `came back`, `looked back`, and `walked together`.

## Hit example lines

- `The plan repeats the same migration step again.`
- `The memo promises a new innovation for scheduling.`
- `The services must merge together before the release.`
- `The file is surrounded on all sides by generated data.`

## No-hit example lines

- `The workers walked together after the meeting.`
- `The test failed again after the dependency update.`
- `The process came back online at noon.`
- `The outer wall surrounded the courtyard on the north side only.`
