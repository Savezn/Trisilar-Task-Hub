# Version 0.2 W1 Company Access + Deployment Plan

**Doc Role:** W1 workstream phase ladder and execution plan
**Status:** Active - `V0.2-W1-05` Cloudflare Tunnel local runtime setup is next (alias W1.4)
**Version:** V0.2
**Planning Stage:** No-cost teammate preview path accepted
**Owner:** PM / Platform Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM
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

Current W1 decision:

- Use Cloudflare Tunnel + Cloudflare Access as the no-cost teammate preview path.
- Run Trisilar Task Hub on a local/dev machine during preview.
- Protect human access with Cloudflare Access email allowlist.
- Prepare future Paperclip/multi-agent access with a service-token pattern, but do not implement new W3 behavior in W1.
- Keep Render as the default paid hosted target and Railway as the paid hosted alternate, both deferred until always-on runtime is justified.
- Keep ngrok as a short-lived demo/troubleshooting fallback only.

---

## Scope / Non-Goals

In scope:

- No-cost teammate preview through Cloudflare Tunnel.
- Cloudflare Access email allowlist for human users.
- Stable local preview runtime with `APP_DATA_DIR`.
- Hosted callback values through `APP_BASE_URL` and `GOOGLE_REDIRECT_URI`.
- Clear separation between human access and future agent/API access.
- Deferred paid hosted target notes for Render/Railway.

Out of scope:

- Production deployment.
- Paid Render/Railway deployment before PM approval.
- W2 UI redesign.
- New W3 Paperclip behavior.
- Per-user app RBAC.
- Committing secrets, generated runtime data, or production exports.

---

## Dependency / Workflow Model

```text
V0.2-W1-01..V0.2-W1-03 repo readiness done
    -> V0.2-W1-04 PM no-cost preview decision accepted
    -> V0.2-W1-05 Cloudflare Tunnel local runtime setup
    -> V0.2-W1-06 Cloudflare Access teammate gate
    -> V0.2-W1-07 future agent access pattern
    -> V0.2-W1-08 paid hosted review only if needed
```

Aliases: `W1.0`-`W1.7`.

Branch/workflow rules:

- W1 repo changes still start from `dev` and go through PR unless PM explicitly approves a docs-only direct update.
- Runtime setup uses local machine and Cloudflare dashboards/CLI; secrets stay out of git.
- Production remains untouched.
- W2 and W3 continue independently from their own branches/worktrees.

Runtime dependency rules:

- Local machine must stay online during teammate preview.
- `APP_DATA_DIR` must point to a stable preview data directory.
- Cloudflare Access must block anonymous users before sharing the URL.
- Paperclip agent/service-token access is only a pattern in W1; live agent integration remains W3-owned.

---

## Workstream / Phase Map

| Canonical ID | Alias | Status | Owner | Scope | Exit Criteria |
|---|---|---|---|---|---|
| `V0.2-W1-01` | `W1.0` | Done | PM / QA | Platform/access decision | Render/Railway/Vercel tradeoff reviewed; Cloudflare Access selected as gate |
| `V0.2-W1-02` | `W1.1` | Done | Dev / QA | Repo deploy readiness | `APP_BASE_URL`, `GOOGLE_REDIRECT_URI`, `APP_DATA_DIR`, `/healthz`, placeholder env docs merged |
| `V0.2-W1-03` | `W1.2` | Done | Dev / QA / PM | Dev deployment config | `render.yaml`, `railway.toml`, and hosted dev setup handoff merged to `dev` |
| `V0.2-W1-04` | `W1.3` | Accepted | PM | No-cost preview decision | Cloudflare Tunnel + Cloudflare Access selected; paid hosted Render/Railway deferred |
| `V0.2-W1-05` | `W1.4` | Next | Dev | Cloudflare Tunnel local runtime | Local app served through `taskhub-dev.trisilar.com` or PM-approved hostname via `cloudflared` |
| `V0.2-W1-06` | `W1.5` | Pending | Dev / QA | Cloudflare Access email allowlist | Anonymous access blocked; approved teammate can access and load the app |
| `V0.2-W1-07` | `W1.6` | Pending | Dev / PM | Paperclip agent access prep | Service-token pattern documented for future agent/API access without W3 implementation |
| `V0.2-W1-08` | `W1.7` | Deferred | PM | Paid hosted dev review | Render/Railway revisited only when always-on runtime, stronger parity, or preview usage justifies cost |

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

**Status:** Accepted
**Owner:** PM

Decision:

- Use Cloudflare Tunnel + Cloudflare Access for W1 teammate preview.
- Defer paid hosted Render/Railway deployment.
- Keep ngrok as a temporary fallback only.

### V0.2-W1-05 - Cloudflare Tunnel Local Runtime Setup

**Alias:** W1.4

**Status:** Next
**Owner:** Dev

