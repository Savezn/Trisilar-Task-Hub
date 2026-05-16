# Version 0.6 UI V2 Planning Scope

**Doc Role:** PM/UX planning scope for V0.6 UI V2 implementation
**Status:** Complete for planning; V0.6 implementation route opened after V0.5 acceptance
**Owner:** PM / UX Owner
**Created:** 2026-05-15
**Updated by:** Codex PM / UX Owner
**Related Docs:** `PROJECT_LADDER.md`, `../../TODO.md`, `VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`, `../design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md`, `../design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md`, `../design/ui-design-v2/UI_V2_CLAUDE_OUTPUT_REVIEW.md`, `../design/ui-design-v2/UI_V2_DESIGN_SYSTEM_HANDOFF.md`, `../design/ui-design-v2/UI_V2_ROUTE_SCREEN_SPECS.md`, `../logs/V0_3_RUX_FINDINGS.md`, `../logs/DECISION_LOG.md`

---

## PM / UX Decision

Decision: **Accept V0.6 UI V2 planning artifacts as the implementation-planning baseline.**

This opens implementation planning after V0.5 acceptance. It does not approve production app changes outside scoped V0.6 UI slices, runtime changes, Cloudflare changes, Paperclip behavior changes, Team OS product scope, or a full rewrite.

Implementation planning may proceed because V0.5 is accepted. First code work is routed through `VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`, which defines route order, file ownership, regression targets, and rollback boundaries.

Current allowed scope:

- V0.6 route-by-route UI implementation planning.
- Shell/navigation and route state planning before deeper route rewrites.
- Use accepted design artifacts as baseline.
- Keep all runtime, production, Paperclip, Cloudflare, secret, webhook auth, Team OS product, and Full Rewrite work out of V0.6 UI slices.

---

## V0.5 Gate Source Confirmation

Confirmed current gate source:

- `docs/plans/PROJECT_LADDER.md` is the project-wide roadmap ladder and release-gate source.
- `TODO.md` is the high-level index that mirrors the ladder status.
- `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md` is the accepted foundation hardening plan on current `origin/dev`.

Current V0.5 source state:

| Source | V0.5 status | Gate / next evidence |
|---|---|---|
| `docs/plans/PROJECT_LADDER.md` | Accepted / earlier ladder rebaselined | V0.5 foundation accepted; V0.6 route opened |
| `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md` | Accepted | Deterministic tests, contracts, SQLite migration/import/export, hosted dev/demo canary, rollback proof, and short monitor passed |
| `TODO.md` Project Ladder Summary | V0.6 next implementation route | UI V2 route-by-route implementation on accepted V0.5 foundation |

PM/UX interpretation:

- V0.5 is accepted on current `origin/dev`.
- V0.6 implementation planning may proceed.
- V0.6 code work must stay route-by-route and must not cross into runtime, production, Cloudflare, Paperclip live behavior, webhook auth, Team OS product scope, or Full Rewrite.

---

## Scope

V0.6 planning may include:

- Mapping accepted UI V2 prototype routes to future production route work.
- Translating UI V2 tokens into implementation-ready token names and migration notes.
- Defining a component inventory and build sequence for a future Frontend Dev task.
- Defining responsive and visual QA criteria for UI V2.
- Defining Review Queue safety and Paperclip/AI trace requirements for implementation.
- Identifying V0.5 dependencies that must be accepted before implementation starts.

V0.6 planning must not include:

- Edits under `public/` or `src/` until a scoped first-slice plan is accepted.
- Runtime setup, runtime flags, service deployment, or Cloudflare changes.
- Secrets, live tokens, production data, or Paperclip live behavior changes.
- New Trello, Calendar, Google Tasks, or Paperclip side effects.
- Full Rewrite or framework migration.
- Replacement of Trello as the execution surface.

---

## Accepted Design Inputs

Use these artifacts as the V0.6 planning baseline:

