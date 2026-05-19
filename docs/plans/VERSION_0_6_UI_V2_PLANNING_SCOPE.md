# Version 0.6 UI V2 Planning Scope

**Doc Role:** PM/UX planning scope for V0.6 UI V2 implementation
**Status:** Complete for planning and implementation parity evidence; source-led QA pass / PM-UX re-review pending after sidebar/icon correction
**Owner:** PM / UX Owner
**Created:** 2026-05-15
**Updated by:** Codex PM / UX Owner
**Related Docs:** `PROJECT_LADDER.md`, `../../TODO.md`, `VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`, `../design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md`, `../design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md`, `../design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md`, `../design/ui-design-v2/UI_V2_COMPONENT_PARITY_AUDIT.md`, `../logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`, `../design/ui-design-v2/UI_V2_PROTOTYPE_DEVIATION_LOG.md`, `../design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md`, `../design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md`, `../design/ui-design-v2/UI_V2_CLAUDE_OUTPUT_REVIEW.md`, `../design/ui-design-v2/UI_V2_DESIGN_SYSTEM_HANDOFF.md`, `../design/ui-design-v2/UI_V2_ROUTE_SCREEN_SPECS.md`, `../logs/V0_3_RUX_FINDINGS.md`, `../logs/DECISION_LOG.md`

---

## PM / UX Decision

Decision: **Accept V0.6 UI V2 planning artifacts as the implementation-planning baseline.**

This opens implementation planning after V0.5 acceptance. It does not approve production app changes outside scoped V0.6 UI slices, runtime changes, Cloudflare changes, Paperclip behavior changes, Team OS product scope, or a full rewrite.

Implementation planning may proceed because V0.5 is accepted. The original first code work was routed through `VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`; continuing fixes are now routed through the source-led parity gate below.

Current parity control is stricter than the original planning gate. `../design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md` is now the first-read contract for any further V0.6 UI V2 fix. It requires prototype source references, a gap row before code, narrow route/component patches, regenerated evidence, and PM/UX visual review before acceptance.

Latest source-led recovery closed the PM/UX P1 screenshot-pack blockers for Today mobile, Boards mobile, OKR / Portfolio desktop, shared mobile shell title stack, and sidebar/icon primitive parity, and tightened the Mobile More P2 density row. The sidebar/icon correction is QA-passed; PM/UX re-review is pending before merge-review acceptance is restored. Automated PASS remains supporting evidence for future reopened gaps.

Current allowed scope:

- V0.6 route-by-route UI implementation planning and source-led parity fixes.
- Shell/navigation, shared route states, and component parity fixes when tied to a logged prototype-source gap.
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

- Unscoped edits under `public/` or `src/` outside a V0.6 source-led parity slice.
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
| `../design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md` | Active source-led parity workflow, ECC boundary, acceptance rules, and Codex prompt template |
| `../design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md` | Source-derived tokens, shell, elements, components, route composition, mobile, state, and safety specs |
| `../design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md` | PM/UX-facing visual gap ledger and severity model |
| `../logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md` | Generated route/screenshot evidence; automated gate only, not PM/UX acceptance |
| `../design/ui-design-v2/UI_V2_COMPONENT_PARITY_AUDIT.md` | Generated component presence audit; structural gate only |

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

- `../design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md`
- `../design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md`
- `../design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md`
- `../design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md`
- `VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md`

PM/UX review result:

- Planning artifacts accepted.
- V0.6 implementation route is opened by the later V0.5 acceptance decision.
- Current V0.6 source-led parity branch/worktree is `codex/v06-uiv2-full-fidelity` / `trisilar-task-hub-v06-uiv2-qa`.
- `VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md` remains historical route-order and ownership context; `UI_V2_CODEX_PARITY_HANDOFF.md` is now the active first-read implementation contract.
- Latest source-led P1 recovery repaired Today mobile from `screens-mobile.jsx` `MToday`, Boards mobile from `screens-mobile.jsx` `MBoards`, OKR / Portfolio desktop from `screens-3.jsx` `ScreenOKR`, shared mobile shell title stack from `screens-mobile.jsx` `MTopbar`, and sidebar/icon primitive parity from `components.jsx` `Ic.*` / `NAV` / `Sidebar`; PM/UX re-review is pending for the reopened sidebar/icon gap.
- Production/runtime work and Full Rewrite remain out of scope.
- PM closeout packet: `../design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md`.

