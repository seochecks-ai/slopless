# Legacy Source Material

## Goal

Move exhausted research source material out of active product paths and stop GitHub Linguist from counting it as Slopless implementation language.

## Approach

- Add `.gitattributes` rules that mark legacy research material and generated build artifacts as vendored or generated for Linguist.
- Move `data/source-material` to `legacy/source-material`.
- Move `.plans/source-material` to `legacy/plans-source-material`.
- Update verifier scripts and path references so existing audit checks still work against the legacy location.
- Run validation that covers source-material verification and product checks.

## Key Decisions

- Keep the source material instead of deleting it because it is still the audit trail for source attribution and skipped-source decisions.
- Move it under `legacy/` because it is no longer product data.
- Keep verifier coverage for the legacy files because the incorporation record still depends on them being readable and complete.

## Files To Modify

- `.gitattributes`
- `data/source-material/**`
- `.plans/source-material/**`
- `legacy/source-material/**`
- `legacy/plans-source-material/**`
- `scripts/verify-source-material.py`
- `scripts/verify-fixture-corpus-coverage.py`
- `eslint.config.js`
- `cspell.config.json`
- source-material path references in tracked Markdown and TOML files
