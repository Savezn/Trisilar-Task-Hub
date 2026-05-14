# V0.3 RUX Findings Log

**Doc Role:** Active findings log for V0.3 Product Reliability + UX Stabilization
**Status:** Active - ready for UX / QA findings
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
| Held | Not actionable yet because dependency, evidence, or scope is missing. |
| Won't do | PM explicitly declines. |

---

## Findings

| ID | Date | Route | Category | Severity | Symptom | User impact | Source evidence | Suggested owner | Suggested phase | Acceptance criteria | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RUX-000 | 2026-05-14 | All | N/A | N/A | Findings log initialized. | Enables consistent V0.3 intake before implementation. | `V0.3-RUX-01` docs-only baseline. | PM / UX / QA | `V0.3-RUX-01` | Intake model and route checklist exist before route review starts. | Triaged |
| RUX-001 | 2026-05-14 | All Trello-dependent routes | Data confidence | P1 high friction | Global/sidebar and Settings surfaces report Trello as connected/ready while browser requests return `401 Unauthorized` and route content shows Trello connection failure. | Users cannot trust whether Trello is actually connected, configured but invalid, or temporarily unavailable. This weakens release confidence and daily workflow decisions. | Browser baseline on `http://localhost:3093` across desktop/mobile: `/today`, `/all`, `/boards`, `/okr`, and `/focus` showed Trello failure text; console recorded `401 Unauthorized`; Settings text still said Trello ready/connected. | Runtime | `V0.3-RUX-02` | Trello connection state distinguishes configured, verified, invalid, and disconnected; no route says Trello is connected/ready after an API auth failure. | New |
| RUX-002 | 2026-05-14 | Today / Tasks / Boards Monitor / OKR / Weekly Focus | Missing state | P1 high friction | Trello-dependent route failure states collapse into developer-facing text such as checking the API key in `.env`. | Non-developer users do not get a clear next action, ownership boundary, or whether to retry, reconnect, contact Runtime, or continue with partial data. | Browser baseline: `/today`, `/all`, `/boards`, `/okr`, and `/focus` each loaded with route-level Trello failure copy; desktop and mobile horizontal overflow were `0`. | UX | `V0.3-RUX-02` | Each Trello-dependent route has a user-facing disconnected/error state that names the owner or action, preserves route context, and avoids developer-only `.env` wording in the main product UI. | New |
| RUX-003 | 2026-05-14 | Docs / Paperclip surfaces | Audit gap | P2 polish / hardening | Docs cards show linked task status as `Not_found` and some source/type badges run together in text extraction, such as `agent-tracemock`. | Paperclip traceability is present but harder to scan; reviewers may not know whether a missing linked task is expected, stale, or an error. | Browser baseline `/docs` desktop/mobile: headings and mock artifacts loaded; text included `Live Paperclip remains blocked`, source `paperclip / mock`, status `Not_found`, and concatenated badge text. | AI Integration | `V0.3-RUX-03` | Docs/Paperclip cards show human-readable linked-task status, separated source/type badges, and a clear explanation when a linked review task cannot be found. | New |

---

## Review Batches

| Batch | Date | Scope | Reviewer | Status | Notes |
|---|---|---|---|---|---|
| RUX-B01 | 2026-05-14 | Baseline log initialization | Codex PM | Ready for UX / QA | No runtime/browser review yet. |
| RUX-B02 | 2026-05-14 | Desktop/mobile baseline review for `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, and `/docs` | Codex UX / QA | Findings recorded | Local app on port `3093`; all routes returned HTTP `200`; desktop/mobile horizontal overflow measured `0`; console showed Trello `401 Unauthorized` from missing/invalid local credentials; no UI/runtime patch made. |

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created V0.3 RUX findings log and initial baseline row | Codex PM |
| 2026-05-14 | Recorded first desktop/mobile route baseline findings from local browser review | Codex UX / QA |
