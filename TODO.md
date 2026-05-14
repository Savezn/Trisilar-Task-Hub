# Project Roadmap - Trisilar Task Hub

**Doc Role:** High-level roadmap index
**Status:** Active
**Owner:** PM
**Last Updated:** 2026-05-13
**Updated by:** Codex PM

This file tracks the broad roadmap. It does not replace `CURRENT_SPRINT.md`, version plans, QA logs, or ADRs.

---

## Source of Truth

| Need | Use |
|---|---|
| Current active task and next prompt | `CURRENT_SPRINT.md` |
| Project-wide ladder and release gates | `docs/plans/PROJECT_LADDER.md` |
| Version scope and workstreams | `docs/plans/VERSION_0_2_PLAN.md` |
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

Status: Active. W2 full UI redesign is re-scoped into `V0.2-W2-01`-`V0.2-W2-06` (`W2a`-`W2f` aliases). `V0.2-W2-06` is integrated and PM accepted on `origin/dev@523c948`, completing the W2 full UI redesign line on `dev`. V0.2 should not be treated as release-ready until W1 Cloudflare-protected hosted dev/demo access, W2 full UI integration, and W3 mock/integration gates are accepted. `V0.2-W1-05` random ngrok + temporary Basic Auth is accepted for short manual teammate demo only. Task Hub is now configured on DigitalOcean behind Cloudflare at `https://taskhub.trisila.online`; `V0.2-W1-06`/`V0.2-W1-08` are accepted as dev/demo runtime complete; `V0.2-W1-07` service-auth topology is accepted. Paperclip runtime inputs are now confirmed for W3 planning: hosted base URL `https://paperclip.trisila.online`, health path `/healthz`, source id `paperclip-do-dev`, environment `dev`, local runtime port `3100`, service `paperclip.service`, and Task Hub service-token `/healthz` check returned `200` from the Paperclip server. W3 live connector work is routed to `V0.2-W3-02`.

Workstreams:

| Workstream | Goal | Status |
|---|---|---|
| W0 Branch / Environment / CI Setup | Establish `dev`, branch model, worktree workflow | Done |
| W1 Company Access + Deployment | Make Trisilar teammates able to access stable Task Hub dev/demo safely | `V0.2-W1-05` accepted demo-only; `V0.2-W1-06`/`V0.2-W1-08` accepted for dev/demo runtime; `V0.2-W1-07` accepted |
| W2 Full UI Redesign | Redesign the full app UI with a durable design system | W2-06 integrated / PM accepted on `origin/dev@523c948` |
| W3 Paperclip Multi-Agent Integration | Connect Task Hub to the Paperclip multi-agent system | Mock accepted; live webhook connector routed to `V0.2-W3-02` after runtime inputs confirmed |
| W4 Integration QA | Merge workstreams into `dev` and verify combined behavior | Planned |
| W5 V0.2 Release | Promote from `dev` to `main` after acceptance | Planned |

Use `docs/plans/VERSION_0_2_PLAN.md` for detail.

### Project Ladder Summary

| Level | Track | Status |
|---|---|---|
| L0 | V0.1 Local MVP | Complete |
| L1 | V0.2 Access Foundation | Active |
| L2 | V0.2 Full UI Redesign | Complete on `origin/dev@523c948` |
| L3 | V0.2 Paperclip Foundation | Mock accepted / W3-02 live connector routed |
| L4 | V0.2 Integration Release | Planned |
| L5 | V0.3 Reliability Hardening | Planned |
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
- Team onboarding docs for non-developer use.

---

## Enterprise-Grade Hardening Backlog

These items are not blockers for the current `V0.2-W2-02`/W1 runtime work. They are the next quality bar after V0.2 core access, redesign, and Paperclip integration stabilize.

| Area | Gap | Recommended path |
|---|---|---|
| Automated test suite | Current coverage is mostly smoke and structural verification. Unit, integration, and browser regression tests are not yet systematic. | Expand from `docs/testing/TEST_STRATEGY.md`: route tests, Trello model tests, deterministic fixtures, browser navigation regression, and CI gates. |
| Backend module structure | Root modules such as `trello.js`, `review-store.js`, and `task-diff.js` remain legacy-compatible. | Move into `src/` through scoped Dev tasks with QA and ADR coverage; do not move opportunistically during unrelated work. |
| Deployment/runtime setup | Dev/prod deployment docs exist. W1 random ngrok + temporary Basic Auth is accepted for manual teammate demo only. Task Hub now has an accepted DigitalOcean + Cloudflare dev/demo runtime with private bind, server-only secrets, stable `APP_DATA_DIR`, and accepted Paperclip service-auth topology. Paperclip runtime inputs are confirmed without exposing secrets. | Route `V0.2-W3-02` live Paperclip -> Task Hub webhook connector; keep production/release-grade promotion out of scope until QA/PM accepts the live connector. |
| Historical document encoding | Some archive/log files still contain mojibake from earlier encoding corruption. | Run a separate UTF-8 repair task on archive/log docs only; use targeted edits and preserve historical meaning. |

---

## Roadmap Rules

- Do not put detailed QA evidence in this file.
- Do not overwrite `CURRENT_SPRINT.md` prompts when parallel workstreams are active.
- Add ADRs for decisions that affect architecture, workflow, data contracts, or deployment.
- Keep roadmap entries outcome-based, not chat-history-based.
- Preserve attribution when moving work between roadmap, sprint, logs, and ADRs.
