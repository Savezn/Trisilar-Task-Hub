# V0.3-RUX-03 Review Queue + AI Trace Clarity

**Doc Role:** Scoped PM handoff for the next V0.3 Product Reliability + UX Stabilization task
**Status:** QA pass - ready for PM review
**Owner:** UX / AI Integration / Frontend / QA
**Created:** 2026-05-14
**Last Updated:** 2026-05-14 - **Updated by:** Codex Dev / UX / QA
**Related Docs:** `VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md`, `VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md`, `../../CURRENT_SPRINT.md`, `../logs/V0_3_RUX_FINDINGS.md`, `../testing/TEST_STRATEGY.md`

---

## PM Triage Decision

PM routes `RUX-003` into `V0.3-RUX-03` because the remaining baseline issue is about AI/Paperclip trace readability:

```text
Paperclip document / AI trace data exists
-> Docs surfaces expose technical or compressed labels
-> linked-task state is hard to interpret
-> reviewer confidence drops before Review Queue approval
```

This task is not a live Paperclip enablement task. It should improve reviewability of existing mock/contract-backed AI trace surfaces while preserving the Review Queue human gate.

---

## Scope

### In Scope

- Clarify Docs / Paperclip linked-task state, including a human-readable state for missing or stale linked tasks.
- Separate and label source/type/status chips so text extraction and visual scanning do not collapse into strings such as `agent-tracemock`.
- Preserve useful Paperclip trace metadata where available: source system, artifact id, artifact type, request id, agent run id, evidence excerpt, linked task context, and audit trail.
- Keep Review Queue linked Paperclip document affordances understandable and non-destructive.
- Add or update focused QA evidence for `/docs` and `/review` on desktop and mobile.

### Out Of Scope

- Standing live Paperclip enablement.
- W3 Paperclip webhook hardening, service-auth changes, or runtime gate changes.
- New AI automation behavior or automatic Trello/Calendar side effects.
- Broad Docs or Review Queue redesign beyond trace clarity and linked-task readability.
- Merging this branch into W3 or merging W3 into this branch.

---

## Source Finding

| ID | Route | Category | Severity | Summary |
|---|---|---|---|---|
| `RUX-003` | Docs / Paperclip surfaces | Audit gap | P2 polish / hardening | Docs cards show linked task status as `Not_found` and some source/type badges run together in text extraction, such as `agent-tracemock`. |

---

## Likely Investigation Scope

These files are likely relevant based on repo search. Dev must verify before editing.

| Area | Likely file(s) | Why |
|---|---|---|
| Docs / Paperclip UI | `public/js/pages/docs.js`, `public/style.css` | Baseline issue appears on `/docs` cards, chips, linked-task state, and Paperclip artifact display. |
| Review Queue linked docs | `public/js/pages/review.js`, `public/style.css` | Review Queue already renders linked Paperclip docs and must preserve human approval flow. |
| Paperclip docs contract | `src/integrations/paperclip/documents-contract.js`, `src/integrations/paperclip/docs-workflow.js` | Existing normalized linked-task state and document workflow may need readable mapping without changing contract semantics. |
| Paperclip fixtures | `src/integrations/paperclip/fixtures/document-artifacts.json`, `src/integrations/paperclip/fixtures/valid-paperclip-review-session.json` | Deterministic mock data used by Docs and Review Queue verification. |
| Verification scripts | `scripts/verify-paperclip-docs.js`, `scripts/verify-paperclip-contract.js`, `scripts/verify-paperclip-mock.js` | Existing Paperclip contract/mock/docs regression checks should remain green. |

---

## Acceptance Criteria

