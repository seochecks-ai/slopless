# Summary

Removed the `scripts/validate-g3ts.sh` wrapper and removed it from `pnpm run validate`. G3TS is now run manually through the installed CLI instead of through a repo-owned wrapper.

# Decisions Made

- Deleted the wrapper because it hid some G3TS families by selecting only adopted checks.
- Did not add replacement package scripts for direct G3TS commands.
- Kept `pnpm run validate` focused on this package's build, lint, format, spelling, and type-coverage checks.

# Key Files For Context

- `package.json`
- `scripts/validate-g3ts.sh`

# Verification

- `g3ts validate repo --path . --inventory`
- `g3ts validate workspace --path . --inventory`
- `pnpm run validate`

# Next Steps

- Fix the direct G3TS workspace package/npmrc findings in a separate change.
