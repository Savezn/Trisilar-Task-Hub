# Current Sprint - Trisilar Task Hub

**Phase:** V0.2 W3 Paperclip Docs Foundation - Mock/Local Workflow
**Status:** Active
**Doc Role:** Short active-state file for current work, active tasks, and next action only
**Last Updated:** 2026-05-13 - **Updated by:** Codex PM

> Use this file to start each Dev / QA / PM session. Historical logs and full plans live in linked docs below.

---

## Current Snapshot

| Area | Status | Source |
|---|---|---|
| V0.1 Release Acceptance | Pass | `docs/logs/QA_LOG.md` R34 |
| P9 open bugs | None currently open | `docs/logs/QA_LOG.md` |
| V0.2 W0 Branch / Environment / CI Setup | QA Pass `9dbb47b` | Implemented by Codex Dev; Reviewed by Codex QA |
| V0.2-W1-02 Deploy Readiness | Merged to `dev` via PR #1 / `615eb6e` | `docs/deployment/DEPLOYMENT_SETUP.md`; legacy label W1b |
| V0.2-W1-03 Dev Deployment Config | Merged to `dev` via PR #2 / `84c01cf` | `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md`; legacy label W1c |
| V0.2-W1-05 ngrok Random URL Demo | QA Pass / PM Accepted as demo-only path | Reviewed by Codex QA; Accepted by Codex PM; current URL/credentials remain local-only in Desktop handoff file |
| V0.2 W1 hosted dev/demo runtime | QA Pass / PM Accepted for dev/demo | Task Hub runs on the existing DigitalOcean Droplet from `dev@b9961fa`, binds `127.0.0.1:3000`, uses `APP_DATA_DIR=/home/trisilar/dashboard-data`, is routed at `https://taskhub.trisila.online` behind Cloudflare Access, and has Trello env configured server-side only. `V0.2-W1-06` and `V0.2-W1-08` are accepted as dev/demo runtime complete, not production/release-grade. |
| V0.2 W2 Full UI Redesign | `V0.2-W2-01` through `V0.2-W2-05` accepted and integrated through `dev@3fca059`; `V0.2-W2-06` planned next | `V0.2-W2-05` integration QA passed on `dev@3fca059` and is accepted by Codex PM; full redesign still open until `V0.2-W2-06` passes QA/PM |
| V0.2 W3 Paperclip Mock Integration | PM Accepted `1d1f638` / merged to `dev` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
| V0.2-W3-02a Paperclip Docs Viewer Foundation | QA Pass / PM Accepted `9391e4f` | Mock/local docs viewer foundation accepted; live docs/API/webhook work remains blocked pending Paperclip owner runtime inputs |
| V0.2-W3-02b Paperclip Docs-to-Task Links | QA Pass / PM Accepted `e681006` | Mock/local bidirectional Docs-to-Task links accepted; `/docs -> /review -> /docs` verified; Review Queue remains human-gated |
| V0.2-W3-02c Paperclip Docs Usability Hardening | QA Pass / PM Accepted `64fdb01` | Mock/local search, filters, sorting, metadata, related Review Queue status, and docs/review navigation accepted; no live Paperclip behavior added |
| V0.2 Integration Merge | PM Accepted on `dev` at `dde7ab0` | Implemented by Codex Dev; Reviewed by Codex QA; Accepted by Codex PM |
| Latest runtime fix | `e1b4801` | P9-6 Trello-backed preview regression |
| Latest docs policy | Documentation/file consolidation QA Pass `af822c6`; file organization policy `ba7311b` added | Reviewed by Codex QA; Updated by Codex PM |

---

## Active Tasks

| ID | Task | Status | Next Role |
|---|---|---|---|
| W0 | Branch / Environment / CI Setup | Done `9dbb47b` / QA Pass | PM complete |
| W1 | Company Access + Deployment | `V0.2-W1-05` accepted as random ngrok URL manual demo only; `V0.2-W1-06`/`V0.2-W1-08` accepted as Cloudflare-protected DigitalOcean dev/demo runtime; `V0.2-W1-07` QA Pass / PM Accepted; Paperclip runtime verification held while Paperclip server is offline | Hold / PM |
| W2 | Full UI Redesign | `V0.2-W2-01`-`V0.2-W2-05` accepted and integrated on `dev`; `V0.2-W2-06` remains the final planned W2 phase; full redesign not complete | Dev |
| W3 | Paperclip Multi-Agent Integration | Mock path done `1d1f638` / QA Pass / PM Accepted / merged to `dev`; `V0.2-W3-02a` QA Pass / PM Accepted `9391e4f`; `V0.2-W3-02b` QA Pass / PM Accepted `e681006`; `V0.2-W3-02c` QA Pass / PM Accepted `64fdb01`; `V0.2-W3-02d` approved next; live path blocked until Paperclip owner inputs are confirmed | Dev |
| Integration | Accepted W2/W3 into `dev` | QA Pass / PM Accepted at `dde7ab0` | PM complete |

