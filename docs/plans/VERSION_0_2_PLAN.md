# Version 0.2 Workstream Plan - Trisilar Task Hub

**Doc Role:** Active version plan
**Status:** Active - canonical task IDs adopted; old W1/W2/W3 short labels kept as aliases
**Version:** V0.2
**Planning Stage:** Parallel workstreams active; W1 hosted dev/demo runtime accepted, W1 service-auth topology planned / QA pending
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-13 - **Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `../../TODO.md`, `PROJECT_LADDER.md`, `../../MVP_PRD.md`, `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`, `VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../logs/DECISION_LOG.md`
**Theme:** Enable parallel agents safely while moving from manual demo access toward stable Cloudflare-protected hosted dev/demo runtime for Task Hub and service-auth with hosted Paperclip.

---

## How to Use This Document

- Use as the main V0.2 planning file.
- Use `PROJECT_LADDER.md` for project-wide release sequencing beyond V0.2.
- Start each session from `../../CURRENT_SPRINT.md`; read this file when the task is part of W0/W1/W2/W3.
- Use `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` as the durable prompt registry for W1/W2/W3.
- Update this file when PM changes V0.2 workstream scope, sequencing, or branch/environment rules.
- Keep detailed QA history in `../logs/QA_LOG.md`, not in this plan.
- Use `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md` for branch, environment, PR, and verification rules.

---

## Planning Summary

V0.1 Release Acceptance passed. V0.2 will be managed as parallel workstreams after W0 establishes branch and environment rules.

Goals:

1. Make Trisilar Task Hub accessible to company teammates through a safe internal preview path first.
2. Redesign the full web app UI while preserving existing workflows.
3. Connect Trisilar Task Hub to the Paperclip multi-agent system.
4. Establish a `dev` integration environment and PR flow into production.

Project ladder position:

```text
L1 Access Foundation + L2 Full UI Redesign + L3 Paperclip Foundation
-> L4 V0.2 Integration Release
```

V0.2 is not release-ready until W1 stable access-gated preview evidence, W2 full UI redesign acceptance through `V0.2-W2-06` (`W2f`), and W3 mock/integration verification are all accepted. `V0.2-W1-05` is accepted as a random ngrok URL manual demo path only; it does not replace the stable access gate. Paperclip is now hosted on DigitalOcean behind Cloudflare by the Paperclip owner. Task Hub is accepted as a DigitalOcean hosted dev/demo runtime behind Cloudflare Access; W1 service-auth topology is planned and needs QA/PM acceptance before W3 live connector work proceeds.

---

## Scope / Non-Goals

In scope:

- Branch and environment workflow for `main`, `dev`, and `feature/*`.
- Internal company access and deployment planning.
- Full UI redesign planning and implementation path.
- Paperclip multi-agent integration planning and implementation path.
- PR/QA rules for parallel workstreams.

Not in scope for W0:

- Implementing company access/deployment.
- Implementing the UI redesign.
- Implementing Paperclip live integration.
- Replacing the current Trello/Google integrations.

---

## Dependency / Workflow Model

### Branch Model

| Branch | Role | Rule |
|---|---|---|
| `main` | Production | Protected, no direct feature work |
| `dev` | Integration/dev environment | Feature PRs merge here first |
| `feature/w0-*` | Branch/environment setup | Starts from `main` until `dev` exists |
| `feature/w1-*` | Company access/deployment | Starts from `dev` |
| `feature/w2-*` | UI redesign | Starts from `dev` |
| `feature/w3-*` | Paperclip integration | Starts from `dev` |
| `hotfix/*` | Emergency production fix | Starts from `main`, then merges back to `dev` |

Flow:

```text
feature/* -> dev -> QA/integration -> main -> production
```

Dependency rule:

```text
W0 first -> W1/W2/W3 parallel -> integration QA on dev -> release to main
```

---

## Workstream / Phase Map

