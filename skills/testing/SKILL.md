---
name: testing
description: How to run and extend tests — Mocha unit, sanity API, Jest TypeScript; env and mocks.
---

# Testing skill — `@contentstack/management`

## Commands (from `package.json`)

| Goal | Command |
|------|---------|
| Lint (pre-test hook) | `npm run lint` |
| Default `npm test` | Runs `test:api` then `test:unit` per `package.json` — **confirm `test:api` is defined** in your branch (it may be missing); otherwise use `test:unit` directly |
| Unit only | `npm run test:unit` — Mocha `test/unit/index.js`, **nyc** coverage |
| Unit JSON report | `npm run test:unit:report:json` |
| Sanity + coverage | `npm run test:sanity-test` |
| Sanity, no nyc | `npm run test:sanity-nocov` |
| TypeScript / Jest | `npm run test:typescript` |

Always **`npm run build`** before sanity if `dist/node/contentstack-management.js` must match `lib/` (sanity imports built output).

## Unit tests (`test/unit/`)

- **Mocha** + **Chai** + **@babel/register**; **30s** timeout per script.
- **HTTP**: mock with **Nock**, **axios-mock-adapter**, or stubs — **no live CMA**.
- Suites are **`require`d** from `test/unit/index.js` — add new `*-test.js` files and register them there.

## Sanity tests (`test/sanity-check/`)

- **Live** Contentstack CMA calls; orchestrated by `test/sanity-check/sanity.js`.
- **Env**: required variables and optional OAuth/Personalize keys are listed at the top of **`test/sanity-check/utility/testSetup.js`** (e.g. `EMAIL`, `PASSWORD`, `HOST`, `ORGANIZATION`).
- **Flow**: setup creates stack/management token/fixtures where applicable; teardown is handled in the same module — read it before adding destructive tests.

## Jest (`test/typescript/`)

- **`jest.config.js`**: `ts-jest`, coverage to `coverage/`.
- Use for TypeScript-first checks; keep in sync with public types if asserting SDK shape.

## Hygiene

- No committed **`only`** / **`skip`** on tests meant for CI.
- Never commit **real tokens** in tests or snapshots.
