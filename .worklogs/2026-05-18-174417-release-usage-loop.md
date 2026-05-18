# Release Usage Loop

## Summary

Moved the intended Slopless usage loop to the front of the README and bumped the package to `0.2.8` for release.

## Decisions Made

- Put install and skill install commands immediately after the product summary.
- Documented the intended agent workflow as install, install skill, tell the writing agent to use the skill, iterate until Slopless passes.
- Bumped `package.json`, `package-lock.json`, and CLI `VERSION` together so `npx slopless --version` matches the published package.

## Key Files For Context

- `README.md`
- `package.json`
- `package-lock.json`
- `src/cli.ts`

## Verification

- `npm run validate` passed.
- `scripts/fixture3.sh check --suite textlint-rules` passed with `status: matched`.
- `scripts/verify-all.sh` passed.

## Next Steps

- Merge `development` into `main`.
- Publish `slopless@0.2.8` to npm.
