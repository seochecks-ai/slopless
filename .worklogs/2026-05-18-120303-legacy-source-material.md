# Legacy Source Material

## Summary

Moved exhausted source research material out of active product paths into `legacy/` and added Linguist attributes so GitHub language stats reflect product code instead of research/vendor files.

## Decisions Made

- Kept source material instead of deleting it because `legacy/source-material/incorporation-record.md` is still the audit trail for attribution, implemented sources, and skipped sources.
- Moved `data/source-material` to `legacy/source-material` and `.plans/source-material` to `legacy/plans-source-material` because both are historical research material, not runtime or shipped product data.
- Marked `legacy/**` as vendored and `scripts/*.py` as generated for Linguist so HTML and Python research/tooling files do not dominate the public language chart.
- Updated verifier scripts and path references to use the new legacy locations.

## Key Files For Context

- `.gitattributes`
- `legacy/source-material/incorporation-record.md`
- `legacy/source-material/**`
- `legacy/plans-source-material/**`
- `scripts/verify-source-material.py`
- `scripts/verify-fixture-corpus-coverage.py`
- `.plans/2026-05-18-115950-legacy-source-material.md`

## Verification

- `scripts/verify-source-material.py`
- `scripts/verify-fixture-corpus-coverage.py`
- `scripts/verify-all.sh`
- `scripts/fixture3.sh check --suite textlint-rules`
- `npm run validate`
- `git ls-files 'data/source-material/**' '.plans/source-material/**' | wc -l` returned `0`.

## Next Steps

- Push `development` and let GitHub refresh Linguist language stats.
