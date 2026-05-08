# Project Context - Trisilar Task Hub

**Doc Role:** Durable product and operating context
**Status:** Active
**Owner:** PM
**Last Updated:** 2026-05-08
**Updated by:** Codex PM

This document gives agents the stable context needed to make local decisions without re-deriving the product model every session.

---

## Product Summary

Trisilar Task Hub is a local-first team command center that aggregates execution work from Trello and related operational systems. It is not intended to replace project boards. The durable operating model is:

```text
Project Boards = execution surfaces
Task Hub = command center, portfolio view, review queue, and focus layer
```

The app supports daily work, review flow, board health, OKR/portfolio visibility, weekly focus planning, and team coordination.

---

## Current Integrations

| System | Current role |
|---|---|
| Trello | Primary task and project board source |
| Google Calendar | Calendar/connect status and scheduling context |
| Google Tasks | Task sync target/source where configured |
| AI Review Queue | Review/QA workflow for AI-agent output |
| Paperclip | Planned V0.2 multi-agent integration |

---

## Core Product Surfaces

| Surface | Purpose |
|---|---|
| Today | Daily execution view |
| All Tasks | Cross-board task listing and filtering |
| Boards Monitor | Project board visibility and convention health |
| Calendar | Calendar/connect state and schedule view |
| OKR / Portfolio | Objective, KR, label/member portfolio progress |
| Weekly Focus | Prioritized lanes for current-week execution |
| Settings | Workspace, visibility, team, and group configuration |
| Review Queue | AI/human review flow |

---

## V0.2 Goals

V0.2 has three parallel goals:

1. Company access/deployment so teammates can use Trisilar Task Hub.
2. Full UI redesign with consistent navigation, layout, and design system.
3. Paperclip multi-agent integration for AI team handoff, attribution, and review flow.

These workstreams must run from separate branches and worktrees.

---

## Product Constraints

- Keep coordination overhead low.
- Preserve Trello as the execution source of truth unless a future ADR changes this.
- Treat Task Hub as an aggregation and decision-support layer.
- Avoid adding process-heavy workflows that make a small team slower.
- Make AI-generated work attributable and reviewable.
- Keep company access secure before broader sharing.

---

## Technical Constraints

- Current backend is an Express/CommonJS app.
- Current frontend is static HTML/CSS/plain JavaScript with global script order.
- No bundler is currently used.
- Runtime depends on environment variables for external APIs.
- Some state is file-backed; deployment must account for persistence.
- Smoke checks require a running local server.

---

## Do Not Assume

- Do not assume serverless compatibility without checking state and runtime behavior.
- Do not assume production secrets are available.
- Do not assume Trello API failures are app regressions without checking rate limits and error mapping.
- Do not assume page modules are isolated if they depend on globals loaded by `app.js`.
- Do not assume parallel agents can share one working directory.
