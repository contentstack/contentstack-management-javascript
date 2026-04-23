---
name: testing
description: How to run and extend tests — Mocha unit, sanity API, Jest TypeScript; env and mocks.
---

# Testing – Contentstack Management JavaScript SDK

## When to use

- Running **`npm run test:unit`**, sanity, or Jest.
- Adding or changing tests under **`test/unit/`** or **`test/sanity-check/`**.
- Configuring env vars for live CMA sanity runs.

## Instructions

### Commands (from `package.json`)

| Goal | Command |
|------|---------|
| Lint (pre-test hook) | `npm run lint` |
| Default `npm test` | Runs `test:api` then `test:unit` — **confirm `test:api` exists** in your branch; else use `test:unit` |
| Unit only | `npm run test:unit` — Mocha `test/unit/index.js`, **nyc** |
| Unit JSON report | `npm run test:unit:report:json` |
| Sanity + coverage | `npm run test:sanity-test` |
| Sanity, no nyc | `npm run test:sanity-nocov` |
| TypeScript / Jest | `npm run test:typescript` |

Always **`npm run build`** before sanity if **`dist/node/contentstack-management.js`** must match **`lib/`** (sanity imports the built artifact).

### Unit tests (`test/unit/`)

- **Mocha** + **Chai** + **@babel/register**; **30s** timeout per script.
- **HTTP**: mock with **Nock**, **axios-mock-adapter**, or stubs — **no live CMA**.
- Suites are **`require`d** from **`test/unit/index.js`** — add new **`*-test.js`** files and register them there.

### Sanity tests (`test/sanity-check/`)

- **Live** CMA calls; orchestrated by **`test/sanity-check/sanity.js`**.
- **Authoritative env list:** **`test/sanity-check/utility/testSetup.js`** (and **`sanity.js`**).

#### Environment variables

**Required (core)** — setup fails without: **`EMAIL`**, **`PASSWORD`**, **`HOST`**, **`ORGANIZATION`**.

**Suite-specific** (tests skip or degrade when missing):

| Area | Variables | Notes |
|------|-----------|--------|
| OAuth | `CLIENT_ID`, `APP_ID`, `REDIRECT_URI` | `oauth-test.js` |
| 2FA | `TFA_EMAIL`, `TFA_PASSWORD` | `user-test.js` |
| MFA | `MFA_SECRET` | `user-test.js` |
| Team / share | `MEMBER_EMAIL` | `team-test.js`, `stack-test.js` |
| DAM 2.0 | `DAM_2_0_ENABLED=true` | `entry-test.js` |

**Optional:** `PERSONALIZE_HOST`, `DELETE_DYNAMIC_RESOURCES` (defaults in setup). Set **`HOST`** to your CMA API host.

**Runtime:** setup assigns **`API_KEY`**, **`AUTHTOKEN`**, **`MANAGEMENT_TOKEN`**, etc. — do not commit those.

### Jest (`test/typescript/`)

- **`jest.config.js`**: `ts-jest`, coverage under **`coverage/`**.

### Hygiene

- No committed **`only`** / **`skip`** for CI-needed tests.
- Never commit real tokens in tests or snapshots.
