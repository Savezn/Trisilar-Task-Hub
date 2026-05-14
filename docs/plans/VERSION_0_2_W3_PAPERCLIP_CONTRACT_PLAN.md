# Version 0.2 W3 Paperclip Multi-Agent Integration Contract Plan

**Doc Role:** W3-owned discovery and contract plan
**Status:** `V0.2-W3-01` mock adapter accepted; `V0.2-W3-02` live connector code and live interop accepted; `V0.2-W3-03` controlled live enablement policy PM Accepted; true external sender window passed; standing dev/demo observation window active
**Version:** V0.2 W3
**Owner:** Integration Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-14 - **Updated by:** Codex PM / Runtime
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
- `V0.2-W3-02` live webhook work is now implemented and accepted after Paperclip runtime inputs and Task Hub service-token reachability were confirmed.
- W3 was merged into `dev` at `a89c26a`; permanent runtime enablement is intentionally separate from code merge.
- Runtime `PAPERCLIP_WEBHOOK_ENABLED` remains `false` after interop; permanent live enablement requires separate PM policy approval.
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

### Confirmed Runtime Inputs - 2026-05-14

These inputs unblock W3 live connector planning and implementation. They do not expose or replace secret values.

| Input | Value |
|---|---|
| Paperclip base URL | `https://paperclip.trisila.online` |
| Paperclip health path | `/healthz` |
| Allowed source id | `paperclip-do-dev` |
| Allowed environment | `dev` |
| Paperclip local runtime port | `3100` |
| Paperclip service | `paperclip.service` |
| Task Hub service-token reachability | From the Paperclip server, `GET https://taskhub.trisila.online/healthz` with Cloudflare Access service-token headers returned `200` |

Still secret and excluded from docs/chat/git:

- Cloudflare Access Client ID.
- Cloudflare Access Client Secret.
- HMAC/webhook signing secret.

W3 implementation still needs to verify the actual webhook request generator can send the required headers and compute the agreed HMAC signature. Do not mark the live connector accepted until QA verifies signed webhook behavior.

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
- `source.environment` defaults to `mock` for mock/local verification; accepted live webhook requests may use approved runtime environment `dev` through the live route validation path.
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
| `V0.2-W3-02` | W3 sequence 2 | PM Accepted | Live webhook route, signed request validation, connection gate, idempotency, local QA, and live sender interop verified |
| `V0.2-W3-03` | W3 sequence 3 | PM Accepted | Controlled live enablement policy, rollback procedure, owner permissions, monitoring/audit expectations, and additional source signature/replay hardening after merge/integration acceptance |

Details:

- `V0.2-W3-01` completed pure validator/normalizer logic, fixture files, unit-level validation checks, `POST /api/integrations/paperclip/mock/review-session`, backward-compatible review-store attribution fields, idempotency lookup by `requestId`, and `scripts/verify-paperclip-mock.js`.
- `V0.2-W3-01` introduced no live Paperclip external calls.
- `V0.2-W3-02` added authenticated `POST /api/integrations/paperclip/webhook`, reused the same normalizer and audit path, validated service-auth/source context plus signed webhook headers, and kept the route disabled by default after QA/PM approval.
- Live interop evidence: HTTP `201` for request `pc_live_interop_20260514115714`; Review Queue session `5c5ad00e-d7b8-4c34-91d2-b17a1ca1566a`; created task stayed `pending`; runtime returned to `PAPERCLIP_WEBHOOK_ENABLED=false`.
- `V0.2-W3-03` is a policy/runbook gate before permanent enablement. It must not add a new Paperclip network call or bypass Review Queue human approval.
- Any older W3 sequence or W3-P label is an alias only; use canonical IDs first in new prompts, QA reports, PM updates, commit messages, and PR notes.

---

## V0.2-W3-03 Controlled Live Enablement Policy

Goal: allow the accepted Paperclip live webhook to be enabled in a controlled dev/demo runtime window only when PM, Runtime Owner, Paperclip Owner, and QA have agreed on the enablement checklist and rollback path.

