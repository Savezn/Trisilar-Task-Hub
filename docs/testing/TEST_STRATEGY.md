# Test Strategy - Trisilar Task Hub

**Doc Role:** Verification policy and automated test suite roadmap
**Status:** Active
**Owner:** QA / Dev
**Last Updated:** 2026-05-14
**Updated by:** Codex QA

This document defines how agents verify changes today and how the automated test suite should grow.

V0.5 Foundation Hardening turns the automated test-suite roadmap into active implementation work. `npm test` should become a meaningful deterministic gate before UI V2 production implementation or Team Operating System product work starts.

---

## Current Baseline

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
| `scripts/verify-rux-trello-connection-ux.js` | V0.3 RUX Trello connection-state and failure-copy verification |
| `scripts/verify-rux-ai-trace-clarity.js` | V0.3 RUX Docs/Paperclip trace readability and Review Queue linked-doc clarity verification |
| `scripts/verify-rux-today-tasks-decision-flow.js` | V0.3 RUX Today and Tasks source/context/next-action verification |
| `scripts/verify-rux-browser-regression.js` | V0.3 RUX controlled browser regression gate for core desktop/mobile routes |

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

V0.5 should implement this order as scoped Dev/QA tasks, starting with tests that do not require production secrets or live Trello/Google/Paperclip services.

Priority order:

| Priority | Test area | Goal |
|---|---|---|
| 1 | Deterministic API route tests | Verify route responses without live Trello/Google dependency |
| 2 | Trello model unit tests | Lock normalized card metadata, labels, members, checklists, custom fields |
| 3 | Frontend module checks | Verify page modules expose expected entry points and safe dependencies |
| 4 | Browser navigation regression | Verify URL path sync, back/forward, and key page render states |
| 5 | Paperclip contract tests | Verify agent payloads, attribution, review queue handoff, and failure modes |
| 6 | Paperclip production readiness tests | Verify production runtime profile, staged/permanent policy status, replay/auth failures, and no pre-approval side effects |
| 7 | Deployment smoke tests | Verify hosted dev/prod endpoints and access-gate behavior |

Add tests close to the behavior they protect. Avoid large snapshot tests unless they catch a real regression cheaply.

---

## Test Data Rules

- Prefer mock Trello/Paperclip fixtures for deterministic automated tests.
- Do not require production secrets for CI.
- Keep live API checks as smoke/manual validation, not the only correctness gate.
- Redact tokens and personal data from fixtures.

---

## When Tests Can Be Skipped

Docs-only changes can skip runtime tests when no behavior/config files changed. The final handoff must say:

```text
Runtime checks skipped: docs-only change.
Verification run: git diff --check.
```
