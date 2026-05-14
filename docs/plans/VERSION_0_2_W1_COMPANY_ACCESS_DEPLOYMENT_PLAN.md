# Version 0.2 W1 Company Access + Deployment Plan

**Doc Role:** W1 workstream phase ladder and execution plan
**Status:** Active - `V0.2-W1-05` accepted as random ngrok URL manual demo only; `V0.2-W1-06`/`V0.2-W1-08` QA Pass / PM Accepted for dev/demo runtime; `V0.2-W1-07` QA Pass / PM Accepted
**Version:** V0.2
**Planning Stage:** Dev/demo runtime and service-auth topology accepted; Paperclip runtime inputs confirmed for W3-02 routing
**Owner:** PM / Platform Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-14 - **Updated by:** Codex PM / Runtime
**Related Docs:** `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `../deployment/DEPLOYMENT_SETUP.md`, `../deployment/DEV_ENVIRONMENT_DEPLOYMENT.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../logs/DECISION_LOG.md`
**Theme:** Keep W1 human preview secure while moving from demo-only access to hosted dev/demo runtime and service-auth planning.

---

## How to Use This Document

- Use this as the W1 source of truth for company access and deployment sequencing.
- Keep active sprint prompts in `../../CURRENT_SPRINT.md`.
- Keep W1 implementation/runtime evidence in `../deployment/DEV_ENVIRONMENT_DEPLOYMENT.md`.
- Keep major PM decisions in `../logs/DECISION_LOG.md`.
- Do not use this document for W2 UI redesign or W3 Paperclip implementation details.

---

## Planning Summary

W1 originally prepared Render/Railway hosted deployment readiness. PM later decided not to spend on hosted deployment before teammate preview value is proven.

PM accepted `V0.2-W1-05` as a short manual teammate demo through local ngrok + temporary Basic Auth. That path remains demo-only and is not a durable Paperclip endpoint.

PM now confirmed a Cloudflare-managed domain exists and selected DigitalOcean as the next hosted dev/demo runtime direction. The updated W1 direction is to keep Cloudflare as the DNS/security front door and use DigitalOcean as the preferred always-on dev/demo runtime for Task Hub. Render remains a previously approved managed paid target, Railway remains the managed alternate, but DigitalOcean is now the next W1 runtime path because it can host long-running services with file-backed Task Hub state at low monthly cost.

PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner. Task Hub is now accepted as a Cloudflare-protected DigitalOcean dev/demo runtime. Paperclip runtime inputs are confirmed for W3 planning: base URL `https://paperclip.trisila.online`, health path `/healthz`, source id `paperclip-do-dev`, environment `dev`, local runtime port `3100`, service `paperclip.service`, and Task Hub service-token `/healthz` check status `200` from the Paperclip server.

Current W1 decision:

- Keep ngrok + temporary Basic Auth as the accepted short manual demo path only.
- Use DigitalOcean + Cloudflare front door as the next hosted dev/demo runtime for Task Hub.
- Keep Cloudflare Access as the human teammate access gate.
- Use Cloudflare Access service-token or equivalent service-auth pattern for future Paperclip/API access.
- Treat hosted Paperclip as an external runtime dependency owned by the Paperclip owner; use the confirmed URL/health path for W3 live planning.
- Use random ngrok URLs only for short manual teammate demos; share URL/password out of band and rotate by restarting the launcher.
- Prepare future Paperclip/multi-agent access with a stable URL/auth pattern, but do not implement new W3 behavior in W1.
- Keep Render as the previously approved managed paid target and Railway as the managed alternate.
- Do not treat random `trycloudflare` or random ngrok URLs as durable Paperclip integration endpoints.

---

## Scope / Non-Goals

In scope:

- Demo-only teammate preview through ngrok.
- DigitalOcean hosted dev/demo runtime planning and setup for Task Hub.
- Temporary Basic Auth gate for the no-domain demo.
- Cloudflare DNS/proxy/Tunnel and Cloudflare Access email allowlist for human users.
- Future Cloudflare Access service-token pattern for Paperclip/API calls.
- Stable local preview runtime with `APP_DATA_DIR`.
- Stable hosted dev/demo runtime with `APP_DATA_DIR`.
- Hosted callback values through `APP_BASE_URL` and `GOOGLE_REDIRECT_URI`.
- Clear separation between human access and future agent/API access.
- Deferred managed hosted target notes for Render/Railway.