Non-goals:

- Do not enable production traffic.
- Do not commit or print Cloudflare service-token values, HMAC signing secrets, or Paperclip runtime secrets.
- Do not add outbound Task Hub -> Paperclip calls.
- Do not let Paperclip create Trello cards, Calendar events, or Google Tasks without human Review Queue approval.
- Do not change W1 deployment/access or W2 visual redesign scope.

### Enablement Criteria

All criteria must be true before setting `PAPERCLIP_WEBHOOK_ENABLED=true` for a standing runtime window:

| Gate | Required evidence |
|---|---|
| Code baseline | `dev` includes W3 merge commit `a89c26a` or a later PM-approved commit. |
| Runtime baseline | Task Hub runtime is deployed from `dev`, service is healthy, and `APP_DATA_DIR` persistence is confirmed. |
| Feature flag baseline | `PAPERCLIP_WEBHOOK_ENABLED=false` is confirmed before the enablement change. |
| Settings gate | Paperclip Settings shows connected state with `hasSecret=true`; the secret value is not visible in frontend or API responses. |
| Paperclip sender | Paperclip Owner confirms the live sender uses Cloudflare Access service-token headers and the accepted HMAC canonical format. |
| Source allowlist | Runtime allows only approved source id `paperclip-do-dev` and environment `dev` unless PM records a new approved source. |
| Verification | `verify:paperclip-webhook`, `verify:paperclip-contract`, `verify:paperclip-mock`, `verify:paperclip-connection`, `verify:paperclip-docs`, `verify`, and `check:all` pass on the code baseline. |
| QA canary | A fresh signed live canary creates one pending Review Queue session and no duplicate on replay. |
| Human gate | Created tasks remain `pending`; no Trello, Calendar, or Google Tasks side effect occurs before approval. |
| Rollback owner | A named Runtime Owner is available to disable the flag, restart the service, rotate the secret, and block sender access if needed. |

### Owner Permissions

| Role | Allowed action | Not allowed |
|---|---|---|
| PM | Approve or hold a live enablement window; decide whether the window is temporary or standing. | Directly expose or store secrets in docs/chat/git. |
| Runtime Owner | Set `PAPERCLIP_WEBHOOK_ENABLED`, restart/redeploy Task Hub, rotate runtime secrets, and confirm service health. | Change Paperclip payload semantics or Review Queue approval rules. |
| Paperclip Owner | Enable/disable Paperclip sender, confirm source ids, send live canary payloads, and rotate sender-side secrets. | Send unbounded transcript dumps or bypass Task Hub webhook contract. |
| QA | Run local verification, live canary verification, replay/idempotency checks, and Review Queue human-gate checks. | Approve permanent enablement without PM decision. |
| Dev | Fix code defects found by QA and update tests/docs. | Enable runtime traffic as an implementation side effect. |

### Enablement Procedure

1. PM records an enablement window and names the Runtime Owner, Paperclip Owner, and QA owner.
2. Runtime Owner confirms Task Hub is on `dev@a89c26a` or later, service health is green, and `PAPERCLIP_WEBHOOK_ENABLED=false`.
3. QA runs the full W3 verification command set on the same code baseline.
4. Paperclip Owner confirms sender configuration: Task Hub URL, webhook path, Cloudflare Access service-token headers, source id, environment, request id, timestamp, agent run id, and HMAC signing format.
5. Runtime Owner sets `PAPERCLIP_WEBHOOK_ENABLED=true` in the runtime environment only and restarts/redeploys Task Hub if required.
6. QA runs one live canary from Paperclip with bounded excerpt data, `syncCalendar=false`, `syncGoogleTasks=false`, and a unique `requestId`.
7. QA confirms HTTP success, persisted audit trail, pending Review Queue task, and no external side effects.
8. QA replays the same `requestId` with the same payload and confirms no duplicate session.
9. QA sends or simulates a mismatched replay, invalid signature, timestamp-skew, and disallowed source/environment request if the runtime window permits negative testing.
10. PM either approves a standing dev/demo enablement window or instructs Runtime Owner to disable the flag after the test.

