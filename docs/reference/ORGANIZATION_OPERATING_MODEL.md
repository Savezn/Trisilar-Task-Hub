# Organization Operating Model - Trisilar Task Hub

**Doc Role:** Durable operating model for humans, Task Hub, Trello, Review Queue, runtime governance, and AI intake
**Status:** PM accepted
**Owner:** PM / Product Owner
**Created:** 2026-05-14
**Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `PROJECT_CONTEXT.md`, `AI_AGENT_GOVERNANCE.md`, `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `../plans/PROJECT_LADDER.md`

---

## Purpose

This document defines the long-term project operating model for Trisilar Task Hub after the V0.2 W1/W2/W3 buildout. It is the stable reference for how daily operations, AI-generated intake, human review, runtime ownership, and Codex-based development should work together.

---

## PM Acceptance - 2026-05-14

PM accepts this operating model as the V0.3 long-term direction.

Accepted decisions:

- Keep Trello as the execution surface.
- Keep Task Hub as the command center and review/control layer.
- Preserve Review Queue as the human approval gate.
- Treat Paperclip and future AI agents as controlled intake sources.
- Treat runtime governance as a named ownership lane.
- Treat Codex agents as a development workforce that operates through scoped branches and worktrees.
- Start V0.3 Product Reliability + UX Stabilization planning next.
- Do not create the reusable `trisilar-task-hub-workflow` Codex skill yet; use these docs in real sessions first.

---

## Operating Model

```text
Trello = execution surface
Task Hub = command center and review/control layer
Review Queue = human approval gate
Paperclip and future AI agents = controlled intake sources
Runtime governance = access, secrets, monitoring, rollback, audit
Codex agents = development workforce operating through branches/worktrees
```

Task Hub must not become a heavy project-management platform. Trello remains the project/card execution layer. Task Hub should help the team decide what matters today, what needs review, what is blocked, and what should be pushed outward after approval.

---

## Operating Principles

- Keep Trello as the board/card execution source of truth.
- Keep Task Hub focused on command, review, focus, and control.
- Preserve Review Queue as the mandatory human gate before external side effects.
- Let AI suggest, summarize, prepare, link, and draft work; do not let AI bypass approval.
- Keep Paperclip and future agents configurable through UI/runtime settings, not hardcoded paths.
- Preserve source, request id, agent run id, evidence, linked task/doc context, and audit trail for AI-originated work.
- Treat UX ownership as continuous product work, not a one-time redesign.
- Treat runtime governance as a named ownership lane covering access, secrets, health, rollback, and audit.
- Keep coordination overhead low enough for a small team using AI support.

---

## System Responsibilities

| Layer | Owns | Does not own |
|---|---|---|
| Trello | Project boards, lists, cards, checklists, execution status | AI approval, source audit, runtime policy |
| Task Hub | Daily command center, review/control layer, cross-board visibility, human approval | Replacing Trello as project management |
| Review Queue | Human decision gate for AI-originated work and pending side effects | Automatic external writes without review |
| Paperclip / AI agents | Proposed tasks, summaries, evidence, draft work packets | Direct Trello/Calendar/Tasks side effects |
| Runtime governance | Access, secrets, feature flags, persistence, monitoring, rollback | Product prioritization or QA signoff |
| Codex agents | Scoped PM/Dev/QA/docs/runtime work on branches/worktrees | Shared untracked edits in one working directory |

---

## Human Workflow

1. Use Task Hub to understand today's priority, pending review, blockers, and cross-board context.
2. Use Trello for card execution, ownership, list movement, and project board detail.
3. Use Review Queue to approve, edit, reject, or hold AI-originated tasks before they reach Trello, Google Calendar, or Google Tasks.
4. Use `CURRENT_SPRINT.md` for the current repo/task routing state.
5. Use `docs/plans/PROJECT_LADDER.md` for version sequencing and release gates.
6. Use logs for durable evidence: `docs/logs/DECISION_LOG.md` for PM decisions and `docs/logs/QA_LOG.md` for QA/completion history.

---

## AI Intake Model

AI-originated work must enter Task Hub as reviewable proposals.

Minimum required traceability:

- source system
- request id
- agent id/name/role
- agent run id and parent run id when available
- source artifact or evidence reference
- proposed target board/list/task context
- Review Queue session id
- audit trail from intake to human decision to external side effect

Allowed AI behavior:

- propose tasks
- summarize context
- classify or prioritize work
- prepare draft card data
- link to source evidence
- flag missing owner/deadline/project context

Disallowed AI behavior without explicit human approval:

- create or update Trello cards
- create or update Google Calendar events
- create or update Google Tasks
- enable live runtime flags
- expose or print secrets
- bypass Review Queue because confidence is high

---

## Runtime Governance Model

Runtime governance is a named ownership lane. It covers:

- Cloudflare Access and service-token policy
- environment variables and secret placement
- `APP_BASE_URL`, `APP_DATA_DIR`, and persistence
- feature flags such as `PAPERCLIP_WEBHOOK_ENABLED`
- service health checks
- deploy/restart/rollback procedure
- access-gate and audit evidence

Runtime owners do not decide product acceptance alone. They provide runtime evidence to PM/QA and keep secrets out of git, docs, logs, browser JavaScript, and chat.

---

## V0.3 Direction

The next long-term product phase should be:

```text
V0.3 Product Reliability + UX Stabilization
```

Recommended focus:

- UX issue intake and prioritization
- route-by-route usability review
- Review Queue flow clarity
- Docs / Review / Task linking clarity
- Today and Tasks decision-flow polish
- mobile/desktop regression checks
- empty/error/loading state clarity
- audit/trace visibility for AI-originated work
- test coverage and repeatable browser regression
- release checklist for `dev -> main`

Do not jump straight into larger AI automation if the core human workflow is confusing. More AI-generated tasks increase review volume, so the approval workflow must be easy to trust first.

---

## Source Of Truth

| Need | Source |
|---|---|
| Current route and next action | `CURRENT_SPRINT.md` |
| Version ladder and release gates | `docs/plans/PROJECT_LADDER.md` |
| Product/UX intent | `MVP_PRD.md` and this document |
| AI agent behavior and safety | `docs/reference/AI_AGENT_GOVERNANCE.md` |
| Parallel Codex branch/worktree rules | `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md` |
| Branch/environment workflow | `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md` |
| Role-specific handoffs | `docs/agents/` |
| PM decisions | `docs/logs/DECISION_LOG.md` |
| QA evidence | `docs/logs/QA_LOG.md` |

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created V0.3 operating model draft for PM review | Codex PM / Documentation Architect |
| 2026-05-14 | PM accepted the V0.3 operating model and routed next to Product Reliability + UX Stabilization planning | Codex PM |