| ID | Workstream | Owner Role | Status | Scope |
|---|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Dev / PM | Done `9dbb47b` / QA Pass | Create `dev`, define env/deploy/PR rules, add verification gate |
| W1 | Company Access + Deployment | Platform Dev / PM | `V0.2-W1-01`-`V0.2-W1-03` done; `V0.2-W1-04` accepted/amended; `V0.2-W1-05` accepted demo-only; `V0.2-W1-06`/`V0.2-W1-08` QA Pass / PM Accepted for dev/demo runtime; `V0.2-W1-07` planned / QA pending | Internal access, teammate preview, hosted dev/demo runtime, env/secrets, future agent access pattern |
| W2 | Full UI Redesign | Frontend Dev | `V0.2-W2-01` accepted `b5f67fb`; `V0.2-W2-02` accepted `d33d8f7`; `V0.2-W2-03` accepted `ea807fd`; `V0.2-W2-04` accepted `47ebd84` and integrated on `dev@0b77aed`; `V0.2-W2-05` accepted `4638df7` and integrated on `dev@3fca059`; `V0.2-W2-06` planned next / full redesign not complete | Design system, shell/nav, page-by-page redesign, responsive QA |
| W3 | Paperclip Multi-Agent Integration | Integration Dev | `V0.2-W3-01` done `1d1f638` / QA Pass / PM Accepted / integrated on `dev`; live connector blocked until W1-07 service-auth topology passes QA/PM and Paperclip owner inputs are confirmed | Contract-first mock adapter, attribution/audit sync; live connector waits for stable hosted runtime and auth |

---

## Canonical V0.2 Task IDs

Use canonical IDs as the primary reference in new prompts, QA reports, PM updates, commit messages, and PR notes. Old labels remain aliases for continuity only.

### W1 - Company Access + Deployment

| Canonical ID | Alias | Status | Scope |
|---|---|---|---|
| `V0.2-W1-01` | `W1.0` | Done / PM accepted | Platform and access decision |
| `V0.2-W1-02` | `W1.1` | Done | Repo deploy readiness |
| `V0.2-W1-03` | `W1.2` / legacy `W1c setup` | Done / merged to `dev` | Dev deployment config |
| `V0.2-W1-04` | `W1.3` | Accepted / amended | Preview/runtime decision |
| `V0.2-W1-05` | `W1.4` | Accepted demo-only | No-domain random ngrok manual demo runtime |
| `V0.2-W1-06` | `W1.5` | QA Pass / PM Accepted for dev/demo | Stable Cloudflare hostname + Access teammate gate |
| `V0.2-W1-07` | `W1.6` | Planned / QA pending | Future Paperclip agent/API access pattern for hosted Paperclip -> hosted Task Hub |
| `V0.2-W1-08` | `W1.7` | QA Pass / PM Accepted for dev/demo | DigitalOcean hosted dev/demo runtime for Task Hub |

### W2 - Full UI Redesign

| Canonical ID | Alias | Status | Scope |
|---|---|---|---|
| `V0.2-W2-01` | `W2a` | Accepted `b5f67fb` | Shell foundation, mobile nav baseline, Today redesign |
| `V0.2-W2-02` | `W2b` | Accepted `d33d8f7` | Review Queue redesign and shared task drawer foundation |
| `V0.2-W2-03` | `W2c` | Accepted `ea807fd` | Tasks inbox and cross-board task rows |
| `V0.2-W2-04` | `W2d` | Accepted `47ebd84` / integrated on `dev@0b77aed` | Boards Monitor and team board views |
| `V0.2-W2-05` | `W2e` | Accepted `4638df7` / integrated on `dev@3fca059` | Calendar and Planner redesign |
| `V0.2-W2-06` | `W2f` | Planned next | Settings, OKR, and Weekly Focus polish |

### W3 - Paperclip Multi-Agent Integration

| Canonical ID | Alias | Status | Scope |
|---|---|---|---|
| `V0.2-W3-01` | W3 sequence 1 | Done `1d1f638` | Contract definitions, mock adapter route, idempotency/audit persistence, and mock verification |
| `V0.2-W3-02` | W3 sequence 2 | Blocked / Future | Live webhook route after W1-07 service-auth topology passes QA/PM and Paperclip owner inputs are confirmed |
| `V0.2-W3-03` | W3 sequence 3 | Future | Additional source signature and replay hardening after the first live webhook is verified |

