# Goal

Move Slopless from `agent-quality-controls/slopless` to `seochecks-ai/slopless` with clean public references, matching repository settings, and a minimal `seochecks-ai` organization profile.

# Approach

1. Update public repository references in Slopless files:
   - `README.md`
   - `package.json`
   - `.github/ISSUE_TEMPLATE/config.yml`
   - `.github/CONTRIBUTING.md`
2. Keep historical plans, worklogs, and fixture golden paths unchanged.
3. Create `seochecks-ai/.github` because the new organization has no profile repository.
4. Transfer `agent-quality-controls/slopless` to `seochecks-ai/slopless`.
5. Update the local `origin` remote to the new GitHub URL.
6. Verify repository metadata after transfer:
   - issues enabled
   - discussions enabled
   - wiki enabled
   - homepage preserved
   - topics preserved
   - Actions enabled
   - vulnerability alerts enabled
   - `main` branch protection preserved
7. Update wiki links if the wiki contains old repository URLs.

# Key Decisions

- Do not move the local working tree in this migration. Fixture golden output currently contains absolute local file paths. Moving the folder would create unrelated fixture churn.
- Do not rewrite historical `.plans` or `.worklogs`. Those describe past repository locations and should remain historical records.
- Keep Guardrail3 links pointing to `agent-quality-controls/guardrail3` until that dependency is actually moved.
- Use this branding line in public copy: `Developed by seochecks.ai to keep content specific, useful, and recognizably human.`

# Files To Modify

- `README.md`
- `package.json`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/CONTRIBUTING.md`
- `.plans/2026-05-21-114145-seochecks-ai-migration.md`
- `.plans/2026-05-21-114145-seochecks-ai-migration.md.manifest.toml`
- `.plans/verify-2026-05-21-114145-seochecks-ai-migration.sh`
- `.worklogs/<timestamp>-seochecks-ai-migration.md`
