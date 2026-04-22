---
name: dev-workflow
description: Branches, lint/tests before PR, semver version bumps, and PR expectations for contentstack-management-javascript.
---

# Development workflow – Contentstack Management JavaScript SDK

## When to use

- Starting work or opening a PR.
- Choosing which npm scripts to run before push.
- Deciding whether to bump `package.json` version.

## Instructions

### Branches

- Follow team Git conventions (e.g. feature branches off **`development`** / integration branch used in this repo).
- Keep commits focused; do not commit with `test.only`, `it.only`, `describe.only`, or permanent skips.

### Before opening a PR

1. **`npm run lint`** — ESLint must pass on `lib` and `test`.
2. **Unit tests** — `npm run test:unit`. (`npm test` also runs `test:api` first — **confirm `test:api` is defined** in `package.json` on your branch.)
3. **Sanity / API tests** — only when validating against live CMA: **`npm run build`** then `npm run test:sanity-nocov` or `test:sanity-test`, with env vars per **`test/sanity-check/utility/testSetup.js`**. Never commit secrets.
4. **Version bump** — For user-visible or release-worthy **`lib/`** changes (new API, shipped fix, breaking change), update **`version`** in **`package.json`** per **semver** (**patch** / **minor** / **major**). Docs-only or chore-only PRs may omit per team practice.

### PR expectations (summary)

- **User-facing changes** — JSDoc on public methods; update **`types/**`** when the public surface changes.
- **Behavior** — Preserve backward compatibility unless the change is explicitly breaking and documented.
- **Errors** — Use **`lib/core/contentstackError.js`** patterns; do not leak full tokens in logs.
- **Tests** — Unit tests under **`test/unit/`** with mocks; for sanity env and commands, use the **testing** skill (listed in **`AGENTS.md`**).
