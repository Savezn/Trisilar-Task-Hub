# Project Ladder - Trisilar Task Hub

**Doc Role:** Project-wide roadmap ladder and release gate plan
**Status:** Active
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM
**Related Docs:** `../../TODO.md`, `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `../reference/PROJECT_CONTEXT.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../testing/TEST_STRATEGY.md`, `../logs/DECISION_LOG.md`

---

## How to Use This Document

- Use this as the project-wide ladder before choosing the next Dev/QA/PM task.
- Use `CURRENT_SPRINT.md` only for the current snapshot and next action.
- Use version plans, such as `VERSION_0_2_PLAN.md`, for detailed implementation phases.
- Use `TODO.md` as the high-level index that points here, not as a duplicate of this ladder.
- Update this document when PM changes release sequencing, quality gates, or the definition of "done" for a version.

---

## Ladder Principle

Trisilar Task Hub should climb in small, verifiable product layers:

```text
Stable local command center
-> safe internal access
-> full usable UI
-> controlled AI handoff
-> release-grade reliability
-> broader team operations
```

The product model stays:

```text
Project Boards = execution surfaces
Task Hub = command center, review queue, portfolio/focus layer
```

Do not expand into a heavy project-management platform. Each ladder level should reduce coordination overhead for a small team using Trello, AI agents, and review gates.

---

## Current Ladder

| Level | Version / Track | Status | Outcome | Release Gate |
|---|---|---|---|---|
| L0 | V0.1 Local MVP | Complete | Stable local Task Hub with modularized routes/pages, Today, Review Queue, Calendar, Planner, OKR, Weekly Focus, and release acceptance | V0.1 release acceptance passed |
| L1 | V0.2 Access Foundation | Active | Teammates can access a hosted dev app safely with environment, persistence, and access-control boundaries | Hosted dev runtime verified; no secrets committed |
| L2 | V0.2 Full UI Redesign | Active | Every production page aligns with `docs/design/ui-design-v1-0/` while preserving existing workflows | W2a-W2f QA/PM accepted |
| L3 | V0.2 Paperclip Foundation | Accepted mock / live future | Paperclip task handoff has a contract, mock adapter, attribution, and audit trail without uncontrolled side effects | Contract/mock verification passed; live connector remains separately gated |
| L4 | V0.2 Integration Release | Planned | Accepted W1/W2/W3 work runs together on `dev` without regressions | Integration QA pass on `dev`; PM accepts release candidate |
| L5 | V0.3 Reliability Hardening | Planned | Automated tests, deterministic fixtures, browser regression, CI gate, backend structure hardening | Test strategy implemented enough to reduce manual QA risk |
| L6 | V0.4 Live AI Operations | Planned | Paperclip/live AI handoff can operate with approval gates, attribution, and no accidental Trello/Calendar side effects | Live connector QA with controlled production-like data |
| L7 | V0.5 Team Operating System | Future | Team onboarding, management reporting, portfolio rhythm, and non-developer usability are mature enough for routine company use | Team pilot feedback and operational adoption pass |

---

## Active Level Details

### L1 - V0.2 Access Foundation

**Status:** Active / W1c hosted runtime setup remains.

**Goal:**
Provide a safe hosted dev environment before wider teammate preview.

**Must include:**

- Hosted dev service connected from `dev`.
- Dev-only secrets configured in platform dashboard.
- Persistent storage for file-backed runtime data.
- `APP_BASE_URL` and OAuth redirect URI configured.
- Cloudflare Access or equivalent teammate access gate.
- Non-destructive hosted app smoke.

**Done when:**

- Hosted `GET /healthz` passes.
- Anonymous access is blocked.
- Approved teammate access works.
- PM accepts W1 hosted runtime evidence.

### L2 - V0.2 Full UI Redesign

**Status:** Active; W2a accepted, W2b-W2f remain.

**Goal:**
Make the whole app feel like one coherent command center, not a mix of old screens and one redesigned page.

**Required ladder:**

| Phase | Status | Outcome |
|---|---|---|
| W2a | Accepted | Shell foundation, mobile nav baseline, Today redesign |
| W2b | Next | Review Queue redesign and shared task drawer foundation |
| W2c | Planned | Tasks inbox and cross-board task rows |
| W2d | Planned | Boards monitor and team board views |
| W2e | Planned | Calendar and Planner redesign |
| W2f | Planned | Settings, OKR, and Weekly Focus polish |

**Done when:**

- Every production route has desktop/mobile visual QA evidence.
- Existing live workflows still work or are verified with controlled responses when credentials are unavailable.
- No mobile page-level horizontal overflow remains.
- PM accepts W2f and explicitly marks Full UI Redesign complete.

### L3 - V0.2 Paperclip Foundation

**Status:** Mock integration accepted; live connector remains future work.

**Goal:**
Allow AI-agent output to enter Task Hub through a contract-first review path.

**Already accepted:**

- Contract validation.
- Mock endpoint.
- Duplicate `requestId` rejection.
- Invalid payload field-level errors.
- Session/task attribution and audit persistence.
- No live Paperclip call.
- No Trello/Calendar side effect before approval.

**Next live step:**
Live Paperclip connector should be planned only after W2 UI quality and W1 access boundaries are stable.

### L4 - V0.2 Integration Release

**Status:** Planned after active V0.2 gaps close.

**Goal:**
Promote only a coherent internal preview release, not partial work labeled as done.

**Release candidate gate:**

- W1 hosted dev evidence accepted.
- W2 full UI redesign accepted through W2f.
- W3 mock integration remains passing.
- `npm.cmd run check:all` passes with `node server.js` running.
- Paperclip contract/mock verification passes.
- Desktop/mobile smoke across all production routes passes.
- PM decides whether to merge `dev -> main`.

---

## Future Level Details

### L5 - V0.3 Reliability Hardening

Focus:

- Route and model tests.
- Deterministic Trello/Paperclip fixtures.
- Browser regression for navigation and visual overflow.
- CI verification gate.
- Scoped backend module migration from root modules into `src/` when justified by tests and ADRs.

### L6 - V0.4 Live AI Operations

Focus:

- Live Paperclip connector.
- Approval-gated Trello/Calendar writes.
- Agent attribution, audit trails, replay/debug views.
- Failure handling for duplicate, stale, partial, or low-confidence AI output.

### L7 - V0.5 Team Operating System

Focus:

- Teammate onboarding and non-developer usage.
- Management/portfolio reporting.
- Team rhythm support for weekly planning and review.
- Lower-friction operations without replacing Trello project boards.

---

## Guardrails

- Do not merge partial W2 visual work to `main` as "full redesign."
- Do not start live Paperclip calls before approval gates, attribution, and no-side-effect checks are preserved.
- Do not treat W1 deployment docs as hosted runtime verification.
- Do not add broad platform features that make the tool heavier for a small team.
- Do not use `main` as an integration branch.
- Do not skip QA after behavior-changing Dev work.

---

## Current PM Routing

Current recommended next implementation path:

```text
W2b Review Queue Redesign
-> QA W2b
-> PM W2b acceptance
-> W2c Tasks Inbox
```

W1 hosted runtime setup remains important, but PM has currently prioritized correcting the W2 ladder and closing full UI redesign scope before claiming V0.2 release readiness.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created project-wide ladder after W2 scope clarification and V0.2 doc consolidation | Codex PM |
