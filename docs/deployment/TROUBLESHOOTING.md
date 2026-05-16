# Troubleshooting - Trisilar Task Hub

**Doc Role:** Operator and QA troubleshooting guide
**Status:** Active
**Owner:** Runtime Owner / QA Release Owner
**Created:** 2026-05-15
**Updated by:** Codex PM / Runtime Owner / QA
**Related Docs:** `RUNTIME_OPERATIONS_RUNBOOK.md`, `ENVIRONMENT_MATRIX.md`, `DEPLOYMENT_SETUP.md`, `../testing/TEST_STRATEGY.md`, `../reference/SECURITY_ACCESS_POLICY.md`

---

## Purpose

Use this guide to classify common Task Hub issues before opening a Dev fix. Verify runtime, access, and external service state first so environment noise is not mistaken for an app regression.

---

## First Checks

1. Confirm environment: local, dev/demo, or production.
2. Confirm current branch/commit if repo-side.
3. Check local `/healthz` before public route behavior.
4. Check Cloudflare Access behavior separately from app health.
5. Check Settings connection state for Trello, Calendar, Google Tasks, or Paperclip.
6. For docs-only or repo-only work, do not run live credential checks unless assigned.

Never print tokens, raw auth headers, OAuth values, or signing secrets while troubleshooting.

---

## Common Symptoms

| Symptom | Likely area | First action |
|---|---|---|
| Public URL redirects to Cloudflare Access | Expected access gate | Verify approved-user login path |
| Public URL anonymous access returns app content | Access policy problem | Stop production use and route Runtime Owner |
| Local `/healthz` fails | Runtime process | Restart or inspect runtime host |
| `/api/boards` or Trello data returns `401` | Trello env/credential state | Check server-side Trello env without printing values |
| Trello data appears stale | Cache/rate limit/external API | Use refresh path and inspect error state |
| Calendar or Planner disconnected | OAuth/connect state | Use Settings connection guidance |
| Review Queue empty unexpectedly | `APP_DATA_DIR` or runtime state | Check `/api/reviews` and data directory |
| Paperclip operations status warns | Paperclip runtime policy | Check flag/live mode/source/environment |
| Signed webhook returns `403` | Webhook disabled or source disallowed | Confirm expected `PAPERCLIP_WEBHOOK_ENABLED` |
| Signed webhook returns `401` | HMAC/signature problem | Route Runtime/Paperclip Owner; do not print secret |
| Replay returns unexpected status | Idempotency regression | Run assigned Paperclip verification scripts |

---

## Paperclip Troubleshooting

Before sending any canary:

- read operations status
- confirm environment and live mode
- confirm whether canary is approved by PM/QA
- confirm disabled probe should return `403`

Expected negative checks:

| Case | Expected |
|---|---|
| disabled webhook | `403` |
| invalid signature | `401` |
| invalid source | `403` |
| invalid environment | `400` |
| changed replay | `409` |
| same replay | `200` |

If any Paperclip path creates Trello, Calendar, or Google Tasks side effects before human approval, stop immediately and route PM/Runtime/QA.

---

## Production Trello Verification

Use this when production pages show Trello verification copy, such as `Today needs Trello verification`, or Settings reports Trello as disconnected/invalid.

Run from the production host or another approved operator environment that can reach the private `taskhub-prod` runtime. Do not print `TRELLO_API_KEY`, `TRELLO_TOKEN`, raw auth headers, or copied `.env` contents.

Preferred host-local check:

```bash
docker exec taskhub-prod npm run verify:prod-trello-runtime
```

Equivalent endpoint check:

```bash
docker exec taskhub-prod node scripts/verify-prod-trello-runtime.js http://127.0.0.1:3301/api/trello/status
```

Expected classifications:

| Classification | Meaning | Next action |
|---|---|---|
| `verified` | Runtime can verify Trello through `/api/trello/status`. | No Trello credential action required. |
| `missing_credentials` | Runtime does not have both `TRELLO_API_KEY` and `TRELLO_TOKEN`. | Set runtime-only Trello env and recreate/restart `taskhub-prod`. |
| `invalid_credentials` | Runtime has Trello env, but Trello rejects it. | Rotate or reissue the runtime-only Trello key/token pair. |
| `rate_limited` | Trello verification hit rate limits. | Wait for the retry window, then rerun before rotating credentials. |
| `unavailable` | Task Hub could not verify Trello for another reason. | Check runtime network egress and Trello API availability. |

After changing runtime env, rerun the diagnostic and then reload the affected browser route. `/settings` should render the Settings page; Trello-dependent routes such as `/today`, `/boards`, `/okr`, and `/focus` should stop showing Trello verification copy once `/api/trello/status` is `verified`.

---

## Browser / UX Troubleshooting

For frontend or route issues:

1. Capture route path and viewport.
2. Note whether data is controlled/mock/live.
3. Record console errors and page errors separately.
4. Check whether issue is empty state, disconnected state, or real rendering failure.
5. Use `npm.cmd run verify:rux-browser-regression` for release/regression checks when assigned.

---

## Repo Verification Commands

| Work type | Command |
|---|---|
| Docs-only | `git diff --check` |
| General code/config/route | `node server.js` plus `npm.cmd run check:all` |
| RUX browser regression | `npm.cmd run verify:rux-browser-regression` |
| Production Trello runtime | `npm.cmd run verify:prod-trello-runtime` from a runtime that can reach Task Hub |
| Paperclip contract/mock/docs/operations | Relevant `npm.cmd run verify:paperclip-*` script |
| Production readiness | `npm.cmd run verify:paperclip-production-readiness` |

Runtime checks may be skipped only for docs-only changes and must be stated in the handoff.

---

## Escalation

Escalate to Runtime Owner when:

- access policy is wrong
- runtime cannot serve `/healthz`
- production data path is unknown
- any secret exposure may have occurred
- Paperclip live mode or webhook flag needs changing

Escalate to PM when:

- acceptance criteria are unclear
- the issue changes scope
- a release or production decision is needed

Escalate to Dev when:

- controlled verification reproduces a code behavior bug
- route/model/frontend checks fail independent of credentials
- regression appears after a known commit
