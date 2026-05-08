# Version 0.2 W3 Paperclip Multi-Agent Integration Contract Plan

**Doc Role:** W3-owned discovery and contract plan
**Status:** Draft for PM / QA review
**Version:** V0.2 W3
**Owner:** Integration Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex Dev
**Related Docs:** `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `VERSION_0_2_PARALLEL_WORKSTREAM_PROMPTS.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../../MVP_PRD.md`

---

## Scope Guardrails

This W3 plan covers Paperclip multi-agent integration discovery, contracts, mock verification, and audit requirements only.

In scope:

- Contract-first inbound task handoff from Paperclip into Task Hub review sessions.
- Adapter boundary for future Paperclip live connector work.
- Mock adapter verification before any live external Paperclip calls.
- Attribution and audit trail requirements for multi-agent traceability.

Out of scope:

- W1 company access, deployment, auth, or teammate onboarding.
- W2 visual redesign, navigation redesign, or UI styling implementation.
- Live Paperclip API/webhook calls before mock contract verification passes.
- Changes to existing Trello, Google Calendar, Google Tasks, or current app behavior.

Implemented by: Codex Dev

---

## Current Integration Touchpoints

| Touchpoint | Current file | Current role | W3 implication |
|---|---|---|---|
| Review session creation | `src/routes/review.routes.js` `POST /api/reviews` | Creates local review sessions and resolves task diff when target board is supplied. | Primary inbound handoff target for Paperclip-generated tasks, but Paperclip should enter through a dedicated adapter route or service wrapper instead of calling store internals directly. |
| Task diff | `src/routes/review.routes.js` `POST /api/task-diff`; `task-diff.js` | Compares candidate task title to active Trello cards and returns `create_new`, `update_existing`, or `possible_duplicate`. | Paperclip payloads must preserve enough source context to explain why an agent proposed create/update/duplicate. |
| Review store | `review-store.js`; `review-sessions.json` | Local JSON persistence for sessions and pending/approved/rejected tasks. | Needs contract fields for source attribution, request id, agent identity, agent run id, and audit events before multi-agent use. |
| Approval path | `src/routes/review.routes.js` task approve and bulk approve routes | Approval updates task status and pushes approved tasks to Trello. | Must remain human-gated; Paperclip can propose tasks but cannot bypass approval in W3. |
| Trello adapter | `trello.js`; `src/routes/trello.routes.js` | Existing live Trello CRUD, comments, labels, custom fields, and all-cards reads. | W3 contract should use existing Trello abstractions after approval, not add a second direct Trello path. |
| Calendar sync hook | `src/routes/review.routes.js` `pushTaskToTrello`; `src/routes/trello.routes.js` card create/update | Optional Calendar sync after card create/update. | Paperclip contract may set `syncCalendar`, but sync still runs only after human approval. |
| Frontend Review Queue | `public/js/pages/review.js` | Displays review sessions, editable fields, diff confidence, approve/reject, and manual transcript session creation. | Later UI can surface Paperclip agent/source metadata without changing review decision flow. |
| Weekly Focus agent signal | `public/app.js` Weekly Focus View | Groups AI/agent work by keyword signals and pending review count. | Attribution fields should eventually replace keyword-only detection for agent-originated tasks. |

---

## Proposed Contract Boundary

Use an internal Task Hub adapter contract first, then bind it to Paperclip later.

Recommended first implementation target:

```text
Paperclip mock fixture -> Paperclip adapter service -> Task Hub review session -> existing Review Queue -> human approval -> existing Trello/Calendar path
```

Do not let Paperclip call Trello, Google Calendar, or Google Tasks directly through this app. Task Hub remains the human review and approval boundary.

### Adapter Shape

Create a small adapter module in a later implementation pass:

```text
src/integrations/paperclip/
  contract.js
  mock-adapter.js
  normalizer.js
  audit.js
  fixtures/