Out of scope:

- Production deployment.
- Production deployment.
- Managed Render/Railway deployment before PM approval.
- W2 UI redesign.
- New W3 Paperclip behavior.
- Per-user app RBAC.
- Committing secrets, generated runtime data, or production exports.

---

## Dependency / Workflow Model

```text
V0.2-W1-01..V0.2-W1-03 repo readiness done
    -> V0.2-W1-04 PM no-cost preview decision accepted
    -> V0.2-W1-05 no-domain temporary demo path with ngrok
    -> V0.2-W1-06 stable Cloudflare hostname + Access teammate gate
    -> V0.2-W1-08 DigitalOcean hosted dev/demo runtime setup for Task Hub
    -> V0.2-W1-07 future Paperclip agent/API access pattern
```

Aliases: `W1.0`-`W1.7`.

Branch/workflow rules:

- W1 repo changes still start from `dev` and go through PR unless PM explicitly approves a docs-only direct update.
- Runtime setup may use local machine and ngrok for the temporary demo. The next hosted path uses DigitalOcean plus Cloudflare DNS/Tunnel/Access for Task Hub. Secrets stay out of git.
- Production remains untouched.
- W2 and W3 continue independently from their own branches/worktrees.

Runtime dependency rules:

- Local machine must stay online during teammate preview.
- `APP_DATA_DIR` must point to a stable preview data directory.
- Temporary Basic Auth must protect the ngrok demo URL before sharing it.
- Cloudflare Access must block anonymous users before sharing a stable Cloudflare/hosted URL.
- For `V0.2-W1-08`, prepare the Cloudflare hostname and Access policy before public exposure, deploy Task Hub privately on DigitalOcean, then connect the Cloudflare route and verify access before sharing.
- Paperclip agent/service-token access is only a pattern in W1; live agent integration remains W3-owned. Random tunnel URLs are not durable Paperclip endpoints.
- Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner; Task Hub now has an accepted stable dev/demo hosted URL, and the Task Hub service-token `/healthz` check from the Paperclip server passed.

---

## Workstream / Phase Map

| Canonical ID | Alias | Status | Owner | Scope | Exit Criteria |
|---|---|---|---|---|---|
| `V0.2-W1-01` | `W1.0` | Done | PM / QA | Platform/access decision | Render/Railway/Vercel tradeoff reviewed; Cloudflare Access selected as gate |
| `V0.2-W1-02` | `W1.1` | Done | Dev / QA | Repo deploy readiness | `APP_BASE_URL`, `GOOGLE_REDIRECT_URI`, `APP_DATA_DIR`, `/healthz`, placeholder env docs merged |
| `V0.2-W1-03` | `W1.2` | Done | Dev / QA / PM | Dev deployment config | `render.yaml`, `railway.toml`, and hosted dev setup handoff merged to `dev` |
| `V0.2-W1-04` | `W1.3` | Accepted / amended | PM | Preview/runtime decision | Random ngrok accepted for manual demo; DigitalOcean + Cloudflare selected for next hosted dev/demo runtime |
| `V0.2-W1-05` | `W1.4` | Accepted demo-only | Dev / QA / PM | No-domain random ngrok manual demo runtime | QA verified Basic Auth, `/healthz`, app load, hosted callback, and local-only data path; PM accepted for short manual teammate demo only |
| `V0.2-W1-06` | `W1.5` | QA Pass / PM Accepted for dev/demo | Dev / QA / PM | Stable Cloudflare hostname + Access email allowlist | Task Hub hostname confirmed; Cloudflare Access blocks anonymous users; approved teammate can access and load the app |
| `V0.2-W1-07` | `W1.6` | QA Pass / PM Accepted | Dev / PM / QA | Paperclip agent/API access prep | Service-token and signed-webhook pattern documented for hosted Paperclip -> hosted Task Hub integration without W3 implementation |
| `V0.2-W1-08` | `W1.7` | QA Pass / PM Accepted for dev/demo | PM / Dev / QA | DigitalOcean hosted dev/demo runtime for Task Hub | Runtime, persistent Task Hub `APP_DATA_DIR`, Cloudflare routing, health checks, access gate, non-destructive app load, and hosted Paperclip dependency evidence verified |

---

## Workstream / Phase Details

### V0.2-W1-01 - Platform / Access Decision

**Alias:** W1.0

**Status:** Done
**Owner:** PM / QA

Decision:

