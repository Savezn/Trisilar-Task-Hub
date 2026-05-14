# V0.3-RUX-02A Trello Connection State + Failure Copy

**Doc Role:** Scoped Dev / UX / Runtime handoff for first V0.3 RUX implementation task
**Status:** Implemented - QA pass; ready for PM acceptance
**Owner:** Runtime / UX / Frontend
**Created:** 2026-05-14
**Last Updated:** 2026-05-14 - **Updated by:** Codex Dev / UX / Runtime
**Related Docs:** `VERSION_0_3_PRODUCT_RELIABILITY_UX_STABILIZATION_PLAN.md`, `VERSION_0_3_RUX_01_ISSUE_INTAKE_RELIABILITY_BASELINE.md`, `../../CURRENT_SPRINT.md`, `../logs/V0_3_RUX_FINDINGS.md`, `../testing/TEST_STRATEGY.md`

---

## PM Triage Decision

PM groups `RUX-001` and `RUX-002` into one scoped implementation task because both come from the same user-facing failure chain:

```text
Trello auth/API request fails
-> global/status surfaces still imply connected/ready
-> affected routes show developer-facing .env/API-key wording
-> user cannot tell whether to reconnect, retry, contact Runtime, or continue with partial data
```

`RUX-003` remains triaged for later `V0.3-RUX-03` AI trace clarity work and is not part of this task.

---

## Scope

### In Scope

- Clarify Trello connection state when credentials are missing, invalid, or failing API verification.
- Update user-facing copy on Trello-dependent routes so it names the ownership boundary without exposing internal `.env` wording.
- Preserve existing Trello API behavior and hidden-board/workspace filtering.
- Preserve Review Queue human approval behavior.
- Add or update focused browser evidence for affected routes on desktop and mobile.

### Out Of Scope

- Replacing Trello as execution source of truth.
- Changing runtime secrets or committing any secret values.
- W3 Paperclip live enablement or Paperclip webhook changes.
- Broad route redesign beyond connection-state and failure-copy clarity.
- Merging this branch into W3 or merging W3 into this branch.

---

## Likely Investigation Scope

These files are likely relevant based on repo search. Dev must verify before editing.

| Area | Likely file(s) | Why |
|---|---|---|
| Backend friendly Trello error | `src/utils/errors.js` | Current user-facing text includes API key / `.env` wording. |
| Settings connection card | `public/js/pages/settings.js` | Current Settings card can show Trello `Connected` or `Ready` based on board count, not verified auth state. |
| Initial app status | `public/app.js` | Initial status calls `/api/boards` and may hide failed Trello verification. |
| Trello-dependent routes | `public/js/pages/today.js`, `public/js/pages/all-tasks.js`, `public/js/pages/boards.js`, `public/js/pages/okr.js`, `public/app.js` | Browser baseline showed route-level Trello failure states here; Weekly Focus is implemented in `public/app.js`. |
| Trello API route behavior | `src/routes/trello.routes.js`, `trello.js` | Runtime/API layer may need a status shape that distinguishes configured vs verified vs invalid. |

---

## Acceptance Criteria

- When Trello API verification fails with unauthorized/invalid credentials, no visible app surface reports Trello as connected or ready.
- Affected routes explain the state in product language, for example Runtime setup or Trello credential verification is needed, without exposing internal `.env` wording in the main UI.
- Today, Tasks, Boards Monitor, OKR / Portfolio, Weekly Focus, and Settings preserve useful route context when Trello is unavailable.
- Calendar, Planner, Review Queue, and Docs routes are not regressed by the connection-state change.
- No secret values, auth headers, tokens, or private credentialed URLs appear in UI, docs, logs, or tests.
- V0.3/W3 branch boundary remains intact.

---

## Verification Expectations

Minimum verification for implementation:

```powershell
node server.js
npm.cmd run check:all
```

Focused browser evidence:

- `/today`
- `/all`
- `/boards`
- `/okr`
- `/focus`
- `/settings`

Regression smoke:

- `/review`
- `/calendar`
- `/planner`
- `/docs`

Record:

- desktop and mobile route result
- horizontal overflow
- console/page errors
- Trello invalid-credential state text
- confirmation that no UI says Trello is connected/ready after auth failure

---

## Implementation Result

Completed on 2026-05-14:

- Added `/api/trello/status` so the app can distinguish `verified`, `invalid`, `disconnected`, and unavailable/rate-limited states without inferring health from board count.
- Updated Trello auth failure copy to avoid `.env` and API-key wording in user-facing UI.
- Added frontend Trello connection helpers and route-level product copy for Today, Tasks, Boards, OKR, Weekly Focus, and Settings.
- Updated sidebar and Settings Trello surfaces so disconnected or invalid Trello state is explicit and does not show false connected/ready copy.
- Preserved W3/Paperclip boundaries and did not change runtime secrets.

Verification passed:

- `npm.cmd run verify:rux-trello`
- `node scripts/verify-frontend.js`
- `PORT=3094 npm.cmd run check:all`
- Browser QA on `/today`, `/all`, `/boards`, `/okr`, `/focus`, and `/settings` across desktop/mobile: horizontal overflow `0`, console errors `0`, no `.env` or API-key UI wording, and no false Trello connected/ready state.
- Regression browser QA on `/review`, `/calendar`, `/planner`, and `/docs` across desktop/mobile: rendered content present, horizontal overflow `0`, console errors `0`, and page errors `0`.

---

## Next Recommended Session

```text
Role: PM
Task: Review and accept V0.3-RUX-02A Trello Connection State + Failure Copy.

Read:
- docs/plans/VERSION_0_3_RUX_02A_TRELLO_CONNECTION_STATE_FAILURE_COPY.md
- docs/logs/V0_3_RUX_FINDINGS.md
- docs/logs/QA_LOG.md

Guardrails:
- Accept or hold only `V0.3-RUX-02A`.
- Do not merge W3/V0.3 branches.
- Leave `RUX-003` for later `V0.3-RUX-03`.
- Confirm no secrets or private credential values were recorded.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created PM triage handoff for grouped `RUX-001` and `RUX-002` implementation | Codex PM |
| 2026-05-14 | Implemented and verified `V0.3-RUX-02A`; routed to PM acceptance | Codex Dev / UX / Runtime |
