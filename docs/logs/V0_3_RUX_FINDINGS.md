# V0.3 RUX Findings Log

**Doc Role:** Active findings log for V0.3 Product Reliability + UX Stabilization
**Status:** Active - V0.3-RUX-05 QA pass / PM review pending
**Owner:** PM / UX / QA
**Created:** 2026-05-14
**Last Updated:** 2026-05-14 - **Updated by:** Codex PM
**Related Docs:** `../plans/VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md`, `../plans/VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md`, `../testing/TEST_STRATEGY.md`

---

## Recording Rules

- Record V0.3 UX/reliability findings here before implementation starts.
- Keep one finding per row.
- Use the route names, categories, severity labels, and owner roles from `../plans/VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md`.
- Do not store secrets, auth headers, private credentialed URLs, or raw tokens.
- QA-only sessions must stay read-only and record findings/evidence only.

---

## Finding Status Values

| Status | Meaning |
|---|---|
| New | Captured but not triaged. |
| Triaged | PM assigned category, severity, owner, and phase. |
| Routed | Assigned to a scoped Dev/UX/Runtime/AI Integration task. |
| Fixed pending QA | Implementation claims complete; QA evidence still needed. |
| QA pass | QA accepted the fix. |
| PM Accepted | PM accepted QA evidence and closed the scoped finding. |
| Held | Not actionable yet because dependency, evidence, or scope is missing. |
| Won't do | PM explicitly declines. |

---

## Findings

