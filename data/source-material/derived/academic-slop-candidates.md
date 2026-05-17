# Academic Slop Not Implemented

## Source File Paths Used

- `data/source-material/academic-slop/tortured-phrases/extracted/cabanac-2021-concept-note.md`
- `data/source-material/academic-slop/tortured-phrases/problematic-paper-screener.md`
- `data/source-material/academic-slop/tortured-phrases/extracted/social-sciences-fingerprints-preview.md`
- `data/source-material/academic-slop/tortured-phrases/extracted/tortured-abbreviations-preview.md`
- `data/source-material/academic-slop/tortured-phrases/humanities-social-sciences-zenodo/20241114_social_sciences_fingerprints.csv`
- `data/source-material/academic-slop/tortured-phrases/humanities-social-sciences-zenodo/Tortured_abbreviations.csv`

## Not Implemented

- `casting a ballot`
- `casting a ballot system`
- `casting a ballot framework`
- `electronic democratic frameworks`
- `web-based democratic applications`
- `mystery casting a ballot`
- `political decision framework`
- `articulation of the desire`
- `weighted lion's share voting`
- `absolute intrigue`
- `monetary market contributors`
- `lawful mind`
- `bound together domain`
- `data innovation`
- `innovative work`
- `human immunodeficiency infection`

## Why Not Implemented

- Some strings are translation artifacts that can appear in quoted examples, legal discussion, or source titles.
- Some strings are near normal domain terms and need phrase-pair context before reporting.
- Abbreviation rows need a separate academic-only rule shape that can distinguish incorrect expansion from normal prose.
- The implemented rule currently uses only exact high-confidence tortured phrases with fixtures.

## Required Fixture Work Before Implementation

- Add hits for each exact tortured phrase selected.
- Add no-hits for the correct terms: `artificial intelligence`, `voting system`, `electoral integrity`, `information technology`, `research and development`, `HIV`, and `CCTV`.
- Add quote no-hits where the tortured phrase is discussed as an example.
