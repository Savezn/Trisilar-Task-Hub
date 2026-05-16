# Project Roadmap - Trisilar Task Hub

**Doc Role:** High-level roadmap index
**Status:** Active
**Owner:** PM
**Last Updated:** 2026-05-15
**Updated by:** Codex PM / Integration Owner

This file tracks the broad roadmap. It does not replace `CURRENT_SPRINT.md`, version plans, QA logs, or ADRs.

---

## Source of Truth

| Need | Use |
|---|---|
| Current active task and next prompt | `CURRENT_SPRINT.md` |
| Project-wide ladder and release gates | `docs/plans/PROJECT_LADDER.md` |
| Version scope and workstreams | `docs/plans/VERSION_0_2_PLAN.md` |
| V0.3 Product Reliability + UX Stabilization | `docs/plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md` |
| V0.4 Paperclip production integration | `docs/plans/VERSION_0_4_LIVE_AI_OPERATIONS_PAPERCLIP_PRODUCTION_PLAN.md` |
| V0.5 Foundation Hardening | `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md` |
| Long-term operating model | `docs/reference/ORGANIZATION_OPERATING_MODEL.md` |
| AI agent governance and role boundaries | `docs/reference/AI_AGENT_GOVERNANCE.md` and `docs/agents/` |
| Parallel Codex development | `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md` |
| Parallel W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| QA history | `docs/logs/QA_LOG.md` |
| Major decisions | `docs/logs/DECISION_LOG.md` and `docs/adr/` |
| Architecture reference | `docs/reference/ARCHITECTURE.md` |
| Testing policy | `docs/testing/TEST_STRATEGY.md` |
| Runtime operations | `docs/deployment/RUNTIME_OPERATIONS_RUNBOOK.md`, `docs/deployment/TROUBLESHOOTING.md`, and `docs/deployment/ENVIRONMENT_MATRIX.md` |
| Security and backup policy | `docs/reference/SECURITY_ACCESS_POLICY.md` and `docs/reference/DATA_BACKUP_RETENTION_POLICY.md` |
| Team onboarding | `docs/operations/TEAM_ONBOARDING_GUIDE.md` |
| UI V2 design experiment | `docs/plans/UI_WEB_DESIGN_V2_RESEARCH_AND_CLAUDE_DESIGN_HANDOFF_PLAN.md` and `docs/design/ui-design-v2/CLAUDE_DESIGN_UI_V2_GUIDELINES.md` |

---

## Current Roadmap

Use `docs/plans/PROJECT_LADDER.md` as the current project-wide ladder. The summary below is an index only.

### V0.1 - MVP Release Acceptance

Status: Passed release acceptance.

Core outcomes:

- Trello-backed Task Hub stabilized.
- Page modules extracted from `public/app.js`.
- Router URL path sync implemented.
- Frontend error hardening completed.
- OKR / Portfolio Layer Phase 7 completed.
- Real preview regression and release acceptance passed.

Historical details live in `docs/archive/VERSION_0_1_PLAN.md`, `docs/archive/DEVELOPMENT_HISTORY.md`, and `docs/logs/QA_LOG.md`.

### V0.2 - Company Access, UI Redesign, Paperclip Integration

Status: Complete for the V0.2 release/integration baseline. W2 full UI redesign is complete through `V0.2-W2-06` (`W2a`-`W2f` aliases). `V0.2-W1-05` random ngrok + temporary Basic Auth is accepted for short manual teammate demo only. Task Hub is configured on DigitalOcean behind Cloudflare at `https://taskhub.trisila.online`; `V0.2-W1-06`/`V0.2-W1-08` are accepted as dev/demo runtime complete; `V0.2-W1-07` service-auth topology is accepted. Paperclip runtime inputs are confirmed, W3 live connector and interop are PM accepted, W3 cleanup/operations hardening is complete for V0.2, and V0.2 release/integration cleanup QA passed. Standing dev/demo Paperclip observation remains a runtime monitoring policy, not an open V0.2 delivery blocker.

Workstreams:

| Workstream | Goal | Status |
|---|---|---|
| W0 Branch / Environment / CI Setup | Establish `dev`, branch model, worktree workflow | Done |
| W1 Company Access + Deployment | Make Trisilar teammates able to access stable Task Hub dev/demo safely | `V0.2-W1-05` accepted demo-only; `V0.2-W1-06`/`V0.2-W1-08` accepted for dev/demo runtime; `V0.2-W1-07` accepted |
| W2 Full UI Redesign | Redesign the full app UI with a durable design system | W2-06 integrated / PM accepted on `origin/dev@523c948` |
| W3 Paperclip Multi-Agent Integration | Connect Task Hub to the Paperclip multi-agent system | Mock and live connector accepted; runtime gate disabled by default |
| W4 Integration QA | Merge workstreams into `dev` and verify combined behavior | Passed on clean `origin/dev@8027324`; branch/worktree residue cleaned |
| W5 V0.2 Release | Promote from `dev` to `main` after acceptance | Complete; later dev/main sync is at `631d3b2` |

