# AGENTS.md — AI / automation context

## Project

| | |
|---|---|
| **Name** | `@contentstack/management` (npm) — **Contentstack Management JavaScript SDK** |
| **Purpose** | Client for the **Content Management API (CMA)**: create, update, delete, and fetch content and stack configuration in a Contentstack account. *(This is not the Content Delivery API / read-only delivery client.)* |
| **Repository** | [contentstack/contentstack-management-javascript](https://github.com/contentstack/contentstack-management-javascript.git) |

## Tech stack

| Area | Details |
|------|---------|
| **Language** | JavaScript (ES modules in `lib/`); TypeScript declarations under `types/`; small Jest suite under `test/typescript/` |
| **Runtime** | Node `>=8` per `package.json` `engines`; README suggests Node 10+ for typical development |
| **Build** | Babel (`lib/` → `dist/es5`, `dist/es-modules`); Webpack bundles for `node`, `web`, `react-native`, `nativescript` |
| **Lint / style** | ESLint with `standard` config (`eslint-config-standard`), `@babel/eslint-parser`, `es2020` env |
| **Unit / API tests** | Mocha + Chai + `@babel/register` + `nyc`; Sinon / Nock / `axios-mock-adapter` where used |
| **TypeScript tests** | Jest + `ts-jest` (`jest.config.js`, `npm run test:typescript`) |
| **HTTP / JSON** | **Axios** (`axios`); query serialization via **qs**; helpers from **`@contentstack/utils`** (e.g. `getContentstackEndpoint`) |

## Source layout & public entrypoints

| Path | Role |
|------|------|
| `lib/contentstack.js` | Package entry: `contentstack.client()`, re-exports |
| `lib/contentstackClient.js` | High-level client: `login`, `stack`, `organization`, etc. |
| `lib/core/contentstackHTTPClient.js` | Axios instance, retries, concurrency, interceptors |
| `lib/core/contentstackError.js` | Maps failed HTTP responses to thrown errors |
| `lib/stack/**`, `lib/organization/**`, `lib/user/**`, `lib/query/**` | Resource modules |
| `types/**` | Public `.d.ts` (and some `.ts`) for consumers |
| `dist/**` | Built artifacts (`package.json` `main` / `browser`) |

## Common commands

```bash
npm install
npm run build          # clean + babel + webpack targets
npm run lint           # eslint lib test
npm run test           # package.json chains test:api + test:unit (verify test:api exists in scripts)
npm run test:unit      # Mocha unit suite + nyc
npm run test:sanity-test   # integration-style suite (needs env + network)
npm run test:sanity-nocov  # same without nyc
npm run test:typescript    # Jest for test/typescript
npm run generate:docs      # JSDoc
```

**Unit vs integration**

- **Unit**: `test/unit/index.js` wires Mocha files; mocked HTTP, no live CMA.
- **Sanity / API**: `test/sanity-check/sanity.js` runs against a real stack; imports **`dist/node/contentstack-management.js`** (built output). **Requires credentials and env** (see `test/sanity-check/utility/testSetup.js`: `EMAIL`, `PASSWORD`, `HOST`, `ORGANIZATION`, optional OAuth / Personalize vars).

## Further guidance

- **Cursor rules (globs, always-apply):** [`.cursor/rules/README.md`](.cursor/rules/README.md)
- **Deeper playbooks:** [`skills/README.md`](skills/README.md)

When unsure about API behavior, prefer the official [Content Management API](https://www.contentstack.com/docs/developers/apis/content-management-api/) docs and existing JSDoc in `lib/`.
