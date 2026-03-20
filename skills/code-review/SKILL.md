---
name: code-review
description: Use when reviewing PRs or before opening a PR — API design, null-safety, errors, backward compatibility, dependencies, security, and test quality.
---

# Code review — Contentstack Management JavaScript SDK

Use this skill when performing or preparing a pull request review for **`@contentstack/management`** (CMA — Content Management API client, not the Java CDA SDK).

## When to use

- Reviewing someone else’s PR.
- Self-reviewing your own PR before submission.
- Checking that changes meet project standards (API, errors, compatibility, tests, security).

## Instructions

Work through the checklist below. Optionally tag items with severity: **Blocker**, **Major**, **Minor**.

### 1. API design and stability

- [ ] **Public API:** New or changed public exports are necessary and documented with **JSDoc** (purpose, `@param` / `@returns`, `@example` where helpful), consistent with `lib/contentstack.js` and `lib/contentstackClient.js`.
- [ ] **TypeScript surface:** **`types/**`** updated when consumers would see new or changed signatures or exports.
- [ ] **Backward compatibility:** No breaking changes to public function signatures, option objects, defaults, or export shape unless explicitly agreed (e.g. major version). Deprecations should note alternatives when used in this codebase.
- [ ] **Naming:** Consistent with existing modules and **CMA** terminology (e.g. stack, entry, content type, asset, taxonomy) and paths under `lib/stack/`.

**Severity:** Breaking public API without approval = **Blocker**. Missing JSDoc or types on new public API = **Major**.

### 2. Error handling and robustness

- [ ] **Errors:** HTTP failures flow through **`lib/core/contentstackError.js`** (or the same promise-rejection pattern used by neighboring code), preserving **status** and safe **request** metadata.
- [ ] **Null safety:** No unsafe assumptions on optional fields; guard or default where API responses can omit nested objects.
- [ ] **Secrets:** Do not log or stringify full **authtoken**, **authorization**, or **management_token**; follow redaction patterns in **`contentstackError.js`**.

**Severity:** Wrong or missing error handling on new/changed paths = **Major**.

### 3. Dependencies and security

- [ ] **Dependencies:** New or upgraded npm dependencies are justified; prefer existing **`lodash` / `axios`** patterns where possible. **Lockfile** / **`package.json`** bumps are intentional and reviewable.
- [ ] **SCA:** Security findings (e.g. Snyk, Dependabot) in the change set are addressed or explicitly deferred with a tracked follow-up.

**Severity:** New critical/high vulnerability or unfixed blocker finding in scope = **Blocker**.

### 4. Testing

- [ ] **Unit:** New or modified **`lib/`** behavior has tests under **`test/unit/`** with HTTP **mocked** (Nock, axios-mock-adapter, Sinon, etc.); register suites in **`test/unit/index.js`** when adding files.
- [ ] **Sanity / API:** When behavior is integration-sensitive, update or add **`test/sanity-check/api/*-test.js`** and ensure **`test/sanity-check/sanity.js`** includes it; run against **`dist/node/contentstack-management.js`** after **`npm run build`**. Document new env vars in **`test/sanity-check/utility/testSetup.js`** header only — no committed secrets.
- [ ] **Quality:** Tests are readable, deterministic (no flaky timing or live-network dependence in unit tests), and assert meaningful behavior.

**Severity:** No tests for new behavior = **Blocker**. Flaky or weak tests = **Major**.

### 5. Optional severity summary

- **Blocker:** Must fix before merge (e.g. breaking API without approval, security issue, no tests for new code).
- **Major:** Should fix (e.g. inconsistent error handling, missing JSDoc on new public API, flaky tests).
- **Minor:** Nice to fix (e.g. style, minor docs, redundant code).

## References

- Project rule: `.cursor/rules/code-review.mdc`
- Workflow (lint, tests, version bump): `.cursor/rules/dev-workflow.md`
- Testing detail: `skills/testing/SKILL.md`