Use `docs/plans/VERSION_0_2_PLAN.md` for detail.

### V0.4 - Live AI Operations / Paperclip Production

Status: Complete. Repo readiness, separate production runtime setup, staged production canary, 24-hour read-only monitoring, PM permanent acceptance, rollback proof, and production permanent enablement passed.

Production Paperclip intake is live at `https://taskhub-prod.trisila.online` behind Cloudflare Access with Review Queue as the mandatory human gate. V0.4 is not blocking V0.6 UI V2 implementation planning.

### V0.5 - Foundation Hardening

Status: Complete / PM Accepted. FND-02/03/04/05 integrated via PR #30; runtime checklist integrated via PR #36; hosted dev/demo SQLite canary, rollback proof, and short monitor passed.

Goal: strengthen persistence, test gates, and app-owned data contracts before UI V2 implementation and Team Operating System product work.

Use `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md` and ADRs `ADR_0003` / `ADR_0004`.

### V0.6 - UI V2 Design System Implementation

Status: Next implementation route. UI V2 design handoff is ready; production implementation may start route-by-route now that V0.5 is accepted.

Goal: promote UI V2 tokens and component language into production route-by-route on top of the accepted V0.5 foundation, without forcing an uncontrolled frontend rewrite.

### V0.7 - Team Operating System Pilot

Status: Future product track. Docs-only pilot assumptions may be prepared in parallel.

Goal: make Task Hub usable as a routine company operating layer for onboarding, weekly rhythm, management/portfolio reporting, and non-developer workflows.

### V0.8+ - Full Rewrite Decision

Status: Future decision memo only.

Goal: decide whether a full rewrite is still justified after V0.5 foundation hardening and V0.6 UI implementation evidence. Do not execute a full rewrite before this decision.

### Project Ladder Summary

| Level | Track | Status |
|---|---|---|
| L0 | V0.1 Local MVP | Complete |
| L1 | V0.2 Access Foundation | Complete for dev/demo baseline |
| L2 | V0.2 Full UI Redesign | Complete on `origin/dev@523c948` |
| L3 | V0.2 Paperclip Foundation | W3-02 live connector accepted / runtime gate disabled by default |
| L4 | V0.2 Integration Release | Complete |
| L5 | V0.3 Product Reliability + UX Stabilization | Complete on dev/dev-demo; PM accepted for main promotion through PR #20 |
| L6 | V0.4 Live AI Operations | Complete; production permanent enablement active with Review Queue gate |
| L7 | V0.5 Foundation Hardening | Complete / PM Accepted after hosted dev/demo SQLite canary, rollback proof, and short monitor passed |
| L8 | V0.6 UI V2 Design System Implementation | Next implementation route |
| L9 | V0.7 Team Operating System Pilot | Future |
| L10 | V0.8+ Full Rewrite Decision | Future decision memo only |

---

## Backlog Themes

- Hosted dev/prod environment with access control.
- Persistent state strategy for deployment.
- UI system and responsive redesign.
- Paperclip contract, attribution, review queue, and audit trail.
- Automated browser regression coverage.
- V0.5 persistence, test gates, and app-owned data contracts.
- Trello/Paperclip mock data for deterministic tests.
- UX issue intake and route-by-route usability review.
- Agent role docs and future Codex skill extraction after PM approval.
- Team onboarding docs exist; next step is team pilot feedback and routine-use SOP refinement.
- UI Web Design V2 handoff for V0.6 implementation; implementation should proceed route-by-route on top of the accepted V0.5 foundation.
- Full Rewrite decision memo after V0.5/V0.6 evidence; no full rewrite implementation yet.

---

## Enterprise-Grade Hardening Backlog

These items are not blockers for the completed V0.2 or V0.3 release baselines. V0.5 turns the persistence, test, and contract items into the next foundation hardening track before UI V2 implementation or Team OS product work.

