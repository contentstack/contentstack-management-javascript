---
name: javascript-style
description: JavaScript and TypeScript declaration style for lib, webpack, types — ESLint standard, modules, JSDoc.
---

# JavaScript & types – Contentstack Management JavaScript SDK

## When to use

- Editing **`lib/**/*.js`**, **`webpack/**/*.js`**, **`types/**`**, or root **`*.mjs`**.
- Matching ESLint **standard** style and public JSDoc for npm consumers.

## Instructions

### Runtime & modules

- **Source** is **ES modules** under **`lib/`** (`import` / `export`). Builds target Node and browsers via Babel + Webpack (`package.json` scripts).
- **`types/`** holds public TypeScript declarations for npm; keep aligned with **`lib/`** JSDoc and exports.

### Style & tooling

- **ESLint** uses **`eslint-config-standard`** and **`@babel/eslint-parser`**; match **semicolon-free** standard style and two-space indentation as in existing **`lib/`** files.
- **Environment**: ESLint `es2020`; **`test/**/*.js`** may relax rules via **`overrides`** in **`.eslintrc.js`**.

### Patterns

- Prefer **named exports** where the codebase already does; **default exports** for factories (`contentstackClient`, HTTP client factory).
- **JSDoc** (`@memberof`, `@func`, `@param`, `@returns`, `@example`) on **public** API, consistent with **`lib/contentstack.js`** and **`lib/contentstackClient.js`**.
- **Dependencies**: **`lodash`**, **`axios`**, **`qs`**, **`@contentstack/utils`** — follow existing import paths (including **`.js`** suffixes where used).

### Logging

- Avoid noisy **`console.log`** in library code except via existing **`logHandler`** / patterns in **`lib/core/contentstackHTTPClient.js`**.
- Never log full **authtoken**, **management tokens**, or **passwords**.
