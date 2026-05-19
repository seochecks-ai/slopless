# Goal

Split the current mixed repository into two repositories.

- Current repository becomes `agent-quality-controls/prosesmasher`.
- New local Slopless repository contains only Slopless source, fixtures, fixture scripts, package metadata, README, and release docs.
- New GitHub repository becomes `agent-quality-controls/Slopless`.
- Slopless is released again from the new repository after package metadata and README point at the new home.

# Approach

1. Rename the current GitHub repository.
   - Rename `agent-quality-controls/slopless` to `agent-quality-controls/prosesmasher`.
   - Update the current local remote to the renamed repository.
2. Create a new Slopless local repository.
   - Use `/Users/tartakovsky/Projects/Slopless`.
   - Put the npm package at repository root.
   - Copy Slopless source from `packages/textlint-rules`.
   - Copy Slopless fixture corpus from `behavior`.
   - Copy Slopless fixture scripts that operate on textlint fixture output.
   - Copy recent Slopless plans and worklogs needed for cold-start context.
   - Copy root license and relevant ignore/config files.
3. Adapt Slopless for repo-root package layout.
   - Update package repository URL and remove nested `directory`.
   - Update fixture scripts from `packages/textlint-rules` paths to repo root paths.
   - Update README so it points at the new repo.
   - Bump npm package patch version.
4. Verify and release Slopless from the new repository.
   - Install dependencies.
   - Run package validation.
   - Run fixture verification where still applicable.
   - Pack and test local CLI install.
   - Publish npm patch release.
5. Create and push new GitHub repository.
   - Create `agent-quality-controls/Slopless`.
   - Push main branch and release tag.
6. Clean the renamed Prosesmasher repository.
   - Remove Slopless-only package, behavior fixtures, textlint scripts, and Slopless release plans/worklogs from the Prosesmasher working tree.
   - Commit and push cleanup to `agent-quality-controls/prosesmasher`.

# Files And Directories

Slopless new repo should include:

- `src/`
- `styles/`
- `behavior/`
- `scripts/behavior-replay.sh`
- `scripts/normalize-textlint-golden-output.py`
- `scripts/verify-corpus-preserve.py`
- `scripts/fixture3.sh`
- `package.json`
- `pnpm-lock.yaml`
- `README.md`
- `LICENSE`
- `fixture3.yaml`
- TypeScript/lint/spellcheck config files
- recent Slopless `.plans/` and `.worklogs/`

Prosesmasher renamed repo should keep Rust/prosesmasher material and old historical plans/worklogs not specific to Slopless npm release.