- Render is the default paid hosted target.
- Railway is the paid hosted alternate.
- Vercel is not suitable for W1 because the current app is a long-running Express service with file-backed state.
- Cloudflare Access is the preferred access gate.

### V0.2-W1-02 - Repo Deploy Readiness

**Alias:** W1.1

**Status:** Done
**Owner:** Dev / QA

Completed:

- Added `APP_BASE_URL` and `GOOGLE_REDIRECT_URI`.
- Added `APP_DATA_DIR` support for runtime JSON files.
- Added `GET /healthz`.
- Updated placeholder-only env docs.
- Verified local behavior and persistence.

### V0.2-W1-03 - Dev Deployment Config

**Alias:** W1.2

**Status:** Done
**Owner:** Dev / QA / PM

Completed:

- Added `render.yaml`.
- Added `railway.toml`.
- Added deployment handoff docs.
- Merged PR #2 to `dev`.

### V0.2-W1-04 - No-Cost Preview Decision

**Alias:** W1.3

**Status:** Accepted / amended
**Owner:** PM

Decision:

- Use ngrok + temporary Basic Auth for the immediate no-domain demo.
- Use DigitalOcean + Cloudflare as the next always-on dev/demo path for Task Hub.
- Defer managed Render/Railway deployment unless PM reselects them.
- Keep `trycloudflare` as a troubleshooting tool only because the random URL is not suitable for Paperclip or repeat handoff.

### V0.2-W1-05 - No-Domain Temporary Demo Runtime

**Alias:** W1.4

**Status:** Accepted demo-only
**Owner:** Dev / QA / PM

Tasks:

- Use the local Desktop ngrok launcher or equivalent local-only script.
- Run the app locally with stable `APP_DATA_DIR`.
- Expose the local app through ngrok.
- Protect the public ngrok URL with temporary Basic Auth before sharing.
- Configure local preview env for the current ngrok URL when OAuth callback behavior is being tested:
  - `APP_BASE_URL=https://<current-ngrok-host>`
  - `GOOGLE_REDIRECT_URI=https://<current-ngrok-host>/auth/callback`
- Write current URL and temporary credentials to a local-only handoff file outside git.
- Verify local and tunneled `/healthz`.
- For Paperclip demo use, prefer a reserved/static ngrok domain. If the URL is random, treat it as a manual per-run handoff only.

PM acceptance:

- QA passed W1.4 no-domain ngrok verification.
- PM accepts the random ngrok URL path for short manual teammate demo only.
- Current URL and temporary credentials are read from `C:\Users\User\Desktop\Trisilar-TaskHub-current-demo-url.txt`.
- URL/password must be shared out of band only and must not be committed, pasted into chat, or written into repo docs.
- Paperclip automation, permanent webhook use, and stable service integration remain deferred until Task Hub hosted dev hostname, hosted Paperclip URL/health path, and service-auth are verified.

Acceptance criteria:

- Local server starts cleanly.
- ngrok routes the public demo URL to the app.
- Temporary Basic Auth blocks unauthenticated access.
- `GET /healthz` returns `200` through the tunnel.
- No secrets are committed.
- No production service is deployed.
- PM records this as a demo-only path, not a release-grade access gate.

### V0.2-W1-06 - Stable Cloudflare Hostname + Access Email Allowlist

**Alias:** W1.5

**Status:** QA Pass / PM Accepted for dev/demo
**Owner:** Dev / QA

Tasks:

- Confirm the Cloudflare-managed domain and the stable Task Hub preview hostname.
- Route the preview hostname to Task Hub through Cloudflare Tunnel or Cloudflare proxied DNS, depending on the DigitalOcean setup.
- Create Cloudflare Access application for the preview hostname.
- Add approved teammate emails or a PM-approved group.
- Verify anonymous users are blocked.
- Verify approved teammate access.
- Verify basic non-destructive app load.

Acceptance criteria:

- Anonymous access is blocked before sharing the URL.
- Approved teammate can access the app.
- App loads without destructive Trello or Google writes.

2026-05-13 PM checkpoint:

- Task Hub hostname is `https://taskhub.trisila.online`.
- Anonymous `/healthz` request returns Cloudflare Access `302` to `trisilar.cloudflareaccess.com`.
- Approved-user browser path loaded the app after Cloudflare Access login without the earlier `/api/boards` or `/api/all-cards` `401` errors.
- PR #9 was merged to `dev` at `91ee327`; PM accepted `V0.2-W1-06` as dev/demo complete, not production/release-grade.

