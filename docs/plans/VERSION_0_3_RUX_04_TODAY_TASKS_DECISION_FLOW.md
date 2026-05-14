# V0.3-RUX-04 Today + Tasks Decision Flow

**Doc Role:** Scoped PM handoff for the next V0.3 Product Reliability + UX Stabilization task
**Status:** PM Accepted
**Owner:** UX / Frontend / QA
**Created:** 2026-05-14
**Last Updated:** 2026-05-14 - **Updated by:** Codex PM
**Related Docs:** `VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md`, `VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md`, `../../CURRENT_SPRINT.md`, `../logs/V0_3_RUX_FINDINGS.md`, `../testing/TEST_STRATEGY.md`

---

## PM Triage Decision

PM routes `V0.3-RUX-04` after accepting `V0.3-RUX-03` because the next reliability gap is daily decision flow:

```text
Task Hub is the command center
-> Today and Tasks must make top work obvious
-> users should not hunt across boards to understand source, priority, due state, or next action
-> Review Queue and AI-originated work must remain visible without creating alarm fatigue
```

This is a targeted UX/product reliability task. It is not a broad redesign and it must preserve the accepted Trello, Review Queue, and Paperclip safety boundaries.

---

## Scope

### In Scope

- Improve Today and Tasks scanning clarity for today, overdue, upcoming, pending review, and blocked work.
- Clarify task source and context across Trello, Review Queue, Google Tasks, and AI/Paperclip intake where data is available.
- Preserve cross-board confidence by keeping board/list/project context visible enough for daily use.
- Keep next actions reachable on desktop and mobile.
- Preserve disconnected/partial-data states from `V0.3-RUX-02A`.
- Add or update focused QA evidence for `/today` and `/all` on desktop and mobile.

### Out Of Scope

- Broad app redesign or design-system reset.
- Replacing Trello as the execution source of truth.
- Changing runtime secrets, credentials, or Cloudflare policy.
- Standing live Paperclip enablement.
- W3 webhook hardening, service-auth changes, or runtime gate changes.
- Automatic Trello, Calendar, or Google Tasks writes outside existing explicit user actions.
- Merging this branch into W3 or merging W3 into this branch.

---

## Source Context

`V0.3-RUX-04` comes from the accepted V0.3 plan, not from a newly logged defect row. If implementation discovers concrete issues, record them in `../logs/V0_3_RUX_FINDINGS.md` before expanding scope.

| Area | Current signal | PM concern |
|---|---|---|
| Today | Main daily command route | Top work should be clear within 10 seconds without board hunting. |
| Tasks | Cross-board task route | Source, due state, owner, board/list, and next action should remain visible across dense lists. |
| Review Queue | Human approval gate | Pending review should be visible and actionable, but not alarming or mixed with already-approved execution work. |
| Google Tasks / Planner | Personal task source | User should understand when Google Tasks data is disconnected, partial, or separate from Trello execution. |
| Paperclip / AI intake | Controlled intake source | AI-originated work should remain traceable without bypassing Review Queue. |

---

## Likely Investigation Scope

These files are likely relevant based on current route ownership. Dev must verify before editing.

| Area | Likely file(s) | Why |
|---|---|---|
| Today route | `public/js/pages/today.js`, `public/app.js`, `public/style.css` | Today combines Trello, Review Queue, Calendar, and Google Tasks signals. |
| Tasks route | `public/js/pages/all-tasks.js`, `public/app.js`, `public/style.css` | Tasks renders cross-board rows, filters, grouping, and edit/open actions. |
| Shared state/helpers | `public/js/state.js`, `public/js/utils.js` | Existing route state, task labels, date formatting, and source helpers may already exist. |
| Trello status/failure copy | `public/app.js`, `src/routes/trello.routes.js`, `src/utils/errors.js` | Must preserve `V0.3-RUX-02A` disconnected/invalid credential behavior. |
| Review Queue links | `public/js/pages/review.js`, `review-store.js`, `src/integrations/paperclip/` | Pending review counts and AI-originated context must stay human-gated. |
| Verification | `scripts/verify-frontend.js`, `scripts/verify-rux-trello-connection-ux.js` | Existing checks should remain green; add focused verification only if behavior needs it. |

---

## Acceptance Criteria

- A user can identify top work in Today within 10 seconds from visible priority, due state, source, and next-action cues.
- Pending Review is visible and actionable without implying that unapproved AI work has already become execution work.
- Tasks preserves source, board/list/project context, owner, due state, and next action in dense desktop and mobile views.
- Hidden boards and configured workspace filters remain respected.
- Disconnected, partial-data, and credential-invalid states from `V0.3-RUX-02A` remain intact and user-facing.
- Mobile view keeps key actions reachable without page-level horizontal overflow.
- No broad redesign reset is introduced.
- No live Paperclip enablement, secret exposure, W3 service-auth/runtime change, or automatic write side effect occurs.
- V0.3/W3 branch boundary remains intact.

