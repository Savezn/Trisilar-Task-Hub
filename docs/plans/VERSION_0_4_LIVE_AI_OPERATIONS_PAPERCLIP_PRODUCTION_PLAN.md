# Version 0.4 Live AI Operations - Paperclip Production Permanent Integration Plan

**Doc Role:** V0.4 plan and tracker for production Paperclip intake
**Status:** Complete; production Paperclip permanent enablement active with Review Queue human gate
**Version:** V0.4
**Planning Stage:** Permanent production enablement complete / routine runtime monitoring
**Owner:** PM / AI Integration Owner / Runtime Owner / QA Release Owner
**Created:** 2026-05-15
**Last Updated:** 2026-05-16
**Updated by:** Codex PM / Dev / QA
**Related Docs:** `../../CURRENT_SPRINT.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../deployment/DEPLOYMENT_SETUP.md`, `../deployment/DIGITALOCEAN_DASHBOARD_HANDOVER.md`, `../adr/ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md`, `VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md`, `VERSION_0_3_RUX_06_RELEASE_CHECKLIST_DEV_MAIN.md`

---

## How to Use This Document

Use this document as the active V0.4 handoff for making Paperclip production intake permanent. It separates repo readiness, production runtime setup, staged production QA, permanent acceptance, and rollback.

V0.4 is complete. V0.5 Foundation Hardening and UI V2 work may continue in separate branches/worktrees as long as they do not change production runtime, Cloudflare policy, secrets, live Paperclip flags, or webhook auth behavior.

Do not paste secrets into this document. Record only non-secret hostnames, source/environment identifiers, command names, and redacted verification outcomes.

---

## Planning Summary

V0.4 promotes Paperclip from controlled dev/demo observation to a separate production runtime at `https://taskhub-prod.trisila.online`.

The production contract remains intentionally narrow:

- Paperclip calls `POST /api/integrations/paperclip/webhook`.
- Task Hub validates edge service-auth, HMAC signature, request id, source id, agent run id, timestamp, payload contract, replay/idempotency, and runtime connection state.
- Accepted payloads create pending Review Queue sessions only.
- Trello, Google Calendar, and Google Tasks writes still require explicit human approval from Review Queue.

Locked PM decisions:

| Decision | Value |
|---|---|
| Runtime target | Separate production runtime |
| Hostname | `https://taskhub-prod.trisila.online` |
| Go-live mode | Staged production window, then permanent |
| Acceptance depth | Pending Review Queue intake only; no production external write required |

---

## Scope / Non-Goals

In scope:

- Production-aware Paperclip operations status.
- Runtime policy env vars: `TASKHUB_RUNTIME_PROFILE`, `TASKHUB_PRODUCTION_HOSTNAME`, and `PAPERCLIP_LIVE_MODE`.
- Production readiness verification that runs without production secrets.
- Production runtime setup handoff for Runtime Owner and Paperclip Owner.
- QA evidence model for staged canary, replay, invalid signature, invalid source, invalid environment, and read-only monitoring.

Not in scope:

- Auto-approving Review Queue work.
- Direct Paperclip writes to Trello, Calendar, or Google Tasks.
- Storing Cloudflare tokens or HMAC signing secrets in docs, git, browser code, or chat.
- Reusing the dev/demo `APP_DATA_DIR` for production.
- Treating local verification as proof that Cloudflare production routing is already deployed.

---

## Dependency / Workflow Model

Branch/worktree:

```text
Branch: codex/v04-paperclip-prod-integration
Worktree: trisilar-task-hub-v04-paperclip-prod-integration
Base: origin/dev
Target: dev after QA/PM acceptance, then main by separate release decision
```

Owner lanes:

| Lane | Owner | Acceptance evidence |
|---|---|---|
| Repo implementation | AI Integration Owner / Dev | Local verification suite, new production readiness script |
| Production runtime | Runtime Owner | Production service, Cloudflare Access, env vars, health, rollback |
| Paperclip sender | Paperclip Owner | Production source id, service-token headers, HMAC signing configured |
| QA / release | QA Release Owner | Staged canary and negative checks, read-only status evidence |
| PM acceptance | PM | Decide staged -> permanent after monitoring window |

---

## Workstream / Phase Map

