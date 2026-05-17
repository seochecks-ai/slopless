# Source Material Capture Plan

## Goal

Create a local source-material archive for known slop, cliches, wordiness, bad prose, LLM vocabulary, and style-guide avoid lists. The archive must preserve provenance and make later rule work possible without searching the web again.

## Approach

- Add `data/source-material/` as the raw research/input area, separate from shipped rule lexicons under `src/families/*/data`.
- Store each source in its own folder with a `README.md` that records upstream URL, fetched files, item counts where practical, likely Slopless use, and caveats.
- Download raw source files where the upstream exposes machine-readable files.
- Convert sources that are only PDFs or web pages into Markdown notes with source links and extracted relevant lists where practical.
- Add a top-level index so later work can decide which sources become direct lexicons and which become pattern/template material.

## Key Decisions

- Do not import these sources into active rules in this change. This task captures source material only.
- Keep empirical LLM lists separate from traditional style-guide lists because their false-positive behavior differs.
- Keep academic tortured-phrase material separate because it is domain-specific.

## Files To Modify

- `data/source-material/**`
- `.plans/2026-05-17-125853-source-material-capture.md`
- `.worklogs/<timestamp>-source-material-capture.md`