### Rollback Procedure

Use rollback immediately if invalid payloads are accepted, duplicate sessions are created, Review Queue human gate is bypassed, secrets are exposed, Paperclip sends unexpected data volume, or Task Hub health degrades.

1. Runtime Owner sets `PAPERCLIP_WEBHOOK_ENABLED=false` and restarts/redeploys Task Hub if the process reads env on start.
2. Paperclip Owner pauses the live sender.
3. Runtime Owner confirms the webhook returns disabled response for live requests.
4. Runtime Owner disconnects Paperclip Settings or rotates the shared webhook secret if signing trust is in doubt.
5. Runtime Owner disables or rotates Cloudflare Access service-token credentials if edge access trust is in doubt.
6. QA records affected `requestId`, `agentRunId`, session id, task ids, and audit events. Do not record secret values.
7. PM decides whether any pending interop-created Review Queue tasks should remain for inspection, be rejected manually, or be archived according to retention policy.
8. Dev receives a defect prompt only if code changes are required; otherwise the issue remains runtime/config owned.

### Monitoring And Audit Expectations

- Runtime logs may include request id, source id, environment, agent run id, result status, idempotency result, and error category.
- Runtime logs must not include HMAC secrets, Cloudflare Access secrets, full auth headers, or unbounded raw transcript text.
- Review session audit trail must include `paperclip_payload_received`, `review_session_created`, and task-level diff events for accepted payloads.
- Rejected live requests should be auditable by reason category: disabled flag, disconnected settings, missing secret, invalid signature, timestamp skew, disallowed source, disallowed environment, contract validation failure, duplicate mismatch, or unsupported payload.
- PM should review a short enablement report after the first standing window: accepted count, rejected count by reason, duplicate count, pending task count, approved task count, rejected task count, and any rollback events.

### Post-Interop Checklist Before Permanent Enablement

- W3 branch is merged into `dev` and deployed from `dev`.
- Paperclip Settings connection is enabled with a write-only shared secret.
- `PAPERCLIP_WEBHOOK_ENABLED=true` is approved for the named window only.
- Paperclip Owner confirms live sender version and sample payload shape.
- QA confirms live canary, replay/idempotency, audit trail, and Review Queue pending state.
- PM records whether the runtime should stay enabled, be disabled after the test, or move to another limited observation window.
- If enabled beyond a single test, PM records who owns daily monitoring and who can execute rollback.

### V0.2-W3-03 Acceptance Criteria

- Controlled enablement policy is documented in W3 and V0.2 planning docs.
- Runtime enablement requires PM approval and named Runtime Owner.
- Rollback has clear owner actions and includes feature flag, Paperclip sender, shared secret, and Cloudflare service-token controls.
- Monitoring/audit rules preserve traceability without leaking secrets or unbounded source text.
- Human Review Queue approval remains the only path to Trello/Calendar/Google side effects.
- Default runtime policy remains `PAPERCLIP_WEBHOOK_ENABLED=false` unless PM explicitly approves a live window.

PM acceptance:

- `V0.2-W3-03` policy is accepted as the required gate before any standing live runtime enablement.
- Acceptance does not itself enable `PAPERCLIP_WEBHOOK_ENABLED=true`.
- Next runtime work must be a named limited enablement window with Runtime Owner, Paperclip Owner, and QA owner recorded before the flag changes.

Limited window result:

- Runtime-local signed canary window passed on Task Hub `dev@a89c26a`.
- `PAPERCLIP_WEBHOOK_ENABLED=true` was loaded only for the window, then returned to `false`.
- Canary request `pc_w3_03_window_20260514062346` returned HTTP `201`.
- Review Queue session `7dd7d2a3-377c-4336-ba75-ba1c312635d2` was created with task status `pending`.
- Same-payload replay returned idempotent success; changed replay returned `409`; invalid signature returned `401`; invalid source returned `403`; invalid environment returned `400`.
- Final health check returned `200`; final disabled probe returned `403`.
- The limited window did not re-run the external Cloudflare service-token sender path; earlier live interop remains the evidence for that path.