| ID | Phase | Status | Next Role |
|---|---|---|---|
| V0.4-PROD-01 | Repo production readiness | Integrated to `dev@7e069b5` | PM complete |
| V0.4-PROD-02 | Separate production runtime setup | Pass: private runtime + Cloudflare route + service token + Settings connection prepared | QA / Runtime / Paperclip Owner |
| V0.4-PROD-03 | Staged production canary window | Pass; runtime returned to disabled | QA / Runtime complete |
| V0.4-PROD-04 | 24-hour read-only monitoring | Pass; final checkpoint 2026-05-16T08:03:14Z | PM / Integration closeout |
| V0.4-PROD-05 | Permanent enablement acceptance | Complete; `taskhub-prod` permanent-enabled and rollback-tested | PM / Runtime complete |

---

## Workstream / Phase Details

### V0.4-PROD-01 - Repo Production Readiness

Required changes:

- Add production runtime fields to Paperclip operations status:
  - `runtime.profile`
  - `runtime.liveMode`
  - `runtime.appBaseUrl`
  - `runtime.productionHostname`
  - `runtime.dataDirConfigured`
- Add production-specific warning codes so production does not report the old dev/demo standing warning.
- Add `verify:paperclip-production-readiness` to validate production profile, staged mode, hard gate disabled behavior, pending Review Queue creation, replay/idempotency, invalid signature, invalid source, invalid environment, and no pre-approval Trello link.
- Add non-secret env examples for production runtime policy.

Acceptance:

- `npm.cmd run verify:paperclip-production-readiness` passes.
- Existing Paperclip verification scripts still pass.
- No webhook contract change is introduced.
- No secrets or raw auth values are committed.

Local verification result:

```text
Status: Pass
Date: 2026-05-15
Branch: codex/v04-paperclip-prod-integration
Production deploy: Not performed
Production live canary: Not sent
Secret exposure: None recorded
Verification:
- npm.cmd ci
- npm.cmd run check:all
- npm.cmd run verify:paperclip-contract
- npm.cmd run verify:paperclip-mock
- npm.cmd run verify:paperclip-docs
- npm.cmd run verify:paperclip-connection
- npm.cmd run verify:paperclip-operations
- npm.cmd run verify:paperclip-cleanup
- npm.cmd run verify:paperclip-webhook
- npm.cmd run verify:paperclip-production-readiness
- git diff --check
- conflict-marker scan
```

Integration result:

```text
Status: Pass
Date: 2026-05-15
Integrated commit: dev@7e069b5
Production deploy: Not performed
Production live canary: Not sent
Secret exposure: None recorded
Verification:
- npm.cmd ci
- npm.cmd run check:all
- npm.cmd run verify:paperclip-contract
- npm.cmd run verify:paperclip-mock
- npm.cmd run verify:paperclip-docs
- npm.cmd run verify:paperclip-connection
- npm.cmd run verify:paperclip-operations
- npm.cmd run verify:paperclip-cleanup
- npm.cmd run verify:paperclip-webhook
- npm.cmd run verify:paperclip-production-readiness
- git diff --check
```

Post-main/dev refresh verification:

```text
Status: Pass
Date: 2026-05-15
Worktree: trisilar-task-hub-v04-paperclip-prod-integration
Branch: codex/v04-paperclip-prod-integration@eef107b
Base: origin/dev@eef107b
Production deploy: Not performed
Production live canary: Not sent
Secret exposure: None recorded
Verification:
- npm.cmd ci
- npm.cmd run verify:paperclip-production-readiness
- npm.cmd run verify:paperclip-webhook
- npm.cmd run verify:paperclip-operations
- npm.cmd run verify:paperclip-connection
- npm.cmd run verify:paperclip-contract
- npm.cmd run verify:paperclip-mock
- npm.cmd run verify:paperclip-docs
- npm.cmd run verify:paperclip-cleanup
- git diff --check
Result: Repo-side V0.4 Paperclip production intake baseline remained ready at this checkpoint; staged canary was still blocked then on production service-token validation.
```

### V0.4-PROD-02 - Separate Production Runtime Setup

Runtime Owner configures a separate production service. Do not reuse dev/demo process, data directory, or secrets.

Production Task Hub env:

