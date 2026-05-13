# Version 0.2 Parallel Workstream Prompts - Trisilar Task Hub

**Doc Role:** Durable prompt registry for V0.2 parallel workstreams
**Status:** Active
**Version:** V0.2
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-13 - **Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`

---

## How to Use This Document

- Keep reusable W1/W2/W3 prompts here so they do not disappear when `CURRENT_SPRINT.md` changes its single Next Action.
- `CURRENT_SPRINT.md` should point to the current immediate next action only.
- Start every V0.2 workstream from `dev` unless the workflow doc explicitly says otherwise.
- W1/W2/W3 Dev agents must not edit `CURRENT_SPRINT.md`; PM updates it after QA/decision checkpoints.
- QA agents report evidence in their workstream handoff/doc; PM decides what enters `CURRENT_SPRINT.md`.
- Use canonical task IDs first: `V0.2-W1-XX`, `V0.2-W2-XX`, and `V0.2-W3-XX`.
- Old labels such as `W1.4`, `W2b`, and `W3 sequence 1` are aliases only.

---

## Parallel Write Ownership

| Workstream | Dev/QA Write Scope | PM Write Scope |
|---|---|---|
| W1 | W1 plan/docs/branch only | Sprint snapshot and cross-workstream status |
| W2 | W2 plan/docs/branch only | Sprint snapshot and cross-workstream status |
| W3 | W3 plan/docs/branch only | Sprint snapshot and cross-workstream status |

Do not replace this registry with a single workstream's next action. Update one prompt at a time and preserve the rest.

## Branch Ownership

| Workstream | Required Branch | Rule |
|---|---|---|
| W1 | `feature/w1-company-access-deployment` | Do not commit W2/W3 work here. |
| W2 | active `feature/w2-*` phase branch | Do not commit W1/W3 work here. |
| W3 | `feature/w3-paperclip-integration` | Do not commit W1/W2 work here. |

All three branches start from latest `dev`. Do not run multiple workstreams in one feature branch. PM/integration merges finished workstream branches into `dev`.

## Worktree Ownership

Parallel agents must use separate Git worktree folders. Do not run W1/W2/W3 in the same `trisilar-task-hub` working directory.

| Workstream | Worktree folder | Branch |
|---|---|---|
| PM / Integration | `trisilar-task-hub` | `dev` |
| W1 | `trisilar-task-hub-w1-company-access` | `feature/w1-company-access-deployment` |
| W2 | `trisilar-task-hub-w2-ui-redesign` | active `feature/w2-*` phase branch |
| W3 | `trisilar-task-hub-w3-paperclip` | `feature/w3-paperclip-integration` |

Agent start check:

```powershell
git status --short --branch
```

If the branch/folder does not match the prompt, stop before editing and move to the correct worktree.

---

## Canonical Prompt IDs

| Prompt | Canonical ID | Alias | Purpose |
|---|---|---|---|
| A | `V0.2-W1-05` | `W1.4` | Random ngrok manual teammate demo handoff |
| B | `V0.2-W2-02` | `W2b` | Review Queue redesign and shared task drawer foundation |
| C | `V0.2-W3-01` | W3 sequence 1 | Paperclip integration discovery and contract plan |
| D | `V0.2-W2-06` | `W2f` | Settings, OKR, and Weekly Focus polish |
| E | `V0.2-W1-08` | `W1.7` | DigitalOcean hosted dev/demo runtime behind Cloudflare for Task Hub |
| F | `V0.2-W1-07` | `W1.6` | Paperclip service-auth planning for hosted Paperclip -> hosted Task Hub |
| G | `V0.2-W1-07` | `W1.6` | QA review for Paperclip service-auth planning |

Use the canonical ID in the task title. Include the alias only for continuity.

---

## Prompt A - V0.2-W1-05 Random ngrok Manual Teammate Demo Handoff

```text
Role: PM / User
Task: V0.2-W1-05 - Run Manual Teammate Demo With Random ngrok URL
Alias: W1.4

Context:
V0.2-W1-01 through V0.2-W1-03 are done. V0.2-W1-05 passed QA and is accepted by PM as random ngrok URL manual demo only. This prompt is for manual demo fallback only. The next stable runtime path is `V0.2-W1-08` DigitalOcean hosted dev/demo behind Cloudflare for Task Hub.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md
- README.md

Goals:
1. Open `C:\Users\User\Desktop\Trisilar-TaskHub-current-demo-url.txt` locally.
2. Share current URL, username, and password to the teammate out of band.
3. Keep the launcher window open while the teammate previews the app.
4. Ask teammate to verify Basic Auth prompt, app load, and basic non-destructive navigation.
5. Do not ask teammate or Paperclip to store the random URL as a permanent endpoint.
6. Stop the demo by pressing Enter in the launcher window after the demo.
7. Record feedback without including the password.

