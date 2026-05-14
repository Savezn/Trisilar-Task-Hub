# Version 0.3 Product Reliability + UX Stabilization Plan

**Doc Role:** Active V0.3 phase plan
**Status:** PM accepted; `V0.3-RUX-01` active / baseline created
**Version:** V0.3
**Planning Stage:** Product Reliability + UX Stabilization scoped after V0.3 operating model acceptance
**Owner:** PM
**Created:** 2026-05-14
**Last Updated:** 2026-05-14 - **Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `PROJECT_LADDER.md`, `VERSION_0_2_PLAN.md`, `VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md`, `../../TODO.md`, `../../MVP_PRD.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `../testing/TEST_STRATEGY.md`, `../logs/DECISION_LOG.md`, `../logs/V0_3_RUX_FINDINGS.md`
**Theme:** Stabilize the human workflow and release confidence before expanding larger AI automation.

---

## How to Use This Document

- Use this as the main V0.3 Product Reliability + UX Stabilization plan.
- Use `PROJECT_LADDER.md` for project-wide sequencing.
- Use `CURRENT_SPRINT.md` for the current session prompt and next action.
- Use `../reference/ORGANIZATION_OPERATING_MODEL.md` for the accepted operating model.
- Use `../reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md` before assigning parallel V0.3 work.
- Keep detailed QA evidence in `../logs/QA_LOG.md`, not in this plan.

---

## Planning Summary

V0.2 established safe dev/demo access, full UI redesign, and Paperclip-to-Task-Hub intake through Review Queue. V0.3 should not jump directly into larger AI automation. The next quality bar is making the human workflow reliable, clear, reviewable, and repeatably testable.

V0.3 focuses on:

- UX issue intake and prioritization.
- Route-by-route usability review.
- Review Queue clarity and human approval confidence.
- Docs / Review / Task linking clarity.
- Today and Tasks decision-flow polish.
- Mobile/desktop regression checks.
- Empty/error/loading state clarity.
- Audit/trace visibility for AI-originated work.
- Browser regression and repeatable QA.
- Release checklist for `dev -> main`.

The operating model remains:

```text
Trello = execution surface
Task Hub = command center and review/control layer
Review Queue = human approval gate
Paperclip and future AI agents = controlled intake sources
Runtime governance = access, secrets, monitoring, rollback, audit
Codex agents = development workforce operating through branches/worktrees
```

---

## Scope / Non-Goals

### In Scope

- PM/UX intake process for product reliability and UX issues.
- Route-by-route usability audit across production surfaces.
- Review Queue improvements that make AI-originated work easier to trust.
- Better visibility for task source, linked docs, linked Review Queue session, and audit trace.
- Today and Tasks decision-flow clarity.
- Empty, error, loading, disconnected, and credential-missing states.
- Desktop/mobile regression standards and evidence requirements.
- Browser regression plan for core routes.
- Release checklist for promotion from `dev` to `main`.
- PM/QA/UX/Dev handoff structure for V0.3 tasks.

### Out Of Scope

- Production deployment.
- Standing live Paperclip enablement.
- Creating the reusable `trisilar-task-hub-workflow` Codex skill.
- Replacing Trello as the execution surface.
- Bypassing Review Queue for AI-originated work.
- Runtime secret changes or Cloudflare policy changes.
- Large backend persistence migration unless PM approves a dedicated Dev task and ADR.
- Broad UI redesign reset beyond targeted reliability and UX stabilization.

---

## Parallel Work Boundary With V0.2-W3

V0.3 planning may proceed in parallel with V0.2-W3 only if ownership stays separate.

| Track | Role | Scope | Branch / Worktree |
|---|---|---|---|
| V0.2-W3 | AI Integration / Runtime / QA | Controlled live enablement policy, Paperclip webhook hardening, runtime evidence, QA rechecks | `feature/w3-paperclip-integration` or PM-assigned W3 branch in `trisilar-task-hub-w3-paperclip` |
| V0.3 RUX | PM / UX / QA / scoped Dev | Human workflow reliability, UX clarity, browser regression, release checklist | `feature/v0.3-product-reliability-ux-stabilization` in `trisilar-task-hub-v03-product-reliability-ux` |

Rules:

- Do not merge W3 sibling branches into V0.3 branches.
- Do not merge V0.3 branches into W3 branches.
- Integration Owner merges accepted branches into `dev`.
- If W3 changes Review Queue data contracts, V0.3 UX work that depends on those fields must wait for W3 acceptance or use documented mock fixtures.
- If V0.3 changes Review Queue UI expectations, W3 must not depend on those changes until they are integrated into `dev`.

---

## V0.3 Task ID Rules

Use canonical V0.3 IDs for this plan:

```text
V0.3-RUX-01
V0.3-RUX-02
```

`RUX` means Product Reliability + UX Stabilization. Use priority separately as `Priority: P0/P1/P2`.

---

## Phase Ladder

| ID | Phase | Owner Role | Status | Outcome |
|---|---|---|---|---|
| `V0.3-RUX-01` | UX Issue Intake + Reliability Baseline | PM / UX / QA | Active / baseline created | Create the issue intake model, severity labels, route inventory, and first baseline audit checklist |
| `V0.3-RUX-02` | Route-by-Route Usability Review | UX / QA | Planned | Review every production route for workflow clarity, copy, empty/error/loading states, and mobile/desktop usability |
| `V0.3-RUX-03` | Review Queue + AI Trace Clarity | UX / Frontend / Core / QA | Planned | Make AI-originated work easier to evaluate through source, rationale, evidence, linked task/doc context, and audit trace |
| `V0.3-RUX-04` | Today + Tasks Decision Flow | UX / Frontend / QA | Planned | Improve daily decision flow, priority scanning, cross-board task confidence, and low-friction next actions |
| `V0.3-RUX-05` | Browser Regression + Responsive QA Gate | QA / Frontend / Dev | Planned | Add repeatable browser regression coverage and desktop/mobile evidence expectations for core routes |
| `V0.3-RUX-06` | Release Checklist for `dev -> main` | PM / QA / Integration / Runtime | Planned | Define promotion checklist, rollback notes, runtime gate checks, and PM release decision format |

---

## Phase Details

### V0.3-RUX-01 - UX Issue Intake + Reliability Baseline

**Priority:** P0
**Owner Role:** PM / UX / QA

**Goal:**
Create a single V0.3 intake and baseline model so UX/reliability issues are classified consistently before implementation starts.

**Scope:**

- Define issue categories: UX friction, workflow ambiguity, missing state, data confidence, regression risk, audit gap, release blocker.
- Define severity: P0 blocker, P1 high user friction, P2 polish/hardening.
- Create route inventory and owner map.
- Decide where V0.3 findings should be recorded.
- Produce baseline review checklist for every production route.

**Acceptance criteria:**

- Route inventory covers Today, Review Queue, Tasks, Boards Monitor, Calendar, Planner, OKR / Portfolio, Weekly Focus, Settings, and Docs if user-facing.
- Intake format includes route, symptom, user impact, source evidence, suggested owner, priority, and acceptance criteria.
- PM can route each issue to UX, Frontend, Core, QA, Runtime, or AI Integration.
- No behavior or runtime changes are included in this phase.

**Verification:**

```powershell
git diff --check
```

Runtime checks skipped because this phase is docs/process only.

### V0.3-RUX-02 - Route-by-Route Usability Review

**Priority:** P0
**Owner Role:** UX / QA

**Goal:**
Find concrete workflow problems before assigning implementation.

**Routes:**

- Today
- Review Queue
- Tasks
- Boards Monitor
- Calendar
- Planner
- OKR / Portfolio
- Weekly Focus
- Settings
- Docs / Paperclip document surfaces when active in the app

**Review checklist:**

- The first useful action is obvious.
- The route explains empty/disconnected/error states without generic failure text.
- Mobile and desktop layouts preserve the workflow.
- Primary and secondary actions are visually distinct.
- External side effects are explicit before Trello/Calendar/Tasks writes.
- AI-originated work shows enough source and confidence context.
- Navigation back to the previous work context is clear.

**Acceptance criteria:**

- Each route has PASS/HOLD findings with evidence.
- Findings are prioritized and routed to role owners.
- No implementation happens during UX/QA review.

**Verification:**

Use browser review evidence when the app is run for QA. Docs-only review output may use:

```powershell
git diff --check
```

### V0.3-RUX-03 - Review Queue + AI Trace Clarity

**Priority:** P0
**Owner Role:** UX / Frontend / Core / QA

**Goal:**
Make AI-originated work easier to trust before approval.

**Scope candidates:**

- Surface Paperclip/source metadata clearly in Review Queue.
- Show source system, request id, agent run id, rationale, and bounded evidence where available.
- Link review sessions to proposed task context and source docs.
- Make create/update/possible duplicate state easier to compare.
- Make approval side effects explicit before approving.
- Preserve existing approval/reject behavior and no-side-effect-before-approval rule.

**Acceptance criteria:**

- Reviewers can identify where an AI task came from.
- Reviewers can see why the task is proposed.
- Reviewers can inspect linked evidence or source context without losing the current review flow.
- Approval still requires human action.
- Rejected/held items remain auditable.
- No secrets or auth headers are exposed in UI or docs.

**Verification:**

For implementation:

```powershell
node server.js
npm.cmd run check:all
npm.cmd run verify:paperclip-contract
npm.cmd run verify:paperclip-mock
```

Add browser evidence for Review Queue desktop and mobile.

### V0.3-RUX-04 - Today + Tasks Decision Flow

**Priority:** P1
**Owner Role:** UX / Frontend / QA

**Goal:**
Make the daily command flow easier to scan and act on.

**Scope candidates:**

- Clarify today, overdue, upcoming, pending review, and blocked work.
- Improve cross-board task confidence without requiring board hunting.
- Ensure hidden boards and configured workspaces remain respected.
- Make task source, due state, owner, and next action visible enough for daily use.
- Clarify when a task is from Trello, Review Queue, Google Tasks, or AI intake.

**Acceptance criteria:**

- User can identify top work within 10 seconds.
- Pending Review is visible and actionable but not alarming.
- Cross-board tasks preserve source and target context.
- Mobile view keeps key actions reachable.
- No broad redesign reset is introduced.

**Verification:**

For implementation:

```powershell
node server.js
npm.cmd run check:all
```

Add browser evidence for Today and Tasks on desktop and mobile.

### V0.3-RUX-05 - Browser Regression + Responsive QA Gate

**Priority:** P1
**Owner Role:** QA / Frontend / Dev

**Goal:**
Turn repeated manual smoke patterns into a repeatable browser regression gate.

**Scope candidates:**

- Define required route smoke matrix.
- Add or extend browser automation for route load, console errors, horizontal overflow, and core interaction paths.
- Record desktop/mobile viewport expectations.
- Keep live Trello/Google dependencies mockable or controlled when credentials are unavailable.

**Minimum route matrix:**

- Today
- Review Queue
- Tasks
- Boards Monitor
- Calendar
- Planner
- OKR / Portfolio
- Weekly Focus
- Settings

**Acceptance criteria:**

- Browser regression can run without production secrets.
- Console/page errors are captured.
- Mobile horizontal overflow is checked.
- Controlled API responses are allowed when live credentials are unavailable.
- QA report format follows `docs/testing/TEST_STRATEGY.md`.

**Verification:**

For implementation:

```powershell
node server.js
npm.cmd run check:all
```

Run any new browser regression command added by the implementation phase.

### V0.3-RUX-06 - Release Checklist for `dev -> main`

**Priority:** P0 before release promotion
**Owner Role:** PM / QA / Integration / Runtime

**Goal:**
Define a repeatable promotion gate from `dev` to `main`.

**Checklist must include:**

- Branch status and accepted commits.
- Integration QA evidence.
- Browser regression evidence.
- Review Queue and Paperclip mock/contract regression.
- Runtime gate state, including `PAPERCLIP_WEBHOOK_ENABLED=false` unless PM approves otherwise.
- Secret handling confirmation.
- Rollback note.
- PM release decision.

**Acceptance criteria:**

- PM can decide `dev -> main` from one checklist.
- QA evidence is linked or summarized.
- Runtime evidence is separated from product/UX acceptance.
- No production deploy is implied by docs alone.

**Verification:**

Docs-only checklist work:

```powershell
git diff --check
```

Release execution later requires the runtime/check commands assigned by QA/Integration.

---

## Delivery Rules

- Preserve Trello as execution surface.
- Preserve Review Queue as human approval gate.
- Keep Paperclip live standing enablement out of V0.3 RUX unless PM creates a separate AI Integration / Runtime task.
- Do not create the reusable Codex skill during this plan.
- Do not change runtime config or secrets.
- Do not merge sibling W3 branches into V0.3 branches.
- Use specific file staging only. Never use `git add .`.
- QA must stay read-only while acting as QA.
- PM updates `CURRENT_SPRINT.md` after acceptance or routing decisions.

---

## Branch / Worktree Model

Current V0.3 planning branch:

```text
Branch: feature/v0.3-product-reliability-ux-stabilization
Worktree: trisilar-task-hub-v03-product-reliability-ux
Base: feature/project-operating-model-agent-structure@96826f7
```

This branch is intentionally stacked on the PM-accepted operating-model branch because the V0.3 plan depends on the new accepted reference docs. Integration Owner should merge the operating-model branch into `dev` before integrating this V0.3 plan branch.

---

## PM Acceptance

```text
Status: Accepted
Accepted by: Codex PM
Date: 2026-05-14

