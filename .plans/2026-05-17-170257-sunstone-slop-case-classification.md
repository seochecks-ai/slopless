# Goal

Classify newly supplied Sunstone slop cases into rule-design categories and save them as source material for later rule updates.

# Approach

1. Create one plain Markdown file under `legacy/source-material/derived`.
2. Preserve every supplied example without rewriting the sentence text.
3. Group examples by the generalized pattern needed to catch them.
4. For each group, name the likely existing family and the generalized matching approach.
5. Mark all entries as not implemented because this change is classification only.

# Files To Modify

- `legacy/source-material/derived/sunstone-slop-cases.md`
- `.worklogs/<timestamp>-sunstone-slop-case-classification.md`

# Non-Goals

- Do not change rules.
- Do not change fixtures.
- Do not accept fixture output.