---

## Verification Expectations

Minimum verification for implementation:

```powershell
node server.js
npm.cmd run check:all
npm.cmd run verify:rux-trello
```

Focused browser evidence:

- `/today`
- `/all`

Regression smoke:

- `/review`
- `/docs`
- `/boards`
- `/settings`

Record:

- desktop and mobile route result
- horizontal overflow
- console/page errors
- Today top-work readability
- Tasks source/context/readability
- pending Review visibility and human-gate preservation
- confirmation that no live Paperclip enablement or secret exposure occurred

---

## Implementation Summary

`V0.3-RUX-04` was implemented as a scoped Today / Tasks decision-flow clarity patch.

Changed:

- Today now labels the start point with visible source/context/next-action cues.
- Today pending Review copy now says `Needs human approval` and `Review before execution`, preserving the Review Queue as the human gate.
- Tasks rows now expose `Source: Trello`, board/list context, owner, due state, status, and next action in dense desktop/mobile rows.
- A focused verification gate was added as `npm.cmd run verify:rux-decision-flow`.

No live Paperclip enablement, W3 webhook/service-auth/runtime changes, secrets, private credential URLs, or automatic Trello/Calendar/Google Tasks write paths were added.

---

## Verification Result

| Check | Result |
|---|---|
| `node --check public/js/pages/today.js` | Pass |
| `node --check public/js/pages/all-tasks.js` | Pass |
| `npm.cmd run verify:rux-decision-flow` | Pass |
| `npm.cmd run verify:rux-trello` | Pass |
| `npm.cmd run verify:rux-ai-trace` | Pass |
| `npm.cmd run check:all` with local temporary server | Pass |
| Browser QA `/today` desktop/mobile | Pass - source/context/next-action, top-work cue, pending Review human gate visible |
| Browser QA `/all` desktop/mobile | Pass - source/context/owner/due/status/next-action visible |
| Browser regression `/review`, `/docs`, `/boards`, `/settings` | Pass |
| Hidden-board filtering controlled QA | Pass - hidden board card stayed filtered |
| Horizontal overflow / console errors / page errors | Pass - no overflow, console errors `0`, page errors `0` |

---

## PM Acceptance

```text
Status: Accepted
Accepted by: Codex PM
Date: 2026-05-14
Accepted commit: d72f979

Acceptance confirmed:
- Today top work is identifiable from visible priority, due state, source, context, and next-action cues.
- Tasks preserves source, board/list context, owner, due state, status, and next action across dense desktop/mobile views.
- Pending Review remains visible without implying unapproved AI work is already execution work.
- Hidden-board filtering, V0.3-RUX-02A connection-state copy, and RUX-03 trace clarity remained covered by verification.
- Browser QA evidence covered /today and /all across desktop/mobile plus /review, /docs, /boards, and /settings regression.
- No live Paperclip enablement, W3 branch merge, automatic write side effect, secret exposure, or W3 service-auth/runtime change occurred.
```

---

## Next Recommended Session

```text
Role: QA / Frontend / Dev
Task: Implement and verify V0.3-RUX-05 Browser Regression + Responsive QA Gate.

Read:
- docs/plans/VERSION_0_3_RUX_05_BROWSER_REGRESSION_RESPONSIVE_QA_GATE.md
- docs/logs/V0_3_RUX_FINDINGS.md
- docs/testing/TEST_STRATEGY.md
- docs/reference/AI_AGENT_GOVERNANCE.md

Guardrails:
- Build a repeatable browser regression gate without production secrets.
- Keep live dependencies controlled or mockable when local credentials are unavailable.
- Preserve Review Queue as the human approval gate.
- Do not enable live Paperclip.
- Do not change W3 webhook/service-auth behavior.
- Do not expose secrets or private credential values.
- Do not merge W3/V0.3 branches.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Routed `V0.3-RUX-04` for Today + Tasks decision-flow clarity after `V0.3-RUX-03` PM acceptance | Codex PM |
| 2026-05-14 | Implemented and verified Today + Tasks source/context/next-action cues; routed to PM review | Codex Dev / UX / QA |
| 2026-05-14 | Accepted `V0.3-RUX-04` at `d72f979`; routed next to `V0.3-RUX-05` browser regression gate | Codex PM |