```text
APP_BASE_URL=https://taskhub-prod.trisila.online
APP_DATA_DIR=/home/trisilar/taskhub-prod-data
TASKHUB_RUNTIME_PROFILE=production
TASKHUB_PRODUCTION_HOSTNAME=https://taskhub-prod.trisila.online
PAPERCLIP_ALLOWED_SOURCE_ID=paperclip-do-prod
PAPERCLIP_PRODUCTION_SOURCE_ID=paperclip-do-prod
PAPERCLIP_ALLOWED_ENVIRONMENT=production
PAPERCLIP_WEBHOOK_ENABLED=false
PAPERCLIP_LIVE_MODE=disabled
PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS=300
```

Paperclip owner config:

```text
TASKHUB_BASE_URL=https://taskhub-prod.trisila.online
TASKHUB_PAPERCLIP_WEBHOOK_PATH=/api/integrations/paperclip/webhook
TASKHUB_CF_ACCESS_CLIENT_ID=<runtime-only secret>
TASKHUB_CF_ACCESS_CLIENT_SECRET=<runtime-only secret>
TASKHUB_WEBHOOK_SIGNING_SECRET=<runtime-only secret matching Task Hub connection>
```

Acceptance:

- Production service runs the accepted release commit.
- Cloudflare Access blocks anonymous public access before production use.
- Paperclip service-token path can reach Task Hub.
- `APP_DATA_DIR` is separate from dev/demo and persists after restart.
- `paperclip-connection.json` is treated as secret-bearing production data.

Runtime checkpoint:

```text
Status: Partial pass
Date: 2026-05-15
Runtime host: DigitalOcean Droplet
Runtime source: dev@e8a211b
Runtime process: Docker container taskhub-prod
Private bind: 127.0.0.1:3301
Public hostname: https://taskhub-prod.trisila.online
Cloudflare tunnel: existing healthy tunnel routes taskhub-prod.trisila.online to http://localhost:3301
Cloudflare Access: production self-hosted app created; anonymous /healthz returns 302
APP_DATA_DIR: /home/trisilar/taskhub-prod-data
Live mode: PAPERCLIP_LIVE_MODE=disabled
Webhook hard gate: PAPERCLIP_WEBHOOK_ENABLED=false
Operations status: mode=read_only; runtime.profile=production; connection.status=not_connected; reviewQueue.trelloLinked=0
Verification:
- local production /healthz 200
- local production /api/config 200
- local production /api/reviews 200
- local production /api/integrations/paperclip/operations/status 200
- disabled webhook probe 403
- Cloudflare authoritative DNS resolves taskhub-prod.trisila.online
- anonymous public /healthz returns Cloudflare Access 302
Not performed:
- production service-token creation or validation
- staged production canary
- Trello, Calendar, or Google Tasks side effect
- production secret disclosure
```

Completed before staged canary:

- Created and assigned a production Cloudflare Access service token for the Paperclip sender.
- Configured the runtime-only production candidate Paperclip env with production service-token headers out of band.
- Verified service-token reachability without printing token values.

Runtime follow-up:

```text
Status: Runtime setup pass; staged canary completed after approval
Date: 2026-05-15
Host: DigitalOcean Droplet
Task Hub production container: taskhub-prod running
Production local checks:
- /healthz 200
- /api/config 200
- /api/reviews 200
- /api/integrations/paperclip/operations/status 200
- disabled webhook probe 403
Production env: APP_BASE_URL=https://taskhub-prod.trisila.online; APP_DATA_DIR=/home/trisilar/taskhub-prod-data; TASKHUB_RUNTIME_PROFILE=production; PAPERCLIP_WEBHOOK_ENABLED=false; PAPERCLIP_LIVE_MODE=disabled
Operations status after Settings connection: mode=read_only; runtime.profile=production; connection.status=connected; connection.hasSecret=true; connection.secretPreview=configured; liveWebhook.enabled=false; reviewQueue.trelloLinked=0
Connection file: /home/trisilar/taskhub-prod-data/paperclip-connection.json present and treated as secret-bearing production data
Production candidate Paperclip env: /home/trisilar/.paperclip/.env.taskhub-prod created with TASKHUB_BASE_URL=https://taskhub-prod.trisila.online and matching runtime signing secret
Service-token validation: production Cloudflare Access service token returns 200 for https://taskhub-prod.trisila.online/healthz
Decision after canary: keep production runtime disabled until read-only monitoring passes and PM accepts permanent enablement.
Secret exposure: None recorded in tracker; secret values were not copied into docs.
```

### V0.4-PROD-03 - Staged Production Canary Window

Runtime Owner changes:

```text
PAPERCLIP_LIVE_MODE=staged
PAPERCLIP_WEBHOOK_ENABLED=true
```