Do not use `W3-P0`, `W3-P1`, or similar active IDs. If an older agent used them in chat, normalize the next PM update to the canonical `V0.2-W3-XX` form.

---

## Workstream / Phase Details

### W0 - Branch / Environment / CI Setup

**Priority:** P0
**Owner Role:** Dev / PM
**Status:** Done `9dbb47b` / QA Pass

**Why:**
- Parallel agent work needs a stable integration branch.
- Company access, UI redesign, and Paperclip integration should not merge directly to production.
- PR/QA rules must be explicit before W1/W2/W3 begin.

**Tasks:**
- Verify current branch and remote status.
- Create `dev` from current `main` if it does not exist.
- Push `dev` to origin.
- Document branch model and environment expectations.
- Document PR flow: `feature/* -> dev -> main`.
- Confirm verification command: `npm.cmd run check:all`.

**AC:**
- [ ] `dev` branch exists and is pushed to remote.
- [ ] Branch model is documented in README/docs.
- [ ] PR flow is documented: `feature/* -> dev -> main`.
- [ ] Dev/prod environment expectations are documented.
- [ ] Required check command is documented: `npm.cmd run check:all`.
- [ ] Next actions for W1, W2, and W3 are clear enough to open parallel Dev sessions.

### W1 - Company Access + Deployment

**Priority:** P0 after W0
**Owner Role:** Platform Dev / PM
**Status:** `V0.2-W1-01`-`V0.2-W1-03` done; `V0.2-W1-04` preview path accepted/amended; `V0.2-W1-05` random ngrok manual demo accepted; `V0.2-W1-06`/`V0.2-W1-08` QA Pass / PM Accepted for dev/demo runtime; `V0.2-W1-07` service-auth topology planned / QA pending
**Detailed Plan:** `VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md`

**Scope:**
- Internal access method.
- Demo-only teammate preview path.
- DigitalOcean hosted dev/demo runtime candidate for Task Hub.
- Managed hosted deployment target notes, deferred unless PM reselects Render/Railway.
- Environment variables and secrets.
- Teammate onboarding path.
- Dev/prod access boundary.
- Future Paperclip multi-agent access pattern.

**Current PM Decision:**

W1 keeps random ngrok URL + temporary Basic Auth as the accepted manual demo-only fallback path. PM confirmed a Cloudflare-managed domain exists and selected DigitalOcean as the always-on dev/demo runtime for Task Hub. Task Hub now runs on the existing DigitalOcean Droplet from `dev@b9961fa`, binds `127.0.0.1:3000`, uses `APP_DATA_DIR=/home/trisilar/dashboard-data`, and is routed through Cloudflare Access at `https://taskhub.trisila.online`. PM also confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner. Cloudflare remains the front door for DNS, access control, HTTPS/proxy, and future service-token access. Render remains the previously approved managed hosted target and Railway remains the managed alternate, but neither is the next planned path unless PM reselects them.

**Why:**

- Current expected usage is two human users plus future Paperclip/multi-agent integration.
- Manual ngrok demo already proved short teammate access, but it cannot provide stable Paperclip handoff.
- The app still uses file-backed runtime state, so a low-cost Droplet with explicit `APP_DATA_DIR` is a better fit than serverless/ephemeral hosting.
- Cloudflare Access gives a cleaner durable path for both human email allowlists and future service-token access for Paperclip-style agents.
- ngrok gives a no-cost short demo path now, but random URLs require manual handoff each run. Paperclip repeat testing should use a reserved/static ngrok domain or stable Cloudflare hostname.

**Phase Ladder:**