Rules:
- Start from `dev`.
- Runtime handoff may use the local Desktop files outside git.
- Use `V0.2-W1-05` as the primary task ID; `W1.4` is an alias only.
- Do not implement W2 UI redesign or W3 Paperclip integration.
- Do not commit secrets.
- Do not deploy production or use paid Render/Railway unless PM changes the decision.
- Do not commit Desktop launcher files, generated demo URL files, or credentials.
- Do not treat the random ngrok URL as a production endpoint, Paperclip automation endpoint, or release-grade access gate.
- Preserve existing app behavior unless explicitly required.
- Include attribution: Accepted by Codex PM.
```

---

## Prompt B - V0.2-W2-02 Review Queue Redesign

```text
Role: Dev
Task: V0.2-W2-02 - Review Queue Redesign + Shared Task Drawer Foundation

Context:
V0.2-W2-01 (alias W2a) shell/Today redesign was accepted at `b5f67fb`, but PM clarified this is not full W2 UI redesign completion. W2 is now phased as canonical IDs `V0.2-W2-01` through `V0.2-W2-06` in `docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md`. Work in the W2 worktree folder and implement V0.2-W2-02 only. Alias: W2b.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md
- docs/design/ui-design-v1-0/README.md
- docs/design/ui-design-v1-0/pages-review-cal-settings.jsx
- docs/design/ui-design-v1-0/app.jsx
- public/style.css
- public/app.js
- public/js/router.js
- public/js/pages/review.js

Goals:
1. Redesign Review Queue to match the `ui-design-v1-0` direction while preserving current review APIs and workflows.
2. Introduce shared task row/detail drawer primitives only where needed by Review and future W2 phases.
3. Preserve accepted V0.2-W2-01 shell/Today behavior and W3 Paperclip mock behavior.
4. Capture desktop/mobile visual QA evidence and run `npm.cmd run check:all`.

Rules:
- Start from `dev`.
- Work only in the W2 worktree folder and a W2 phase branch under `feature/w2-*`, default `feature/w2-02-review-redesign`.
- Use `V0.2-W2-02` as the primary task ID; `W2b` is an alias only.
- Do not implement W1 deployment/access or W3 Paperclip integration.
- Do not rewrite to React/Vite unless PM explicitly approves.
- Preserve route behavior and existing APIs.
- Include attribution: Implemented by Codex Dev.
```

---

## Prompt C - V0.2-W3-01 Paperclip Multi-Agent Integration

```text
Role: Dev
Task: V0.2-W3-01 - Paperclip Multi-Agent Integration Discovery and Contract Plan

Context:
V0.2 W0 Branch / Environment / CI Setup passed QA at commit `9dbb47b`. The `dev` branch exists and is the integration baseline. Work in `trisilar-task-hub-w3-paperclip` on `feature/w3-paperclip-integration`.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- MVP_PRD.md

Goals:
1. Identify required Paperclip integration touchpoints.
2. Draft a contract-first API/webhook or adapter plan.
3. Define mock adapter verification before live connector work.
4. Define attribution/audit trail requirements so multi-agent work stays traceable.

Rules:
- Start from `dev`.
- Work only in the W3 worktree folder on `feature/w3-paperclip-integration`.
- Use `V0.2-W3-01` as the primary task ID; any W3 sequence or W3-P label is an alias only.
- Do not implement W1 deployment/access or W2 UI redesign.
- Do not add live external calls before contract/mock verification.
- Preserve existing app behavior.
- Include attribution: Implemented by Dev agent name.
```

---

## Prompt D - V0.2-W2-06 Settings + OKR + Weekly Focus Polish

```text
Role: Dev
Task: V0.2-W2-06 - Settings + OKR + Weekly Focus Polish
Alias: W2f

Context:
V0.2-W2-01 through V0.2-W2-05 are accepted and integrated on dev through `3fca059`. Work in `trisilar-task-hub-w2-ui-redesign`, update from `origin/dev`, and create `feature/w2-06-settings-okr-focus-redesign`. This is the final planned W2 UI redesign phase; do not mark W2 complete until QA and PM acceptance pass.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md
- docs/design/ui-design-v1-0/README.md
- docs/design/ui-design-v1-0/pages-review-cal-settings.jsx
- public/index.html
- public/style.css
- public/app.js
- public/js/router.js
- public/js/utils.js
- public/js/pages/settings.js
- public/js/pages/okr.js

Goals:
1. Redesign `/settings` as the operational control center for integrations, workspace visibility, hidden boards, monitor teams, and BU groups.
2. Normalize `/okr` and `/focus` to the accepted W2 shell/page system without expanding strategy scope.
3. Preserve accepted W2-01 through W2-05 behavior and W3 Paperclip mock behavior.
4. Capture desktop/mobile visual QA evidence for Settings, OKR, and Weekly Focus.

