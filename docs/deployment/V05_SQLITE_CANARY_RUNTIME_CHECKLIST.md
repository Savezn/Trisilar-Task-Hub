# V0.5 SQLite Canary Runtime Checklist

**Doc Role:** Runtime Owner checklist for the hosted dev/demo SQLite canary and JSON rollback proof
**Status:** Active handoff / blocked until Runtime Owner host access is available
**Owner:** Runtime Owner / Integration Owner / QA
**Created:** 2026-05-16
**Updated by:** Codex Dev / QA
**Related Docs:** `README.md`, `RUNTIME_OPERATIONS_RUNBOOK.md`, `ENVIRONMENT_MATRIX.md`, `../plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md`, `../adr/ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md`, `../testing/TEST_STRATEGY.md`

---

## Scope

Use this checklist only for the hosted dev/demo SQLite persistence canary selected for V0.5 Foundation Hardening.

This checklist is not a production switch. Production must remain JSON default until a separate PM / Runtime decision accepts a production SQLite migration.

Hard no-go boundaries:

- Do not run this checklist on production.
- Do not change Cloudflare policy.
- Do not print, paste, commit, or screenshot secrets.
- Do not change Paperclip live flags or webhook auth behavior.
- Do not send live Paperclip canaries.
- Do not create Trello cards, Calendar events, or Google Tasks.
- Do not approve Review Queue items as part of the canary.

---

## Current Gate

Status on 2026-05-16:

- Repo-side V0.5 test, contract, migration, SQLite canary, and rollback guards are implemented.
- Local temp-data preflight exists as `npm.cmd run verify:persistence-canary-cycle`.
- Latest local preflight from `origin/dev@3159a21` passed `npm.cmd ci`, `npm test` 25/25, and `npm.cmd run verify:persistence-canary-cycle`.
- Hosted dev/demo execution is blocked from this workstation because SSH to the DigitalOcean host still returns `Permission denied (publickey)`.
- Runtime Owner must provide or use host access before any hosted dev/demo runtime state changes.

---

## Operator Inputs To Confirm

Record these before changing anything. Keep values non-secret.

```text
Environment: hosted dev/demo
Source branch / commit:
Runtime service or container:
Local service URL:
APP_DATA_DIR:
Current TASKHUB_STATE_BACKEND:
Current Paperclip live flag state:
Current Paperclip operations mode:
Backup path:
Rollback owner:
PM decision owner:
```

Expected defaults before canary:

- `TASKHUB_STATE_BACKEND` is empty or unset.
- JSON is the active runtime state reader.
- Paperclip operations status is read-only.
- Local service URL is the runtime-local address, for example `http://127.0.0.1:3000`.

---

## Preflight

Run from the deployed dev/demo code tree after confirming it is an accepted `dev` commit.

```powershell
npm.cmd ci
npm test
npm.cmd run verify:persistence-canary-cycle
```

What this proves:

- deterministic tests still pass without live Trello, Google, Cloudflare, or Paperclip secrets
- temp JSON state can migrate into SQLite
- SQLite runtime reads health/config/reviews correctly
- rollback export recreates JSON state
- JSON runtime can still pass after rollback

Stop if any command fails. Do not touch hosted runtime flags until the failure is explained.

---

## Backup

Before running `migrate:sqlite` against hosted dev/demo data:

1. Confirm the target is hosted dev/demo, not production.
2. Confirm `APP_DATA_DIR` points to the dev/demo runtime data directory.
3. Preserve or snapshot the whole `APP_DATA_DIR` using the approved runtime backup path.
4. Treat SQLite files, exported JSON files, and backup archives as sensitive runtime data if Paperclip connection state is present.
5. Record the backup location without printing secrets or raw data.

Stop if the backup path is missing, ambiguous, or points at production.

---

## SQLite Canary Steps

Run on hosted dev/demo only.

```powershell
npm.cmd run migrate:sqlite
```

Set the canary backend only in the dev/demo runtime environment. Use the service manager's normal env mechanism if the service is not started from the current shell.

```powershell
$env:TASKHUB_STATE_BACKEND = "sqlite"
```

Restart or reload the dev/demo Task Hub service.

Verify from the runtime host against the local app URL, not through the public Cloudflare Access route.

```powershell
$env:SQLITE_CANARY_BASE_URL = "http://127.0.0.1:3000"
npm.cmd run verify:sqlite-canary
npm.cmd run migrate:sqlite:export
```

Expected result:

- `/healthz` returns `200`
- `/api/config` returns `200`
- `/api/reviews` returns `200`
- SQLite `app_state` contains required app-owned rows
- Paperclip operations status remains read-only
- forbidden secret-bearing keys are not returned
- rollback export succeeds after verifying SQLite state

---

## Rollback Proof

If PM decides to return dev/demo to JSON, or if the canary fails, remove the SQLite backend flag from the dev/demo runtime environment and restart or reload the service.

For a shell-local verification run:

```powershell
$env:TASKHUB_STATE_BACKEND = ""
$env:JSON_ROLLBACK_BASE_URL = "http://127.0.0.1:3000"
npm.cmd run verify:json-rollback
```

For a managed service, make sure the service environment no longer sets `TASKHUB_STATE_BACKEND=sqlite` before restart.

Expected result:

- JSON is the active runtime state reader.
- `/healthz`, `/api/config`, and `/api/reviews` return `200`.
- Paperclip operations status remains read-only.
- exported rollback JSON exists in the expected `APP_DATA_DIR`.
- no Review Queue item was approved and no external task/event was created.

---

## Stop Conditions

Stop, rollback to JSON, and route PM / QA if any of these appear:

- the target environment is production or ambiguous
- the dev/demo backup is missing or unverified
- `APP_DATA_DIR` is empty, wrong, or points at production data
- `npm test`, `verify:persistence-canary-cycle`, `verify:sqlite-canary`, or `verify:json-rollback` fails
- `/healthz`, `/api/config`, or `/api/reviews` fails after restart
- Paperclip operations status is not read-only
- secret-bearing values appear in route responses, logs, screenshots, docs, or chat
- Review Queue counts change unexpectedly
- any Trello, Calendar, Google Tasks, or live Paperclip side effect occurs
- rollback export fails or rollback JSON cannot be verified

Rollback command path:

```text
Remove TASKHUB_STATE_BACKEND from dev/demo runtime -> restart/reload -> run verify:json-rollback -> send evidence to QA/PM.
```

---

## Evidence To Send Back

Paste a non-secret summary in the team handoff.

```text
V0.5 hosted dev/demo SQLite canary evidence

Environment:
Commit:
Runtime service:
APP_DATA_DIR:
Backup path:
Preflight:
- npm test:
- verify:persistence-canary-cycle:
Canary:
- migrate:sqlite:
- TASKHUB_STATE_BACKEND:
- verify:sqlite-canary:
- migrate:sqlite:export:
Rollback proof:
- backend after rollback:
- verify:json-rollback:
Paperclip status:
External side effects:
Decision:
Next role:
```

Decision options:

- keep SQLite enabled on hosted dev/demo for a limited observation window
- rollback hosted dev/demo to JSON default and keep SQLite deferred
- open a separate PM / Runtime decision for future production migration
