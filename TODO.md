# Project Roadmap - Trisilar Task Hub

**Doc Role:** High-level roadmap index
**Status:** Active
**Owner:** PM
**Last Updated:** 2026-05-08
**Updated by:** Codex PM

This file tracks the broad roadmap. It does not replace `CURRENT_SPRINT.md`, version plans, QA logs, or ADRs.

---

## Source of Truth

| Need | Use |
|---|---|
| Current active task and next prompt | `CURRENT_SPRINT.md` |
| Version scope and workstreams | `docs/plans/VERSION_0_2_PLAN.md` |
| Parallel W1/W2/W3 prompts | `docs/plans/VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md` |
| QA history | `docs/logs/QA_LOG.md` |
| Major decisions | `docs/logs/DECISION_LOG.md` and `docs/adr/` |
| Architecture reference | `docs/reference/ARCHITECTURE.md` |
| Testing policy | `docs/testing/TEST_STRATEGY.md` |

---

## Current Roadmap

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

Status: Active planning and parallel workstream setup.

Workstreams:

| Workstream | Goal | Status |
|---|---|---|
| W0 Branch / Environment / CI Setup | Establish `dev`, branch model, worktree workflow | Done |
| W1 Company Access + Deployment | Make Trisilar teammates able to access a hosted app safely | Active / Next |
| W2 Full UI Redesign | Redesign the full app UI with a durable design system | Active / Next |
| W3 Paperclip Multi-Agent Integration | Connect Task Hub to the Paperclip multi-agent system | Active / Next |
| W4 Integration QA | Merge workstreams into `dev` and verify combined behavior | Planned |
| W5 V0.2 Release | Promote from `dev` to `main` after acceptance | Planned |

Use `docs/plans/VERSION_0_2_PLAN.md` for detail.

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

## Roadmap Rules

- Do not put detailed QA evidence in this file.
- Do not overwrite `CURRENT_SPRINT.md` prompts when parallel workstreams are active.
- Add ADRs for decisions that affect architecture, workflow, data contracts, or deployment.
- Keep roadmap entries outcome-based, not chat-history-based.
- Preserve attribution when moving work between roadmap, sprint, logs, and ADRs.
