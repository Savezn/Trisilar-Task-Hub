# Version 0.2 Workstream Plan - Trisilar Task Hub

**Doc Role:** Active version plan
**Status:** Active - canonical task IDs adopted; old W1/W2/W3 short labels kept as aliases
**Version:** V0.2
**Planning Stage:** Parallel workstreams active; W1 no-cost preview rebaseline accepted
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `../../TODO.md`, `PROJECT_LADDER.md`, `../../MVP_PRD.md`, `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`, `VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../logs/DECISION_LOG.md`
**Theme:** Enable parallel agents safely while giving the small team a no-cost internal preview path before paid hosted deployment.

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

1. Make Trisilar Task Hub accessible to company teammates through a no-cost internal preview path first.
2. Redesign the full web app UI while preserving existing workflows.
3. Connect Trisilar Task Hub to the Paperclip multi-agent system.
4. Establish a `dev` integration environment and PR flow into production.

Project ladder position:

```text
L1 Access Foundation + L2 Full UI Redesign + L3 Paperclip Foundation
-> L4 V0.2 Integration Release
```

V0.2 is not release-ready until W1 hosted runtime evidence, W2 full UI redesign acceptance through W2f, and W3 mock/integration verification are all accepted.

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
| W1 | Company Access + Deployment | Platform Dev / PM | `V0.2-W1-01`-`V0.2-W1-03` done; `V0.2-W1-04` accepted; `V0.2-W1-05` Cloudflare Tunnel setup next | Internal access, no-cost teammate preview, deferred paid hosted target, env/secrets, future agent access pattern |
| W2 | Full UI Redesign | Frontend Dev | `V0.2-W2-01` accepted `b5f67fb`; `V0.2-W2-02`-`V0.2-W2-06` planned / full redesign not complete | Design system, shell/nav, page-by-page redesign, responsive QA |
| W3 | Paperclip Multi-Agent Integration | Integration Dev | `V0.2-W3-01` done `1d1f638` / QA Pass / PM Accepted / integrated on `dev` | Contract-first mock adapter, attribution/audit sync; live connector remains future work |

---

## Canonical V0.2 Task IDs

Use canonical IDs as the primary reference in new prompts, QA reports, PM updates, commit messages, and PR notes. Old labels remain aliases for continuity only.

### W1 - Company Access + Deployment

| Canonical ID | Alias | Status | Scope |
|---|---|---|---|
| `V0.2-W1-01` | `W1.0` | Done / PM accepted | Platform and access decision |
| `V0.2-W1-02` | `W1.1` | Done | Repo deploy readiness |
| `V0.2-W1-03` | `W1.2` / `W1c setup` | Done / merged to `dev` | Dev deployment config |
| `V0.2-W1-04` | `W1.3` | Accepted | No-cost preview decision |
| `V0.2-W1-05` | `W1.4` | Next | Cloudflare Tunnel local runtime setup |
| `V0.2-W1-06` | `W1.5` | Pending | Cloudflare Access teammate gate |
| `V0.2-W1-07` | `W1.6` | Pending | Future Paperclip agent access pattern |
| `V0.2-W1-08` | `W1.7` | Deferred | Paid hosted dev review |

### W2 - Full UI Redesign

| Canonical ID | Alias | Status | Scope |
|---|---|---|---|
| `V0.2-W2-01` | `W2a` | Accepted `b5f67fb` | Shell foundation, mobile nav baseline, Today redesign |
| `V0.2-W2-02` | `W2b` | Planned next | Review Queue redesign and shared task drawer foundation |
| `V0.2-W2-03` | `W2c` | Planned | Tasks inbox and cross-board task rows |
| `V0.2-W2-04` | `W2d` | Planned | Boards Monitor and team board views |
| `V0.2-W2-05` | `W2e` | Planned | Calendar and Planner redesign |
| `V0.2-W2-06` | `W2f` | Planned | Settings, OKR, and Weekly Focus polish |

### W3 - Paperclip Multi-Agent Integration

