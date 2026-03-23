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
- **Authoritative list:** variable names and defaults are documented in **`test/sanity-check/utility/testSetup.js`** (and mirrored in `sanity.js`); prefer that file when adding new env vars.

### Environment variables

**Required (core)** — setup fails or cannot run without these:

- `EMAIL`, `PASSWORD`, `HOST`, `ORGANIZATION`

Without them, login / stack creation / org-scoped setup does not complete.

**Required for specific suites** — related tests **skip** (or degrade) when missing:

| Area | Variables | Notes |
|------|-----------|--------|
| **OAuth** | `CLIENT_ID`, `APP_ID`, `REDIRECT_URI` | Used by `oauth-test.js` and auth flows that need app registration |
| **2FA (TFA)** | `TFA_EMAIL`, `TFA_PASSWORD` | `user-test.js` — skip TFA scenarios when unset |
| **MFA (TOTP)** | `MFA_SECRET` | `user-test.js` — MFA login path; optional asserts still run without it in some cases |
| **Team / stack share** | `MEMBER_EMAIL` | `team-test.js`, `stack-test.js` — avoids mutating the admin user; share tests skip if unset |
| **DAM 2.0** | `DAM_2_0_ENABLED=true` | `entry-test.js` — asset/DAM 2.0 block gated on this flag |

**Optional / config** (defaults exist; override when needed):

- `PERSONALIZE_HOST` — defaults to `personalize-api.contentstack.com` in setup  
- `DELETE_DYNAMIC_RESOURCES` — defaults to deleting dynamic stack/Personalize resources; set to `false` to keep them for debugging  

**Regions / hosts:** point `HOST` at the **API host** for the stack you are testing (e.g. regional or custom CMA host), consistent with `testSetup.js`.

**Runtime (not for .env check-in):** after setup, `testSetup` assigns `process.env.API_KEY`, `AUTHTOKEN`, `MANAGEMENT_TOKEN`, `PERSONALIZE_PROJECT_UID`, etc. Do not commit those; they are produced by the harness.

- **Flow**: setup creates stack, management token, and Personalize project where applicable; teardown reads `DELETE_DYNAMIC_RESOURCES`. Read **`testSetup.js`** before adding destructive or org-wide tests.

## Jest (`test/typescript/`)

- **`jest.config.js`**: `ts-jest`, coverage to `coverage/`.
- Use for TypeScript-first checks; keep in sync with public types if asserting SDK shape.

## Hygiene

- No committed **`only`** / **`skip`** on tests meant for CI.
- Never commit **real tokens** in tests or snapshots.