---

## V0.6 Implementation Ready Gate

Frontend Dev planning may start from current `origin/dev`. Continuing code slices may proceed only when they stay inside the recorded source-led parity gate and PM records all required inputs:

- V0.5 accepted evidence remains current.
- Current target branch and integration route are named.
- Route slice map is approved.
- Token migration map is approved.
- Review Queue safety spec is approved.
- QA plan is approved and includes responsive/browser evidence expectations.
- Production/runtime boundaries are restated: no secrets, no runtime flag changes, no Cloudflare changes, no Paperclip side effects, no auto-approval.

## Source-Led Parity Gate

After PM/UX preview identified gaps in the alignment pass, every remaining V0.6 UI V2 fix must satisfy this gate:

- Read `../design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md` first.
- Identify the prototype source file/component before changing code.
- Add or update a row in `../design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md` before patching.
- Patch one route/component slice unless the change is a shared token/primitive.
- Regenerate `../logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md`, `../design/ui-design-v2/UI_V2_COMPONENT_PARITY_AUDIT.md`, and screenshot evidence when visible UI changes.
- Log intentional prototype differences in `../design/ui-design-v2/UI_V2_PROTOTYPE_DEVIATION_LOG.md`.
- Treat generated PASS as automated evidence only. PM/UX visual review remains final acceptance.

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
Task: Continue V0.6 UI V2 source-led full-fidelity recovery only when PM/UX identifies a route/component mismatch.

Inputs:
- docs/design/ui-design-v2/UI_V2_CODEX_PARITY_HANDOFF.md
- docs/design/ui-design-v2/UI_V2_PROTOTYPE_SOURCE_INVENTORY.md
- docs/design/ui-design-v2/UI_V2_VISUAL_PARITY_REVIEW.md
- docs/logs/UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md
- docs/plans/VERSION_0_6_UI_V2_PLANNING_SCOPE.md
- docs/design/ui-design-v2/UI_V2_PM_CLOSEOUT_HANDOFF.md
- docs/design/ui-design-v2/UI_V2_V0_6_PLANNING_ARTIFACTS.md
- docs/design/ui-design-v2/UI_V2_CLAUDE_OUTPUT_REVIEW.md
- docs/design/ui-design-v2/UI_V2_DESIGN_SYSTEM_HANDOFF.md
- docs/design/ui-design-v2/UI_V2_ROUTE_SCREEN_SPECS.md
- docs/logs/V0_3_RUX_FINDINGS.md
- docs/plans/VERSION_0_6_UI_V2_FIRST_SLICE_IMPLEMENTATION_PLAN.md

Rules:
- Do not start from screenshot guessing.
- Identify the prototype source file/component before changing code.
- Add or update a gap row in `UI_V2_VISUAL_PARITY_REVIEW.md` before patching.
- Patch one route/component slice unless the issue is a shared token/primitive.
- Treat route/component audit PASS as automated evidence only; PM/UX visual review remains final acceptance.
- Do not start Full Rewrite.
- Do not touch runtime, Cloudflare, secrets, or Paperclip live behavior.
- Preserve Trello as execution surface, Task Hub as command/review layer, and Review Queue as human gate.
- Keep V0.6 route-by-route and outside Team OS product scope.

Expected output:
- Prototype source reference
- gap/evidence row updated before code
- source-led slice implementation summary
- route/component coverage
- browser/responsive evidence and screenshots for affected route
- regression and no-runtime-scope confirmation
```