Rules:
- Start from latest `dev`.
- Work only in the W2 worktree folder and `feature/w2-06-settings-okr-focus-redesign`.
- Use `V0.2-W2-06` as the primary task ID; `W2f` is an alias only.
- Do not implement W1 deployment/access or new W3 Paperclip behavior.
- Do not rewrite to React/Vite unless PM explicitly approves.
- Do not expand OKR or Weekly Focus strategy scope.
- Preserve route behavior and existing APIs.
- Include attribution: Implemented by Codex Dev.

Verify:
- `node server.js`
- `npm.cmd run check:all`
- `npm.cmd run verify:paperclip-contract`
- `npm.cmd run verify:paperclip-mock`
- Browser/Playwright QA for `/settings`, `/okr`, `/focus` desktop/mobile, including mobile overflow.
- Regression smoke for Today, Review, Tasks, Boards, Calendar, Planner, and W3 Paperclip mock behavior.
```

---

## Prompt E - V0.2-W1-08 DigitalOcean Hosted Dev/Demo Runtime

```text
Role: QA
Task: V0.2-W1-08 - Review DigitalOcean / Cloudflare Hosted Dev/Demo Runtime
Alias: W1.7

Context:
V0.2-W1-05 passed teammate demo and remains accepted as manual demo-only access. Task Hub is now deployed on the existing DigitalOcean Droplet from `dev@b9961fa`, routed through Cloudflare at `https://taskhub.trisila.online`, and protected by Cloudflare Access. PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Goals:
1. Verify the Task Hub dev/demo runtime on DigitalOcean from branch `dev`.
2. Confirm Cloudflare Access protects the stable hostname before teammate preview.
3. Keep server secrets out of git and chat.
4. Record service-auth blocker without implementing new W3 behavior.

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
- QA only: do not patch code.
- Use `V0.2-W1-08` as the primary task ID; `W1.7` is an alias only.
- Do not deploy production.
- Do not merge to main.
- Do not commit secrets or generated runtime data.
- Do not implement W2 UI redesign.
- Do not implement new W3 Paperclip behavior.
- Include attribution: Routed by Codex PM; reviewed by Codex QA.
```

---

## Prompt F - V0.2-W1-07 Paperclip Service-Auth Planning

```text
Role: PM / Dev
Task: V0.2-W1-07 - Paperclip Service-Auth Planning for Hosted Task Hub
Alias: W1.6

Context:
V0.2-W1-05 passed teammate demo and remains accepted as manual demo-only access. PR #9 merged to `dev` at `91ee327`, and PM accepted `V0.2-W1-06` plus `V0.2-W1-08` as Cloudflare-protected DigitalOcean dev/demo runtime complete for Task Hub. Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner. W3 live connector work remains blocked until service-auth topology is planned and accepted.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Goals:
1. Plan machine/API auth between hosted Paperclip and hosted Task Hub.
2. Keep human Cloudflare Access email login separate from service auth.
3. Document runtime env var names only; do not record secret values.
4. Route W3 live connector only after PM accepts the auth topology.

Steps:
1. Confirm direction: Paperclip calls Task Hub, Task Hub calls/polls Paperclip, or both.
2. Record hosted Task Hub base URL and hosted Paperclip base URL/health path without secrets.
3. Choose service-auth pattern: Cloudflare Access service token, signed webhook header, or other PM-approved machine auth.
4. Separate human Cloudflare Access email login from machine/API auth.
5. Define W3 live endpoints/client calls requiring service auth without implementing in W1.
6. Document required runtime env var names only.
7. Define replay/idempotency requirement handoff for W3.
8. Record remaining Paperclip owner inputs.
9. Route next W3 live connector only after PM accepts W1-07 auth topology.

Rules:
- Use `V0.2-W1-07` as the primary task ID; `W1.6` is an alias only.
- Do not deploy production.
- Do not merge to main.
- Do not commit secrets or generated runtime data.
- Do not implement W2 UI redesign.
- Do not implement new W3 Paperclip behavior.
- Include attribution: Routed by Codex PM.
```

---

## Prompt G - V0.2-W1-07 Service-Auth Planning QA Review

```text
Role: QA / PM
Task: V0.2-W1-07 - Review Paperclip Service-Auth Planning for Hosted Task Hub
Alias: W1.6