QA checks:

- Disabled hard gate previously returned `403`.
- Valid signed production payload returns `201`.
- Review Queue session is pending.
- Same-payload replay returns `200`.
- Changed replay returns `409`.
- Invalid signature returns `401`.
- Invalid source returns `403`.
- Invalid environment returns `400`.
- Operations status remains `mode: read_only`.
- `reviewQueue.trelloLinked` remains `0`.

Acceptance:

- No secret exposure.
- No auto-approval.
- No Trello, Calendar, or Google Tasks side effect before human approval.
- No danger warning in operations status.

Staged production canary result:

```text
Status: Pass
Date: 2026-05-15
Runtime window: enabled temporarily; rolled back to disabled
Preflight disabled probe: 403
Staged mode: PAPERCLIP_LIVE_MODE=staged; PAPERCLIP_WEBHOOK_ENABLED=true
Valid signed production payload: 201
Review Queue session: 57fdc85e-fe1e-4711-9269-c26d5ead3b07
Task status: pending
Same-payload replay: 200
Changed replay: 409
Invalid signature: 401
Invalid source: 403
Invalid environment: 400
Operations status: mode=read_only
Review Queue counts after canary: pending=1; approved=0; rejected=0; trelloLinked=0
Rollback: PAPERCLIP_LIVE_MODE=disabled; PAPERCLIP_WEBHOOK_ENABLED=false; disabled probe 403
Secret exposure: None recorded
External side effects: none
```

### V0.4-PROD-04 - 24-Hour Read-Only Monitoring

Monitoring rules:

- Use read-only operations status by default.
- Do not send routine canaries after staged pass unless PM/QA requests, runtime changes, Paperclip sender changes, or read-only evidence suggests regression.
- Monitor Review Queue counts, audit categories, danger warnings, and unexpected side effects.
- Keep parallel V0.5/UI V2 design work isolated from runtime/secrets/live flag work.

Stop conditions:

- Any danger warning appears.
- New Paperclip-created task is auto-approved.
- Any Paperclip-created task links to Trello/Calendar/Google before human approval.
- Replay/auth negative behavior regresses.
- Runtime Owner cannot disable `PAPERCLIP_WEBHOOK_ENABLED` immediately.

Monitoring checkpoint 1:

```text
Status: Pass
Date: 2026-05-15T05:24:25Z
Automation: v0-4-paperclip-prod-read-only-monitor active every 6 hours
Container: taskhub-prod up
Health: /healthz 200; /api/config 200; /api/reviews 200
Webhook gate: disabled probe 403
Runtime: PAPERCLIP_LIVE_MODE=disabled; liveWebhook.enabled=false
Operations: mode=read_only; connection.status=connected; connection.hasSecret=true
Review Queue: pending=1; approved=0; rejected=0; trelloLinked=0; paperclipSessions=1; paperclipTasks=1
Canary session: 57fdc85e-fe1e-4711-9269-c26d5ead3b07 remains pending
Warnings: none
Danger warnings: none
Audit accepted: paperclip_payload_received=1; review_session_created=1; task_diff_resolved=1
Audit replay: paperclip_duplicate_payload_ignored=1
Audit rejected: paperclip_duplicate_payload_rejected=1
External side effects: none
```

Monitoring final checkpoint:

```text
Status: Pass
Date: 2026-05-16T08:03:14Z
Elapsed time: more than 24 hours since 2026-05-15T05:24:25Z
Container: taskhub-prod up 27 hours
Health: /healthz 200; /api/config 200; /api/reviews 200
Webhook gate: disabled probe 403
Runtime: PAPERCLIP_LIVE_MODE=disabled; liveWebhook.enabled=false
Operations: mode=read_only; connection.status=connected; connection.hasSecret=true
Review Queue: pending=1; approved=0; rejected=0; trelloLinked=0; paperclipSessions=1; paperclipTasks=1
Canary session: 57fdc85e-fe1e-4711-9269-c26d5ead3b07 remains pending
Warnings: none
Danger warnings: none
Audit accepted: paperclip_payload_received=1; review_session_created=1; task_diff_resolved=1
Audit replay: paperclip_duplicate_payload_ignored=1
Audit rejected: paperclip_duplicate_payload_rejected=1
External side effects: none
```

### V0.4-PROD-05 - Permanent Enablement Acceptance