| ID | Date | Route | Category | Severity | Symptom | User impact | Source evidence | Suggested owner | Suggested phase | Acceptance criteria | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RUX-000 | 2026-05-14 | All | N/A | N/A | Findings log initialized. | Enables consistent V0.3 intake before implementation. | `V0.3-RUX-01` docs-only baseline. | PM / UX / QA | `V0.3-RUX-01` | Intake model and route checklist exist before route review starts. | Triaged |
| RUX-001 | 2026-05-14 | All Trello-dependent routes | Data confidence | P1 high friction | Global/sidebar and Settings surfaces report Trello as connected/ready while browser requests return `401 Unauthorized` and route content shows Trello connection failure. | Users cannot trust whether Trello is actually connected, configured but invalid, or temporarily unavailable. This weakens release confidence and daily workflow decisions. | Baseline on `http://localhost:3093`: affected routes showed Trello failure text, console recorded `401 Unauthorized`, and Settings still said ready/connected. Fix verification on `http://localhost:3094`: `/today`, `/all`, `/boards`, `/okr`, `/focus`, and `/settings` no longer report Trello connected/ready when disconnected; console errors `0`; desktop/mobile overflow `0`. PM accepted at `516b33e`. | Runtime / Frontend / UX | `V0.3-RUX-02A` | Trello connection state distinguishes configured, verified, invalid, and disconnected; no route says Trello is connected/ready after an API auth failure. | PM Accepted |
| RUX-002 | 2026-05-14 | Today / Tasks / Boards Monitor / OKR / Weekly Focus | Missing state | P1 high friction | Trello-dependent route failure states collapse into developer-facing text such as checking the API key in `.env`. | Non-developer users do not get a clear next action, ownership boundary, or whether to retry, reconnect, contact Runtime, or continue with partial data. | Baseline: `/today`, `/all`, `/boards`, `/okr`, and `/focus` loaded with route-level Trello failure copy. Fix verification: each route shows product copy naming Trello verification and Runtime ownership; no `.env` or API-key wording appeared in the checked UI; desktop/mobile overflow `0`. PM accepted at `516b33e`. | UX / Frontend / Runtime | `V0.3-RUX-02A` | Each Trello-dependent route has a user-facing disconnected/error state that names the owner or action, preserves route context, and avoids developer-only `.env` wording in the main product UI. | PM Accepted |
| RUX-003 | 2026-05-14 | Docs / Paperclip surfaces | Audit gap | P2 polish / hardening | Docs cards show linked task status as `Not_found` and some source/type badges run together in text extraction, such as `agent-tracemock`. | Paperclip traceability is present but harder to scan; reviewers may not know whether a missing linked task is expected, stale, or an error. | Baseline `/docs` desktop/mobile: text included `Not_found` and concatenated badge text. Fix verification: Docs list/viewer now use labeled Type/Agent/Status/Link chips, missing links say `Missing local Review Queue task`, metadata splits `SOURCE SYSTEM` and `SOURCE MODE`, Review Queue linked docs show Type/Status/Run/Agent, and browser QA found no `Not_found` or `agent-tracemock` across desktop/mobile. PM accepted at `b2425a4`. | AI Integration / UX | `V0.3-RUX-03` | Docs/Paperclip cards show human-readable linked-task status, separated source/type badges, and a clear explanation when a linked review task cannot be found. | PM Accepted |
| RUX-004 | 2026-05-14 | Today / Tasks | Decision flow | P2 polish / hardening | Today and Tasks showed due/status/board signals but did not consistently label source, context, and next action for fast daily decisions. | Users had to infer where work came from and what to do next, especially in dense cross-board lists or when Review Queue items were pending. | Fix verification: `verify:rux-decision-flow`, `verify:rux-trello`, `verify:rux-ai-trace`, and server-backed `check:all` passed. Browser QA verified `/today` and `/all` across desktop/mobile with visible `Source: Trello`, context, owner/due/status, and `Next action` cues; pending Review copy says `Needs human approval` and `Review before execution`; hidden board card stayed filtered; overflow `0`, console/page errors `0`. PM accepted at `d72f979`. | UX / Frontend / QA | `V0.3-RUX-04` | Today top work is identifiable from priority/due/source/context/next-action cues; Tasks preserves source/board/list/owner/due/status/next action in dense desktop/mobile views; pending Review remains human-gated. | PM Accepted |
| RUX-005 | 2026-05-14 | All core routes | Regression risk | P1 high friction | Browser QA evidence was repeated manually across RUX tasks without one repeatable command. | Release confidence depends on re-running the same route matrix without relying on memory, production credentials, or ad hoc browser scripts. | Fix verification: RED missing-script failure observed, then `npm.cmd run verify:rux-browser-regression` passed. The command starts a temporary local server, uses controlled fixtures, checks `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, and `/docs` across desktop/mobile, captures console/page errors and overflow, and requires no production secrets. | QA / Frontend / Dev | `V0.3-RUX-05` | A repeatable browser regression command covers core routes with controlled fixtures, desktop/mobile viewports, console/page error capture, overflow checks, and relevant RUX assertions. | QA pass |

---

## Review Batches

| Batch | Date | Scope | Reviewer | Status | Notes |
|---|---|---|---|---|---|
| RUX-B01 | 2026-05-14 | Baseline log initialization | Codex PM | Ready for UX / QA | No runtime/browser review yet. |
| RUX-B02 | 2026-05-14 | Desktop/mobile baseline review for `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, and `/docs` | Codex UX / QA | Findings recorded | Local app on port `3093`; all routes returned HTTP `200`; desktop/mobile horizontal overflow measured `0`; console showed Trello `401 Unauthorized` from missing/invalid local credentials; no UI/runtime patch made. |
| RUX-B03 | 2026-05-14 | PM triage of `RUX-001` through `RUX-003` | Codex PM | Routed | Grouped `RUX-001` and `RUX-002` into `V0.3-RUX-02A`; left `RUX-003` triaged for later `V0.3-RUX-03`. |
| RUX-B04 | 2026-05-14 | `V0.3-RUX-02A` Trello connection-state and failure-copy verification | Codex Dev / UX / Runtime | QA pass | `npm.cmd run verify:rux-trello`, `node scripts/verify-frontend.js`, and `PORT=3094 npm.cmd run check:all` passed. Browser verification on `/today`, `/all`, `/boards`, `/okr`, `/focus`, and `/settings` plus regression routes `/review`, `/calendar`, `/planner`, and `/docs` passed across desktop/mobile with horizontal overflow `0`, console errors `0`, and page errors `0`. |
| RUX-B05 | 2026-05-14 | PM acceptance of `V0.3-RUX-02A` | Codex PM | PM Accepted | Accepted `RUX-001` and `RUX-002` at `516b33e`; confirmed scope stayed inside V0.3, with no W3 merge, no Paperclip live-enablement change, and no secret exposure. |
| RUX-B06 | 2026-05-14 | PM routing for `V0.3-RUX-03` | Codex PM | Routed | Routed `RUX-003` to `docs/plans/VERSION_0_3_RUX_03_REVIEW_QUEUE_AI_TRACE_CLARITY.md`; scope is Docs/Paperclip trace readability and Review Queue linked-doc clarity only. |
| RUX-B07 | 2026-05-14 | `V0.3-RUX-03` Review Queue + AI Trace Clarity implementation and QA | Codex Dev / UX / QA | QA pass | Added `verify:rux-ai-trace`, clarified Docs linked-task state and trace chips, added Review Queue linked-doc Type/Status/Run/Agent metadata, and verified `verify:rux-ai-trace`, Paperclip contract/mock/docs checks, server-backed `check:all`, and desktop/mobile browser QA for `/docs`, `/review`, `/today`, `/all`, `/boards`, and `/settings`. No live Paperclip enablement, W3 merge, automatic side effects, or secret exposure. |
| RUX-B08 | 2026-05-14 | PM acceptance of `V0.3-RUX-03` and routing for `V0.3-RUX-04` | Codex PM | PM Accepted / Routed | Accepted `RUX-003` at `b2425a4`; confirmed scope stayed inside V0.3, with no W3 merge, no Paperclip live-enablement change, no automatic side effects, and no secret exposure. Routed next to `docs/plans/VERSION_0_3_RUX_04_TODAY_TASKS_DECISION_FLOW.md`. |
| RUX-B09 | 2026-05-14 | `V0.3-RUX-04` Today + Tasks Decision Flow implementation and QA | Codex Dev / UX / QA | QA pass | Added `verify:rux-decision-flow`, Today source/context/next-action cues, pending Review human-gate copy, and Tasks source/context/owner/due/status/next-action cues. Verified syntax, `verify:rux-decision-flow`, `verify:rux-trello`, `verify:rux-ai-trace`, server-backed `check:all`, and controlled browser QA for `/today`, `/all`, `/review`, `/docs`, `/boards`, and `/settings` across desktop/mobile. Hidden board filtering stayed intact; no live Paperclip enablement, W3 merge, automatic side effects, or secret exposure. |
| RUX-B10 | 2026-05-14 | PM acceptance of `V0.3-RUX-04` and routing for `V0.3-RUX-05` | Codex PM | PM Accepted / Routed | Accepted `RUX-004` at `d72f979`; confirmed Today/Tasks decision-flow cues, pending Review human gate, hidden-board filtering, browser evidence, no live Paperclip enablement, no W3 merge, no automatic side effects, and no secret exposure. Routed next to `docs/plans/VERSION_0_3_RUX_05_BROWSER_REGRESSION_RESPONSIVE_QA_GATE.md`. |
| RUX-B11 | 2026-05-14 | `V0.3-RUX-05` Browser Regression + Responsive QA Gate implementation and QA | Codex Dev / QA | QA pass | Added `verify:rux-browser-regression` with Playwright controlled fixtures, temporary local server, desktop/mobile viewports, core route matrix, console/page error capture, horizontal overflow checks, hidden-board fixture validation, disconnected Today copy assertion, Docs trace labels, and Today/Tasks decision-flow assertions. No production secrets, live Paperclip enablement, W3 merge, automatic side effects, or private credentialed URLs. |

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created V0.3 RUX findings log and initial baseline row | Codex PM |
| 2026-05-14 | Recorded first desktop/mobile route baseline findings from local browser review | Codex UX / QA |
| 2026-05-14 | Triaged baseline findings and routed grouped Trello connection-state work to `V0.3-RUX-02A` | Codex PM |
| 2026-05-14 | Implemented and verified `V0.3-RUX-02A`; marked `RUX-001` and `RUX-002` as QA pass | Codex Dev / UX / Runtime |
| 2026-05-14 | Accepted `V0.3-RUX-02A` and routed next to `V0.3-RUX-03` planning | Codex PM |
| 2026-05-14 | Routed `RUX-003` to `V0.3-RUX-03` Review Queue + AI Trace Clarity | Codex PM |
| 2026-05-14 | Implemented and verified `V0.3-RUX-03`; marked `RUX-003` as QA pass before PM acceptance | Codex Dev / UX / QA |
| 2026-05-14 | Accepted `V0.3-RUX-03`; routed `V0.3-RUX-04` Today + Tasks Decision Flow | Codex PM |
| 2026-05-14 | Implemented and verified `V0.3-RUX-04`; marked `RUX-004` as QA pass before PM acceptance | Codex Dev / UX / QA |
| 2026-05-14 | Accepted `V0.3-RUX-04`; routed `V0.3-RUX-05` Browser Regression + Responsive QA Gate | Codex PM |
| 2026-05-14 | Implemented and verified `V0.3-RUX-05`; marked `RUX-005` as QA pass before PM acceptance | Codex Dev / QA |
