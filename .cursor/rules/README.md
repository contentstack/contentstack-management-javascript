# Cursor Rules Documentation

This directory contains **Cursor AI rules** that provide context-aware guidance for the **Contentstack Management JavaScript SDK** (`@contentstack/management`) — CMA client development, not a separate CLI repo.

## Rules overview

| Rule | Role |
|------|------|
| [`dev-workflow.md`](dev-workflow.md) | Branches, lint/tests before PR (unit + optional sanity), version bump guidance, links to skills |
| [`javascript.mdc`](javascript.mdc) | JavaScript / TypeScript declaration style: `lib/`, `webpack/`, `types/`, root `*.mjs` |
| [`contentstack-javascript-cma.mdc`](contentstack-javascript-cma.mdc) | CMA SDK patterns in `lib/`: client, stack, auth, host/region, HTTP/error handling |
| [`testing.mdc`](testing.mdc) | Mocha unit suite, sanity/API tests, Jest + `test/typescript`; env and mocks |
| [`code-review.mdc`](code-review.mdc) | PR checklist: JSDoc, compat, errors, SCA, unit + sanity tests, CMA semantics (**always applied**) |

## Rule application

Rules load from **globs** and **`alwaysApply`** in each file’s frontmatter (not every rule runs for every file).

| Context | Typical rules |
|---------|----------------|
| **Every chat / session** | [`code-review.mdc`](code-review.mdc) (`alwaysApply: true`) |
| **Most project files** | [`dev-workflow.md`](dev-workflow.md) — `**/*.js`, `**/*.ts`, `**/*.json`, `**/*.mjs` |
| **SDK implementation** | [`javascript.mdc`](javascript.mdc) + [`contentstack-javascript-cma.mdc`](contentstack-javascript-cma.mdc) for `lib/**/*.js` |
| **Build config** | [`javascript.mdc`](javascript.mdc) for `webpack/**/*.js` |
| **Public types** | [`javascript.mdc`](javascript.mdc) for `types/**` |
| **Tests** | [`testing.mdc`](testing.mdc) for `test/unit/**`, `test/sanity-check/**`, `test/typescript/**`, `test/**/index.js` |

Overlaps are expected (e.g. editing `lib/foo.js` can match `dev-workflow`, `javascript`, and `contentstack-javascript-cma`).

## Usage

- Rules are **loaded automatically** when opened files match their globs (and `code-review` is always in context).
- You can **@ mention** rule files in chat when your Cursor build supports file references, e.g. `@dev-workflow`, `@javascript`, `@contentstack-javascript-cma`, `@testing`, `@code-review` (exact names depend on how Cursor labels `.md` / `.mdc` rules in your project).

## Quick reference table

| File | `alwaysApply` | Globs (summary) |
|------|---------------|-----------------|
| `dev-workflow.md` | no | `**/*.js`, `**/*.ts`, `**/*.json`, `**/*.mjs` |
| `javascript.mdc` | no | `lib/**/*.js`, `webpack/**/*.js`, `types/**/*.ts`, `types/**/*.d.ts`, `*.mjs` |
| `contentstack-javascript-cma.mdc` | no | `lib/**/*.js` |
| `testing.mdc` | no | `test/unit/**`, `test/sanity-check/**`, `test/typescript/**`, `test/**/index.js` |
| `code-review.mdc` | **yes** | — |

## Skills & maintenance

- Deeper playbooks: [`skills/README.md`](../../skills/README.md).
- Repo agent entry: [`AGENTS.md`](../../AGENTS.md).
- When directories change, update **globs** in rule frontmatter; keep rules short and put detail in `skills/*/SKILL.md`.