After staged QA and 24-hour read-only monitoring pass, PM may accept permanent enablement:

```text
PAPERCLIP_LIVE_MODE=permanent
PAPERCLIP_WEBHOOK_ENABLED=true
```

PM acceptance package:

- Monitoring evidence covers at least 24 hours from `2026-05-15T05:24:25Z`.
- Every checkpoint reports production runtime health `200` for `/healthz`, and no sustained API health failure.
- Disabled webhook probe returns `403` until PM explicitly accepts permanent enablement.
- Operations status remains `mode=read_only` during monitoring.
- `PAPERCLIP_LIVE_MODE=disabled` and `liveWebhook.enabled=false` remain true during monitoring.
- Paperclip Settings remains connected with `hasSecret=true`; no secret value is printed, copied into docs, committed, or returned to browser UI.
- Canary Review Queue session `57fdc85e-fe1e-4711-9269-c26d5ead3b07` remains pending until a human explicitly approves or rejects it.
- Review Queue counts show no auto-approval and `trelloLinked=0`.
- Warnings contain no `danger` level entries.
- Audit categories preserve accepted/replay/rejected traceability for the staged canary.
- No Trello card, Google Calendar event, or Google Task is created from Paperclip before human approval.
- Runtime Owner confirms rollback path still works before permanent enablement.

Permanent enablement runbook:

1. Confirm the PM acceptance package above is complete and recorded in `docs/logs/QA_LOG.md`.
2. Record the permanent enablement decision in `docs/logs/DECISION_LOG.md` before changing production runtime flags.
3. Back up the current production runtime env file without printing secret values.
4. Set only these production runtime policy values:
   - `PAPERCLIP_LIVE_MODE=permanent`
   - `PAPERCLIP_WEBHOOK_ENABLED=true`
5. Restart or recreate only the production Task Hub runtime needed to load those flags.
6. Verify `/healthz`, `/api/config`, `/api/reviews`, and `/api/integrations/paperclip/operations/status`.
7. Confirm operations status shows production profile, permanent live mode, connected Paperclip Settings, no danger warnings, and `trelloLinked=0`.
8. Do not send a new Paperclip canary unless PM/QA explicitly requests it after permanent enablement.
9. Keep Review Queue as the mandatory human gate for external writes.

Rollback runbook:

1. Set `PAPERCLIP_WEBHOOK_ENABLED=false`.
2. Set `PAPERCLIP_LIVE_MODE=disabled`.
3. Restart or recreate only the production Task Hub runtime needed to load those flags.
4. Verify `/healthz` returns `200`.
5. Verify disabled webhook probe returns `403`.
6. Verify operations status shows `mode=read_only`, `liveWebhook.enabled=false`, `runtime.liveMode=disabled`, and no danger warnings caused by external side effects.
7. Record the rollback evidence in `docs/logs/QA_LOG.md` without secret values.

Permanent enablement evidence:

```text
Timestamp: 2026-05-16T11:44Z
Production URL: https://taskhub-prod.trisila.online
Runtime: taskhub-prod
Runtime flags: PAPERCLIP_LIVE_MODE=permanent; PAPERCLIP_WEBHOOK_ENABLED=true
Health: /healthz 200; /api/config 200; /api/reviews 200
Operations: mode=read_only; runtime.profile=production; liveWebhook.enabled=true; connection.status=connected; connection.hasSecret=true
Review Queue: pending=1; approved=0; rejected=0; trelloLinked=0
Warnings: production_permanent_live_enabled only
Danger warnings: none
Public access: Cloudflare Access anonymous 302
Rollback proof: restored disabled mode, disabled webhook probe returned 403, then re-enabled permanent mode with health 200
External side effects: no new signed canary; no Trello, Calendar, Google Tasks, or live Paperclip side effect
Secrets: not printed or committed
```

Draft PR routing:

- Target branch: `dev`.
- Draft PR: #27 (`codex/v04-paperclip-prod-integration` -> `dev`).
- PR status: merged to `dev@c866a7d` on 2026-05-16.
- Ready-for-review condition: met for pre-permanent merge because 24-hour read-only monitoring passed with no stop condition.
- PR body stated the production webhook remained disabled before permanent enablement.
- Merge hold: cleared; permanent enablement was completed later as V0.4-PROD-05 runtime work.

---

## Delivery Rules