PM post-window decision:

- Hold standing enablement.
- Keep `PAPERCLIP_WEBHOOK_ENABLED=false`.
- Schedule one true external Paperclip sender window before any standing dev/demo enablement.
- Runtime Owner opens/closes the feature flag and owns rollback.
- Paperclip Owner sends the live payload from the actual Paperclip sender through Cloudflare Access service-token and HMAC signing.
- QA Owner verifies pending task creation, same-payload replay, invalid signature, invalid source, and invalid environment.

True external sender window result:

- Window: `V0.2-W3-03 true external Paperclip sender window 2026-05-14`.
- Sender path: Paperclip runtime host/env sent to the public Task Hub Cloudflare URL with Cloudflare Access service-token headers and Task Hub HMAC headers.
- Task Hub runtime: `dev@a89c26a`.
- `PAPERCLIP_WEBHOOK_ENABLED=false` before the window, `true` only during the window, and `false` after rollback.
- Request `pc_true_external_20260514064709` and agent run `run_true_external_20260514064709` returned HTTP `201`.
- Review Queue session `0e8f8b2e-d767-44ef-854c-538481c124c8` was created with task `ef72316d-148d-4c4a-b600-fc5bb14da928` and status `pending`.
- Same-payload replay returned `200`; changed-payload replay returned `409`; invalid signature returned `401`; invalid source returned `403`; invalid environment returned `400`.
- Final health check returned `200`; final disabled probe returned `403` with `Paperclip live webhook is disabled`.
- At this point, standing enablement remained held until PM approved the later standing dev/demo observation window.

Standing dev/demo enablement planning decision:

- Planning started with runtime disabled until PM accepted the standing policy and confirmed owners.
- PM later accepted the standing policy and started a named dev/demo observation window.
- Standing enablement is dev/demo only; it is not production, not a `main` merge, and not permission for auto-approval or external side effects before human Review Queue approval.

Plain-language PM summary:

ตอนนี้ W3 พิสูจน์แล้วว่า Paperclip ส่งงานเข้า Task Hub ได้จริงผ่านทางที่ปลอดภัยกว่าการ hardcode คือผ่าน Cloudflare Access และ HMAC signature งานที่ส่งเข้ามาถูกบันทึกพร้อม audit/trace และเข้า Review Queue เป็นสถานะ `pending` เท่านั้น คนยังต้องตรวจและ approve ก่อนถึงจะเกิดผลกับ Trello, Calendar, หรือ Google Tasks

เหตุผลที่ยังไม่เปิด `PAPERCLIP_WEBHOOK_ENABLED=true` แบบถาวร คือการเปิดถาวรแปลว่า Task Hub จะยอมรับงานจาก Paperclip ได้ตลอดช่วง dev/demo ดังนั้นต้องมี owner คอยดู, วิธีปิดกลับทันที, และเงื่อนไขหยุดที่ทุกคนเข้าใจตรงกันก่อน การวาง policy รอบนี้จึงเป็นขั้นก่อนเปิดใช้งานยืนระยะ ไม่ใช่การเปิด live production

Named owner plan:

| Owner | Named role for standing policy | Responsibility |
|---|---|---|
| PM Owner | Codex PM / project PM | Approve or hold standing dev/demo enablement and review weekly summary before any broader rollout. |
| Monitor Owner | QA Owner | Run daily/weekly monitoring checklist, inspect Review Queue samples, and report abnormal accepted/rejected payload patterns. |
| Rollback Owner | Runtime Owner | Disable `PAPERCLIP_WEBHOOK_ENABLED`, restart/redeploy Task Hub if needed, pause trust paths, and confirm disabled webhook response. |
| Paperclip Owner | Paperclip runtime sender owner | Keep sender bounded to approved source/environment, pause sender on rollback, and rotate sender-side secret if requested. |

