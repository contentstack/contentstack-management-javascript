---
name: framework
description: Axios HTTP layer for the SDK — contentstackHTTPClient, retries, concurrency, plugins, oauth utilities.
---

# Framework – HTTP / config / transport – Contentstack Management JavaScript SDK

## When to use

- Changing **`lib/core/`** request behavior: retries, base URL, interceptors, concurrency, OAuth helpers.
- Debugging HTTP-level issues (429, timeouts, headers).

## Instructions

The SDK isolates HTTP and cross-cutting behavior under **`lib/core/`**. Use this when changing requests, retries, auth headers, or queueing — not when only adjusting a single stack resource’s URL path.

### Key modules

| File | Responsibility |
|------|----------------|
| **`contentstackHTTPClient.js`** | Builds **axios** instance: **baseURL**, **paramsSerializer** (qs + JSON `query`), **interceptors**, **retry** behavior, **ConcurrencyQueue**, **logHandler**, **retryCondition** (e.g. 429) |
| **`concurrency-queue.js`** | Limits parallel in-flight requests (`maxRequests`) |
| **`contentstackError.js`** | Maps axios errors to enriched `Error` objects (redacts tokens in logged config) |
| **`errorMessages.js`** | User-facing error string helpers |
| **`oauthHandler.js`** | OAuth-related behavior used by `contentstackClient` |
| **`pkceStorage.js`** | PKCE storage for OAuth flows |
| **`Util.js`** | Host checks, user agent, plugin normalization |

### When to change this layer

- **New global header**, **auth scheme**, or **base URL** rule → HTTP client / **`lib/contentstack.js`** bootstrap.
- **Retry policy**, **429**, **timeout** defaults → **`contentstackHTTPClient.js`** (and JSDoc on `client()` options).
- **Concurrency** → **`concurrency-queue.js`** + options from **`client()`**.

### Tests

- **`test/unit/ContentstackHTTPClient-test.js`**, **`concurrency-Queue-test.js`**, **`contentstackError-test.js`**, **`Util-test`** — extend when behavior changes.
