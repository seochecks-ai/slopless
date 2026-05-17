# Wordiness Pattern Candidates

## Source file paths used

- `data/source-material/prose-linters/npm-packages/too-wordy-0.3.6/too-wordy.js`
- `data/source-material/style-guides/microsoft/rules/Wordiness.yml`
- `data/source-material/style-guides/elastic/rules/Wordiness.yml`
- `data/source-material/plain-english/extracted/plain-english-campaign-words-and-phrases-to-avoid.md`
- `data/source-material/plain-english/extracted/govuk-style-guide-words-to-avoid.md`
- `data/source-material/plain-english/extracted/gca-words-not-to-use.md`

## Candidate templates or exact phrases

- `{causeLead} the fact that`
- `based on the fact that`
- `despite the fact that`
- `in spite of the fact that`
- `in view of the fact that`
- `at {timePoint} time`
- `during the {periodWord} of`
- `for the duration of`
- `{purposeLead} to`
- `{purposeLead} of`
- `{abilityVerb} the {abilityNoun} to`
- `{workVerb} a {reviewNoun} of`
- `{referenceVerb} reference to`
- `{takeVerb} into account`
- `until such time as`
- `the question as to whether`
- `with the exception of`

## Slots

- `causeLead`: `because of`, `due to`, `owing to`, `in light of`, `by virtue of`
- `timePoint`: `this point in`, `this moment in`, `the present`
- `periodWord`: `course`, `period`, `time`
- `purposeLead`: `in order`, `in an effort`, `as a means`, `for the purpose`
- `abilityVerb`: `has`, `have`, `had`
- `abilityNoun`: `ability`, `capacity`, `opportunity`
- `workVerb`: `conduct`, `perform`, `carry out`
- `reviewNoun`: `review`, `assessment`, `evaluation`, `investigation`
- `referenceVerb`: `make`, `made`
- `takeVerb`: `take`, `takes`, `took`, `taken`

## Risk controls

- Match exact token templates, not substrings.
- Report only the wordy phrase span.
- Do not import broad single words such as `however`, `objective`, `monitor`, `purchase`, `validate`, or `focus`.
- Keep plain-English government guidance as source evidence, not automatic default word bans.
- Add no-hit cases for technical uses where the phrase is literal or necessary.

## Hit example lines

- `We delayed the release due to the fact that the migration failed.`
- `The team met in order to review the incident.`
- `The report made reference to the retired endpoint.`
- `The policy remains active until such time as the board replaces it.`

## No-hit example lines

- `The fact that the migration failed changed the schedule.`
- `The committee issued an order to review the incident.`
- `The pointer stores a reference to the retired endpoint.`
- `The board will replace the policy when the review ends.`
