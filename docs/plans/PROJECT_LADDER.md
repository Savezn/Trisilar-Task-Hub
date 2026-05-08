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
| L1 | V0.2 Access Foundation | Active | Teammates can access a no-cost preview app safely with environment, persistence, and access-control boundaries; current no-domain demo uses ngrok + temporary Basic Auth | `V0.2-W1-06` stable access-gated preview verified, or PM explicitly accepts an ngrok demo-only waiver; no secrets committed |
| L2 | V0.2 Full UI Redesign | Active | Every production page aligns with `docs/design/ui-design-v1-0/` while preserving existing workflows | `V0.2-W2-01`-`V0.2-W2-06` QA/PM accepted |
| L3 | V0.2 Paperclip Foundation | Accepted mock / live future | Paperclip task handoff has a contract, mock adapter, attribution, and audit trail without uncontrolled side effects | Contract/mock verification passed; live connector remains separately gated |
| L4 | V0.2 Integration Release | Planned | Accepted W1/W2/W3 work runs together on `dev` without regressions | Integration QA pass on `dev`; PM accepts release candidate |
| L5 | V0.3 Reliability Hardening | Planned | Automated tests, deterministic fixtures, browser regression, CI gate, backend structure hardening | Test strategy implemented enough to reduce manual QA risk |
| L6 | V0.4 Live AI Operations | Planned | Paperclip/live AI handoff can operate with approval gates, attribution, and no accidental Trello/Calendar side effects | Live connector QA with controlled production-like data |
| L7 | V0.5 Team Operating System | Future | Team onboarding, management reporting, portfolio rhythm, and non-developer usability are mature enough for routine company use | Team pilot feedback and operational adoption pass |

---

## Active Level Details

### L1 - V0.2 Access Foundation

**Status:** Active / `V0.2-W1-05` no-domain ngrok demo path is active; `V0.2-W1-06` Cloudflare Access gate is deferred until a domain/subdomain exists.

**Goal:**
Provide a safe no-cost preview environment before wider teammate access.

**Must include:**

- Local/dev machine running the app from the `dev` baseline.
- Temporary ngrok route while no domain/subdomain is available.
- Cloudflare Tunnel route for the PM-approved preview hostname once a domain/subdomain exists.
- Local or dashboard-managed dev-only secrets; no secret values in git.
- Stable `APP_DATA_DIR` for file-backed runtime data.
- `APP_BASE_URL` and OAuth redirect URI configured for the current demo URL or stable preview hostname.
- Temporary Basic Auth before sharing the ngrok demo URL.
- Cloudflare Access email allowlist before sharing a stable Cloudflare preview URL.
- Non-destructive preview app smoke.

**Done when:**

- Local and tunneled `GET /healthz` pass.
- Anonymous access is blocked by the active access gate.
- Approved teammate access works.
- PM accepts `V0.2-W1-06` stable access-gated preview evidence, or records that the ngrok path is demo-only and not a release-grade substitute.

### L2 - V0.2 Full UI Redesign

**Status:** Active; `V0.2-W2-01` (`W2a`) and `V0.2-W2-02` (`W2b`) accepted, `V0.2-W2-03`-`V0.2-W2-06` remain.

**Goal:**
Make the whole app feel like one coherent command center, not a mix of old screens and one redesigned page.

**Required ladder:**

| Canonical ID | Alias | Status | Outcome |
|---|---|---|---|
| `V0.2-W2-01` | `W2a` | Accepted | Shell foundation, mobile nav baseline, Today redesign |
| `V0.2-W2-02` | `W2b` | Accepted `d33d8f7` | Review Queue redesign and shared task drawer foundation |
| `V0.2-W2-03` | `W2c` | Next | Tasks inbox and cross-board task rows |
| `V0.2-W2-04` | `W2d` | Planned | Boards monitor and team board views |
| `V0.2-W2-05` | `W2e` | Planned | Calendar and Planner redesign |
| `V0.2-W2-06` | `W2f` | Planned | Settings, OKR, and Weekly Focus polish |

**Done when:**

- Every production route has desktop/mobile visual QA evidence.
- Existing live workflows still work or are verified with controlled responses when credentials are unavailable.
- No mobile page-level horizontal overflow remains.
- PM accepts `V0.2-W2-06` (`W2f`) and explicitly marks Full UI Redesign complete.

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

- W1 `V0.2-W1-06` stable access-gated no-cost preview evidence accepted, unless PM explicitly records an ngrok demo-only waiver for a non-release demo.
- W2 full UI redesign accepted through `V0.2-W2-06` (`W2f`).
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
- Do not treat W1 deployment docs or repo readiness as runtime/access verification.
- Do not add broad platform features that make the tool heavier for a small team.
- Do not use `main` as an integration branch.
- Do not skip QA after behavior-changing Dev work.

---

## Current PM Routing

Current recommended next implementation path:

```text
Merge accepted V0.2-W2-02 into dev
-> Integration QA V0.2-W2-02 on dev
-> PM integration acceptance
-> V0.2-W2-03 Tasks Inbox
```

W1 `V0.2-W1-05`/`V0.2-W1-06` access setup remains important. The current W1 demo path is ngrok + temporary Basic Auth because no domain/subdomain exists; stable Cloudflare Access remains the release-grade gate when DNS is available. PM has currently prioritized correcting the W2 ladder and closing full UI redesign scope before claiming V0.2 release readiness.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created project-wide ladder after W2 scope clarification and V0.2 doc consolidation | Codex PM |
| 2026-05-08 | Updated L1 W1 access language to canonical `V0.2-W1-05`/`V0.2-W1-06` no-cost preview structure | Codex PM |
| 2026-05-08 | Accepted `V0.2-W2-02` at `d33d8f7` and routed L2 to W2-02 integration into `dev` before `V0.2-W2-03` starts | Codex PM |
| 2026-05-08 | Updated L1 to reflect no-domain ngrok + temporary Basic Auth demo path while keeping Cloudflare Access as the stable release-grade gate | Codex PM |