| Canonical ID | Alias | Status | Scope |
|---|---|---|---|
| `V0.2-W3-01` | W3 sequence 1 | Done `1d1f638` | Contract definitions, mock adapter route, idempotency/audit persistence, and mock verification |
| `V0.2-W3-02` | W3 sequence 2 | Future | Live webhook route after W1 access/security readiness |
| `V0.2-W3-03` | W3 sequence 3 | Future | Source signature and replay protection after Paperclip auth details are known |

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
**Status:** `V0.2-W1-01`-`V0.2-W1-03` done; `V0.2-W1-04` no-cost preview path accepted; `V0.2-W1-05` Cloudflare Tunnel setup next
**Detailed Plan:** `VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md`

**Scope:**
- Internal access method.
- No-cost teammate preview path.
- Paid hosted deployment target, deferred until always-on runtime is needed.
- Environment variables and secrets.
- Teammate onboarding path.
- Dev/prod access boundary.
- Future Paperclip multi-agent access pattern.

**Current PM Decision:**

W1 uses Cloudflare Tunnel + Cloudflare Access as the no-cost teammate preview path. Render remains the default paid hosted target, Railway remains the paid hosted alternate, and both are deferred until the team needs an always-on cloud runtime. ngrok is allowed only as a short-lived troubleshooting/demo fallback, not as the standard W1 company access path.

**Why:**

- Current expected usage is two human users.
- The team does not want paid deployment cost before preview value is proven.
- The app still uses file-backed runtime state, so a local machine plus `APP_DATA_DIR` is acceptable for no-cost preview.
- Cloudflare Access gives a cleaner path for both human email allowlists and future service-token access for Paperclip-style agents.

**Phase Ladder:**

| Canonical ID | Alias | Status | Scope | Exit Criteria |
|---|---|---|---|---|
| `V0.2-W1-01` | `W1.0` | Done | Platform/access decision | Render/Railway/Vercel tradeoff reviewed; Cloudflare Access selected as default gate |
| `V0.2-W1-02` | `W1.1` | Done | Repo deploy readiness | `APP_BASE_URL`, `GOOGLE_REDIRECT_URI`, `APP_DATA_DIR`, `/healthz`, placeholder env docs merged |
| `V0.2-W1-03` | `W1.2` | Done | Dev deployment config | `render.yaml`, `railway.toml`, and hosted dev setup handoff merged to `dev` |
| `V0.2-W1-04` | `W1.3` | Accepted | No-cost preview decision | Cloudflare Tunnel + Cloudflare Access selected for W1 teammate preview; paid Render/Railway deferred |
| `V0.2-W1-05` | `W1.4` | Next | Cloudflare Tunnel local runtime | Local app served through `taskhub-dev.trisilar.com` or confirmed dev hostname via `cloudflared` |
| `V0.2-W1-06` | `W1.5` | Pending | Cloudflare Access email allowlist | Anonymous access blocked; approved teammate email can access |
| `V0.2-W1-07` | `W1.6` | Pending | Paperclip agent access prep | Service-token pattern documented for future agent/API access without implementing new W3 behavior |
| `V0.2-W1-08` | `W1.7` | Deferred | Paid hosted dev review | Revisit Render/Railway only when always-on runtime, stronger dev/prod parity, or preview usage justifies cost |

**No-Cost Preview Rules:**

- The local machine hosting the tunnel must be treated as the dev runtime while preview is active.
- Secrets stay in local `.env` or dashboard configuration only; never commit secrets.
- `APP_DATA_DIR` should point to a stable local data directory for preview persistence.
- Human users use Cloudflare Access email allowlist.
- Future agent access should use Cloudflare Access service tokens or an equivalent service-auth pattern, aligned with W3 and not implemented early in W1.
- Production deployment remains out of scope.

### W2 - Full UI Redesign