### V0.2-W1-07 - Paperclip Agent Access Prep

**Alias:** W1.6

**Status:** QA Pass / PM Accepted
**Owner:** Dev / PM

Decision:

- First live direction is Paperclip calls Task Hub by webhook.
- Task Hub does not poll Paperclip in the first live connector. Task Hub may later call a Paperclip health/readiness endpoint for diagnostics only.
- Human users keep Cloudflare Access email login.
- Machine/API access uses Cloudflare Access service token at the edge plus signed webhook headers at the Task Hub application boundary.
- Live Paperclip behavior remains W3-owned; W1 only records topology, env var names, and handoff requirements.

Recorded hosted endpoints:

| Service | Base URL | Health/readiness |
|---|---|---|
| Task Hub | `https://taskhub.trisila.online` | `/healthz` |
| Paperclip | `https://paperclip.trisila.online` | `/healthz` |

Confirmed runtime inputs:

- `PAPERCLIP_ALLOWED_SOURCE_ID`: `paperclip-do-dev`
- `PAPERCLIP_ALLOWED_ENVIRONMENT`: `dev`
- Paperclip local runtime port: `3100`
- Paperclip service: `paperclip.service`
- Task Hub service-token `/healthz` check from the Paperclip server returned `200`
- Cloudflare Client ID/Secret and HMAC signing secret remain excluded from docs/chat/git.

Recommended W3 live endpoint:

```text
POST /api/integrations/paperclip/webhook
```

Auth topology:

```text
Hosted Paperclip
  -> Cloudflare Access service token headers
  -> https://taskhub.trisila.online
  -> signed Task Hub webhook headers
  -> Review Queue
  -> human approval
  -> existing Trello / Google paths
```

Task Hub runtime env var names:

- `PAPERCLIP_WEBHOOK_ENABLED`
- `PAPERCLIP_WEBHOOK_SIGNING_SECRET`
- `PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS`
- `PAPERCLIP_ALLOWED_SOURCE_ID`
- `PAPERCLIP_ALLOWED_ENVIRONMENT`
- `PAPERCLIP_BASE_URL`
- `PAPERCLIP_HEALTH_PATH`
- `CLOUDFLARE_ACCESS_AUD`
- `CLOUDFLARE_ACCESS_TEAM_DOMAIN`

Paperclip runtime env var names:

- `TASKHUB_BASE_URL`
- `TASKHUB_PAPERCLIP_WEBHOOK_PATH`
- `TASKHUB_WEBHOOK_SIGNING_SECRET`
- `TASKHUB_CF_ACCESS_CLIENT_ID`
- `TASKHUB_CF_ACCESS_CLIENT_SECRET`

Signed webhook headers:

- `X-TaskHub-Request-Id`
- `X-TaskHub-Timestamp`
- `X-TaskHub-Signature`
- `X-Paperclip-Source`
- `X-Paperclip-Agent-Run-Id`

Replay/idempotency requirement:

- `requestId` is the idempotency key.
- Re-sending the same `requestId` with the same payload must not create duplicate review sessions.
- Re-sending the same `requestId` with a different payload must be rejected and logged for audit.
- W3 implementation should persist request id, payload hash, source, Paperclip run id, and resulting Task Hub review session id.

Remaining W3 implementation inputs:

- Confirm which Paperclip run/workspace/thread identifiers map to the W3 contract fields.
- Verify the live Paperclip webhook client can compute and send the agreed HMAC-SHA256 signature.
- Verify the live Paperclip webhook client sends the required Task Hub request id, timestamp, signature, source, and agent run id headers.

Acceptance criteria:

- Human access and future agent access are separated clearly.
- Service-token and signed-webhook pattern is documented without committing credentials.
- Hosted Paperclip dependency, service-auth requirement, and owner inputs are recorded as W3 runtime blockers.
- ADR `ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md` records the service-auth decision.
- No new W3 implementation is introduced.

PM acceptance:

- QA/PM reviewed PR #11 and reported PASS.
- PR #11 merged to `dev` at `fa87ac4`.
- PM accepts `V0.2-W1-07` as docs-only service-auth topology.
- W3 live connector is routed to `V0.2-W3-02` after runtime inputs and Task Hub service-token reachability were confirmed.

### V0.2-W1-08 - DigitalOcean Hosted Dev/Demo Runtime for Task Hub