| Canonical ID | Alias | Status | Scope | Exit Criteria |
|---|---|---|---|---|
| `V0.2-W1-01` | `W1.0` | Done | Platform/access decision | Render/Railway/Vercel tradeoff reviewed; Cloudflare Access selected as default gate |
| `V0.2-W1-02` | `W1.1` | Done | Repo deploy readiness | `APP_BASE_URL`, `GOOGLE_REDIRECT_URI`, `APP_DATA_DIR`, `/healthz`, placeholder env docs merged |
| `V0.2-W1-03` | `W1.2` | Done | Dev deployment config | `render.yaml`, `railway.toml`, and deployment setup handoff merged to `dev` |
| `V0.2-W1-04` | `W1.3` | Accepted / amended | Preview/runtime decision | Random ngrok accepted for manual demo; DigitalOcean + Cloudflare selected for next hosted dev/demo runtime |
| `V0.2-W1-05` | `W1.4` | Accepted demo-only | No-domain random ngrok manual demo runtime | QA verified Basic Auth, `/healthz`, app load, hosted callback, and local-only data path; PM accepted short manual teammate demo only |
| `V0.2-W1-06` | `W1.5` | QA Pass / PM Accepted for dev/demo | Stable Cloudflare hostname + Access email allowlist | Task Hub hostname confirmed; anonymous access blocked; approved teammate email can access |
| `V0.2-W1-07` | `W1.6` | Planned / QA pending | Paperclip agent/API access prep | Cloudflare Access service-token plus signed-webhook pattern documented for hosted Paperclip -> hosted Task Hub integration without implementing new W3 behavior |
| `V0.2-W1-08` | `W1.7` | QA Pass / PM Accepted for dev/demo | DigitalOcean hosted dev/demo runtime for Task Hub | Runtime, persistent Task Hub `APP_DATA_DIR`, Cloudflare routes, health checks, access gate, non-destructive app load, and hosted Paperclip dependency evidence verified |

**No-Cost Preview Rules:**

- The local machine hosting the tunnel must be treated as the dev runtime while preview is active.
- Secrets stay in local `.env` or dashboard configuration only; never commit secrets.
- `APP_DATA_DIR` should point to a stable local data directory for preview persistence.
- Human users use temporary Basic Auth for the random ngrok manual demo and Cloudflare Access email allowlist for the stable Cloudflare preview.
- Future agent access should use Cloudflare Access service tokens, a reserved/static ngrok domain for demo-only repeat testing, or an equivalent service-auth pattern, aligned with W3 and not implemented early in W1.
- Production deployment remains out of scope.

### W2 - Full UI Redesign

**Priority:** P1 after W0
**Owner Role:** Frontend Dev
**Status:** `V0.2-W2-01` done `b5f67fb` / QA Pass / PM Accepted / integrated on `dev`; `V0.2-W2-02` done `d33d8f7` / QA Recheck Pass / PM Accepted; `V0.2-W2-03` done `ea807fd` / QA Recheck Pass / PM Accepted; `V0.2-W2-04` done `47ebd84` / integrated on `dev@0b77aed`; `V0.2-W2-05` done `4638df7` / integrated on `dev@3fca059`; `V0.2-W2-06` planned next
**Detailed Plan:** `VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md`

**Scope:**
- Design system.
- App shell and navigation.
- Page-by-page redesign.
- Desktop/mobile visual QA.
- No server/API refactor unless explicitly required.

**Phase Breakdown:**

| Canonical ID | Alias | Status | Scope |
|---|---|---|---|
| `V0.2-W2-01` | `W2a` | Accepted | Shell foundation, mobile nav baseline, Today redesign |
| `V0.2-W2-02` | `W2b` | Accepted `d33d8f7` | Review Queue redesign and shared task drawer foundation |
| `V0.2-W2-03` | `W2c` | Accepted `ea807fd` | Tasks inbox and cross-board task rows |
| `V0.2-W2-04` | `W2d` | Accepted `47ebd84` / integrated on `dev@0b77aed` | Boards monitor and team board views |
| `V0.2-W2-05` | `W2e` | Accepted `4638df7` / integrated on `dev@3fca059` | Calendar and Planner redesign |
| `V0.2-W2-06` | `W2f` | Planned next | Settings, OKR, and Weekly Focus polish |

**PM Clarification:**

