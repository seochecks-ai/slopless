# Academic Slop Candidates

## Source file paths used

- `data/source-material/academic-slop/tortured-phrases/extracted/cabanac-2021-concept-note.md`
- `data/source-material/academic-slop/tortured-phrases/problematic-paper-screener.md`
- `data/source-material/academic-slop/tortured-phrases/extracted/social-sciences-fingerprints-preview.md`
- `data/source-material/academic-slop/tortured-phrases/extracted/tortured-abbreviations-preview.md`
- `data/source-material/academic-slop/tortured-phrases/humanities-social-sciences-zenodo/20241114_social_sciences_fingerprints.csv`
- `data/source-material/academic-slop/tortured-phrases/humanities-social-sciences-zenodo/Tortured_abbreviations.csv`

## Candidate templates or exact phrases

- `counterfeit consciousness`
- `man-made reasoning`
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
- `data and interchanges innovation`
- `innovative work`
- `human immunodeficiency infection`
- `shut circuit tv`

## Slots

- No broad semantic slots for the first implementation.
- Optional closed abbreviation slot only when the source row provides it, such as `(AI)`, `(ICT)`, `(R&D)`, `(HIV)`, or `(CCTV)`.
- Optional case-folding because source rows mix title case and all caps.

## Risk controls

- Keep academic tortured phrases separate from general style families.
- Use exact known phrase pairs only.
- Do not classify normal scientific terminology as bad.
- Report the tortured phrase, not the expected phrase.
- Require source provenance for every phrase added to active data.
- Add no-hit cases for the correct terms: `artificial intelligence`, `voting system`, `electoral integrity`, `information technology`, and `research and development`.

## Hit example lines

- `The paper models counterfeit consciousness in autonomous planning agents.`
- `The survey describes a casting a ballot framework for local elections.`
- `The abstract calls the method man-made reasoning.`
- `The appendix discusses data and interchanges innovation in schools.`

## No-hit example lines

- `The paper models artificial intelligence in autonomous planning agents.`
- `The survey describes a voting system for local elections.`
- `The abstract calls the method machine reasoning.`
- `The appendix discusses information and communications technology in schools.`