**Alias:** W1.7

**Status:** QA Pass / PM Accepted for dev/demo
**Owner:** PM / Dev / QA

Decision:

- Use DigitalOcean as the preferred next hosted dev/demo runtime for Task Hub.
- Keep Cloudflare in front for DNS, HTTPS/proxy, Access email allowlist, and future service-token policy.
- Prefer a Droplet over DigitalOcean App Platform while Task Hub uses file-backed runtime state.
- Do not deploy production.

Tasks:

- Create or confirm a dev-only DigitalOcean Droplet or approved DO runtime layout for Task Hub.
- Install Node/runtime and process manager on the Droplet.
- Prepare the Cloudflare hostname, routing plan, and Access allowlist before exposing the runtime to teammates.
- Pull the `dev` branch and configure dev-only `.env` on the server only.
- Run Task Hub on a private/local bind first; do not expose the raw Droplet service as the preview URL.
- Record the hosted Paperclip URL, health/readiness path, and service-auth requirements from the Paperclip owner.
- Configure `APP_DATA_DIR` on persistent server storage.
- Configure `APP_BASE_URL` and `GOOGLE_REDIRECT_URI` for the Cloudflare Task Hub hostname.
- Connect the Task Hub hostname through Cloudflare Tunnel or proxied DNS + reverse proxy, then put Cloudflare Access in front before teammate preview.
- Verify Task Hub `/healthz`, authenticated app load, Basic Google/Trello non-destructive routes, and `APP_DATA_DIR` persistence.
- Use confirmed Paperclip hosted health evidence for W3 planning.

Acceptance criteria:

- Task Hub runs from the dev baseline on DigitalOcean.
- Paperclip hosted Cloudflare URL and health path are recorded for W3 planning.
- Cloudflare hostname reaches Task Hub.
- Cloudflare Access blocks anonymous users and allows approved teammates.
- No production deployment is created.
- No secrets are committed or pasted into docs/chat.
- Paperclip integration is not marked live until W3 verifies the stable endpoint/auth path.

2026-05-13 PM checkpoint:

- Task Hub runs on the existing DigitalOcean Droplet at `dev@b9961fa`.
- Runtime service is `taskhub-dashboard.service`, active/enabled.
- Task Hub binds `127.0.0.1:3000`; raw public `157.230.251.209:3000` is unreachable.
- `APP_DATA_DIR` is `/home/trisilar/dashboard-data`.
- `APP_BASE_URL=https://taskhub.trisila.online`.
- `GOOGLE_REDIRECT_URI=https://taskhub.trisila.online/auth/callback`.
- Server-side env keys include Trello credentials, but values were not exposed in chat or docs.
- Local Droplet checks returned `200` for `/healthz`, `/api/boards`, and `/api/all-cards`.
- QA recheck passed after approved-user browser access and persistence verification.
- PR #9 was merged to `dev` at `91ee327`; PM accepted `V0.2-W1-08` as dev/demo complete, not production/release-grade.

---

## Delivery Rules

- Do not deploy production in W1.
- Do not commit secrets.
- Keep W1 runtime data in `APP_DATA_DIR`.
- Do not implement W2 UI redesign work.
- Do not implement new W3 Paperclip behavior.
- Use temporary Basic Auth before sharing the ngrok demo URL.
- Use Cloudflare Access before sharing a stable Cloudflare/hosted preview URL.
- Use random tunnel URLs only for short-lived demo access; use a reserved/static domain for repeat Paperclip testing.
- Treat W3 live integration as W3-owned; W1 only records runtime inputs and service-auth topology.
- Repo changes require a branch/PR unless PM explicitly approves docs-only direct updates.

---

## Session Estimate

| Phase | Expected Sessions | Notes |
|---|---|---|
| `V0.2-W1-05` | Complete | Alias W1.4; accepted as random ngrok URL manual teammate demo path only |
| `V0.2-W1-06` | Complete for dev/demo | Alias W1.5; Cloudflare hostname, anonymous block, approved-user access, and app load accepted |
| `V0.2-W1-07` | Complete | Alias W1.6; documentation/pattern only; records hosted service-auth pattern; no live W3 behavior |
| `V0.2-W1-08` | Complete for dev/demo | Alias W1.7; DigitalOcean hosted dev/demo runtime, private bind, Cloudflare route, and persistence accepted |

---

## Next Recommended Session

