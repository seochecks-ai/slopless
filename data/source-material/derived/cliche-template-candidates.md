# Cliche Template Candidates

## Source file paths used

- `data/source-material/prose-linters/npm-packages/cliches-1.0.6/glossary.js`
- `data/source-material/prose-linters/npm-packages/no-cliches-0.3.6/cliches.js`
- `data/source-material/prose-linters/proselint/proselint/checks/cliches/misc.py`
- `data/source-material/prose-linters/proselint/proselint/checks/cliches/write-good`
- `src/families/phrases/data/cliches.json`
- `src/families/phrases/data/cliches.source.md`

## Candidate templates or exact phrases

- `{possessive} dirty laundry`
- `{possessive} eggs in one basket`
- `{possessive} head against a brick wall`
- `{possessive} chickens before they hatch`
- `{possessive} bubble`
- `{possessive} own horn`
- `{possessive} bridges`
- `{possessive} tongue`
- `{genderedPossessive} own shadow`
- `{genderedPossessive} sleeve`
- `{genderedPossessive} bite`
- `crying over {spilledWord} milk`

## Slots

- `possessive`: `my`, `your`, `his`, `her`, `their`, `our`
- `genderedPossessive`: `his`, `her`
- `spilledWord`: `spilled`, `spilt`

## Risk controls

- Convert only regex alternatives with closed slots.
- Reject broad `\w+` source patterns unless the surrounding idiom is long and specific.
- Preserve existing literal cliche entries and source documentation.
- Do not expand idioms that contain offensive, animal, or medical language without separate review.
- Add no-hit cases for literal laundry, literal baskets, literal bridges, and literal tongues.

## Hit example lines

- `The manager aired his dirty laundry during the review.`
- `The proposal puts all our eggs in one basket.`
- `She was banging her head against a brick wall with the vendor.`
- `Do not count your chickens before they hatch.`

## No-hit example lines

- `He washed his dirty laundry after the trip.`
- `The chef put our eggs in one basket for delivery.`
- `The builder inspected her head against a brick wall for clearance.`
- `The students counted their chickens before the eggs hatched in the incubator log.`
