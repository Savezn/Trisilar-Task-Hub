# V0.3-RUX-05 Browser Regression + Responsive QA Gate

**Doc Role:** Scoped PM handoff for the next V0.3 Product Reliability + UX Stabilization task
**Status:** QA pass - PM review pending
**Owner:** QA / Frontend / Dev
**Created:** 2026-05-14
**Last Updated:** 2026-05-14 - **Updated by:** Codex Dev / QA
**Related Docs:** `VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md`, `VERSION_0_3_RUX_04_TODAY_TASKS_DECISION_FLOW.md`, `../../CURRENT_SPRINT.md`, `../logs/V0_3_RUX_FINDINGS.md`, `../testing/TEST_STRATEGY.md`, `../reference/AI_AGENT_GOVERNANCE.md`

---

## PM Triage Decision

PM accepts `V0.3-RUX-04` at `d72f979` and routes `V0.3-RUX-05` because the RUX work has repeated the same browser QA pattern across multiple sessions:

```text
manual controlled route stubs
-> desktop/mobile route load
-> console/page error capture
-> horizontal overflow checks
-> route-specific visible text assertions
-> regression routes
```

This needs to become a repeatable project gate before `V0.3-RUX-06` release checklist work.

---

## Scope

### In Scope

- Add or formalize a repeatable browser regression command for core user-facing routes.
- Keep browser regression runnable without production secrets.
- Support controlled/mock API responses when Trello, Google Calendar, Google Tasks, or Paperclip credentials are unavailable.
- Check route load, console errors, page errors, and horizontal overflow for desktop and mobile.
- Include route-specific assertions for Today, Review Queue, Tasks, Boards Monitor, Calendar, Planner, OKR / Portfolio, Weekly Focus, Settings, and Docs.
- Record the expected QA evidence format in docs.
- Preserve existing verification scripts and smoke checks.

### Out Of Scope

- Broad UI redesign.
- Production deployment.
- Live Paperclip standing enablement.
- W3 webhook hardening or service-auth changes.
- Changing runtime secrets, Cloudflare policy, or credential storage.
- Replacing Trello as the execution surface.
- Automatic Trello, Calendar, or Google Tasks writes outside explicit existing user actions.
- Merging this branch into W3 or merging W3 into this branch.

---

## Route Matrix

Minimum route matrix for the regression gate:

| Route | Required checks |
|---|---|
| `/today` | Route loads, Today top-work cues visible, Trello disconnected state remains product-facing when mocked disconnected |
| `/review` | Review Queue loads, pending/processed states render, human approval gate copy remains clear |
| `/all` | Tasks load, source/context/owner/due/status/next-action cues remain visible |
| `/boards` | Boards Monitor loads, hidden-board filtering can be validated with controlled fixture |
| `/calendar` | Calendar connected/disconnected state renders without console/page errors |
| `/planner` | Google Tasks/Trello Planner separation renders, disconnected state remains clear |
| `/okr` | OKR / Portfolio route loads without overflow |
| `/focus` | Weekly Focus route loads and Review Queue path remains visible when pending review exists |
| `/settings` | Settings loads connection surfaces without exposing secrets |
| `/docs` | Docs route loads, mock Paperclip trace labels remain readable, live enablement is not implied |

---

## Likely Implementation Scope

These files are likely relevant. Dev must verify before editing.

| Area | Likely file(s) | Why |
|---|---|---|
| Browser regression script | `scripts/` | Existing verification commands live here and should remain discoverable through `package.json`. |
| Package command | `package.json` | Add one clear `npm.cmd run ...` command if a new gate is implemented. |
| Test strategy docs | `docs/testing/TEST_STRATEGY.md` | Document how to run and interpret browser regression evidence. |
| V0.3 findings / QA logs | `docs/logs/V0_3_RUX_FINDINGS.md`, `docs/logs/QA_LOG.md` | Record route matrix evidence and acceptance state. |
| Frontend routes | `public/js/pages/*`, `public/app.js`, `public/style.css` | Only edit if the browser gate exposes a concrete regression that is inside RUX-05 scope. |

---

## Acceptance Criteria

- A single repeatable browser regression command exists or the existing command set is clearly documented as the gate.
- The gate can run without production secrets using controlled responses or local mock fixtures.
- Desktop and mobile viewports are checked.
- Console errors, page errors, and horizontal overflow are captured.
- Core route matrix covers `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, and `/docs`.
- RUX-02A Trello connection-state copy, RUX-03 trace clarity, and RUX-04 Today/Tasks decision-flow cues are included in regression assertions where relevant.
- No live Paperclip enablement, W3 service-auth/runtime change, secret exposure, broad UI redesign, or automatic write side effect occurs.
- V0.3/W3 branch boundary remains intact.

---

## Verification Expectations

Minimum verification:

```powershell
node server.js
npm.cmd run check:all
npm.cmd run verify:rux-trello
npm.cmd run verify:rux-ai-trace
npm.cmd run verify:rux-decision-flow
```

If a new browser regression command is added, run it and record:

- route matrix result
- desktop/mobile result
- horizontal overflow result
- console/page error result
- controlled API fixture boundary
- confirmation that no production secrets or private credentialed URLs were used

---

## Implementation Summary

`V0.3-RUX-05` added a repeatable browser regression gate:

```powershell
npm.cmd run verify:rux-browser-regression
```

The gate:

- Starts a temporary local Task Hub server with a temporary `APP_DATA_DIR`.
- Uses Playwright with controlled API fixtures instead of production credentials.
- Checks desktop `1440x960` and mobile `390x844` viewports.
- Covers `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, and `/docs`.
- Captures console errors, page errors, and horizontal overflow.
- Validates RUX-02A Trello disconnected copy, RUX-03 Docs trace labels, and RUX-04 Today/Tasks decision-flow cues where relevant.
- Cleans up temporary runtime data after the run.

No live Paperclip enablement, W3 webhook/service-auth/runtime change, secret exposure, broad UI redesign, or automatic write side effect was introduced.

---

## Verification Result

| Check | Result |
|---|---|
| RED: `npm.cmd run verify:rux-browser-regression` before implementation | Failed as expected with missing script |
| `npm.cmd run verify:rux-browser-regression` | Pass |
| Route matrix | Pass for `/today`, `/review`, `/all`, `/boards`, `/calendar`, `/planner`, `/okr`, `/focus`, `/settings`, `/docs` |
| Desktop/mobile viewports | Pass |
| Horizontal overflow | Pass |
| Console/page errors | Pass |
| Controlled fixture boundary | Pass - no production secrets required |

---

## Next Recommended Session

```text
Role: PM
Task: Review and accept V0.3-RUX-05 Browser Regression + Responsive QA Gate.

Read:
- docs/plans/VERSION_0_3_RUX_05_BROWSER_REGRESSION_RESPONSIVE_QA_GATE.md
- docs/testing/TEST_STRATEGY.md
- docs/logs/V0_3_RUX_FINDINGS.md
- docs/reference/AI_AGENT_GOVERNANCE.md

Guardrails:
- Confirm the browser regression command is repeatable and does not require production secrets.
- Confirm the route matrix and desktop/mobile evidence meet acceptance.
- Do not expose secrets, auth headers, tokens, or private credentialed URLs.
- Do not enable live Paperclip.
- Do not change W3 webhook/service-auth/runtime behavior.
- Do not merge W3/V0.3 branches.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Routed `V0.3-RUX-05` after PM accepting `V0.3-RUX-04` at `d72f979` | Codex PM |
| 2026-05-14 | Implemented and verified repeatable browser regression gate; routed to PM review | Codex Dev / QA |
