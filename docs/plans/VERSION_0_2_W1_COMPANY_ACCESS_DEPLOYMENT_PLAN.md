# Version 0.2 W1 Company Access + Deployment Plan

**Doc Role:** W1 workstream phase ladder and execution plan
**Status:** Active - `V0.2-W1-05` accepted as random ngrok URL manual demo only; `V0.2-W1-06` stable Access gate is deferred until a domain/subdomain exists
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

PM later confirmed no Trisilar domain/subdomain is currently available for a Cloudflare named tunnel and Cloudflare Access application. `trycloudflare` was verified as technically useful, but its random URL makes it a poor fit for Paperclip or repeat teammate handoff. For the immediate no-cost demo window, W1 uses a local ngrok tunnel with a temporary Basic Auth proxy. The durable target remains Cloudflare named tunnel + Cloudflare Access once a domain/subdomain is available.

Current W1 decision:

- Use ngrok + temporary Basic Auth as the current no-domain demo path.
- Run Trisilar Task Hub on a local/dev machine during preview.
- Use random ngrok URLs only for short manual teammate demos; share URL/password out of band and rotate by restarting the launcher.
- Keep Cloudflare named tunnel + Cloudflare Access as the stable access gate once a domain/subdomain is available.
- Prepare future Paperclip/multi-agent access with a stable URL/auth pattern, but do not implement new W3 behavior in W1.
- Keep Render as the default paid hosted target and Railway as the paid hosted alternate, both deferred until always-on runtime is justified.
- Do not treat random `trycloudflare` or random ngrok URLs as durable Paperclip integration endpoints.

---

## Scope / Non-Goals

In scope:

- No-cost teammate preview through ngrok while no domain/subdomain exists.
- Temporary Basic Auth gate for the no-domain demo.
- Cloudflare Access email allowlist for human users once a domain/subdomain exists.
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
    -> V0.2-W1-05 no-domain temporary demo path with ngrok
    -> V0.2-W1-06 stable Cloudflare Access teammate gate when domain/subdomain exists
    -> V0.2-W1-07 future agent access pattern
    -> V0.2-W1-08 paid hosted review only if needed