- Stage specific files only; never use `git add .`.
- Keep production secrets runtime-only.
- Keep Task Hub browser code away from Paperclip Docs API tokens and webhook signing secrets.
- Keep Review Queue mandatory before external side effects.
- Treat production backups of `APP_DATA_DIR` as secret-bearing because `paperclip-connection.json` contains the runtime signing secret.
- Do not claim production deployment until Runtime Owner provides live evidence.

---

## Next Recommended Session

```text
Role: PM / Runtime Owner
Task: Routine production Paperclip monitoring and rollback readiness.
Branch: dev or a new codex/runtime branch if PM chooses to change runtime flags
Worktree: main dev/runtime worktree selected by Runtime Owner
Owned files: decision log, QA log, runtime evidence, and production runtime flags only if PM chooses a new runtime change
Acceptance criteria: production remains permanent-enabled, Review Queue gated, no secret values are exposed, and rollback evidence remains available
Verification: production /healthz, /api/config, /api/reviews, operations status, Review Queue counts, warning/danger-warning review, and Cloudflare Access public block
Stop conditions: danger warning, auto-approval, Trello/Calendar/Google side effect before human approval, secret exposure, or inability to restore disabled mode
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-15 | Created V0.4 Paperclip production permanent integration plan and repo readiness tracker | Codex PM / Dev |
| 2026-05-15 | Added production runtime policy/status, production readiness verification, and local QA evidence; production deploy remains pending Runtime Owner | Codex Dev / QA |
| 2026-05-15 | Integrated V0.4 repo readiness to `dev@7e069b5` and routed next process to separate production runtime setup | Codex Integration Owner |
| 2026-05-15 | Prepared production private runtime, Cloudflare tunnel route, DNS, and Access app; held staged canary at that checkpoint until production service-token and Settings connection were completed | Codex Runtime Owner |
| 2026-05-15 | Refreshed V0.4 worktree from `origin/dev@eef107b` after main/dev update and reran Paperclip production/intake verifiers; runtime service-token and Settings connection remained pending at that checkpoint | Codex Runtime Owner / QA |
| 2026-05-15 | Verified production runtime is still healthy with webhook disabled, but held staged canary because the available Paperclip sender env still targets dev/demo and production Settings connection is missing | Codex Runtime Owner |
| 2026-05-15 | Merged latest `origin/dev@622c7dd` DoR/DoD governance baseline into the V0.4 branch; V0.4 production service-auth hold remains unchanged | Codex Runtime Owner / Integration |
| 2026-05-15 | Connected production Paperclip Settings and prepared a runtime-only production Paperclip env candidate; staged canary remained blocked at that checkpoint because the copied Cloudflare Access token still returned 302 on the production hostname | Codex Runtime Owner |
| 2026-05-15 | Created and assigned production Cloudflare Access service token for `taskhub-prod.trisila.online`; runtime-only candidate env reached production `/healthz` with `200`; staged canary still awaited approval at that checkpoint | Codex Runtime Owner |
| 2026-05-15 | Ran staged production canary against `taskhub-prod.trisila.online`; valid signed payload created pending Review Queue session `57fdc85e-fe1e-4711-9269-c26d5ead3b07`, replay/negative checks passed, no external side effect occurred, and runtime rollback restored disabled mode | Codex Runtime Owner / QA |
| 2026-05-15 | Started V0.4 24-hour read-only monitoring; first checkpoint passed with production gate disabled, no warnings, no danger warnings, and no external side effects; automation `v0-4-paperclip-prod-read-only-monitor` runs every 6 hours | Codex QA / Runtime Owner |
| 2026-05-15 | Opened draft PR #27 to `dev` as a hold-state integration PR while the 24-hour monitoring window was active; permanent enablement was not accepted | Codex Integration Owner |
| 2026-05-16 | Completed V0.4 24-hour read-only monitoring with final production checkpoint pass; production webhook remained disabled at that checkpoint and permanent enablement remained a separate runtime decision | Codex QA / PM / Runtime Owner |
| 2026-05-16 | Merged PR #27 to `dev@c866a7d`; V0.4 monitoring no longer blocked follow-on versions, and permanent enablement remained a separate PM / Runtime Owner runtime switch until V0.4-PROD-05 | Codex Integration Owner |
| 2026-05-16 | Completed V0.4-PROD-05 permanent production enablement on `taskhub-prod`; rollback proof passed and Review Queue remained gated with no external side effects | Codex Runtime Owner / QA / PM |
