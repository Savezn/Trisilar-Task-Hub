# Project Roadmap - Trisilar Task Hub

**Doc Role:** High-level roadmap index
**Status:** Active
**Owner:** PM
**Last Updated:** 2026-05-14
**Updated by:** Codex PM / Documentation Architect

This file tracks the broad roadmap. It does not replace `CURRENT_SPRINT.md`, version plans, QA logs, or ADRs.

---

## Source of Truth

| Need | Use |
|---|---|
| Current active task and next prompt | `CURRENT_SPRINT.md` |
| Project-wide ladder and release gates | `docs/plans/PROJECT_LADDER.md` |
| Version scope and workstreams | `docs/plans/VERSION_0_2_PLAN.md` |
| V0.3 Product Reliability + UX Stabilization | `docs/plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md` |
| Long-term operating model | `docs/reference/ORGANIZATION_OPERATING_MODEL.md` |
| AI agent governance and role boundaries | `docs/reference/AI_AGENT_GOVERNANCE.md` and `docs/agents/` |
| Parallel Codex development | `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md` |
| Parallel W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| QA history | `docs/logs/QA_LOG.md` |
| Major decisions | `docs/logs/DECISION_LOG.md` and `docs/adr/` |
| Architecture reference | `docs/reference/ARCHITECTURE.md` |
| Testing policy | `docs/testing/TEST_STRATEGY.md` |

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

Status: Active. W2 full UI redesign is re-scoped into `V0.2-W2-01`-`V0.2-W2-06` (`W2a`-`W2f` aliases). `V0.2-W2-06` is integrated and PM accepted on `origin/dev@523c948`, completing the W2 full UI redesign line on `dev`. `V0.2-W1-05` random ngrok + temporary Basic Auth is accepted for short manual teammate demo only. Task Hub is configured on DigitalOcean behind Cloudflare at `https://taskhub.trisila.online`; `V0.2-W1-06`/`V0.2-W1-08` are accepted as dev/demo runtime complete; `V0.2-W1-07` service-auth topology is accepted. Paperclip runtime inputs are confirmed, W3 live connector and interop are PM accepted, and runtime `PAPERCLIP_WEBHOOK_ENABLED=false` remains the default until PM approves standing live enablement.

Workstreams:

| Workstream | Goal | Status |
|---|---|---|
| W0 Branch / Environment / CI Setup | Establish `dev`, branch model, worktree workflow | Done |
| W1 Company Access + Deployment | Make Trisilar teammates able to access stable Task Hub dev/demo safely | `V0.2-W1-05` accepted demo-only; `V0.2-W1-06`/`V0.2-W1-08` accepted for dev/demo runtime; `V0.2-W1-07` accepted |
| W2 Full UI Redesign | Redesign the full app UI with a durable design system | W2-06 integrated / PM accepted on `origin/dev@523c948` |
| W3 Paperclip Multi-Agent Integration | Connect Task Hub to the Paperclip multi-agent system | Mock and live connector accepted; runtime gate disabled by default |
| W4 Integration QA | Merge workstreams into `dev` and verify combined behavior | W3 integrated on `origin/dev@a89c26a`; release candidate QA/PM decision still required |
| W5 V0.2 Release | Promote from `dev` to `main` after acceptance | Planned |

Use `docs/plans/VERSION_0_2_PLAN.md` for detail.

### Project Ladder Summary

| Level | Track | Status |
|---|---|---|
| L0 | V0.1 Local MVP | Complete |
| L1 | V0.2 Access Foundation | Active |
| L2 | V0.2 Full UI Redesign | Complete on `origin/dev@523c948` |
| L3 | V0.2 Paperclip Foundation | W3-02 live connector accepted / runtime gate disabled by default |
| L4 | V0.2 Integration Release | Active |
| L5 | V0.3 Product Reliability + UX Stabilization | Complete on `origin/dev@02fe7cf` and dev/demo runtime |
| L6 | V0.4 Live AI Operations | Planned |
| L7 | V0.5 Team Operating System | Future |

---

## Backlog Themes

- Hosted dev/prod environment with access control.
- Persistent state strategy for deployment.
- UI system and responsive redesign.
- Paperclip contract, attribution, review queue, and audit trail.
- Automated browser regression coverage.
- Trello/Paperclip mock data for deterministic tests.
- UX issue intake and route-by-route usability review.
- Agent role docs and future Codex skill extraction after PM approval.
- Team onboarding docs for non-developer use.

---

## Enterprise-Grade Hardening Backlog

These items are not blockers for the current `V0.2-W2-02`/W1 runtime work. They are the next quality bar after V0.2 core access, redesign, and Paperclip integration stabilize.

| Area | Gap | Recommended path |
|---|---|---|
| Automated test suite | Current coverage is mostly smoke and structural verification. Unit, integration, and browser regression tests are not yet systematic. | Expand from `docs/testing/TEST_STRATEGY.md`: route tests, Trello model tests, deterministic fixtures, browser navigation regression, and CI gates. |
| Backend module structure | Root modules such as `trello.js`, `review-store.js`, and `task-diff.js` remain legacy-compatible. | Move into `src/` through scoped Dev tasks with QA and ADR coverage; do not move opportunistically during unrelated work. |
| Deployment/runtime setup | Dev/prod deployment docs exist. W1 random ngrok + temporary Basic Auth is accepted for manual teammate demo only. Task Hub now has an accepted DigitalOcean + Cloudflare dev/demo runtime with private bind, server-only secrets, stable `APP_DATA_DIR`, and accepted Paperclip service-auth topology. Paperclip runtime inputs are confirmed without exposing secrets. | Keep `PAPERCLIP_WEBHOOK_ENABLED=false` until PM approves standing live enablement; keep production/release-grade promotion gated by integration QA and PM acceptance. |
| V0.3 operating model | Long-term role ownership moves beyond W1/W2/W3 labels. | PM accepted `docs/reference/ORGANIZATION_OPERATING_MODEL.md`, `docs/reference/AI_AGENT_GOVERNANCE.md`, `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, and `docs/agents/`; reusable Codex workflow skill is deferred until the docs prove useful in real sessions. |
| V0.3 Product Reliability + UX Stabilization | Human workflow reliability and UX clarity stabilized before larger AI automation. | `RUX-001` and `RUX-002` are PM Accepted under `V0.3-RUX-02A` at `516b33e`; `RUX-003` is PM Accepted under `V0.3-RUX-03` at `b2425a4`; `RUX-004` is PM Accepted under `V0.3-RUX-04` at `d72f979`; `RUX-005` is PM Accepted under `V0.3-RUX-05` at `0af9417`; `V0.3-RUX-06` is PM Accepted at `df29307`; operating-model prerequisite merged at `dev@ed9fae0`; V0.3 integrated through PR #18 and merged/deployed at `dev@02fe7cf`; runtime QA passed. `dev -> main` remains a separate PM release decision. |
| Historical document encoding | Some archive/log files still contain mojibake from earlier encoding corruption. | Run a separate UTF-8 repair task on archive/log docs only; use targeted edits and preserve historical meaning. |

---

## Roadmap Rules

- Do not put detailed QA evidence in this file.
- Do not overwrite `CURRENT_SPRINT.md` prompts when parallel workstreams are active.
- Add ADRs for decisions that affect architecture, workflow, data contracts, or deployment.
- Keep roadmap entries outcome-based, not chat-history-based.
- Preserve attribution when moving work between roadmap, sprint, logs, and ADRs.
