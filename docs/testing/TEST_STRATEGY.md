# Test Strategy - Trisilar Task Hub

**Doc Role:** Verification policy and automated test suite roadmap
**Status:** Active
**Owner:** QA / Dev
**Last Updated:** 2026-05-15
**Updated by:** Codex Dev / QA

This document defines how agents verify changes today and how the automated test suite should grow.

---

## Current Baseline

For deterministic route/model/contract checks that must not require live Trello, Google, Cloudflare, or Paperclip secrets:

```powershell
npm.cmd test
```

`npm test` currently runs Node's built-in test runner against `tests/*.test.js`.

For behavior, route, config, integration, or frontend runtime changes:

```powershell
node server.js
npm.cmd run check:all
```
Run `node server.js` in a separate terminal first.

`npm.cmd run check:all` currently runs:

```text
node scripts/verify-frontend.js
npm run smoke
```

`npm run smoke` calls local HTTP endpoints and expects the server to be running.

---

## Current Script Coverage

| Script | Purpose |
|---|---|
| `scripts/verify-frontend.js` | Frontend structural checks such as script order and module expectations |
| `scripts/smoke-test.js` | Local endpoint smoke checks |
| `scripts/verify-paperclip-contract.js` | Paperclip contract verification when relevant |
| `scripts/verify-paperclip-mock.js` | Paperclip mock verification when relevant |
| `scripts/verify-paperclip-docs.js` | Paperclip Docs and Docs-to-Review workflow verification when relevant |
| `scripts/verify-paperclip-production-readiness.js` | Paperclip production profile, staged live mode, HMAC/idempotency, and Review Queue-only intake verification |
| `scripts/verify-sqlite-canary.js` | Read-only hosted dev/demo SQLite canary verification for SQLite `app_state`, health/config/reviews, and Paperclip operations status |
| `scripts/verify-json-rollback.js` | Read-only hosted dev/demo rollback verification for JSON files, health/config/reviews, and Paperclip operations status after removing the SQLite flag |
| `scripts/verify-persistence-canary-cycle.js` | Local temp-data preflight for the full JSON -> SQLite canary -> JSON rollback cycle |
| `scripts/verify-rux-trello-connection-ux.js` | V0.3 RUX Trello connection-state and failure-copy verification |
| `scripts/verify-rux-ai-trace-clarity.js` | V0.3 RUX Docs/Paperclip trace readability and Review Queue linked-doc clarity verification |
| `scripts/verify-rux-today-tasks-decision-flow.js` | V0.3 RUX Today and Tasks source/context/next-action verification |
| `scripts/verify-rux-browser-regression.js` | V0.3 RUX controlled browser regression gate for core desktop/mobile routes |
| `tests/app-contracts.test.js` | App-owned contract validation for Review Queue, config, Paperclip public connection/operations state, and normalized Trello card shapes |
| `tests/api-routes.test.js` | Deterministic injected-dependency route coverage for config, Trello status/boards, and Review Queue creation |
| `tests/trello-model.test.js` | Trello card normalization and custom-field map coverage |
| `tests/paperclip-connection.test.js` | Paperclip public connection response-shape coverage without secret leakage |
| `tests/sqlite-migration.test.js` | SQLite import/export migration coverage for app-owned JSON state, backups, and rollback manifests |
| `tests/runtime-state-backend.test.js` | Runtime state backend coverage for JSON default, SQLite env-flag opt-in, JSON fallback, APP_DATA_DIR creation, Review Queue persistence, config shape, and Paperclip secret masking |

Use `node --check <file>` for targeted JavaScript syntax checks when changing individual files.

---

## Manual Browser Checks

Use browser preview when changing:

- navigation and URL path sync
- page rendering
- responsive layout
- major UI surfaces
- fallback/error states
- Review Queue flows
- Boards Monitor, OKR/Portfolio, Weekly Focus

Minimum browser surfaces for release/regression passes:

- Today
- All Tasks
- Boards Monitor
- Calendar
- OKR / Portfolio
- Weekly Focus
- Settings
- Review Queue

Record console errors and API failures separately from visual findings.

For V0.3 RUX browser regression, use:

```powershell
npm.cmd run verify:rux-browser-regression
```

The command starts a temporary local server, uses controlled browser API fixtures, checks desktop and mobile viewports, captures console/page errors, checks horizontal overflow, validates the core route matrix, and cleans up temporary runtime data. It must not require production secrets.

---

## QA Report Format

QA output should include:

1. Findings first, if any.
2. AC checklist with PASS/FAIL.
3. Evidence with file/line references or command output summary.
4. Verification commands and exit status.
5. Final verdict.
6. Attribution.
7. Next role.

QA must not edit files.

---

## Automated Test Suite Roadmap

Priority order:

| Priority | Test area | Goal |
|---|---|---|
| 1 | Deterministic API route tests | Started in `tests/api-routes.test.js`; expand route responses without live Trello/Google dependency |
| 2 | Trello model unit tests | Started in `tests/trello-model.test.js`; lock normalized card metadata, labels, members, checklists, custom fields |
| 3 | Frontend module checks | Verify page modules expose expected entry points and safe dependencies |
| 4 | Browser navigation regression | Verify URL path sync, back/forward, and key page render states |
| 5 | Paperclip contract tests | Existing scripts verify agent payloads; `tests/app-contracts.test.js` now locks public Paperclip connection/operations state shapes |
| 6 | Paperclip production readiness tests | Verify production runtime profile, staged/permanent policy status, replay/auth failures, and no pre-approval side effects |
| 7 | Deployment smoke tests | Verify hosted dev/prod endpoints and access-gate behavior |

Add tests close to the behavior they protect. Avoid large snapshot tests unless they catch a real regression cheaply.

---

## Test Data Rules

- Prefer mock Trello/Paperclip fixtures for deterministic automated tests.
- Do not require production secrets for CI.
- Keep live API checks as smoke/manual validation, not the only correctness gate.
- Redact tokens and personal data from fixtures.
- Treat SQLite databases and migration backups as secret-bearing if they include `paperclip-connection.json`.

---

## When Tests Can Be Skipped

Docs-only changes can skip runtime tests when no behavior/config files changed. The final handoff must say:

```text
Runtime checks skipped: docs-only change.
Verification run: git diff --check.
```
