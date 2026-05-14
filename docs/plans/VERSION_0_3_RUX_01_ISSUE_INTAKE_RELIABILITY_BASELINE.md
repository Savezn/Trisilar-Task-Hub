# V0.3-RUX-01 Issue Intake + Reliability Baseline

**Doc Role:** Active intake model and baseline checklist for V0.3 Product Reliability + UX Stabilization
**Status:** Active - baseline created for PM / UX / QA use
**Owner:** PM / UX / QA
**Created:** 2026-05-14
**Last Updated:** 2026-05-14 - **Updated by:** Codex PM
**Related Docs:** `VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md`, `PROJECT_LADDER.md`, `../../CURRENT_SPRINT.md`, `../logs/V0_3_RUX_FINDINGS.md`, `../testing/TEST_STRATEGY.md`

---

## Purpose

`V0.3-RUX-01` creates the shared intake model for UX and reliability issues before implementation begins. This phase does not change UI, behavior, runtime config, secrets, or branch integration.

Use this document to classify findings. Record actual findings in `../logs/V0_3_RUX_FINDINGS.md`.

---

## Issue Categories

| Category | Use when |
|---|---|
| UX friction | The route works, but a user needs unnecessary steps, scanning effort, or repeated context switching. |
| Workflow ambiguity | The next action, owner, status, source, or side effect is unclear. |
| Missing state | Empty, loading, disconnected, credential-missing, blocked, or error states are absent or generic. |
| Data confidence | The user cannot tell whether data is fresh, filtered, complete, trusted, or source-specific. |
| Regression risk | Existing Trello, Google Calendar, Google Tasks, Review Queue, Paperclip, or navigation behavior could be broken by changes. |
| Audit gap | AI-originated work lacks source, request id, rationale, evidence, review-session link, or history needed for trust. |
| Release blocker | The issue prevents a safe `dev -> main` release decision. |

---

## Severity Labels

| Severity | Meaning | Required action |
|---|---|---|
| P0 blocker | Blocks reliable use, release decision, human approval safety, or creates uncontrolled side-effect risk. | PM routes before implementation proceeds. |
| P1 high friction | Causes repeated confusion, high manual effort, missing confidence, or likely support burden. | Route into the relevant V0.3 RUX phase. |
| P2 polish / hardening | Improves clarity, consistency, copy, layout, or test confidence without blocking core workflow. | Batch after P0/P1 work is assigned. |

---

## Intake Format

Use this format for every finding in `../logs/V0_3_RUX_FINDINGS.md`.

```text
ID:
Date:
Route:
Category:
Severity:
Symptom:
User impact:
Source evidence:
Suggested owner:
Suggested phase:
Acceptance criteria:
Notes / dependencies:
Status:
```

Rules:

- `Route` must use the route inventory below.
- `Suggested owner` must be one of PM, UX, Frontend, Core, QA, Runtime, or AI Integration.
- `Source evidence` can be a screenshot path, browser observation, console/API note, command output summary, file/line reference, or user report.
- Do not include secrets, tokens, private URLs with credentials, or raw auth headers.
- Do not assign implementation until PM confirms category, severity, owner, and phase.

---

## Route Inventory + Owner Map