---

## Documentation Routing

| Need | Read |
|---|---|
| Current task and next action | `CURRENT_SPRINT.md` |
| Project-wide ladder and release gates | `docs/plans/PROJECT_LADDER.md` |
| Full V0.2 branch/workstream plan | `docs/plans/VERSION_0_2_PLAN.md` |
| Durable W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| W2 full UI redesign phase plan | `docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md` |
| W1 deploy-readiness setup (`V0.2-W1-02`) and DigitalOcean/Cloudflare hosted dev path | `docs/deployment/DEPLOYMENT_SETUP.md` |
| W1 dev deployment config / ngrok demo handoff / DigitalOcean runtime notes (`V0.2-W1-03` to `V0.2-W1-08`) | `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md` |
| QA history and completed work archive | `docs/logs/QA_LOG.md` |
| PM decisions and phase context | `docs/logs/DECISION_LOG.md` |
| Product/UX scope | `MVP_PRD.md` |
| Historical roadmap/progress tracker | `docs/archive/DEVELOPMENT_HISTORY.md` |
| File/function lookup hints | `docs/reference/KEY_FILE_MAP.md` |

---

## Parallel Workstream Write Ownership

| File / Area | Write Owner | Rule |
|---|---|---|
| `CURRENT_SPRINT.md` | PM only | Dev/QA may read but must not update this file during W1/W2/W3 parallel work; integration conflict resolution may preserve accepted PM status. |
| `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` | PM only | Preserve prompts for all workstreams; do not delete other workstream prompts. |
| W1 plan/files | W1 Dev / QA | Keep W1 updates inside W1-owned docs/branches until PM checkpoint. |
| W2 plan/files | W2 Dev / QA | Keep W2 updates inside W2-owned docs/branches until PM checkpoint. |
| W3 plan/files | W3 Dev / QA | Keep W3 updates inside W3-owned docs/branches until PM checkpoint. |

Required branches:

- `V0.2-W1-02` / legacy W1b: `feature/w1-deploy-readiness` merged to `dev` in PR #1
- `V0.2-W1-03` / legacy W1c: `feature/w1c-dev-environment-deployment` merged to `dev` in PR #2
- W2: `feature/w2-*` phase branches; next implementation branch `feature/w2-06-settings-okr-focus-redesign`
- W3: `feature/w3-paperclip-integration`

Required worktrees:

- PM / Integration: `trisilar-task-hub` on `dev`
- `V0.2-W1-05`: ngrok temporary demo runtime uses local runtime tools; repo branch only if a docs/setup defect is discovered
- `V0.2-W1-08`: DigitalOcean hosted dev/demo setup uses latest `dev`, server-only secrets, and Cloudflare front door for Task Hub; repo changes only if setup defects are found
- W2: `trisilar-task-hub-w2-ui-redesign` on the active `feature/w2-*` phase branch
- W3: `trisilar-task-hub-w3-paperclip` on `feature/w3-paperclip-integration`

Parallel rule:

- W1/W2/W3 Dev agents must not edit `CURRENT_SPRINT.md` directly.
- W1/W2/W3 Dev agents must not share one feature branch.
- W1/W2/W3 Dev agents must not run in the same working directory.
- Before editing, each agent must run `git status --short --branch` and confirm the folder/branch match the assigned workstream.
- QA agents report evidence in the workstream handoff/doc, not `CURRENT_SPRINT.md`.
- PM is the only role that updates `CURRENT_SPRINT.md` after QA pass, PM decision, or integration checkpoint.
- If a Dev/QA task needs a status change, leave a PM handoff note instead of editing the sprint snapshot.

---

## Next Action - V0.2-W3-02d Paperclip Docs-to-Review Workflow

Project ladder now lives in `docs/plans/PROJECT_LADDER.md`. `V0.2-W1-05` (`W1.4`) remains accepted as demo-only random ngrok access. `V0.2-W1-06` and `V0.2-W1-08` are accepted as Cloudflare-protected DigitalOcean dev/demo runtime complete after QA pass and PR #9 merge to `dev` at `91ee327`. `V0.2-W1-07` service-auth topology is accepted after QA/PM review and PR #11 merge to `dev` at `fa87ac4`. This does not replace production deployment, does not implement W3 live Paperclip behavior, and does not merge to `main`.