- `/docs` shows human-readable linked-task state for linked, unlinked, missing/stale, and manually referenced tasks where applicable.
- `/docs` source/type/status labels are visually and textually separated; source/type badge text must not collapse into ambiguous strings like `agent-tracemock`.
- Reviewers can identify source document context, artifact type, request/run context, and linked Review Queue task context without losing the current flow.
- Review Queue linked Paperclip document affordances still open the related Docs context and do not change approval/reject behavior.
- Approval still requires explicit human action; no Trello, Calendar, Google Tasks, or live Paperclip side effect occurs before approval.
- No secrets, auth headers, tokens, HMAC values, Cloudflare Access credentials, or private credentialed URLs appear in UI, docs, logs, or tests.
- V0.3/W3 branch boundary remains intact.

---

## Verification Expectations

Minimum verification for implementation:

```powershell
npm.cmd run check:all
npm.cmd run verify:paperclip-contract
npm.cmd run verify:paperclip-mock
npm.cmd run verify:paperclip-docs
```

Focused browser evidence:

- `/docs`
- `/review`

Regression smoke:

- `/today`
- `/all`
- `/boards`
- `/settings`

Record:

- desktop and mobile route result
- horizontal overflow
- console/page errors
- Docs linked-task state wording
- source/type/status badge readability
- Review Queue linked Paperclip doc behavior
- confirmation that no live Paperclip enablement or secret exposure occurred

---

## Implementation Evidence

Files changed:

- `public/js/pages/docs.js`
- `public/js/pages/review.js`
- `public/style.css`
- `scripts/verify-rux-ai-trace-clarity.js`
- `scripts/verify-paperclip-docs.js`
- `package.json`

Verification completed:

- `npm.cmd run verify:rux-ai-trace`
- `npm.cmd run verify:paperclip-contract`
- `npm.cmd run verify:paperclip-mock`
- `npm.cmd run verify:paperclip-docs`
- `npm.cmd run check:all` with a local isolated server on port `3097`
- Browser QA on `/docs`, `/review`, `/today`, `/all`, `/boards`, and `/settings` across desktop `1440x1000` and mobile `390x844`

Browser QA result:

- Horizontal overflow: `0` for every checked route and viewport.
- Console errors: `0`.
- Page errors: `0`.
- `/docs` showed labeled Type / Agent / Status / Link chips, `Missing local Review Queue task`, `SOURCE SYSTEM`, and `SOURCE MODE`.
- `/review` showed linked Paperclip docs with `Type:`, `Status:`, `Run:`, and `Agent:` context.
- No checked route exposed `Not_found` or collapsed `agent-tracemock` text.
- Browser regression used controlled local API responses for Trello-dependent routes to avoid credential noise.

Boundary confirmation:

- No live Paperclip enablement.
- No W3 webhook/service-auth/runtime gate change.
- No automatic Trello, Calendar, or Google Tasks side effect before approval.
- No secret, token, auth header, private credentialed URL, HMAC value, or Cloudflare Access credential added to UI, docs, logs, or tests.
- No W3/V0.3 branch merge.

---

## Next Recommended Session

```text
Role: PM
Task: Review and accept V0.3-RUX-03 Review Queue + AI Trace Clarity for RUX-003.

Read:
- docs/plans/VERSION_0_3_RUX_03_REVIEW_QUEUE_AI_TRACE_CLARITY.md
- docs/logs/V0_3_RUX_FINDINGS.md
- docs/testing/TEST_STRATEGY.md
- docs/reference/AI_AGENT_GOVERNANCE.md

Guardrails:
- Confirm changes stayed scoped to Docs/Paperclip trace readability and Review Queue linked-doc clarity.
- Do not enable live Paperclip.
- Do not change W3 webhook/service-auth behavior.
- Do not create automatic Trello/Calendar side effects.
- Do not expose secrets or private credential values.
- Do not merge W3/V0.3 branches.

If accepted:
- Mark RUX-003 as PM Accepted.
- Route the next V0.3 RUX item from the accepted plan.

If held:
- List the exact copy, evidence, or route behavior that needs revision.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Routed `V0.3-RUX-03` for `RUX-003` Docs/Paperclip trace clarity | Codex PM |
| 2026-05-14 | Implemented and verified `V0.3-RUX-03`; routed to PM review | Codex Dev / UX / QA |