Daily monitoring checklist while standing dev/demo enablement is active:

1. Confirm Task Hub `/healthz` returns `200`.
2. Confirm `PAPERCLIP_WEBHOOK_ENABLED=true` only if a PM-approved standing window is active.
3. Review Paperclip-originated Review Queue sessions created since the previous check.
4. Confirm every Paperclip-created task remains `pending` until a human approves or rejects it.
5. Check accepted/rejected webhook counts by reason category, including invalid signature, source, environment, contract validation, and duplicate mismatch.
6. Check duplicate request handling: same-payload replay should not create a new session; changed-payload replay should remain rejected.
7. Confirm no secret values, service-token values, auth headers, or unbounded transcript text appear in docs, logs, browser responses, or screenshots.

Weekly monitoring checklist:

1. Summarize accepted payload count, rejected payload count by reason, replay count, duplicate mismatch count, pending tasks, approved tasks, rejected tasks, and rollback events.
2. Review a sample of Paperclip audit trails for request id, source id, environment, agent run id, session id, and task id traceability.
3. Confirm Paperclip sender still uses only approved source id `paperclip-do-dev` and environment `dev`.
4. Confirm Paperclip Settings still reports connected state with `hasSecret=true` without returning the secret value.
5. Decide whether to continue standing dev/demo enablement, narrow it to named test windows, or disable it.

Stop conditions:

- Any invalid payload is accepted.
- Duplicate request handling creates an incorrect duplicate session.
- Review Queue human approval gate is bypassed.
- Task Hub health degrades, service restarts repeatedly, or `/healthz` fails.
- Paperclip sends unexpected, unbounded, or production-like sensitive source data.
- Secret, service-token, signing header, or runtime credential exposure is suspected.
- Paperclip source id or environment differs from the PM-approved allowlist.
- Trello, Google Calendar, or Google Tasks side effects occur before human approval.

Rollback steps:

1. Runtime Owner sets `PAPERCLIP_WEBHOOK_ENABLED=false`.
2. Runtime Owner restarts/redeploys Task Hub if the process reads env on start.
3. Paperclip Owner pauses the Paperclip sender.
4. Runtime Owner confirms the webhook returns disabled response for live requests.
5. Runtime Owner rotates the shared webhook secret if signing trust is in doubt.
6. Runtime Owner disables or rotates Cloudflare Access service-token credentials if edge access trust is in doubt.
7. QA records affected request ids, agent run ids, session ids, task ids, and rejection categories without recording secret values.
8. PM decides whether any pending Paperclip-created tasks remain for inspection, are manually rejected, or are archived.

PM acceptance criteria for standing dev/demo observation:

- PM names Monitor Owner and Rollback Owner.
- Runtime Owner confirms Task Hub is deployed from `dev@a89c26a` or later and preflight flag is `false`.
- Paperclip Settings is connected with `hasSecret=true`; secret value remains write-only.
- Paperclip Owner confirms the live sender uses Cloudflare Access service-token headers and accepted HMAC canonical format.
- QA confirms the latest true external sender window evidence remains acceptable or reruns a canary if runtime/config changed.
- Monitoring checklist, stop conditions, and rollback steps are recorded in this plan and `CURRENT_SPRINT.md`.
- PM explicitly records the named dev/demo observation window before Runtime Owner enables the flag.

Standing dev/demo observation window start result:

