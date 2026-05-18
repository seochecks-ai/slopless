# Summary

Classified the newly supplied Sunstone slop examples into generalized not-implemented rule-design groups.

No rule behavior or fixture output changed.

# Decisions Made

- Stored the material under `legacy/source-material/derived` because it is not implemented yet.
- Preserved the supplied sentence text and grouped it by catch strategy rather than by exact phrase.
- Separated prose examples from source notes so future implementation can turn notes into fixtures without treating notes as prose.
- Did not update rule data because this change is classification only.

# Key Files For Context

- `.plans/2026-05-17-170257-sunstone-slop-case-classification.md`
- `legacy/source-material/derived/sunstone-slop-cases.md`
- `legacy/source-material/README.md`
- `legacy/source-material/incorporation-record.md`

# Verification

- `scripts/verify-source-material.py`
- lifecycle/status term scan over source-material records
- `npm run format:check -- legacy/source-material/derived/sunstone-slop-cases.md`

# Next Steps

- Convert one group at a time into hit cases, no-hit controls, corpus prose, rule changes, and approved fixture output.
