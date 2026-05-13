# Version 0.2 W1 Company Access + Deployment Plan

**Doc Role:** W1 workstream phase ladder and execution plan
**Status:** Active - `V0.2-W1-05` accepted as random ngrok URL manual demo only; `V0.2-W1-06`/`V0.2-W1-08` runtime configured and QA pending; `V0.2-W1-07` service-auth planning pending
**Version:** V0.2
**Planning Stage:** No-cost teammate preview path accepted
**Owner:** PM / Platform Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-13 - **Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `../deployment/DEPLOYMENT_SETUP.md`, `../deployment/DEV_ENVIRONMENT_DEPLOYMENT.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../logs/DECISION_LOG.md`
**Theme:** Give the team a secure no-cost preview path first, while preserving a paid hosted deployment path for later.

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

PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner. Live Paperclip integration remains blocked until the hosted Paperclip runtime URL/health path, hosted Task Hub runtime, and service-auth path are verified together.

Current W1 decision:

- Keep ngrok + temporary Basic Auth as the accepted short manual demo path only.
- Use DigitalOcean + Cloudflare front door as the next hosted dev/demo runtime for Task Hub.
- Keep Cloudflare Access as the human teammate access gate.
- Use Cloudflare Access service-token or equivalent service-auth pattern for future Paperclip/API access.
- Treat hosted Paperclip as an external runtime dependency owned by the Paperclip owner; record its URL/health path before W3 live work.
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
- Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner; Task Hub still needs a stable hosted URL and service-auth path before W3 live connector work proceeds.

---

## Workstream / Phase Map

| Canonical ID | Alias | Status | Owner | Scope | Exit Criteria |
|---|---|---|---|---|---|
| `V0.2-W1-01` | `W1.0` | Done | PM / QA | Platform/access decision | Render/Railway/Vercel tradeoff reviewed; Cloudflare Access selected as gate |
| `V0.2-W1-02` | `W1.1` | Done | Dev / QA | Repo deploy readiness | `APP_BASE_URL`, `GOOGLE_REDIRECT_URI`, `APP_DATA_DIR`, `/healthz`, placeholder env docs merged |
| `V0.2-W1-03` | `W1.2` | Done | Dev / QA / PM | Dev deployment config | `render.yaml`, `railway.toml`, and hosted dev setup handoff merged to `dev` |
| `V0.2-W1-04` | `W1.3` | Accepted / amended | PM | Preview/runtime decision | Random ngrok accepted for manual demo; DigitalOcean + Cloudflare selected for next hosted dev/demo runtime |
| `V0.2-W1-05` | `W1.4` | Accepted demo-only | Dev / QA / PM | No-domain random ngrok manual demo runtime | QA verified Basic Auth, `/healthz`, app load, hosted callback, and local-only data path; PM accepted for short manual teammate demo only |
| `V0.2-W1-06` | `W1.5` | Pending | Dev / QA | Stable Cloudflare hostname + Access email allowlist | Task Hub hostname confirmed; Cloudflare Access blocks anonymous users; approved teammate can access and load the app |
| `V0.2-W1-07` | `W1.6` | Pending | Dev / PM | Paperclip agent/API access prep | Service-token pattern documented for hosted Paperclip -> hosted Task Hub integration without W3 implementation |
| `V0.2-W1-08` | `W1.7` | Next candidate | PM / Dev / QA | DigitalOcean hosted dev/demo runtime for Task Hub | Runtime, persistent Task Hub `APP_DATA_DIR`, Cloudflare routing, health checks, access gate, non-destructive app load, and hosted Paperclip dependency evidence verified |

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

**Status:** Runtime configured / QA pending
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
- Approved-user browser path still needs QA recheck after Trello env setup.

### V0.2-W1-07 - Paperclip Agent Access Prep

**Alias:** W1.6

**Status:** Pending
**Owner:** Dev / PM

Tasks:

