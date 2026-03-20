---
description: "Branches, tests, and PR expectations for contentstack-management-javascript"
globs: ["**/*.js", "**/*.ts", "**/*.json", "**/*.mjs"]
alwaysApply: false
---

# Development workflow - Contentstack javascript CMA SDK

## Branches

- Follow team Git conventions (e.g. feature branches off `development` / default integration branch as used in this repo).
- Keep commits focused; do not commit with `test.only`, `it.only`, `describe.only`, or skipped tests meant to be permanent.

## Before opening a PR

1. **`npm run lint`** — ESLint must pass on `lib` and `test`.
2. **Unit tests** — `npm run test:unit` (default `npm test` also invokes `test:api` first — ensure that script exists in `package.json` on your branch).
3. **Sanity / API tests** — only when explicitly validating against live CMA: run `npm run test:sanity-nocov` or `test:sanity-test` after **`npm run build`**, with env vars documented in `test/sanity-check/utility/testSetup.js` (`EMAIL`, `PASSWORD`, `HOST`, `ORGANIZATION`, etc.). Never commit secrets.
4. **Version bump** — When the PR introduces **user-visible or release-worthy** `lib/` behavior (new API, bug fix shipped to npm, or a **breaking** change), update **`version`** in `package.json` per **semver**: **patch** (fixes, internal-compatible tweaks), **minor** (backward-compatible features or additive API), **major** (breaking public contract). Docs-only, tests-only, or chore-only changes often **omit** a bump if your team bumps only at release; follow team practice (some repos bump only on `main`/`release`). If unsure, ask the reviewer or match sibling PRs.

## PR expectations (summary)

- **User-facing changes** — JSDoc on public methods; update `types/**` when the public surface changes.
- **Behavior** — Preserve backward compatibility unless the change is explicitly breaking and documented.
- **Errors** — Route HTTP failures through existing patterns (`lib/core/contentstackError.js`-style handling); avoid leaking full tokens in logs (existing code redacts authtoken/authorization in error paths).
- **Tests** — Add or adjust unit tests under `test/unit/` for new behavior; use mocks (Sinon / Nock / axios-mock-adapter) rather than live API in unit tests.

## Quick links

- Agent overview: repo root `AGENTS.md`
- CMA SDK patterns: `skills/contentstack-javascript-cma/SKILL.md`
- HTTP / retry layer: `skills/framework/SKILL.md`
