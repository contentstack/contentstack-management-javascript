---
name: framework
description: Axios HTTP layer for the SDK — contentstackHTTPClient, retries, concurrency, plugins, oauth utilities.
---

# Framework skill — HTTP / config / transport

The SDK isolates HTTP and cross-cutting behavior under **`lib/core/`**. Read these when changing requests, retries, auth headers, or queueing — not when only adjusting a single stack resource’s URL path.

## Key modules

| File | Responsibility |
|------|----------------|
| **`contentstackHTTPClient.js`** | Builds **axios** instance: **baseURL** from host/port/version/`endpoint`, **paramsSerializer** (qs + JSON `query`), **interceptors** (path versioning, plugins), **retry** adapter pattern, **ConcurrencyQueue**, default **logHandler**, **retryCondition** (e.g. 429) |
| **`concurrency-queue.js`** | Limits parallel in-flight requests (`maxRequests`) |
| **`contentstackError.js`** | Maps axios errors to enriched `Error` objects (redacts token fields in logged config) |
| **`errorMessages.js`** | User-facing error string helpers |
| **`oauthHandler.js`** | OAuth-related client behavior used by `contentstackClient` |
| **`pkceStorage.js`** | PKCE storage helper for OAuth flows |
| **`Util.js`** | Host checks, user agent, plugin normalization, shared helpers |

## When to change this layer

- **New global header**, **auth scheme**, or **base URL** rule → HTTP client / client bootstrap (`contentstack.js`).
- **Retry policy**, **429** handling, **timeout** defaults → `contentstackHTTPClient.js` (and JSDoc on `client()` options).
- **Concurrency** behavior → `concurrency-queue.js` + options plumbed from `client()`.

## Tests

- **`test/unit/ContentstackHTTPClient-test.js`**, **`concurrency-Queue-test.js`**, **`contentstackError-test.js`**, **`Util-test`** exercise this stack — update or extend when behavior changes.

## Rule shortcut

- Cursor: `.cursor/rules/javascript.mdc` for style; **CMA usage** rules in `.cursor/rules/contentstack-javascript-cma.mdc`