- Document service-token pattern for future Paperclip agent/API access.
- Record hosted Paperclip base URL, health/readiness path, and owner-confirmed environment before W3 live connector work proceeds.
- Decide whether Paperclip will call Task Hub by webhook or Task Hub will call/poll Paperclip.
- If Paperclip calls Task Hub, require a stable Task Hub hostname and service-auth path such as Cloudflare Access service token for the Paperclip endpoint.
- If Task Hub calls Paperclip, require a stable Paperclip hostname before live code proceeds.
- Keep live Paperclip behavior under W3 ownership.
- Do not add new Paperclip runtime endpoints in W1.

Acceptance criteria:

- Human access and future agent access are separated clearly.
- Service-token pattern is documented without committing credentials.
- Hosted Paperclip dependency and service-auth requirement are recorded as W3 runtime blockers.
- No new W3 implementation is introduced.

### V0.2-W1-08 - DigitalOcean Hosted Dev/Demo Runtime for Task Hub

**Alias:** W1.7

**Status:** Runtime configured / QA pending
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
- Verify or record Paperclip hosted health/load evidence supplied by the Paperclip owner.

Acceptance criteria:

- Task Hub runs from the dev baseline on DigitalOcean.
- Paperclip hosted Cloudflare URL and health/readiness path are recorded from the Paperclip owner.
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
- Remaining QA scope: approved-user Cloudflare Access path, non-destructive browser app load after Trello env setup, and persistence after service restart.

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
- Treat W3 live integration as blocked until Task Hub hosted runtime and service-auth with hosted Paperclip are verified.
- Repo changes require a branch/PR unless PM explicitly approves docs-only direct updates.

---

## Session Estimate

| Phase | Expected Sessions | Notes |
|---|---|---|
| `V0.2-W1-05` | Complete | Alias W1.4; accepted as random ngrok URL manual teammate demo path only |
| `V0.2-W1-06` | QA pending | Alias W1.5; hostname and anonymous block configured; approved-user access needs QA recheck |
| `V0.2-W1-07` | 1 | Alias W1.6; documentation/pattern only; records hosted service-auth pattern; no live W3 behavior |
| `V0.2-W1-08` | QA pending | Alias W1.7; DigitalOcean hosted dev/demo runtime is configured; persistence and approved-user browser path need QA recheck |

---

## Next Recommended Session

```text
Role: QA
Task: V0.2-W1-08 - Review DigitalOcean / Cloudflare Hosted Dev/Demo Runtime
Alias: W1.7

Context:
W1 repo deploy-readiness and dev deployment config are merged to `dev`. `V0.2-W1-05` random ngrok demo passed and remains accepted for short manual demo only. Task Hub is now deployed on the existing DigitalOcean Droplet from `dev@b9961fa`, routed through Cloudflare at `https://taskhub.trisila.online`, and protected by Cloudflare Access. PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Steps:
1. Confirm `taskhub-dashboard.service` is active/enabled on the Droplet.
2. Confirm Task Hub binds `127.0.0.1:3000` and raw public `157.230.251.209:3000` is unreachable.
3. Confirm anonymous `https://taskhub.trisila.online` access is blocked by Cloudflare Access.
4. Confirm approved teammate access can pass Cloudflare Access and load the app.
5. Confirm `/healthz`, `/api/boards`, and `/api/all-cards` are healthy without exposing secrets.
6. Confirm `APP_BASE_URL` and `GOOGLE_REDIRECT_URI` use `https://taskhub.trisila.online`.
7. Confirm runtime files persist under `/home/trisilar/dashboard-data` after service restart.
8. Confirm no production deploy, no main merge, no W2 UI redesign, no new W3 Paperclip behavior, and no secrets in repo/docs/chat.
9. If pass, recommend PM accept `V0.2-W1-06` and `V0.2-W1-08`, then route `V0.2-W1-07` service-auth planning for hosted Paperclip -> hosted Task Hub.

Rules:
- Do not deploy production.
- QA only: do not patch code.
- Do not use Render/Railway unless PM changes the decision.
- Do not commit secrets.
- Do not implement W2 UI redesign or new W3 Paperclip behavior.
- Preserve existing app behavior.
- Include attribution: Routed by Codex PM; reviewed by Codex QA.
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
