# Runtime Operations Runbook - Trisilar Task Hub

**Doc Role:** Runtime incident, restart, rollback, and production operations runbook
**Status:** Active
**Owner:** Runtime / Access Owner
**Created:** 2026-05-15
**Updated by:** Codex PM / Runtime Owner
**Related Docs:** `README.md`, `ENVIRONMENT_MATRIX.md`, `TROUBLESHOOTING.md`, `DEPLOYMENT_SETUP.md`, `../reference/SECURITY_ACCESS_POLICY.md`, `../reference/DATA_BACKUP_RETENTION_POLICY.md`, `../plans/VERSION_0_4_LIVE_AI_OPERATIONS_PAPERCLIP_PRODUCTION_PLAN.md`

---

## Purpose

Use this runbook when Task Hub runtime behavior, access, Paperclip intake, or deployment state needs operator action.

This document records safe operating steps only. Do not paste secrets, raw auth headers, Cloudflare token values, HMAC signing secrets, OAuth secrets, or production data into this file, logs, screenshots, or chat.

---

## Roles

| Role | Owns |
|---|---|
| Runtime Owner | Runtime health, deploy/restart/rollback, env vars, Cloudflare Access, service-token path |
| QA Release Owner | Read-only verification evidence and PASS/FAIL/HOLD |
| PM | Staged/permanent acceptance and route decisions |
| Paperclip Owner | Paperclip sender runtime config and signed webhook sender evidence |

QA may verify and report. QA must not edit runtime state unless explicitly assigned Runtime Owner too.

---

## Standard Checks

Run checks from the runtime host or an approved operator environment. Redact secrets from outputs before recording evidence.

| Check | Expected |
|---|---|
| Runtime process/container active | Service or container is running |
| Local `/healthz` | `200` |
| Public hostname without human login | Cloudflare Access blocks anonymous access |
| `/api/config` | `200` when runtime is healthy |
| `/api/reviews` | `200` when runtime data path is readable |
| Paperclip operations status | `read_only`; no secret values returned |
| Disabled webhook probe | `403` when `PAPERCLIP_WEBHOOK_ENABLED=false` |

Record only command names, status codes, redacted hostnames, source commit, and non-secret runtime mode.

---

## Incident Triage

1. Identify environment: dev/demo or production.
2. Confirm current source commit and branch from deployment metadata or runtime handoff.
3. Check local health before public route behavior.
4. Check Cloudflare Access separately from app health.
5. Check `APP_DATA_DIR` readability if `/api/reviews` or Paperclip Settings are failing.
6. If Paperclip is involved, check operations status before sending any canary.
7. If a stop condition appears, freeze new intake and route PM/QA.

Stop conditions:

- anonymous public access is not blocked
- production `APP_DATA_DIR` is shared with dev/demo
- secret values appear in logs, docs, screenshots, browser JavaScript, or chat
- Paperclip can create external side effects before human approval
- disabled webhook probe does not return `403`
- rollback cannot immediately set `PAPERCLIP_WEBHOOK_ENABLED=false`

---

## Restart

Use restart only when the intended commit, env vars, and data directory are known.

Before restart:

- record environment and source commit
- confirm whether this is dev/demo or production
- confirm `APP_DATA_DIR`
- confirm expected `PAPERCLIP_WEBHOOK_ENABLED` and `PAPERCLIP_LIVE_MODE`

After restart:

- local `/healthz` returns `200`
- public access behavior matches policy
- `/api/config` and `/api/reviews` return `200`
- Paperclip operations status remains read-only
- feature flags match the intended state

If post-restart checks fail, rollback or disable live intake before deeper investigation.

---

## Rollback

Rollback goal: stop risky intake first, then restore known-good app behavior.

Immediate Paperclip rollback:

1. Set `PAPERCLIP_WEBHOOK_ENABLED=false`.
2. Restart/reload runtime if required by the deployment method.
3. Confirm disabled webhook probe returns `403`.
4. Confirm operations status is read-only.
5. Record evidence in `docs/logs/QA_LOG.md` or runtime handoff.

App rollback:

1. Identify last accepted commit from `CURRENT_SPRINT.md`, QA log, or release checklist.
2. Restore the accepted runtime code or image.
3. Do not change `APP_DATA_DIR` unless restoring data is the explicit task.
4. Run standard checks.
5. Route PM/QA for acceptance.

---

## V0.4 Production Paperclip Gate

Production staged canary must not start until:

- production runtime is separate from dev/demo
- Cloudflare Access blocks anonymous public access
- production service-token path is verified without printing token values
- Paperclip Settings connection stores signing material under production `APP_DATA_DIR`
- `PAPERCLIP_WEBHOOK_ENABLED=false` before the staged window
- PM and QA approve the staged window

During staged window:

- valid signed production payload returns `201`
- Review Queue session remains pending
- replay and negative checks pass
- no Trello, Calendar, or Google Tasks side effect occurs before approval

After staged window:

- return to disabled or PM-approved permanent state
- record QA evidence and PM decision

---

## Handoff Format

```text
Role:
Environment:
Branch / commit:
Runtime service:
Hostname:
APP_DATA_DIR:
Flags:
Access evidence:
Health evidence:
Paperclip evidence:
Secret handling:
Rollback path:
DoD cleanup state:
Next role:
```