Tasks:

- Confirm preview hostname, default `taskhub-dev.trisilar.com`.
- Install or verify `cloudflared`.
- Run the app locally with stable `APP_DATA_DIR`.
- Configure local preview env:
  - `APP_BASE_URL=https://taskhub-dev.trisilar.com`
  - `GOOGLE_REDIRECT_URI=https://taskhub-dev.trisilar.com/auth/callback`
- Route the Cloudflare Tunnel hostname to `http://localhost:3000`.
- Verify local and tunneled `/healthz`.

Acceptance criteria:

- Local server starts cleanly.
- Tunnel routes preview hostname to the app.
- `GET /healthz` returns `200` through the tunnel.
- No secrets are committed.
- No production service is deployed.

### V0.2-W1-06 - Cloudflare Access Email Allowlist

**Alias:** W1.5

**Status:** Pending
**Owner:** Dev / QA

Tasks:

- Create Cloudflare Access application for the preview hostname.
- Add approved teammate emails or a PM-approved group.
- Verify anonymous users are blocked.
- Verify approved teammate access.
- Verify basic non-destructive app load.

Acceptance criteria:

- Anonymous access is blocked before sharing the URL.
- Approved teammate can access the app.
- App loads without destructive Trello or Google writes.

### V0.2-W1-07 - Paperclip Agent Access Prep

**Alias:** W1.6

**Status:** Pending
**Owner:** Dev / PM

Tasks:

- Document service-token pattern for future Paperclip agent/API access.
- Keep live Paperclip behavior under W3 ownership.
- Do not add new Paperclip runtime endpoints in W1.

Acceptance criteria:

- Human access and future agent access are separated clearly.
- Service-token pattern is documented without committing credentials.
- No new W3 implementation is introduced.

### V0.2-W1-08 - Paid Hosted Dev Review

**Alias:** W1.7

**Status:** Deferred
**Owner:** PM

Trigger conditions:

- Teammate preview shows enough value to justify always-on runtime.
- Local machine uptime becomes a blocker.
- Dev/prod parity becomes important enough to pay for.
- Paperclip agent usage requires a stable always-on endpoint.

Decision checkpoint:

- Revisit Render as default paid hosted target.
- Revisit Railway as alternate.
- Confirm budget, persistent disk/volume, dev/prod credential separation, and Cloudflare Access gate.

---

## Delivery Rules

- Do not deploy production in W1.
- Do not commit secrets.
- Keep W1 runtime data in `APP_DATA_DIR`.
- Do not implement W2 UI redesign work.
- Do not implement new W3 Paperclip behavior.
- Use Cloudflare Access before teammate preview.
- Use ngrok only for short-lived troubleshooting/demo access.
- Repo changes require a branch/PR unless PM explicitly approves docs-only direct updates.

---

## Session Estimate

| Phase | Expected Sessions | Notes |
|---|---|---|
| `V0.2-W1-05` | 1-2 | Alias W1.4; depends on Cloudflare account/DNS access and `cloudflared` install |
| `V0.2-W1-06` | 1 | Alias W1.5; depends on allowlist emails/group and teammate availability |
| `V0.2-W1-07` | 1 | Alias W1.6; documentation/pattern only; no live W3 behavior |
| `V0.2-W1-08` | 1 | Alias W1.7; PM decision checkpoint if paid hosting becomes necessary |

---

## Next Recommended Session

```text
Role: Dev
Task: V0.2-W1-05 - Cloudflare Tunnel Local Runtime Setup
Alias: W1.4

Context:
W1 repo deploy-readiness and dev deployment config are merged to `dev`. PM selected Cloudflare Tunnel + Cloudflare Access as the no-cost teammate preview path. Render remains the default paid hosted target and Railway remains the paid hosted alternate, but both are deferred until always-on runtime is justified.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Steps:
1. Confirm preview hostname, default `taskhub-dev.trisilar.com`, or record PM-approved alternate.
2. Install or verify `cloudflared`.
3. Run the app locally with stable `APP_DATA_DIR`.
4. Configure `APP_BASE_URL` and `GOOGLE_REDIRECT_URI` for the preview hostname.
5. Create a Cloudflare Tunnel route from the preview hostname to `http://localhost:3000`.
6. Add Cloudflare Access email allowlist before teammate preview.
7. Verify local `/healthz`, tunneled `/healthz`, anonymous blocked access, approved teammate access, and non-destructive app load.
8. Record remaining runtime blockers.

Rules:
- Do not deploy production.
- Do not use paid Render/Railway unless PM changes the decision.
- Do not commit secrets.
- Do not implement W2 UI redesign or new W3 Paperclip behavior.
- Preserve existing app behavior.
- Include attribution: Runtime setup by Codex Dev.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created W1 phase ladder as a dedicated plan following project plan-document policy | Codex PM |
