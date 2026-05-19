# Fresh Slop Corpus Expansion

Generated on 2026-05-19 for deterministic Slopless rule mining.

This folder is not behavior fixture data. It is a review corpus for discovering missed slop patterns and false-positive controls before moving selected material into `behavior/fixtures`.

## Structure

- `texts/`: long realistic prose samples in different slop-heavy styles.
- `edge-cases/hits/`: compact cases that should become future positive fixture material after review.
- `edge-cases/no-hits/`: compact adversarial controls that should remain clean after review.
- `analysis/`: first-pass notes on likely rule widenings and risks.

## Use

1. Run current Slopless against `texts/**/*.md` and `edge-cases/**/*.md`.
2. Compare misses against the intended hit files.
3. Compare reports against the intended no-hit files.
4. Move reviewed examples into `behavior/fixtures/textlint-rules/cases`.
5. Update corpus fixtures only after the case files are reviewed.