```

Initial route options:

- `POST /api/integrations/paperclip/mock/review-session`
  - Dev-only/mock-only route.
  - Reads a contract payload and creates a review session using existing review session semantics.
- `POST /api/integrations/paperclip/webhook`
  - Future live route.
  - Must stay disabled until W3 mock verification and W1 access/auth decisions are complete.

The mock route should be the only route implemented before live connector work. The future webhook route should be documented but not wired to external calls until PM/QA approve the mock contract.

---

## Inbound Contract Draft

Paperclip should submit one work packet per agent run or coordination event.

```json
{
  "contractVersion": "paperclip.taskhub.v0.2",
  "requestId": "pc_req_20260508_001",
  "source": {
    "system": "paperclip",
    "environment": "mock",
    "workspaceId": "paperclip_workspace_id",
    "threadId": "paperclip_thread_id"
  },
  "agent": {
    "agentId": "agent_strategy_01",
    "agentName": "Paperclip Strategy Agent",
    "agentRole": "strategy",
    "runId": "run_20260508_001",
    "parentRunId": null
  },
  "reviewSession": {
    "title": "Paperclip handoff - Weekly Marketing Sync",
    "summary": "Summary generated by Paperclip.",
    "transcript": "Optional source text or reference excerpt.",
    "sourceUrl": "https://paperclip.local/runs/run_20260508_001",
    "sourceCreatedAt": "2026-05-08T07:00:00.000Z"
  },
  "tasks": [
    {
      "externalTaskId": "pc_task_001",
      "title": "Prepare campaign brief",
      "description": "Context from Paperclip agent output.",
      "owner": "Name or Trello member id",
      "deadline": "2026-05-12T10:00:00.000Z",
      "priority": "high",
      "projectReference": "Project/Card reference",
      "targetBoardId": "trello_board_id",
      "targetListId": "trello_list_id",
      "confidence": 0.82,
      "syncCalendar": false,
      "syncGoogleTasks": false,
      "agentRationale": "Why this task was proposed.",
      "sourceEvidence": [
        {
          "type": "transcript_excerpt",
          "text": "Short excerpt only.",
          "sourceOffset": 123
        }
      ]
    }
  ]
}
```

### Contract Rules

- `contractVersion`, `requestId`, `source.system`, `agent.agentId`, `agent.agentName`, `agent.runId`, `reviewSession.title`, and at least one task title are required.
- `source.environment` must be `mock` until live connector work is explicitly approved.
- `requestId` must be idempotent. Re-submitting the same request must not create duplicate review sessions.
- Task Hub assigns internal `session.id` and `task.id`; Paperclip keeps `requestId`, `runId`, and `externalTaskId` for traceability.
- Dates must be ISO 8601 strings or `null`.
- `priority` must normalize to `low`, `medium`, or `high`.
- Paperclip may suggest `targetBoardId` and `targetListId`; the reviewer can still edit them before approval.
- Paperclip may suggest `syncCalendar` and `syncGoogleTasks`, but approval remains the only point where external task/calendar side effects can happen.
- Raw transcript text should be bounded. Large artifacts should be passed by source reference once W1 access/security decisions exist.

---

## Review Store Extensions Needed

Before live Paperclip connector work, the review session and task model should grow without breaking current sessions.

Session-level fields:

- `source`: keep existing string for UI compatibility; allow `paperclip_mock` and future `paperclip_webhook`.
- `externalSource`: object containing `system`, `environment`, `workspaceId`, `threadId`, `sourceUrl`, and `sourceCreatedAt`.
- `requestId`: Paperclip idempotency key.
- `agent`: object containing `agentId`, `agentName`, `agentRole`, `runId`, and `parentRunId`.
- `auditTrail`: append-only array of normalized audit events.

Task-level fields:

- `externalTaskId`.
- `agentRationale`.
- `sourceEvidence`.
- `createdByAgent`: compact copy of agent id/name/run id.
- `auditTrail`: append-only task-specific events.

Backward compatibility:

- Existing review sessions without these fields must still load.
- Existing UI should continue to rely on current task fields until W2 or a later W3 UI pass adds source display.
- Existing approval/reject semantics must not change.

---

## Audit Trail Requirements

Every Paperclip-originated session should preserve a trace from agent proposal to human decision to Trello side effect.

Minimum session events:

| Event | Actor | Required fields |
|---|---|---|
| `paperclip_payload_received` | system | `requestId`, `contractVersion`, `agent.runId`, received timestamp |
| `review_session_created` | system | internal session id, source environment, task count |
| `task_diff_resolved` | system | task id, external task id, diff status, matched card id, confidence, match reason |
| `task_field_updated` | user/system | task id, changed field, previous value hash or redacted value, new value hash or redacted value |
| `task_approved` | user | task id, reviewer identity if available, timestamp |
| `task_rejected` | user | task id, reviewer identity if available, timestamp |
| `trello_push_attempted` | system | task id, action type, target list/card id |
| `trello_push_succeeded` | system | task id, Trello card id |
| `trello_push_failed` | system | task id, friendly error, retryable flag |

Storage requirement:

- Append audit data to local review session records for V0.2.
- Do not store secrets, full auth headers, or raw external credentials.
- Keep full text evidence bounded; store source references for large content.
- The review UI may initially hide audit details, but the data should be available from `GET /api/reviews/:id` for QA inspection.

Attribution display requirement for later UI:

- Session header should eventually show `Paperclip`, agent name, agent role, and run id.
- Each task should eventually show proposed-by agent metadata and rationale.
- Approved Trello cards should receive a comment or metadata note only after the mock path proves the wording and idempotency behavior. Do not add Trello comments in the contract-only pass.

---

## Mock Adapter Verification Plan

The mock adapter must pass before live connector work begins.

### Fixtures

Add fixtures in a later implementation pass:

- `valid-paperclip-review-session.json`
- `duplicate-request-id.json`
- `missing-required-fields.json`
- `invalid-task-dates.json`
- `large-evidence-truncated.json`
- `multi-agent-parent-child-run.json`

### Verification Cases

| Case | Expected result |
|---|---|
| Valid mock payload | Creates one review session with `source=paperclip_mock`, required attribution fields, and pending tasks. |
| Duplicate `requestId` | Returns existing session or `409` with existing session id; does not create duplicate tasks. |
| Missing required fields | Returns `400` with field-level validation errors; store is unchanged. |
| Invalid dates or priority | Returns `400` or normalized output according to contract; no silent malformed data. |
| Task with board id | Runs existing task diff and persists diff status, confidence, and match reason. |
| Task without board id | Creates pending task with `create_new` semantics and no Trello call. |
| Approve mocked task without target list | Marks approved but skips Trello push with existing skipped result. |
| Approve mocked task with target list | Uses existing approval path; no Paperclip live call is made. |
| Reject mocked task | Marks rejected and records audit event. |
| Large evidence | Stores bounded evidence or reference, not unbounded raw text. |

### Required Commands

Documentation-only W3 discovery can skip runtime checks. Once mock adapter code is added, W3 QA should run:

```powershell
node server.js
npm.cmd run check:all
node scripts/verify-paperclip-mock.js
```

The future `verify-paperclip-mock.js` should:

- Reset or isolate `review-sessions.json` test data.
- Submit mock fixtures through HTTP, not store internals.
- Assert response status and persisted session/task fields.
- Assert no live Paperclip network call is attempted.
- Assert no Trello/Calendar side effect happens until approval routes are explicitly invoked.
- Restore any local fixture data after the run.

---

## Implementation Sequence

1. Contract data definitions
   - Add a pure validator/normalizer for Paperclip payloads.
   - Add fixture files and unit-level validation checks.
   - No server route or external calls yet.

2. Mock route
   - Add `POST /api/integrations/paperclip/mock/review-session`.
   - Route accepts only `source.environment=mock`.
   - Route calls the normalizer and then the existing review session creation flow.

3. Idempotency and audit store
   - Extend review store with backward-compatible `requestId`, `agent`, `externalSource`, and `auditTrail`.
   - Add idempotency lookup by `requestId`.

4. Mock verification script
   - Add `scripts/verify-paperclip-mock.js`.
   - Exercise mock route and persisted output.
   - Confirm no live external connector work.

5. QA handoff
   - Provide fixture names, command outputs, and changed files.
   - Mark live webhook as blocked until W1 access/security decisions and PM approval.

6. Future live connector
   - Add authenticated `POST /api/integrations/paperclip/webhook`.
   - Use the same normalizer and audit path.
   - Add replay protection and source signature checks once Paperclip auth details are known.

---

## Open Questions for PM / Paperclip Owner

- What stable Paperclip identifiers are available: workspace id, thread id, run id, agent id, task id?
- Will Paperclip call Task Hub by webhook, or will Task Hub poll Paperclip?
- What auth/signature scheme will Paperclip support for live webhooks?
- Should Paperclip payloads include raw transcript text, source artifact links, or both?
- What reviewer identity should be recorded before W1 multi-user access exists?
- Should approved Trello cards receive a Paperclip attribution comment, label, or custom field after mock verification?
- What retention rule should apply to rejected Paperclip tasks and source evidence?

---

## Acceptance Criteria for W3 Discovery

- Required Paperclip integration touchpoints are identified.
- Contract-first adapter plan is documented.
- Mock verification gate is defined before live connector work.
- Attribution and audit trail requirements are explicit.
- W1 deployment/access and W2 UI redesign remain untouched.
- No live external calls are introduced.
- Existing app behavior is preserved.
- Implemented by Codex Dev.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created W3 Paperclip integration discovery and contract plan | Codex Dev |