```

Aliases: `W1.0`-`W1.7`.

Branch/workflow rules:

- W1 repo changes still start from `dev` and go through PR unless PM explicitly approves a docs-only direct update.
- Runtime setup uses local machine and ngrok for the temporary demo; Cloudflare dashboard/CLI work resumes once a domain/subdomain exists. Secrets stay out of git.
- Production remains untouched.
- W2 and W3 continue independently from their own branches/worktrees.

Runtime dependency rules:

- Local machine must stay online during teammate preview.
- `APP_DATA_DIR` must point to a stable preview data directory.
- Temporary Basic Auth must protect the ngrok demo URL before sharing it.
- Cloudflare Access must block anonymous users before sharing a stable Cloudflare URL.
- Paperclip agent/service-token access is only a pattern in W1; live agent integration remains W3-owned. Random tunnel URLs are not durable Paperclip endpoints.

---

## Workstream / Phase Map

| Canonical ID | Alias | Status | Owner | Scope | Exit Criteria |
|---|---|---|---|---|---|
| `V0.2-W1-01` | `W1.0` | Done | PM / QA | Platform/access decision | Render/Railway/Vercel tradeoff reviewed; Cloudflare Access selected as gate |
| `V0.2-W1-02` | `W1.1` | Done | Dev / QA | Repo deploy readiness | `APP_BASE_URL`, `GOOGLE_REDIRECT_URI`, `APP_DATA_DIR`, `/healthz`, placeholder env docs merged |
| `V0.2-W1-03` | `W1.2` | Done | Dev / QA / PM | Dev deployment config | `render.yaml`, `railway.toml`, and hosted dev setup handoff merged to `dev` |
| `V0.2-W1-04` | `W1.3` | Accepted / amended | PM | No-cost preview decision | Paid Render/Railway deferred; no-domain ngrok demo selected until Cloudflare domain/subdomain exists |
| `V0.2-W1-05` | `W1.4` | Accepted demo-only | Dev / QA / PM | No-domain random ngrok manual demo runtime | QA verified Basic Auth, `/healthz`, app load, hosted callback, and local-only data path; PM accepted for short manual teammate demo only |
| `V0.2-W1-06` | `W1.5` | Deferred | Dev / QA | Stable Cloudflare Access email allowlist | Domain/subdomain exists; anonymous access blocked; approved teammate can access and load the app |
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

**Status:** Accepted / amended
**Owner:** PM

Decision:

- Use ngrok + temporary Basic Auth for the immediate no-domain demo.
- Resume Cloudflare Tunnel + Cloudflare Access when a domain/subdomain is available.
- Defer paid hosted Render/Railway deployment.
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
- Paperclip automation, permanent webhook use, and stable service integration remain deferred until a stable hostname exists.

Acceptance criteria:

- Local server starts cleanly.
- ngrok routes the public demo URL to the app.
- Temporary Basic Auth blocks unauthenticated access.
- `GET /healthz` returns `200` through the tunnel.
- No secrets are committed.
- No production service is deployed.
- PM records this as a demo-only path, not a release-grade access gate.

### V0.2-W1-06 - Stable Cloudflare Access Email Allowlist

**Alias:** W1.5

**Status:** Deferred until domain/subdomain exists
**Owner:** Dev / QA

Tasks:

- Confirm a Trisilar domain/subdomain for the stable preview hostname.
- Create a Cloudflare named tunnel for the preview hostname.
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
- If W1 demo uses ngrok, document that Paperclip requires either a reserved/static ngrok domain or a fresh manual URL handoff each run.
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
- Use temporary Basic Auth before sharing the ngrok demo URL.
- Use Cloudflare Access before sharing a stable Cloudflare preview URL.
- Use random tunnel URLs only for short-lived demo access; use a reserved/static domain for repeat Paperclip testing.
- Repo changes require a branch/PR unless PM explicitly approves docs-only direct updates.

---

## Session Estimate

| Phase | Expected Sessions | Notes |
|---|---|---|
| `V0.2-W1-05` | Complete | Alias W1.4; accepted as random ngrok URL manual teammate demo path only |
| `V0.2-W1-06` | 1-2 | Alias W1.5; depends on domain/subdomain, Cloudflare Access, allowlist emails/group, and teammate availability |
| `V0.2-W1-07` | 1 | Alias W1.6; documentation/pattern only; no live W3 behavior |
| `V0.2-W1-08` | 1 | Alias W1.7; PM decision checkpoint if paid hosting becomes necessary |

---

## Next Recommended Session

```text
Role: Dev
Task: V0.2-W1-05 - Manual Teammate Demo With Random ngrok URL
Alias: W1.4

Context:
W1 repo deploy-readiness and dev deployment config are merged to `dev`. QA passed the no-domain ngrok temporary demo verification. PM accepted random ngrok URL usage for short manual teammate demo only. `trycloudflare` and random ngrok URLs are not suitable for permanent Paperclip handoff because the URL changes. Render remains the default paid hosted target and Railway remains the paid hosted alternate, but both are deferred until always-on runtime is justified.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Steps:
1. Open `C:\Users\User\Desktop\Trisilar-TaskHub-current-demo-url.txt` locally.
2. Share the current URL, username, and password to the teammate out of band.
3. Keep the launcher window open while the teammate previews the app.
4. Ask teammate to verify Basic Auth prompt, app load, and basic non-destructive navigation.
5. Do not ask teammate or Paperclip to store this random URL as a permanent endpoint.
6. Stop the demo by pressing Enter in the launcher window after the demo.
7. Record feedback without including the password.

Rules:
- Do not deploy production.
- Do not use paid Render/Railway unless PM changes the decision.
- Do not treat the temporary ngrok URL as a production or release-grade access gate.
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
| 2026-05-08 | Amended W1 no-cost preview path to use ngrok + temporary Basic Auth while no domain/subdomain is available; Cloudflare Access remains the stable gate once DNS is ready | Codex PM |
| 2026-05-09 | Accepted `V0.2-W1-05` random ngrok URL path as short manual teammate demo only; Paperclip stable endpoint remains deferred until stable hostname exists | Codex PM |