Acceptance confirmed:
- Plan covers UX issue intake, route-by-route usability review, Review Queue clarity, audit trace visibility, browser regression, and dev -> main release checklist.
- V0.3 may proceed in parallel with W3 only through separate branches/worktrees.
- Reusable trisilar-task-hub-workflow Codex skill remains deferred.
```

---

## Next Recommended Session

```text
Role: UX / QA
Task: Use V0.3-RUX-01 intake model to run the first route-by-route baseline review.

Read:
- docs/plans/VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md
- docs/logs/V0_3_RUX_FINDINGS.md

Do:
- Review each route in the RUX-01 inventory.
- Record findings in docs/logs/V0_3_RUX_FINDINGS.md.
- Keep QA read-only if acting as QA.
- Do not patch UI or runtime during the baseline review.
- Keep W3 live enablement or Paperclip hardening on its own W3 branch/worktree.

If held:
- List the missing route evidence, runtime blocker, or review-scope ambiguity that prevents the baseline review.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created V0.3 Product Reliability + UX Stabilization draft plan | Codex PM |
| 2026-05-14 | Accepted V0.3 Product Reliability + UX Stabilization plan and routed `V0.3-RUX-01` | Codex PM |
| 2026-05-14 | Started `V0.3-RUX-01` with intake model, findings log, route inventory, and baseline checklist | Codex PM |
