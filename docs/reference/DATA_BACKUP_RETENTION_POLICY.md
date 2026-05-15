# Data Backup And Retention Policy - Trisilar Task Hub

**Doc Role:** Runtime data backup, restore, and retention policy
**Status:** Active
**Owner:** Runtime Owner / PM
**Created:** 2026-05-15
**Updated by:** Codex PM / Runtime Owner
**Related Docs:** `../deployment/RUNTIME_OPERATIONS_RUNBOOK.md`, `../deployment/ENVIRONMENT_MATRIX.md`, `SECURITY_ACCESS_POLICY.md`, `AI_AGENT_GOVERNANCE.md`, `../plans/VERSION_0_4_LIVE_AI_OPERATIONS_PAPERCLIP_PRODUCTION_PLAN.md`

---

## Purpose

Task Hub uses runtime data files for Review Queue state, card events, and Paperclip connection state. This policy defines how to treat that data when running dev/demo or production environments.

---

## Data Classes

| Data | Examples | Handling |
|---|---|---|
| Public docs/config | tracked markdown, `.env.example`, non-secret hostnames | May be committed |
| Runtime state | review sessions, card events, runtime JSON | Keep in `APP_DATA_DIR` or ignored local files |
| Secret-bearing runtime state | `paperclip-connection.json`, production `APP_DATA_DIR` backups after Settings connection | Treat as secrets |
| Secrets | API tokens, OAuth secrets, Cloudflare Access Client Secret, HMAC signing secret | Runtime/platform only; never git/docs/chat |

Production backups that include `paperclip-connection.json` are secret-bearing because they contain webhook signing material or connection state.

---

## Backup Rules

- Do not commit runtime JSON exports unless PM explicitly approves a sanitized fixture.
- Keep dev/demo and production `APP_DATA_DIR` separate.
- Label backups with environment, timestamp, and source commit when safe.
- Store secret-bearing backups only in approved private storage.
- Do not paste backup contents into docs, screenshots, issue comments, PRs, or chat.
- Before relying on production intake, verify that the operator knows where backups are stored and how restore is performed.

---

## Restore Rules

Restore is a Runtime Owner task unless PM assigns otherwise.

Before restore:

1. Identify environment and target `APP_DATA_DIR`.
2. Confirm whether backup is secret-bearing.
3. Stop live Paperclip intake by setting `PAPERCLIP_WEBHOOK_ENABLED=false` when Paperclip state may be affected.
4. Preserve the current data directory as a rollback backup when possible.
5. Record source commit and restore reason without exposing data values.

After restore:

1. Restart or reload runtime if required.
2. Confirm `/healthz`, `/api/config`, and `/api/reviews`.
3. Confirm Paperclip operations status is read-only and secret values are not returned.
4. Confirm Review Queue counts are plausible.
5. Route QA/PM if restore affects production or Review Queue decisions.

---

## Retention Rules

Default retention until PM changes it:

| Artifact | Retention |
|---|---|
| QA and decision logs | Keep in git history |
| Rejected or cleaned Paperclip test sessions | Retain audit trace while Paperclip integration is active |
| Production runtime backups | Keep minimum necessary for rollback; treat as secret-bearing |
| Local temporary backups | Delete after merge/acceptance unless PM keeps them as safety refs |
| Backup branches | Keep as local safety refs until PM approves deletion |

Do not delete audit evidence for AI-originated work unless PM creates a retention decision that preserves traceability requirements.

---

## Stop Conditions

Stop and route PM/Runtime Owner if:

- production data is mixed with dev/demo data
- a backup includes secrets but storage is not private
- a restore would remove Paperclip audit trace
- the active `APP_DATA_DIR` is unknown
- the backup source commit/environment is unknown
- any secret-bearing value appears in git, docs, browser JavaScript, screenshots, logs, or chat

---

## Handoff Evidence

```text
Role:
Environment:
APP_DATA_DIR:
Backup source:
Secret-bearing: yes/no
Restore performed: yes/no
Verification:
Paperclip gate:
Retention decision:
Next role:
```