- PM accepted the standing dev/demo policy and named `V0.2-W3-03 Standing Dev/Demo Observation Window - 2026-05-14`.
- Runtime Owner confirmed Task Hub was on `dev@a89c26a`, service health was `200`, Paperclip Settings was connected with `hasSecret=true`, and preflight flag was `PAPERCLIP_WEBHOOK_ENABLED=false`.
- Runtime Owner set `PAPERCLIP_WEBHOOK_ENABLED=true` for the named dev/demo observation window.
- Standing observation request `pc_standing_observation_20260514092342` and agent run `run_standing_observation_20260514092342` returned HTTP `201`.
- Review Queue session `884fec91-26e9-40e9-91af-6a11f91f317f` was created with task `025630e8-d52b-4ef3-b7ac-0cb858342497` and status `pending`.
- Same-payload replay returned `200`; changed-payload replay returned `409`; invalid signature returned `401`; invalid source returned `403`; invalid environment returned `400`.
- Post-start Task Hub health returned `200`.
- Runtime remains `PAPERCLIP_WEBHOOK_ENABLED=true` only for this dev/demo observation window; rollback owner must set it to `false` immediately if any stop condition occurs.

---

## Open Questions for PM / Paperclip Owner

- Which stable Paperclip identifiers are available for workspace id, thread id, run id, agent id, and task id?
- Can the hosted Paperclip runtime compute HMAC-SHA256 signatures over the raw request body or agreed canonical payload in the live webhook client code?
- Should Paperclip payloads include raw transcript text, source artifact links, or both?
- What reviewer identity should be recorded before W1 multi-user access exists?
- Should approved Trello cards receive a Paperclip attribution comment, label, or custom field after mock verification?
- What retention rule should apply to rejected Paperclip tasks and source evidence?

Resolved runtime inputs:

- W3 should use Paperclip base URL `https://paperclip.trisila.online`.
- W3 should use Paperclip health path `/healthz`.
- Task Hub should allow source id `paperclip-do-dev`.
- Task Hub should allow environment `dev`.
- Paperclip runtime can reach Task Hub `/healthz` through Cloudflare Access service-token headers from the Paperclip server.

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
| 2026-05-14 | Recorded Paperclip runtime inputs, confirmed `/healthz`, and confirmed Task Hub service-token `/healthz` reachability from the Paperclip server; routed `V0.2-W3-02` live webhook connector | Codex PM / Runtime |
| 2026-05-14 | Accepted `V0.2-W3-02` live webhook connector code and live signed sender interop; kept runtime `PAPERCLIP_WEBHOOK_ENABLED=false` after test | Codex PM / Paperclip Owner / QA |
| 2026-05-14 | Planned and PM accepted `V0.2-W3-03` controlled live enablement policy with enablement criteria, rollback, owner permissions, monitoring/audit, and post-interop checklist; runtime gate remains disabled until a named live window starts | Codex PM |
| 2026-05-14 | Completed limited `V0.2-W3-03` runtime-local signed canary window; canary/replay/negative checks passed and runtime returned to `PAPERCLIP_WEBHOOK_ENABLED=false` | Codex Runtime Owner / QA |
| 2026-05-14 | PM held standing enablement and routed next to a true external Paperclip sender window with Runtime Owner, Paperclip Owner, and QA Owner | Codex PM |
| 2026-05-14 | Completed true external `V0.2-W3-03` Paperclip sender window from Paperclip runtime host/env through Cloudflare Access and HMAC; request `pc_true_external_20260514064709` created pending session `0e8f8b2e-d767-44ef-854c-538481c124c8`; replay/negative checks passed; runtime returned to `PAPERCLIP_WEBHOOK_ENABLED=false` | Codex Runtime Owner / Paperclip Owner / QA |
| 2026-05-14 | Started standing dev/demo enablement policy planning with Monitor Owner, Rollback Owner, daily/weekly monitoring, stop conditions, rollback steps, and PM acceptance criteria; runtime remains `PAPERCLIP_WEBHOOK_ENABLED=false` | Codex PM |
| 2026-05-14 | Started `V0.2-W3-03` standing dev/demo observation window; runtime is `PAPERCLIP_WEBHOOK_ENABLED=true`; canary/replay/negative checks passed and created pending session `884fec91-26e9-40e9-91af-6a11f91f317f` | Codex Runtime Owner / QA / Paperclip Owner |
