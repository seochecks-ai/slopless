# CI G3TS Compatibility

## Summary

Fixed the validation script so it works with both the newer local `g3ts validate workspace --path . --rules-only` CLI and the older locked CI `g3ts validate --path . --rules-only` CLI.

## Decisions Made

- Added a command fallback instead of changing the CI installer because the workflow installs `g3ts` from the locked Guardrail3 repo and the local machine has a newer CLI shape.
- Kept the fallback after all local gates so the only changed behavior is the final G3TS invocation compatibility.

## Key Files For Context

- `package.json`
- `.github/workflows/ci.yml`

## Verification

- `npm run validate` locally uses the newer G3TS command and passes.
- GitHub CI should use the fallback old command after the newer command is rejected.

## Next Steps

- Push to `development` and re-run PR checks.
