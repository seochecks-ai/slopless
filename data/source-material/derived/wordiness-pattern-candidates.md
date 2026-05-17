# Wordiness Patterns Not Implemented

## Source File Paths Used

- `data/source-material/prose-linters/npm-packages/too-wordy-0.3.6/too-wordy.js`
- `data/source-material/style-guides/microsoft/rules/Wordiness.yml`
- `data/source-material/style-guides/elastic/rules/Wordiness.yml`
- `data/source-material/plain-english/extracted/plain-english-campaign-words-and-phrases-to-avoid.md`
- `data/source-material/plain-english/extracted/govuk-style-guide-words-to-avoid.md`
- `data/source-material/plain-english/extracted/gca-words-not-to-use.md`

## Not Implemented

- `for the duration of`
- `has the capacity to`
- `have the capacity to`
- `had the capacity to`
- `has the opportunity to`
- `have the opportunity to`
- `had the opportunity to`
- `conduct a review of`
- `perform a review of`
- `carry out a review of`
- `taken into account`
- `with the exception of`

## Why Not Implemented

- The implemented wordiness rule uses exact token templates that already have fixture coverage.
- Capacity and opportunity phrases can be semantically necessary in legal, clinical, accessibility, or scheduling prose.
- Review phrases can describe formal procedures.
- `taken into account` needs tense and surrounding-context coverage before activation.
- `with the exception of` can be precise legal or policy wording.

## Required Fixture Work Before Implementation

- Add no-hits for legal, policy, scheduling, and formal-review contexts.
- Add hits where a shorter phrase is clearly equivalent.
- Keep matching exact phrase spans only.
