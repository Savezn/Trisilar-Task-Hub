# Version 0.2 Parallel Workstream Prompts - Trisilar Task Hub

**Doc Role:** Durable prompt registry for V0.2 parallel workstreams
**Status:** Active
**Version:** V0.2
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM
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
| A | `V0.2-W1-05` | `W1.4` | Cloudflare Tunnel local runtime setup |
| B | `V0.2-W2-02` | `W2b` | Review Queue redesign and shared task drawer foundation |
| C | `V0.2-W3-01` | W3 sequence 1 | Paperclip integration discovery and contract plan |

Use the canonical ID in the task title. Include the alias only for continuity.

---

## Prompt A - V0.2-W1-05 Cloudflare Tunnel Local Runtime Setup

```text
Role: Dev
Task: V0.2-W1-05 - Cloudflare Tunnel Local Runtime Setup
Alias: W1.4

Context:
V0.2-W1-01 through V0.2-W1-03 are done, and V0.2-W1-04 selected Cloudflare Tunnel + Cloudflare Access as the no-cost teammate preview path. The `dev` branch exists and is the integration baseline. Work in `trisilar-task-hub-w1-company-access` on the W1-owned feature branch.

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
1. Confirm preview hostname, default `taskhub-dev.trisilar.com`, or record the PM-approved alternate.
2. Install or verify `cloudflared`.
3. Run the app locally with stable `APP_DATA_DIR`.
4. Configure `APP_BASE_URL` and `GOOGLE_REDIRECT_URI` for the preview hostname.
5. Create a Cloudflare Tunnel route from the preview hostname to `http://localhost:3000`.
6. Add Cloudflare Access email allowlist before teammate preview.
7. Verify local `/healthz`, tunneled `/healthz`, anonymous blocked access, approved teammate access, and non-destructive app load.
8. Record remaining runtime blockers.

Rules:
- Start from `dev`.
- Work only in the W1 worktree folder and W1-owned feature branch.
- Use `V0.2-W1-05` as the primary task ID; `W1.4` is an alias only.
- Do not implement W2 UI redesign or W3 Paperclip integration.
- Do not commit secrets.
- Do not deploy production or use paid Render/Railway unless PM changes the decision.
- Preserve existing app behavior unless explicitly required.
- Include attribution: Implemented by Dev agent name.
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
- Work only in the W2 worktree folder and a W2 phase branch under `feature/w2-*`, default `feature/w2b-review-redesign`.
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

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created durable W1/W2/W3 prompt registry and PM-owned Current Sprint rule | Codex PM |
| 2026-05-08 | Added per-workstream Git worktree requirement | Codex PM |
