---
name: contentstack-javascript-cma
description: Contentstack Management (CMA) JavaScript SDK — client, stack, auth, regions, entities in lib/.
---

# Contentstack JavaScript CMA SDK – Contentstack Management JavaScript SDK

This repository ships **`@contentstack/management`**, the **Content Management API** client. It is **not** the Content Delivery API (CDA) read client.

## When to use

- Implementing or changing **`lib/`** CMA resources (stack, entries, assets, …).
- Understanding **`contentstack.client()`** options and stack-scoped APIs.

## Instructions

### Mental model

1. **`contentstack.client(options)`** (`lib/contentstack.js`) builds the axios-based HTTP stack and returns a **client** facade.
2. **`contentstackClient`** (`lib/contentstackClient.js`) adds **login**, **logout**, **stack**, **organization**, etc.
3. **Stack-scoped** modules live under **`lib/stack/`** (content types, entries, assets, branches, …).
4. Shared HTTP behavior: **`lib/core/contentstackHTTPClient.js`**; errors: **`lib/core/contentstackError.js`**.

### Configuration knobs (see JSDoc on `client()`)

- **region**, **host**, **endpoint** — CMA base URL resolution; **host** overrides region when both set (per README / JSDoc).
- **timeout**, **retryOnError**, **retryLimit**, **retryDelay**, **maxRequests** — network behavior.
- **authtoken** / **authorization** — user-scoped auth; **management_token** + **api_key** on **stack()** for stack operations.
- **early_access** — forwarded as `x-header-ea` for EA features.
- **plugins** — axios interceptors normalized in HTTP client (see `normalizePlugins` usage).

### Implementing new resources

- Follow neighbors in **`lib/stack/<feature>/`**: accept **`http`**, carry **`urlPath`** / **`uid`**, clone **`stackHeaders`**, use **`entity`** / **`ContentstackCollection`** patterns where appropriate.
- Pass the shared **`error`** handler from **`contentstackError`** on HTTP promise chains for consistent failures.

### Types & docs

- Consumer types: **`types/contentstackClient.d.ts`**, **`types/stack/**`**.
- Product reference: [Content Management API](https://www.contentstack.com/docs/developers/apis/content-management-api/).