`V0.2-W2-01` through `V0.2-W2-05` acceptance does not mean the full UI redesign is complete. Full W2 acceptance still requires `V0.2-W2-06` implementation, QA, and PM acceptance against `docs/design/ui-design-v1-0/`.

Legacy W2 phase labels such as `W2a` and `W2b` are aliases only. Use canonical IDs first in new prompts, QA reports, PM updates, commit messages, and PR notes.

### W3 - Paperclip Multi-Agent Integration

**Priority:** P1 after W0
**Owner Role:** Integration Dev
**Status:** `V0.2-W3-01` done `1d1f638` / QA Pass / PM Accepted / integrated on `dev` at `dde7ab0`; live connector remains blocked until runtime/auth topology is stable

**Scope:**
- Integration contract.
- Mock adapter before live connector.
- Task/agent attribution sync.
- Error handling and audit trail.

**Current runtime clarification:**

- Task Hub is accepted as a stable hosted dev/demo URL through DigitalOcean + Cloudflare.
- Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner.
- W3 live connector work can proceed after QA/PM accepts `V0.2-W1-07` service-auth topology and Paperclip owner inputs are confirmed.

---

## Delivery Rules

- No direct push to `main` for feature work.
- Every workstream branch must state owner agent in docs and PR notes.
- Every PR into `dev` must include QA evidence.
- Any production-ish behavior or critical API change requires QA Recheck before PM signoff.
- UI redesign PRs must include desktop/mobile visual evidence and console error check.
- Paperclip integration PRs must include contract/mock verification before live connector work.
- Keep `CURRENT_SPRINT.md` short; put history in logs and multi-session plans in `docs/plans/`.
- During parallel W1/W2/W3 work, only PM updates `CURRENT_SPRINT.md`; Dev/QA agents keep updates in their owned workstream docs/branches.
- Durable W1/W2/W3 prompts live in `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` and must not be overwritten by a single workstream update.
- New V0.2 prompts and reports must use canonical task IDs such as `V0.2-W1-05`, `V0.2-W2-02`, or `V0.2-W3-01` first; old labels are aliases only.
- W1/W2/W3 must use separate feature branches: `feature/w1-*`, `feature/w2-*`, and `feature/w3-*`; W2 subphases may use dedicated `feature/w2-*` phase branches such as `feature/w2-02-review-redesign`.
- W1/W2/W3 must run in separate Git worktree folders; do not run parallel agents in the same `trisilar-task-hub` working directory.

---

## Session Estimate

| Workstream | Expected Sessions | Notes |
|---|---|---|
| W0 | 1-2 | Branch, environment docs, PR workflow |
| W1 | 4-8 | Repo readiness is done; random ngrok manual demo path is accepted; DigitalOcean hosted dev/demo behind Cloudflare for Task Hub is QA Pass / PM Accepted; service-auth topology is planned and needs QA/PM acceptance |
| W2 | 4-8 | Depends on redesign depth and page count |
| W3 | 3-6 | Contract/mock first, live connector second |

---

## Next Recommended Session

Use `../../CURRENT_SPRINT.md` for the current active sprint prompt. If resuming W1 specifically, use the service-auth QA review prompt in `CURRENT_SPRINT.md` for `V0.2-W1-07`. Alias: W1.6.

