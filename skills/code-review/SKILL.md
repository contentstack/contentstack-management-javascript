---
name: code-review
description: Use when reviewing PRs or before opening a PR — API design, null-safety, errors, backward compatibility, dependencies, security, and test quality.
---

# Code review – Contentstack Management JavaScript SDK

## When to use

- Reviewing someone else’s PR or self-review before submission.
- Verifying API surface, errors, compatibility, dependencies, security, and tests.

## Instructions

Work through the checklist below. Optionally tag items with severity: **Blocker**, **Major**, **Minor**.

### 1. API design and stability

- [ ] **Public API:** New or changed public exports documented with **JSDoc**, consistent with **`lib/contentstack.js`** and **`lib/contentstackClient.js`**.
- [ ] **TypeScript surface:** **`types/**`** updated when signatures or exports change.
- [ ] **Backward compatibility:** No breaking changes without explicit agreement (e.g. major version).
- [ ] **Naming:** **CMA** terminology and **`lib/stack/`** patterns.

**Severity:** Breaking public API without approval = **Blocker**. Missing JSDoc/types on new public API = **Major**.

### 2. Error handling and robustness

- [ ] **Errors:** Flow through **`lib/core/contentstackError.js`** (or equivalent), preserving **status** and safe **request** metadata.
- [ ] **Null safety:** No unsafe assumptions on optional API fields.
- [ ] **Secrets:** No logging of full **authtoken**, **authorization**, or **management_token**.

**Severity:** Wrong or missing error handling in new code = **Major**.

### 3. Dependencies and security

- [ ] **Dependencies:** New or upgraded deps justified; prefer **`lodash` / `axios`** patterns.
- [ ] **SCA:** Snyk / Dependabot findings addressed or deferred with a ticket.

**Severity:** Critical/high vulnerability unfixed in scope = **Blocker**.

### 4. Testing

- [ ] **Unit:** Coverage under **`test/unit/`** with HTTP mocked; register in **`test/unit/index.js`**.
- [ ] **Sanity:** When needed, update **`test/sanity-check/api/*-test.js`** and **`sanity.js`**; **`npm run build`** first; env per **`testSetup.js`** — no secrets in repo.

**Severity:** No tests for new behavior = **Blocker**. Flaky tests = **Major**.

### 5. Severity summary

- **Blocker:** Must fix before merge (breaking API, security, no tests for new code).
- **Major:** Should fix (error handling, missing docs, flaky tests).
- **Minor:** Nice to fix (style, minor docs).