Context:
V0.2-W1-05 passed teammate demo and remains accepted as manual demo-only access. PR #9 merged to `dev` at `91ee327`, and PM accepted `V0.2-W1-06` plus `V0.2-W1-08` as Cloudflare-protected DigitalOcean dev/demo runtime complete for Task Hub. W1-07 planning selects Paperclip -> Task Hub webhook as the first live direction, using Cloudflare Access service token plus signed webhook headers. W1-07 does not implement live W3 behavior.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/adr/ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Steps:
1. Confirm W1-07 planning is docs-only and does not implement live W3 behavior.
2. Confirm first live direction is Paperclip calls Task Hub webhook, not Task Hub polling Paperclip.
3. Confirm human Cloudflare Access login and machine/API auth are separated.
4. Confirm service-auth pattern is Cloudflare Access service token plus signed webhook headers.
5. Confirm env var names are documented without secret values.
6. Confirm replay/idempotency requirements are clear for W3.
7. Confirm remaining Paperclip owner inputs are explicitly listed.
8. Confirm W3 live connector remains blocked until QA/PM acceptance and owner inputs.
9. If pass, recommend PM accept `V0.2-W1-07` and route W3 live connector planning.

Rules:
- QA only: do not patch code.
- Do not deploy production.
- Do not merge to main.
- Do not commit secrets or generated runtime data.
- Do not implement W2 UI redesign.
- Do not implement new W3 Paperclip behavior.
- Include attribution: Planned by Codex PM / Dev; reviewed by Codex QA.
```

---

## Prompt H - Paperclip Owner Inputs for W3 Live Connector

```text
Role: PM / Paperclip Owner
Task: Confirm Paperclip Inputs for W3 Live Connector

Context:
V0.2-W1-05 remains accepted as manual demo-only access. PR #9 merged to `dev` at `91ee327`, and PM accepted `V0.2-W1-06` plus `V0.2-W1-08` as Cloudflare-protected DigitalOcean dev/demo runtime complete for Task Hub. PR #11 merged to `dev` at `fa87ac4`, and PM accepted `V0.2-W1-07` service-auth topology. W3 live connector work remains blocked until Paperclip owner inputs are confirmed.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/adr/ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md
- docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md
- docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md

Steps:
1. Confirm exact Paperclip health/readiness path for `https://paperclip.trisila.online`.
2. Confirm Paperclip runtime can send Cloudflare Access service-token headers.
3. Confirm Paperclip runtime can compute HMAC-SHA256 signatures over the raw request body or agreed canonical payload.
4. Confirm Paperclip environment/source identifiers for `PAPERCLIP_ALLOWED_SOURCE_ID` and `PAPERCLIP_ALLOWED_ENVIRONMENT`.
5. Confirm which Paperclip run/workspace/thread identifiers map to W3 contract fields.
6. Do not send token or signing-secret values in chat or docs.
7. After inputs are confirmed, route W3 live connector planning.

Rules:
- Do not deploy production.
- Do not merge to main.
- Do not commit secrets or generated runtime data.
- Do not implement W2 UI redesign.
- Do not implement new W3 Paperclip behavior.
- Include attribution: W1-07 reviewed by Codex QA / PM; accepted by Codex PM.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created durable W1/W2/W3 prompt registry and PM-owned Current Sprint rule | Codex PM |
| 2026-05-08 | Added per-workstream Git worktree requirement | Codex PM |
| 2026-05-08 | Updated Prompt A from Cloudflare Tunnel setup to no-domain ngrok temporary demo runtime, with Cloudflare Access deferred to W1-06 | Codex PM |
| 2026-05-09 | Updated Prompt A to manual teammate demo handoff after W1.4 QA pass and PM demo-only acceptance | Codex PM |
| 2026-05-09 | Added Prompt D for `V0.2-W2-06` after `V0.2-W2-05` integration QA/PM acceptance on `dev@3fca059` | Codex PM |
| 2026-05-12 | Added Prompt E for DigitalOcean hosted dev/demo behind Cloudflare; historical Paperclip localhost blocker later superseded by hosted Paperclip confirmation | Codex PM |
| 2026-05-12 | Updated Prompt E after PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare; remaining runtime setup is Task Hub plus service-auth verification | Codex PM |
| 2026-05-13 | Updated Prompt E from DevOps setup to QA recheck after Task Hub was configured on DigitalOcean behind Cloudflare Access at `taskhub.trisila.online` | Codex PM |
| 2026-05-13 | Added Prompt F for `V0.2-W1-07` service-auth planning after PM accepted W1-06/W1-08 as dev/demo runtime complete | Codex PM |
| 2026-05-13 | Added Prompt G for QA/PM review of W1-07 service-auth topology before W3 live connector planning | Codex PM / Dev |
| 2026-05-13 | Added Prompt H after PR #11 merge and PM acceptance of `V0.2-W1-07`; W3 live connector remains blocked until Paperclip owner inputs are confirmed | Codex PM |
