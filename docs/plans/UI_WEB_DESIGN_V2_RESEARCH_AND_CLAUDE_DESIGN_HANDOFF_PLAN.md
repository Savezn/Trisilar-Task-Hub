# UI Web Design V2 Research And Claude Design Handoff Plan

**Doc Role:** PM allocation plan for UI/UX research and Claude Design handoff
**Status:** Active sidecar experiment
**Owner:** PM / UX Owner
**Created:** 2026-05-15
**Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `../design/ui-design-v2/README.md`, `../design/ui-design-v2/CLAUDE_DESIGN_UI_V2_GUIDELINES.md`, `../design/ui-design-v1-0/README.md`, `VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md`, `VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`

---

## Summary

This plan creates a design-only research packet for a Claude Design experiment: UI Web Design Version 2 for Trisilar Task Hub.

The experiment runs alongside V0.4 Paperclip production work and V0.5 Foundation Hardening but does not change product code, runtime config, Cloudflare, Paperclip, or production behavior. Production UI V2 implementation is V0.6 work after V0.5 foundation acceptance.

---

## Definition Of Ready

Ready state for this sidecar experiment:

- Role: PM / UX Owner with support from QA, Frontend Dev, AI Integration, Runtime, and Documentation Workflow.
- Scope: research and write a Claude-ready UI/UX design guideline.
- Branch/worktree: `codex/ui-v2-design-guidelines` from `origin/dev`; worktree `trisilar-task-hub-ui-v2-guidelines`; target `dev`.
- Acceptance: a prompt-ready guideline exists under `docs/design/ui-design-v2/`, is linked from indexes, and preserves Task Hub product constraints.
- Verification: docs-only `git diff --check`, reference search, conflict-marker scan, and no runtime/code changes.
- Dependency: current V0.2 UI redesign, V0.3 RUX findings, operating model, and V0.4 runtime safety docs.
- Dirty state: start from clean `origin/dev`; preserve unrelated V0.4 worktree.
- Secret/runtime boundary: no secrets, runtime flags, service tokens, production data, or live canary instructions.

---

## Non-Goals

- Do not implement UI code.
- Do not start a framework migration.
- Do not change production runtime.
- Do not change Paperclip webhook behavior.
- Do not reopen V0.2 W2 accepted implementation.
- Do not ask Claude to create a landing page or marketing site.
- Do not replace Trello as the execution source of truth.

---

## Team Research Allocation

| Role | Research focus | Output expected |
|---|---|---|
| PM | Product boundary, screen inventory, acceptance, non-goals | Clear brief and Claude output requirements |
| UX Owner | User journeys, route hierarchy, decision clarity, mobile/desktop experience | UX principles and route-level design requirements |
| Frontend Product Dev | Feasibility inside current static app, component reuse, future implementation risks | Implementation constraints and design-to-build notes |
| QA / Release Owner | Responsive, accessibility, route-state, and regression criteria | QA acceptance checklist for any future UI V2 implementation |
| AI Integration Owner | Review Queue, Docs trace, Paperclip attribution, human gate clarity | AI-originated work and audit-trace design requirements |
| Runtime Owner | Access, disconnected, degraded, production safety, and secret boundaries | Runtime/access state requirements without exposing secrets |
| Documentation Workflow Owner | File placement, prompt quality, and future handoff consistency | Indexed docs and clean Claude handoff artifact |

---

## Research Inputs

Internal source docs:

- `MVP_PRD.md`
- `docs/reference/PROJECT_CONTEXT.md`
- `docs/reference/ORGANIZATION_OPERATING_MODEL.md`
- `docs/plans/VERSION_0_2_W2_UI_REDESIGN_DISCOVERY_PLAN.md`
- `docs/design/ui-design-v1-0/README.md`
- `docs/logs/V0_3_RUX_FINDINGS.md`
- `docs/plans/VERSION_0_4_LIVE_AI_OPERATIONS_PAPERCLIP_PRODUCTION_PLAN.md`
- `docs/deployment/RUNTIME_OPERATIONS_RUNBOOK.md`
- `docs/reference/SECURITY_ACCESS_POLICY.md`

External references used as design guardrails:

- W3C WCAG 2.2: accessibility, focus, target size, contrast, predictable navigation, and error-prevention criteria.
- IBM Carbon empty-state pattern: actionable empty/error/disconnected state design.
- Atlassian Design System empty-state component: empty state as a contextual next-action surface.

These references are guardrails, not a requirement to copy a design system.

---

## Deliverables

| Deliverable | Path | Owner |
|---|---|---|
| Claude Design guideline | `docs/design/ui-design-v2/CLAUDE_DESIGN_UI_V2_GUIDELINES.md` | PM / UX Owner |
| Design artifact index | `docs/design/ui-design-v2/README.md` | Documentation Workflow Owner |
| PM allocation plan | `docs/plans/UI_WEB_DESIGN_V2_RESEARCH_AND_CLAUDE_DESIGN_HANDOFF_PLAN.md` | PM |
| Routing/index updates | `CURRENT_SPRINT.md`, `TODO.md`, `docs/README.md` | PM / Documentation Workflow Owner |
| Decision/QA logs | `docs/logs/DECISION_LOG.md`, `docs/logs/QA_LOG.md` | PM / QA |

---

## Claude Design Acceptance Criteria

Claude Design output should be acceptable for PM review when it includes:

- app shell direction for desktop, laptop, tablet, and mobile
- screen designs for Today, Review Queue, All Tasks, Boards Monitor, Calendar, Planner, OKR / Portfolio, Weekly Focus, Settings, and Docs / AI Trace
- component system for task rows, review tasks, filters, status chips, drawers, tables/lists, empty/error/loading states, and integration status
- clear Review Queue and Paperclip trace design that preserves human approval before side effects
- responsive behavior notes and mobile navigation
- accessibility notes aligned to WCAG 2.2 AA where practical
- design tokens for color, typography, spacing, radius, elevation, density, and status colors
- no secrets, production tokens, runtime values, or live credentials
- no marketing hero, landing page, decorative redesign, or unrelated product expansion

---

## Verification Plan

Docs-only verification:

- `git diff --check`
- `rg -n "UI Web Design V2|Claude Design|ui-design-v2|CLAUDE_DESIGN_UI_V2_GUIDELINES" docs CURRENT_SPRINT.md TODO.md`
- conflict-marker scan over touched docs
- runtime/secret wording review

Runtime checks are intentionally skipped because this is documentation and design handoff only.

---

## Next Handoff

```text
Role: Claude Design / UX Owner
Task: Use docs/design/ui-design-v2/CLAUDE_DESIGN_UI_V2_GUIDELINES.md to create UI Web Design Version 2 concepts for Trisilar Task Hub.

Rules:
- Design only; do not modify production code.
- Preserve Trello as execution surface and Task Hub as command/review layer.
- Preserve Review Queue as the human approval gate.
- Cover desktop and mobile.
- Include empty, loading, error, disconnected, and audit/trace states.
- Do not include secrets, runtime tokens, or production data.

Expected output:
- UI V2 concept screens
- design tokens
- component inventory
- responsive notes
- implementation handoff notes for future Frontend Dev
```
