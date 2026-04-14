# Contentstack Management JavaScript SDK – Agent guide

**Universal entry point** for anyone automating or assisting work in this repo—AI agents (Cursor, Copilot, CLI tools), reviewers, and contributors. Conventions and detailed guidance live in **`skills/*/SKILL.md`**, not in editor-specific config, so the same instructions apply whether or not you use Cursor.

## What this repo is

- **Name:** [`@contentstack/management`](https://www.npmjs.com/package/@contentstack/management) — [contentstack/contentstack-management-javascript](https://github.com/contentstack/contentstack-management-javascript.git)
- **Purpose:** JavaScript client for the **Content Management API (CMA)** — create, update, delete, and fetch content and stack configuration (users, orgs, branches, entries, assets, etc.) in a Contentstack account.
- **Out of scope:** This package is **not** the [Content Delivery API](https://www.contentstack.com/docs/developers/apis/content-delivery-api/) (CDA) read-only delivery client. Apps that only deliver content use a delivery SDK; this repo is for **management** operations.

## Tech stack (at a glance)

| Area | Details |
|------|---------|
| Language | JavaScript (ES modules in `lib/`); TypeScript declarations in `types/`; Jest smoke tests in `test/typescript/` |
| Runtime | Node `>=8` (`package.json` `engines`); README often recommends Node 10+ for development |
| Build | Babel (`lib/` → `dist/es5`, `dist/es-modules`); Webpack (`webpack/*.js`) → `dist/node`, `dist/web`, `react-native`, `nativescript` |
| Tests | **Mocha** + Chai + `@babel/register` + **nyc** — `test/unit/index.js`, `test/sanity-check/sanity.js`; **Jest** + `ts-jest` — `test/typescript/` (`jest.config.js`) |
| Lint / coverage | ESLint (`eslint-config-standard`, `@babel/eslint-parser`, `.eslintrc.js`); **nyc** in `package.json` |
| HTTP / JSON | **Axios**, **qs**, **`@contentstack/utils`** (e.g. `getContentstackEndpoint`) |

## Commands (quick reference)

```bash
npm install
npm run build
npm run lint
npm run test:unit
```

Sanity tests (live CMA — needs env from `test/sanity-check/utility/testSetup.js`; build first):

```bash
npm run build
npm run test:sanity-nocov   # or npm run test:sanity-test (with nyc)
```

Other scripts: `npm run test:typescript` (Jest), `npm run generate:docs` (JSDoc). Default `npm test` runs `test:api` then `test:unit` — **confirm `test:api` exists** in `package.json` on your branch; if missing, use `npm run test:unit`.

**CI / workflows:** [`.github/workflows/`](.github/workflows/) — e.g. `unit-test.yml`, `lint-check.yml`, `sca-scan.yml`, `check-version-bump.yml`, `check-branch.yml` (branch rules for PRs to `master`).

**Branch / PR:** feature branches typically target **`development`**; merging to **`master`** may be restricted — see `check-branch.yml` and team process.

## Where the real documentation lives: skills

Read these **`SKILL.md` files** for full conventions—**this is the source of truth** for implementation and review:

| Skill | Path | What it covers |
|-------|------|----------------|
| **Development workflow** | [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md) | Branches, lint/tests before PR, semver bump, PR expectations |
| **JavaScript & repo style** | [`skills/javascript-style/SKILL.md`](skills/javascript-style/SKILL.md) | ESLint standard style, `lib/` / `types/` layout, JSDoc, logging |
| **CMA SDK** | [`skills/contentstack-javascript-cma/SKILL.md`](skills/contentstack-javascript-cma/SKILL.md) | `contentstack.client()`, stack, auth, regions, `lib/stack/` patterns |
| **HTTP / transport** | [`skills/framework/SKILL.md`](skills/framework/SKILL.md) | `lib/core/` axios client, retries, concurrency, errors |
| **Testing** | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) | Mocha, sanity env vars, Jest, mocks vs live API |
| **Code review** | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) | PR checklist (API, errors, compat, deps/SCA, tests), optional Blocker/Major/Minor |

Each **`SKILL.md`** starts with **When to use** — open the skill that matches your task.

## Using Cursor

If you use **Cursor**, [`.cursor/rules/README.md`](.cursor/rules/README.md) only points to **`AGENTS.md`**—same source of truth as everyone else; no separate `.mdc` rule files in this repo.

When unsure about API behavior, use the [Content Management API](https://www.contentstack.com/docs/developers/apis/content-management-api/) docs and JSDoc in `lib/`.