**Priority:** P1 after W0
**Owner Role:** Frontend Dev
**Status:** `V0.2-W2-01` done `b5f67fb` / QA Pass / PM Accepted / integrated on `dev`; `V0.2-W2-02`-`V0.2-W2-06` planned
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
| `V0.2-W2-02` | `W2b` | Planned next | Review Queue redesign and shared task drawer foundation |
| `V0.2-W2-03` | `W2c` | Planned | Tasks inbox and cross-board task rows |
| `V0.2-W2-04` | `W2d` | Planned | Boards monitor and team board views |
| `V0.2-W2-05` | `W2e` | Planned | Calendar and Planner redesign |
| `V0.2-W2-06` | `W2f` | Planned | Settings, OKR, and Weekly Focus polish |

**PM Clarification:**

`V0.2-W2-01` acceptance does not mean the full UI redesign is complete. Full W2 acceptance requires `V0.2-W2-02`-`V0.2-W2-06` implementation, QA, and PM acceptance against `docs/design/ui-design-v1-0/`.

Legacy W2 phase labels such as `W2a` and `W2b` are aliases only. Use canonical IDs first in new prompts, QA reports, PM updates, commit messages, and PR notes.

### W3 - Paperclip Multi-Agent Integration

**Priority:** P1 after W0
**Owner Role:** Integration Dev
**Status:** `V0.2-W3-01` done `1d1f638` / QA Pass / PM Accepted / integrated on `dev` at `dde7ab0`; live connector remains future work

**Scope:**
- Integration contract.
- Mock adapter before live connector.
- Task/agent attribution sync.
- Error handling and audit trail.

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
- W1/W2/W3 must use separate feature branches: `feature/w1-*`, `feature/w2-*`, and `feature/w3-*`; W2 subphases may use dedicated `feature/w2-*` phase branches such as `feature/w2b-review-redesign`.
- W1/W2/W3 must run in separate Git worktree folders; do not run parallel agents in the same `trisilar-task-hub` working directory.

---

## Session Estimate

| Workstream | Expected Sessions | Notes |
|---|---|---|
| W0 | 1-2 | Branch, environment docs, PR workflow |
| W1 | 4-7 | Repo readiness is done; no-cost Cloudflare preview setup remains, paid hosted deployment is deferred |
| W2 | 4-8 | Depends on redesign depth and page count |
| W3 | 3-6 | Contract/mock first, live connector second |

---

## Next Recommended Session

Use `../../CURRENT_SPRINT.md` for the current active sprint prompt. If resuming W1 specifically, use this `V0.2-W1-05` handoff. Alias: W1.4.

```text
Role: Dev
Task: V0.2-W1-05 - Cloudflare Tunnel Local Runtime Setup
Alias: W1.4

Context:
W1 repo deploy-readiness and dev deployment config are merged to `dev`. PM selected Cloudflare Tunnel + Cloudflare Access as the no-cost teammate preview path. Render remains the default paid hosted target and Railway remains the paid hosted alternate, but both are deferred until always-on runtime is justified.

Read first:
- CURRENT_SPRINT.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/deployment/DEPLOYMENT_SETUP.md
- docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md

Steps:
1. Confirm dev hostname, default `taskhub-dev.trisilar.com`, or record the PM-approved alternate.
2. Install or verify `cloudflared` on the local/dev machine.
3. Run the app locally with a stable `APP_DATA_DIR`.
4. Configure `APP_BASE_URL` and `GOOGLE_REDIRECT_URI` for the Cloudflare preview hostname.
5. Create a Cloudflare Tunnel route from the preview hostname to `http://localhost:3000`.
6. Add Cloudflare Access email allowlist before teammate preview.
7. Verify local `/healthz`, tunneled `/healthz`, anonymous blocked access, approved teammate access, and non-destructive app load.
8. Record any remaining runtime blockers.

Rules:
- Dev role only.
- Do not deploy production.
- Do not use paid Render/Railway unless PM explicitly changes the decision.
- Do not commit secrets.
- Do not implement W2 UI redesign or new W3 Paperclip behavior.
- Preserve existing app behavior.
- Include attribution: Runtime setup by Dev agent name.
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
