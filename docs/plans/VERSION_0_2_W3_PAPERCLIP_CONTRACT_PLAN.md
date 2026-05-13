# Version 0.2 W3 Paperclip Multi-Agent Integration Contract Plan

**Doc Role:** W3-owned discovery and contract plan
**Status:** `V0.2-W3-01` mock adapter accepted; live connector blocked while Paperclip server is offline and owner inputs remain unconfirmed
**Version:** V0.2 W3
**Owner:** Integration Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-13 - **Updated by:** Codex PM / Dev
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

PM runtime clarification:

- Task Hub is accepted as a stable hosted dev/demo URL on DigitalOcean behind Cloudflare at `https://taskhub.trisila.online`.
- Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner.
- `V0.2-W3-02` live webhook work must not start until the Paperclip server is online and Paperclip owner inputs are confirmed.
- Do not treat the old random ngrok Task Hub URL as a Paperclip endpoint.
- Do not add live Paperclip calls in W1 or W2.

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
  - Must stay disabled until W3 mock verification, W1 Task Hub access/auth decisions, and Paperclip runtime reachability are complete.

The mock route should be the only route implemented before live connector work. The future webhook route should be documented but not wired to external calls until PM/QA approve the mock contract.

### Runtime Topology Gate

Target topology:

```text
Task Hub target:
  https://taskhub.trisila.online
  DigitalOcean Droplet + Cloudflare hostname + Cloudflare Access/service-token policy

Paperclip target:
  https://paperclip.trisila.online
  Existing DigitalOcean runtime + Cloudflare hostname + service-auth policy
```

Selected live-connector path:

| Path | Requirement | W3 implication |
|---|---|---|
| Paperclip calls Task Hub webhook | Stable Task Hub hostname, Cloudflare Access service token, and signed webhook headers | Selected first live path because it preserves Task Hub as the human review boundary |
| Task Hub calls/polls Paperclip | Hosted Paperclip hostname and auth policy from Paperclip owner | Deferred; allowed only if W3 design later confirms polling is needed |
| Both services on one DigitalOcean account/runtime family | PM/owner approval, process isolation, env separation, and Cloudflare routes | Acceptable topology, but W3 still owns live connector code |

Cloudflare Access email login is suitable for human UI access only. Agent/API calls must not depend on interactive email login. The accepted W1-07 planning topology is:

1. Paperclip sends Cloudflare Access service-token headers to reach Task Hub through Cloudflare.
2. Paperclip also signs the webhook request for Task Hub app-level verification.
3. Task Hub creates or de-duplicates a review session.
4. Human reviewers approve/reject before Trello or Google side effects.

Recommended W3 live route:

```text
POST /api/integrations/paperclip/webhook
```

Recommended signed headers:

- `X-TaskHub-Request-Id`
- `X-TaskHub-Timestamp`
- `X-TaskHub-Signature`
- `X-Paperclip-Source`
- `X-Paperclip-Agent-Run-Id`

Recommended Task Hub env var names:

- `PAPERCLIP_WEBHOOK_ENABLED`
- `PAPERCLIP_WEBHOOK_SIGNING_SECRET`
- `PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS`
- `PAPERCLIP_ALLOWED_SOURCE_ID`
- `PAPERCLIP_ALLOWED_ENVIRONMENT`
- `PAPERCLIP_BASE_URL`
- `PAPERCLIP_HEALTH_PATH`
- `CLOUDFLARE_ACCESS_AUD`
- `CLOUDFLARE_ACCESS_TEAM_DOMAIN`

Recommended Paperclip env var names:

- `TASKHUB_BASE_URL`
- `TASKHUB_PAPERCLIP_WEBHOOK_PATH`
- `TASKHUB_WEBHOOK_SIGNING_SECRET`
- `TASKHUB_CF_ACCESS_CLIENT_ID`
- `TASKHUB_CF_ACCESS_CLIENT_SECRET`

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

Current fixtures:

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

W3 mock adapter QA should run:

```powershell
node server.js
npm.cmd run check:all
npm.cmd run verify:paperclip-contract
npm.cmd run verify:paperclip-mock
```

`verify-paperclip-mock.js` must:

- Reset or isolate `review-sessions.json` test data.
- Submit mock fixtures through HTTP, not store internals.
- Assert response status and persisted session/task fields.
- Assert no live Paperclip network call is attempted.
- Assert no Trello/Calendar side effect happens until approval routes are explicitly invoked.
- Restore any local fixture data after the run.

---

## Implementation Sequence

| Canonical ID | Alias | Status | Scope |
|---|---|---|---|
| `V0.2-W3-01` | W3 sequence 1 | Complete | Contract data definitions, mock adapter route, idempotency/audit persistence, and mock verification |
| `V0.2-W3-02` | W3 sequence 2 | Blocked / Future | Live webhook route after Paperclip server is online and owner inputs are confirmed |
| `V0.2-W3-03` | W3 sequence 3 | Future | Additional source signature/replay hardening after the first live webhook is verified |

Details:

- `V0.2-W3-01` completed pure validator/normalizer logic, fixture files, unit-level validation checks, `POST /api/integrations/paperclip/mock/review-session`, backward-compatible review-store attribution fields, idempotency lookup by `requestId`, and `scripts/verify-paperclip-mock.js`.
- `V0.2-W3-01` introduced no live Paperclip external calls.
- `V0.2-W3-02` should add authenticated `POST /api/integrations/paperclip/webhook`, reuse the same normalizer and audit path, and stay blocked until the Paperclip server is online, the Paperclip health/readiness path is confirmed, and Paperclip owner confirms service-token plus webhook-signing support.
- Any older W3 sequence or W3-P label is an alias only; use canonical IDs first in new prompts, QA reports, PM updates, commit messages, and PR notes.

---

## Open Questions for PM / Paperclip Owner

- What stable Paperclip identifiers are available: workspace id, thread id, run id, agent id, task id?
- What exact health/readiness path should W3 use for `https://paperclip.trisila.online`?
- Can the hosted Paperclip runtime send Cloudflare Access service-token headers?
- Can the hosted Paperclip runtime compute HMAC-SHA256 signatures over the raw request body or agreed canonical payload?
- What source/environment identifiers should Task Hub allow for the first live connector?
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
| 2026-05-08 | Implemented mock adapter route, idempotency/audit persistence, and mock verification | Codex Dev |
| 2026-05-08 | Created W3 Paperclip integration discovery and contract plan | Codex Dev |
| 2026-05-12 | Added runtime topology gate for DigitalOcean-hosted Task Hub; historical Paperclip localhost blocker later superseded by hosted Paperclip confirmation | Codex PM |
| 2026-05-12 | Updated W3 gate after PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare; live work now waits on Task Hub hosting plus service-auth verification | Codex PM |
| 2026-05-13 | Recorded W1-07 service-auth topology for W3: Paperclip calls Task Hub webhook through Cloudflare Access service token plus signed webhook headers; W3 live work remains blocked until QA/PM and Paperclip owner inputs | Codex PM / Dev |
| 2026-05-13 | Accepted W1-07 service-auth topology after PR #11 QA/PM pass and merge at `fa87ac4`; W3 live work now waits on Paperclip owner input confirmation | Codex PM |
| 2026-05-13 | Held W3 live connector planning while the Paperclip server is offline; non-blocked V0.2 work is routed back to W2-06 | Codex PM |
