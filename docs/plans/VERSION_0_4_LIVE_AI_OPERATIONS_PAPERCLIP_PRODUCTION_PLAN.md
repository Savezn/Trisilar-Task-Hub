# Version 0.4 Live AI Operations - Paperclip Production Permanent Integration Plan

**Doc Role:** V0.4 plan and tracker for production Paperclip intake
**Status:** Production private runtime + Cloudflare Access route prepared; staged canary not approved
**Version:** V0.4
**Planning Stage:** Runtime setup partial pass, production Settings connected, production service-auth pending
**Owner:** PM / AI Integration Owner / Runtime Owner / QA Release Owner
**Created:** 2026-05-15
**Last Updated:** 2026-05-15
**Updated by:** Codex PM / Dev
**Related Docs:** `../../CURRENT_SPRINT.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../deployment/DEPLOYMENT_SETUP.md`, `../deployment/DIGITALOCEAN_DASHBOARD_HANDOVER.md`, `../adr/ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md`, `VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md`, `VERSION_0_3_RUX_06_RELEASE_CHECKLIST_DEV_MAIN.md`

---

## How to Use This Document

Use this document as the active V0.4 handoff for making Paperclip production intake permanent. It separates repo readiness, production runtime setup, staged production QA, permanent acceptance, and rollback.

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
| V0.4-PROD-02 | Separate production runtime setup | Partial pass: private runtime + Cloudflare route + Settings connection prepared; service-token still returns `302` | Runtime Owner / Paperclip Owner |
| V0.4-PROD-03 | Staged production canary window | Pending runtime | QA / Runtime / Paperclip Owner |
| V0.4-PROD-04 | 24-hour read-only monitoring | Pending staged pass | QA / Runtime |
| V0.4-PROD-05 | Permanent enablement acceptance | Pending monitoring pass | PM |

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
Result: Repo-side V0.4 Paperclip production intake baseline remains ready; staged canary remains blocked on production service-token validation.
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

Remaining before staged canary:

- Create or assign a production Cloudflare Access service token for the Paperclip sender.
- Configure Paperclip sender with the production service-token headers out of band.
- Verify service-token reachability without printing token values.

Runtime follow-up:

```text
Status: Settings connected; blocked on production service-token before staged canary
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
Service-token validation: copied Cloudflare Access token in the production candidate env still returns 302 for https://taskhub-prod.trisila.online/healthz
Decision: Do not restart Paperclip into the production candidate env, enable webhook, or run staged canary until the production Cloudflare Access service token returns 200.
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

### V0.4-PROD-04 - 24-Hour Read-Only Monitoring

Monitoring rules:

- Use read-only operations status by default.
- Do not send routine canaries after staged pass unless PM/QA requests, runtime changes, Paperclip sender changes, or read-only evidence suggests regression.
- Monitor Review Queue counts, audit categories, danger warnings, and unexpected side effects.

Stop conditions:

- Any danger warning appears.
- New Paperclip-created task is auto-approved.
- Any Paperclip-created task links to Trello/Calendar/Google before human approval.
- Replay/auth negative behavior regresses.
- Runtime Owner cannot disable `PAPERCLIP_WEBHOOK_ENABLED` immediately.

### V0.4-PROD-05 - Permanent Enablement Acceptance

After staged QA and 24-hour read-only monitoring pass, PM may accept permanent enablement:

```text
PAPERCLIP_LIVE_MODE=permanent
PAPERCLIP_WEBHOOK_ENABLED=true
```

Acceptance:

- PM records the permanent decision in `docs/logs/DECISION_LOG.md`.
- QA records evidence in `docs/logs/QA_LOG.md`.
- `CURRENT_SPRINT.md` moves V0.4 from active rollout to runtime monitoring.
- Rollback remains a one-step hard gate: set `PAPERCLIP_WEBHOOK_ENABLED=false`.

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
Role: Runtime Owner
Task: Complete production service-auth and Paperclip Settings connection, keep the webhook hard gate disabled, and hand off staged QA evidence
Branch: dev@e8a211b
Worktree: production runtime checkout
Owned files: runtime configuration only; no git docs/code changes unless setup docs are inaccurate
Acceptance criteria: production service-token path reaches Task Hub, Paperclip Settings connection stores the runtime signing secret under production APP_DATA_DIR, PAPERCLIP_WEBHOOK_ENABLED remains false, and no secret values are printed
Verification: Cloudflare Access service-token reachability path; read-only operations status shows production profile; disabled webhook probe returns 403
Stop conditions: missing secret-management path, shared dev/demo APP_DATA_DIR, anonymous production access, exposed signing material, or any need to enable the production webhook before QA approval
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-15 | Created V0.4 Paperclip production permanent integration plan and repo readiness tracker | Codex PM / Dev |
| 2026-05-15 | Added production runtime policy/status, production readiness verification, and local QA evidence; production deploy remains pending Runtime Owner | Codex Dev / QA |
| 2026-05-15 | Integrated V0.4 repo readiness to `dev@7e069b5` and routed next process to separate production runtime setup | Codex Integration Owner |
| 2026-05-15 | Prepared production private runtime, Cloudflare tunnel route, DNS, and Access app; held staged canary pending production service-token and Settings connection at that checkpoint | Codex Runtime Owner |
| 2026-05-15 | Refreshed V0.4 worktree from `origin/dev@eef107b` after main/dev update and reran Paperclip production/intake verifiers; runtime service-token and Settings connection remained pending at that checkpoint | Codex Runtime Owner / QA |
| 2026-05-15 | Verified production runtime is still healthy with webhook disabled, but held staged canary because the available Paperclip sender env still targets dev/demo and production Settings connection is missing | Codex Runtime Owner |
| 2026-05-15 | Merged latest `origin/dev@622c7dd` DoR/DoD governance baseline into the V0.4 branch; V0.4 production service-auth hold remains unchanged | Codex Runtime Owner / Integration |
| 2026-05-15 | Connected production Paperclip Settings and prepared a runtime-only production Paperclip env candidate; staged canary remains blocked because the copied Cloudflare Access token still returns 302 on the production hostname | Codex Runtime Owner |