| Input | Planning use |
|---|---|
| `../design/ui-design-v2/prototype/Trisilar Task Hub UI V2.html` | Visual baseline and route concept source |
| `../design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md` | Route slice map, token migration map, component build sequence, responsive QA matrix, and Review Queue safety spec |
| `../design/ui-design-v2/UI_V2_CLAUDE_OUTPUT_REVIEW.md` | PM/UX acceptance, coverage, evidence, and known gaps |
| `../design/ui-design-v2/UI_V2_DESIGN_SYSTEM_HANDOFF.md` | Tokens, component inventory, responsive notes, handoff guidance |
| `../design/ui-design-v2/UI_V2_ROUTE_SCREEN_SPECS.md` | Route-by-route screen/state requirements |
| `../design/ui-design-v2/CLAUDE_DESIGN_UI_V2_GUIDELINES.md` | Product guardrails and UX principles |
| `../logs/V0_3_RUX_FINDINGS.md` | Existing reliability and UX baseline that UI V2 must preserve |
| `PROJECT_LADDER.md` | Version sequencing and release gates |
| `VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md` | S0 write ownership, route order, regression targets, and rollback boundary |

---

## Planning Tracks

| Track | Output required before V0.6 Dev |
|---|---|
| Route slice map | Future implementation sequence for Today, Review Queue, All Tasks, Boards Monitor, Calendar, Planner, OKR / Portfolio, Weekly Focus, Docs / AI Trace, and Settings |
| Token migration | Mapping from prototype tokens to production CSS variables, including cobalt user action and violet AI/Paperclip separation |
| Component map | Component inventory mapped to current route ownership and reusable implementation candidates |
| Review Queue safety spec | Required metadata, side-effect disclosure, approve/reject/hold/edit states, and no-bypass behavior |
| Responsive plan | Desktop, laptop, tablet, mobile tall, and mobile small behavior with overflow and navigation expectations |
| QA plan | Visual/responsive/browser checks that extend, not replace, V0.3 RUX regression |
| Migration strategy | Incremental delivery plan with no Full Rewrite and no unrelated framework migration |

Current artifact packet:

- `../design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md`
- `VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`

PM/UX review result:

- Planning artifacts accepted.
- V0.6 implementation route is opened by the later V0.5 acceptance decision.
- First implementation branch/worktree is `codex/v06-ui-v2-implementation` / `trisilar-task-hub-v06-ui-v2`.
- Production/runtime work and Full Rewrite remain out of scope.
- PM closeout packet: `../design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md`.

---

## V0.6 Implementation Ready Gate

Frontend Dev planning may start from current `origin/dev`. First code slice may start only after PM records all required inputs:

- V0.5 accepted evidence remains current.
- Current target branch and integration route are named.
- Route slice map is approved.
- Token migration map is approved.
- Review Queue safety spec is approved.
- QA plan is approved and includes responsive/browser evidence expectations.
- Production/runtime boundaries are restated: no secrets, no runtime flag changes, no Cloudflare changes, no Paperclip side effects, no auto-approval.

---

## Stop Conditions

Hold V0.6 planning or implementation if any of these occur:

- A task requires changing production app code outside the accepted V0.6 slice.
- The route map conflicts with V0.5 team operating-system evidence.
- Review Queue approval behavior becomes ambiguous.
- Trello is treated as no longer the execution surface.
- Paperclip/AI output appears to bypass human approval.
- Runtime, Cloudflare, service-token, or signing-secret work becomes necessary.
- Full Rewrite or framework migration is proposed as the default path.

---

## Next Handoff

```text
Role: Frontend Dev / UX Owner / QA
Task: Execute the accepted V0.6-S0 implementation slice only.

Inputs:
- docs/plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md
- docs/design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md
- docs/design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md
- docs/design/ui-design-v2/UI_V2_CLAUDE_OUTPUT_REVIEW.md
- docs/design/ui-design-v2/UI_V2_DESIGN_SYSTEM_HANDOFF.md
- docs/design/ui-design-v2/UI_V2_ROUTE_SCREEN_SPECS.md
- docs/logs/V0_3_RUX_FINDINGS.md
- docs/plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md

Rules:
- S0 only: shell/navigation, token layer, shared route states.
- Do not start Full Rewrite.
- Do not touch runtime, Cloudflare, secrets, or Paperclip live behavior.
- Preserve Trello as execution surface, Task Hub as command/review layer, and Review Queue as human gate.
- Keep V0.6 route-by-route and outside Team OS product scope.

Expected output:
- S0 implementation summary
- route/component coverage
- browser/responsive evidence
- regression and rollback confirmation
```