QA evidence on 2026-05-13: `taskhub-dashboard.service` is active/enabled; Task Hub binds `127.0.0.1:3000`; raw public `157.230.251.209:3000` is unreachable; anonymous `https://taskhub.trisila.online/healthz` returns Cloudflare Access `302`; approved-user browser access loaded the app without `/api/boards` or `/api/all-cards` 401 errors; local `/healthz`, `/api/boards`, and `/api/all-cards` return `200`; `GOOGLE_REDIRECT_URI` is `https://taskhub.trisila.online/auth/callback`; `APP_DATA_DIR` persistence survived restart; secrets are present only as server-side env keys and were not recorded in docs/chat.

W1 runtime and service-auth planning are accepted for dev/demo. `V0.2-W3-02a` Paperclip Docs Viewer Foundation, `V0.2-W3-02b` Docs-to-Task Links, and `V0.2-W3-02c` Docs Usability Hardening are accepted as mock/local only. PM approves `V0.2-W3-02d` Docs-to-Review Workflow next because it remains local and human-gated. W3 live docs/API/webhook work remains blocked until Paperclip owner confirms health path, service-token support, HMAC support, source/environment ids, id mapping, and sample payload after the server is online. Do not reopen Task Hub runtime work.

```text
Role: Dev
Task: V0.2-W3-02d - Paperclip Docs-to-Review Workflow

Context:
`V0.2-W3-02a` Docs Viewer Foundation is QA Pass / PM Accepted at `9391e4f`.
`V0.2-W3-02b` Docs-to-Task Links is QA Pass / PM Accepted at `e681006`.
`V0.2-W3-02c` Docs Usability Hardening is QA Pass / PM Accepted at `64fdb01`.
Live Paperclip docs/API/webhook work remains blocked until Paperclip owner runtime inputs are confirmed.
This task adds local Docs-to-Review workflow affordances while preserving Review Queue human approval.

Read first:
- CODEX.md
- CURRENT_SPRINT.md
- docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md
- docs/plans/VERSION_0_2_PLAN.md
- docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md
- public/js/pages/docs.js
- public/js/pages/review.js
- src/integrations/paperclip/documents-contract.js
- src/integrations/paperclip/fixtures/document-artifacts.json
- scripts/verify-paperclip-docs.js

Goal:
Let a reviewer create pending Review Queue work from a mock/local Paperclip document excerpt and manually attach/detach document-task links, without any live Paperclip or Trello/Calendar side effects.

Steps:
1. Work only in `trisilar-task-hub-w3-paperclip` on `feature/w3-paperclip-integration`.
2. Add failing verification for creating a pending Review Queue task from a bounded document excerpt.
3. Add a local Review Queue candidate creation path from `/docs`; generated tasks must start as `pending`.
4. Add manual attach/detach for mock/local document-task links by `artifactId`, `requestId`, and `externalTaskId`.
5. Persist attach/detach state under the existing local runtime data path; do not modify fixture files at runtime.
6. Add a document review status field with allowed states `new`, `reviewed`, `needs_follow_up`, and `archived`.
7. Preserve audit trail for task creation, attach, detach, and status changes.
8. Preserve existing `/docs -> /review -> /docs` navigation and `V0.2-W3-02c` search/filter/sort behavior.
9. Route to QA after implementation.

Rules:
- Do not deploy production.
- Do not merge to main.
- Do not expose secrets, Cloudflare tokens, or Trello/Google credential values.
- Do not implement W1 runtime changes.
- Do not implement W2 visual redesign or shell/navigation redesign.
- Do not add live Paperclip calls, live webhook, or live Docs API backend proxy.
- Do not bypass Review Queue human approval.
- Do not auto-approve, auto-create Trello cards, auto-sync Calendar, or auto-sync Google Tasks from Docs.
- New Docs-created tasks must be Review Queue pending tasks only.
- Include attribution: Routed by Codex PM.
```

**Attribution:** W1 runtime rebaseline recorded by Codex PM. W1.4 demo confirmed by teammate and accepted by Codex PM. Paperclip-on-DigitalOcean status confirmed by PM and recorded by Codex PM. W1.5/W1.7 runtime checkpoint recorded by Codex PM; reviewed by Codex QA; accepted by Codex PM. W1.6 service-auth topology planned by Codex PM / Dev; reviewed by Codex QA / PM; accepted by Codex PM. `V0.2-W3-02a` Paperclip Docs Viewer Foundation implemented by Codex Dev, reviewed by Codex QA, and accepted by Codex PM. `V0.2-W3-02b` Docs-to-Task Links implemented by Codex Dev, reviewed by Codex QA, and accepted by Codex PM. `V0.2-W3-02c` Docs Usability Hardening implemented by Codex Dev, reviewed by Codex QA, and accepted by Codex PM. PM approved `V0.2-W3-02d` as the next mock/local human-gated Docs workflow task; live Paperclip work remains blocked.
