# Redundancy Patterns Not Implemented

## Source File Paths Used

- `data/source-material/prose-linters/proselint/proselint/checks/redundancy/misc.py`
- `data/source-material/prose-linters/proselint/proselint/checks/redundancy/garner`
- `data/source-material/prose-linters/proselint/proselint/checks/redundancy/after-the-deadline`
- `data/source-material/prose-linters/npm-packages/too-wordy-0.3.6/too-wordy.js`
- `data/source-material/style-guides/microsoft/rules/Wordiness.yml`
- `data/source-material/style-guides/elastic/rules/Wordiness.yml`

## Not Implemented

- `absolute necessity`
- `complete stranger`
- `emergency situation`
- `software program`
- `consolidate together`
- `consolidates together`
- `consolidated together`
- `couple together`
- `couples together`
- `coupled together`
- `meld together`
- `melds together`
- `melded together`
- `mingle together`
- `mingles together`
- `mingled together`
- `pool together`
- `pools together`
- `pooled together`

## Why Not Implemented

- The implemented redundancy rule uses fixed pairs and small verb slots that already have hit/no-hit coverage.
- These remaining pairs need more no-hits because several can be normal in technical or literal contexts.
- `software program` is especially risky in educational prose and older documentation.
- `continue on` can be idiomatic navigation or UI copy.

## Required Fixture Work Before Implementation

- Add no-hits for UI navigation, literal pooling, physical coupling, emergency-response terminology, and educational software prose.
- Add hits only where the repeated meaning is clear.
- Keep matching exact phrases, not general adjective-plus-noun redundancy.