```text
Role: QA / PM
Task: V0.2-W1-07 - Review Paperclip Service-Auth Planning for Hosted Task Hub
Alias: W1.6

Context:
W1.4 random ngrok manual demo is accepted demo-only. PR #9 was merged to `dev` at `91ee327`, and PM accepted `V0.2-W1-06` plus `V0.2-W1-08` as Cloudflare-protected DigitalOcean dev/demo runtime complete for Task Hub. Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner. W1-07 planning selects Paperclip -> Task Hub webhook as the first live direction, using Cloudflare Access service token plus signed webhook headers. W3 live connector work remains blocked until this topology passes QA/PM and Paperclip owner inputs are confirmed.

Read first:
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
- Do not deploy production.
- QA only: do not patch code.
- Do not expose secrets, Cloudflare tokens, or Trello/Google credential values.
- Do not implement W2 UI redesign or new W3 Paperclip behavior.
- Preserve existing app behavior.
- Include attribution: Planned by Codex PM / Dev; reviewed by Codex QA.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created V0.2 workstream plan after V0.1 Release Acceptance | Codex PM |
| 2026-05-08 | Standardized plan document format with V0.1 archive plan | Codex PM |
| 2026-05-08 | Added PM-owned Current Sprint rule for parallel workstreams | Codex PM |
| 2026-05-08 | Added per-workstream Git worktree requirement | Codex PM |
| 2026-05-08 | Accepted W3 Paperclip mock integration after QA pass at `1d1f638` | Codex PM |
| 2026-05-08 | Merged accepted W2/W3 into `dev` for integration QA routing | Codex Dev |
| 2026-05-08 | Accepted V0.2 W2/W3 integration on `dev` after QA pass at `dde7ab0` | Codex PM |
| 2026-05-08 | Rebaselined W1 into a phase ladder and selected Cloudflare Tunnel + Cloudflare Access as the no-cost teammate preview path; deferred paid Render/Railway hosted dev | Codex PM |
| 2026-05-08 | Added dedicated W1 workstream plan following project plan-document policy | Codex PM |
| 2026-05-08 | Updated W1 release-gate language to canonical `V0.2-W1-05`/`V0.2-W1-06` naming policy | Codex PM |
| 2026-05-08 | Accepted `V0.2-W2-02` Review Queue redesign and shared task drawer foundation at `d33d8f7`; routed W2 next to W2-02 integration into `dev`, then `V0.2-W2-03` Tasks Inbox | Codex PM |
| 2026-05-08 | Amended W1 no-cost path to use ngrok + temporary Basic Auth while no domain/subdomain exists; Cloudflare Access remains the stable gate after DNS is available | Codex PM |
| 2026-05-09 | Accepted `V0.2-W1-05` as random ngrok URL manual teammate demo only; random ngrok remains unsuitable for permanent Paperclip automation | Codex PM |
| 2026-05-09 | Accepted `V0.2-W2-03` Tasks Inbox + Cross-board Rows at `ea807fd`; routed W2 next to W2-03 integration into `dev`, then `V0.2-W2-04` Boards Monitor + Team Board Views | Codex PM |
| 2026-05-09 | Accepted `V0.2-W2-04` Boards Monitor + Team Board Views at `47ebd84` and accepted its integration on `dev@0b77aed`; routed W2 next to `V0.2-W2-05` Calendar + Planner | Codex PM |
| 2026-05-09 | Accepted `V0.2-W2-05` Calendar + Planner at `4638df7` and accepted its integration on `dev@3fca059`; routed W2 next to final phase `V0.2-W2-06` Settings + OKR + Weekly Focus Polish | Codex PM |
| 2026-05-12 | Rebaselined W1 next runtime path to DigitalOcean hosted dev/demo behind Cloudflare; historical Paperclip localhost blocker later superseded by hosted Paperclip confirmation | Codex PM |
| 2026-05-12 | Updated V0.2 W1/W3 plan after PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare; remaining runtime path is Task Hub plus service-auth verification | Codex PM |
| 2026-05-13 | Recorded Task Hub DigitalOcean + Cloudflare runtime checkpoint: `taskhub.trisila.online` routes through Cloudflare Access to private `127.0.0.1:3000`; W1-06/W1-08 require QA acceptance and W1-07 service-auth planning remains pending | Codex PM |
| 2026-05-13 | Accepted `V0.2-W1-06` and `V0.2-W1-08` as Cloudflare-protected DigitalOcean dev/demo runtime complete after PR #9 merge at `91ee327`; routed next W1 work to `V0.2-W1-07` service-auth planning | Codex PM |
| 2026-05-13 | Planned `V0.2-W1-07` service-auth topology: Paperclip calls Task Hub webhook through Cloudflare Access service token plus signed webhook headers; W3 live implementation remains blocked until QA/PM acceptance and Paperclip owner inputs | Codex PM / Dev |