| Area | Gap | Recommended path |
|---|---|---|
| V0.5 Foundation Hardening | UI V2 and Team OS expansion need stronger persistence, tests, and app-owned contracts first. | Complete / PM Accepted. FND-02/03/04/05 integrated through PR #30 at `dev@e3380ac`; runtime checklist integrated via PR #36; hosted dev/demo SQLite canary, rollback proof, and short monitor passed. |
| Persistence | App-owned state is still file-backed JSON by default under `APP_DATA_DIR`, while dev/demo canary proves SQLite can work for larger workflow expansion. | SQLite import/export and rollback are implemented behind `TASKHUB_STATE_BACKEND=sqlite`; hosted dev/demo currently runs SQLite canary with rollback proof and clean short monitor. Production storage remains a separate future decision. |
| Automated test suite | Current coverage is mostly smoke and structural verification. Unit, integration, and browser regression tests are not yet systematic. | Expand from `docs/testing/TEST_STRATEGY.md`: route tests, Trello model tests, deterministic fixtures, browser navigation regression, and CI gates. |
| Backend module structure | Root modules such as `trello.js`, `review-store.js`, and `task-diff.js` remain legacy-compatible. | Move into `src/` through scoped Dev tasks with QA and ADR coverage; do not move opportunistically during unrelated work. |
| Deployment/runtime setup | Dev/prod deployment docs exist. W1 random ngrok + temporary Basic Auth is accepted for manual teammate demo only. Task Hub now has an accepted DigitalOcean + Cloudflare dev/demo runtime and a production Paperclip runtime with private bind, server-only secrets, stable `APP_DATA_DIR`, and accepted Paperclip service-auth topology. Paperclip runtime inputs are confirmed without exposing secrets. | V0.4 production Paperclip permanent enablement is complete; future runtime changes still require PM/Runtime acceptance and rollback evidence. |
| V0.3 operating model | Long-term role ownership moves beyond W1/W2/W3 labels. | PM accepted `docs/reference/ORGANIZATION_OPERATING_MODEL.md`, `docs/reference/AI_AGENT_GOVERNANCE.md`, `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, and `docs/agents/`; reusable Codex workflow skill is deferred until the docs prove useful in real sessions. |
| V0.3 Product Reliability + UX Stabilization | Human workflow reliability and UX clarity stabilized before larger AI automation. | `RUX-001` and `RUX-002` are PM Accepted under `V0.3-RUX-02A` at `516b33e`; `RUX-003` is PM Accepted under `V0.3-RUX-03` at `b2425a4`; `RUX-004` is PM Accepted under `V0.3-RUX-04` at `d72f979`; `RUX-005` is PM Accepted under `V0.3-RUX-05` at `0af9417`; `V0.3-RUX-06` is PM Accepted at `df29307`; operating-model prerequisite merged at `dev@ed9fae0`; V0.3 integrated through PR #18 and merged/deployed at `dev@02fe7cf`; runtime QA passed; PR #20 release candidate verified and PM accepted for main promotion. Production deploy remains a separate runtime decision. |
| Operations docs baseline | Runtime operators and teammates need durable long-term runbooks for production/permanent Paperclip use. | Baseline docs cover runtime operations, troubleshooting, environment matrix, security/access policy, backup/retention policy, and team onboarding. Next hardening step is live pilot feedback and future runtime evidence updates; V0.5 is accepted. |
| UI V2 design experiment | PM wants a Claude Design-ready UI/UX guideline before asking Claude to create a web design version 2. | Use the accepted `docs/design/ui-design-v2/` handoff as the starting point for V0.6 route-by-route implementation. Do not treat V0.6 as runtime work, Team OS product work, or a full rewrite. |
| Team Operating System | Team OS is still needed, but product implementation depends on trustworthy persistence, contracts, tests, and UI shell stability. | Keep docs-only pilot assumptions allowed in parallel; route product implementation to V0.7 after V0.6 shell/workflow stability. |
| Full Rewrite | A full rewrite could solve some frontend/platform issues but would combine persistence, UI, and operating-model risk too early. | Keep Full Rewrite as V0.8+ decision memo only until V0.5/V0.6 evidence shows incremental migration is insufficient. |
| Historical document encoding | Some archive/log files still contain mojibake from earlier encoding corruption. | Run a separate UTF-8 repair task on archive/log docs only; use targeted edits and preserve historical meaning. |

---

## Roadmap Rules

- Do not put detailed QA evidence in this file.
- Do not overwrite `CURRENT_SPRINT.md` prompts when parallel workstreams are active.
- Add ADRs for decisions that affect architecture, workflow, data contracts, or deployment.
- Keep roadmap entries outcome-based, not chat-history-based.
- Preserve attribution when moving work between roadmap, sprint, logs, and ADRs.