```text
Role: Dev
Task: V0.2-W3-02 - Live Paperclip -> Task Hub Webhook Connector

Context:
W1 repo deploy-readiness and dev deployment config are merged to `dev`. `V0.2-W1-05` random ngrok demo passed and remains accepted for short manual demo only. PR #9 merged to `dev` at `91ee327`, and PM accepted `V0.2-W1-06` plus `V0.2-W1-08` as Cloudflare-protected DigitalOcean dev/demo runtime complete for Task Hub. PR #11 merged to `dev` at `fa87ac4`, and PM accepted `V0.2-W1-07` service-auth topology. Paperclip runtime inputs are now confirmed:
- PAPERCLIP_BASE_URL=https://paperclip.trisila.online
- PAPERCLIP_HEALTH_PATH=/healthz
- PAPERCLIP_ALLOWED_SOURCE_ID=paperclip-do-dev
- PAPERCLIP_ALLOWED_ENVIRONMENT=dev
- Paperclip service=paperclip.service
- Paperclip local runtime port=3100
- Task Hub service-token check from the Paperclip server returned 200 for /healthz
- Do not expose Cloudflare Client ID/Secret or HMAC signing secret.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md

Steps:
1. Start from latest `dev` in the W3 worktree.
2. Use the W3 branch/worktree from project policy: `feature/w3-paperclip-integration`, refreshed from latest `origin/dev` before editing.
3. Implement authenticated `POST /api/integrations/paperclip/webhook`.
4. Reuse the existing Paperclip contract normalizer and review-store audit path.
5. Validate source/environment, request id, timestamp, signature, and agent run id headers.
6. Enforce timestamp skew and idempotency.
7. Keep `PAPERCLIP_WEBHOOK_ENABLED=false` by default until QA/PM approval.
8. Add local/mock signed-request verification and preserve existing mock endpoint behavior.

Rules:
- Do not deploy production.
- Do not commit secrets.
- Do not reopen W1 Task Hub runtime work.
- Do not implement W2 UI redesign.
- Preserve existing app behavior.
- Include attribution: Runtime inputs recorded by Codex PM / Runtime; implementation by Codex Dev.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created W1 phase ladder as a dedicated plan following project plan-document policy | Codex PM |
| 2026-05-08 | Amended W1 no-cost preview path to use ngrok + temporary Basic Auth while no domain/subdomain is available; Cloudflare Access remains the stable gate once DNS is ready | Codex PM |
| 2026-05-09 | Accepted `V0.2-W1-05` random ngrok URL path as short manual teammate demo only; random ngrok remains unsuitable for permanent Paperclip automation | Codex PM |
| 2026-05-12 | Rebaselined next W1 path to DigitalOcean hosted dev/demo behind Cloudflare; historical Paperclip localhost blocker later superseded by hosted Paperclip confirmation | Codex PM |
| 2026-05-12 | Updated W1 after PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare; remaining W1 runtime work is Task Hub plus service-auth verification | Codex PM |
| 2026-05-13 | Recorded Task Hub DigitalOcean + Cloudflare runtime checkpoint at `https://taskhub.trisila.online`; W1-06/W1-08 runtime is configured but QA acceptance and W1-07 service-auth planning remain open | Codex PM |
| 2026-05-13 | Accepted `V0.2-W1-06` and `V0.2-W1-08` as Cloudflare-protected DigitalOcean dev/demo runtime complete after PR #9 merge at `91ee327`; routed next W1 work to `V0.2-W1-07` service-auth planning | Codex PM |
| 2026-05-13 | Planned `V0.2-W1-07` service-auth topology: Paperclip calls Task Hub webhook through Cloudflare Access service token plus signed webhook headers; W3 live implementation remains blocked until QA/PM acceptance and Paperclip owner inputs | Codex PM / Dev |
| 2026-05-13 | Accepted `V0.2-W1-07` after PR #11 QA/PM pass and merge at `fa87ac4`; routed next gate to Paperclip owner input confirmation before W3 live connector planning | Codex PM |
| 2026-05-13 | Held Paperclip runtime verification while the Paperclip server is offline; kept Task Hub runtime accepted and routed non-blocked V0.2 work to W2-06 | Codex PM |
| 2026-05-14 | Recorded Paperclip runtime inputs and Task Hub service-token `/healthz` success from the Paperclip server; W1 remains accepted and next implementation is routed to `V0.2-W3-02` | Codex PM / Runtime |