| Route | App path | Primary owner | Support owners | Baseline focus |
|---|---|---|---|---|
| Today | `/today` | UX | Frontend / QA / Core | Daily decision flow, overdue/today/upcoming clarity, pending review visibility, quick-add confidence. |
| Review Queue | `/review` | UX | Frontend / Core / AI Integration / QA | Human approval gate, source/rationale/evidence, duplicate confidence, approval side effects, audit history. |
| Tasks | `/all` | UX | Frontend / Core / QA | Cross-board search/filter/group confidence, source/owner/due clarity, hidden board and workspace respect. |
| Boards Monitor | `/boards` | UX | Frontend / Core / QA | Board health, team grouping, convention status, stale/blocked board scanning. |
| Calendar | `/calendar` | UX | Frontend / Core / Runtime / QA | Google Calendar status, Trello deadline distinction, event edit side effects, disconnected states. |
| Planner | `/planner` | UX | Frontend / Core / Runtime / QA | Google Tasks vs Trello due work separation, add/complete confidence, reconnect states. |
| OKR / Portfolio | `/okr` | PM / UX | Frontend / QA | Objective/project scanning, drilldown/back flow, portfolio status clarity. |
| Weekly Focus | `/focus` | PM / UX | Frontend / QA | Weekly priority scanning, owner filter, blocked/review flow, Review Queue link clarity. |
| Settings | `/settings` | Runtime | UX / Frontend / Core / QA | Integration status, workspace visibility, hidden boards, monitor teams, save-state confidence. |
| Docs / Paperclip surfaces | `/docs` | AI Integration | UX / Frontend / Core / QA | Source document context, Paperclip traceability, safe AI intake review path. |

---

## Baseline Review Checklist

Apply this checklist to every route during UX/QA review.

| Check | PASS/HOLD evidence expected |
|---|---|
| First useful action is obvious. | Browser note or screenshot showing the primary user action. |
| Empty state is specific and actionable. | Note how the route explains no data, filtered-out data, or unavailable integrations. |
| Loading state does not look broken. | Note loading text/skeleton and whether it clears cleanly. |
| Error/disconnected state names the real ownership boundary. | Note whether user action, Runtime setup, credentials, or upstream API is needed. |
| Source and freshness are understandable. | Note source system labels, timestamps, sync status, or missing confidence signals. |
| External side effects are explicit before writes. | Confirm Trello, Calendar, Google Tasks, or AI-originated approval writes are not hidden. |
| Mobile and desktop preserve workflow. | Record desktop and mobile outcome, including horizontal overflow if observed. |
| Navigation back to prior context is clear. | Note browser back, sidebar, drawer close, or contextual back behavior. |
| AI-originated work preserves traceability where relevant. | For Review/Docs/Paperclip surfaces, note source, request id, rationale, evidence, and audit visibility. |
| Regression risk is named. | Note any existing V0.2 behavior that must be protected before Dev starts. |

---

## Recording Location Decision

All V0.3 RUX findings are recorded in:

```text
docs/logs/V0_3_RUX_FINDINGS.md
```

Use `docs/logs/QA_LOG.md` only for formal QA pass/fail evidence after a scoped QA run. Use `docs/logs/DECISION_LOG.md` only for PM decisions that change routing, ownership, release gates, or branch boundaries.

---

## Acceptance Checklist

- [x] Issue categories defined.
- [x] P0/P1/P2 severity labels defined.
- [x] Intake format defined with route, symptom, user impact, source evidence, suggested owner, priority, and acceptance criteria.
- [x] Route inventory covers Today, Review Queue, Tasks, Boards Monitor, Calendar, Planner, OKR / Portfolio, Weekly Focus, Settings, and Docs if user-facing.
- [x] PM can route issues to UX, Frontend, Core, QA, Runtime, or AI Integration.
- [x] Findings recording location selected.
- [x] Baseline route review checklist created.
- [x] No behavior, runtime, secret, or branch-integration changes included.

---

## Next Recommended Session

```text
Role: UX / QA
Task: Use V0.3-RUX-01 intake model to run the first route-by-route baseline review.

Read:
- docs/plans/VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md
- docs/logs/V0_3_RUX_FINDINGS.md
- docs/testing/TEST_STRATEGY.md

Do:
- Review each route in the inventory.
- Record findings in docs/logs/V0_3_RUX_FINDINGS.md.
- Keep QA read-only if acting as QA.
- Do not patch UI or runtime during the baseline review.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created V0.3-RUX-01 intake model, route inventory, owner map, and baseline checklist | Codex PM |
