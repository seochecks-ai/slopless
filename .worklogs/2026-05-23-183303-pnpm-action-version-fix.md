# Drop pnpm version from action-setup

## Summary

CI broke after the pnpm 10 → 11 bump in the previous commit. `pnpm/action-setup@v4` refuses to accept both `version:` in the action config AND `packageManager:` in `package.json` when they differ by any suffix. Corepack appended an integrity hash to `packageManager` (`pnpm@11.2.2+sha512.36e6621f...`) when we activated 11.2.2 locally, which made the two specifiers no longer match the action's strict comparison.

## Fix

Remove the `version:` field from `pnpm/action-setup@v4` in both `ci.yml` and `release.yml`. The action now reads `packageManager` from `package.json` as the sole source of truth, which is the recommended modern pattern (the integrity hash also pins the binary).

## Next steps

CI on the PR should turn green; merge as before.
