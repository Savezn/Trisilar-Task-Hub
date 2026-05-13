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

## V0.2-W3-02 Live Webhook Plan While Paperclip Is Offline

Status: plan prepared; route implementation remains blocked until the Paperclip server is online and the Paperclip owner confirms runtime inputs.

This section converts the accepted `V0.2-W1-07` topology into the Task Hub inbound webhook implementation plan without adding live behavior. The live route must not be implemented, enabled, or deployed from this plan alone.

### Task Hub Inbound Webhook Contract

Planned endpoint:

```text
POST /api/integrations/paperclip/webhook
```

Inbound requirements:

- Accept only `Content-Type: application/json` requests whose raw body verifies before Task Hub trusts parsed JSON.
- Reuse the accepted `paperclip.taskhub.v0.2` payload contract and existing Paperclip normalizer/audit path.
- Require `requestId` in both `X-TaskHub-Request-Id` and the JSON body, and require the values to match exactly.
- Require `source.system=paperclip`.
- Require `source.environment` to match `PAPERCLIP_ALLOWED_ENVIRONMENT`.
- Require `X-Paperclip-Source` to match `PAPERCLIP_ALLOWED_SOURCE_ID` or the owner-approved source identifier.
- Require `X-Paperclip-Agent-Run-Id` to match `agent.runId` when Paperclip confirms it can provide a stable run id.
- Create only Review Queue sessions. Trello, Google Calendar, and Google Tasks side effects stay human-gated behind existing approve actions.
- Keep the existing mock route unchanged for verification: `POST /api/integrations/paperclip/mock/review-session`.

The route must additionally require the web-managed Paperclip connection gate:

- Runtime Paperclip connection state must be enabled/connected.
- `PAPERCLIP_WEBHOOK_ENABLED` must be truthy.
- The live signing secret must come from runtime configuration/secret management, not hardcoded source files.
- Disconnect in Settings must make the future live route reject new requests and must clear/disable the live signing secret path.

### Required Env Vars and Validation Rules

| Env var | Required when live enabled | Validation rule | Notes |
|---|---:|---|---|
| `PAPERCLIP_WEBHOOK_ENABLED` | Yes | Boolean-like `true`/`false`; default `false` | Live route rejects unless true and Settings connection state is enabled |
| `PAPERCLIP_WEBHOOK_SIGNING_SECRET` | Yes | Secret value present in runtime secret store; minimum 32 characters for live | Do not commit, log, or return to frontend/API responses |
| `PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS` | No | Integer, default `300`, allowed `60`-`900` | Reject stale or future timestamps outside skew |
| `PAPERCLIP_ALLOWED_SOURCE_ID` | Yes | Non-empty exact string match | Owner must confirm first live source id |
| `PAPERCLIP_ALLOWED_ENVIRONMENT` | Yes | Non-empty exact string match such as `dev` or `live` | Must match payload `source.environment` |
| `PAPERCLIP_BASE_URL` | No | Valid absolute `https://` URL if set | Diagnostics only; first live connector does not poll Paperclip |
| `PAPERCLIP_HEALTH_PATH` | Blocked input | Must start with `/` after owner confirms | Health/readiness path remains blocked while Paperclip is offline |
| `CLOUDFLARE_ACCESS_AUD` | Conditional | Non-empty exact Cloudflare Access audience if app-level JWT validation is added | Edge service-token validation remains the W1-07 requirement |
| `CLOUDFLARE_ACCESS_TEAM_DOMAIN` | Conditional | Cloudflare team domain if app-level JWT validation is added | Do not treat human email Access login as machine auth |

Startup/config validation for the future route should fail closed:

- If live is disabled, missing live env vars must not break the existing app or mock verification.
- If live is enabled and required env vars are missing or invalid, the live route must reject requests and expose a safe status message without leaking secret values.
- `/api/config` and Settings status responses must never return secret values.

### Cloudflare Access Service-Token Expectations

Paperclip-to-Task-Hub machine traffic must pass Cloudflare Access before reaching Task Hub:

- Paperclip sends `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers configured out of band in the Paperclip runtime.
- Cloudflare validates those service-token headers at the edge for `https://taskhub.trisila.online`.
- Missing or invalid service-token headers should be blocked by Cloudflare before the request reaches Express.
- Task Hub must never log service-token values.
- If Cloudflare forwards an Access JWT and W3 later adds app-level verification, Task Hub may validate `CLOUDFLARE_ACCESS_AUD` and `CLOUDFLARE_ACCESS_TEAM_DOMAIN`; this is hardening, not a replacement for the edge policy.
- Human Cloudflare Access email login remains only for the Task Hub web UI and must not be required for Paperclip/API calls.

### HMAC Canonical Signing Format

Paperclip must sign the exact raw request body bytes. Task Hub must verify the signature before trusting parsed JSON.

Required request headers:

- `X-TaskHub-Request-Id`
- `X-TaskHub-Timestamp`
- `X-TaskHub-Signature`
- `X-Paperclip-Source`
- `X-Paperclip-Agent-Run-Id`

Canonical values:

- `X-TaskHub-Timestamp`: Unix seconds as a base-10 string.
- `bodyHash`: lowercase hex SHA-256 of the raw request body bytes.
- `signature`: lowercase hex HMAC-SHA256 using `PAPERCLIP_WEBHOOK_SIGNING_SECRET`.

Canonical string to sign:

```text
v1
<timestamp>
<requestId>
<paperclipSource>
<bodyHash>
```

Signature header format:

```text
X-TaskHub-Signature: v1=<hexHmacSha256(canonicalString)>
```

Verification rules:

- Reject missing, duplicate, malformed, or unsupported-version signature headers.
- Reject timestamps outside `PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS`.
- Reject when header `requestId` does not match body `requestId`.
- Reject when source/environment headers and payload fields do not match configured allowlist values.
- Compare HMAC values with timing-safe equality.
- Persist the accepted `bodyHash`, `requestId`, source id, environment, Paperclip run id, and resulting Review Queue session id for audit.

### Idempotency and Replay Behavior

- `requestId` is the idempotency key.
- First valid request for a `requestId` creates one Review Queue session and records `requestId`, `bodyHash`, source id, environment, Paperclip run id, and review session id.
- Re-sending the same `requestId` with the same `bodyHash` must not create a duplicate session. The live route should return the existing review session id with an explicit duplicate/idempotent response so Paperclip retries do not create extra work.
- Re-sending the same `requestId` with a different `bodyHash` must be rejected, audited as a conflict, and must not create or mutate a review session.
- Requests outside timestamp skew are rejected even if the `requestId` is new.
- Task Hub must keep Review Queue approval as the only path to Trello/Google side effects.

### Blocked Inputs Before Route Implementation

Do not implement the live route until PM/owner records these inputs:

- Paperclip server is online and reachable at the Cloudflare-hosted base URL.
- Exact Paperclip health/readiness path for diagnostics.
- Confirmation that Paperclip can send Cloudflare Access service-token headers.
- Confirmation that Paperclip can compute HMAC-SHA256 over the agreed raw-body canonical format above, or a recorded replacement canonical format.
- Allowed source id and environment id values for the first live connector.
- Stable mapping for Paperclip workspace/thread/run/agent/task ids to Task Hub audit fields.
- One representative live payload sample from Paperclip for mapping review.

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
| `V0.2-W3-02` | W3 sequence 2 | Plan Ready / Implementation Blocked | Live webhook contract/env/auth/signing/replay plan prepared; route implementation waits for Paperclip server online and owner inputs |
| `V0.2-W3-03` | W3 sequence 3 | Future | Additional source signature/replay hardening after the first live webhook is verified |

Details:

- `V0.2-W3-01` completed pure validator/normalizer logic, fixture files, unit-level validation checks, `POST /api/integrations/paperclip/mock/review-session`, backward-compatible review-store attribution fields, idempotency lookup by `requestId`, and `scripts/verify-paperclip-mock.js`.
- `V0.2-W3-01` introduced no live Paperclip external calls.
- `V0.2-W3-02` now has a docs-only live webhook plan for inbound contract, env validation, Cloudflare Access service-token expectations, HMAC signing, and replay/idempotency. It must stay implementation-blocked until the Paperclip server is online, the Paperclip health/readiness path is confirmed, and Paperclip owner confirms service-token plus webhook-signing support.
- Web-managed Paperclip connection settings were implemented as a prerequisite gate and must remain the source of runtime enable/disable state and secret rotation; do not hardcode live Paperclip values.
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
| 2026-05-08 | Implemented Paperclip connection settings gate, runtime config persistence, and HTTP verification without live webhook calls | Codex Dev |
| 2026-05-08 | Added web-managed Paperclip connection requirement: Settings UI connect/disconnect/rotate gate before live webhook; no hardcoded live config | Codex PM |
| 2026-05-08 | Answered PM/Paperclip owner live connector readiness questions; kept live implementation blocked pending W1 access/security readiness | Codex PM / Paperclip Owner |
| 2026-05-08 | Implemented mock adapter route, idempotency/audit persistence, and mock verification | Codex Dev |
| 2026-05-08 | Created W3 Paperclip integration discovery and contract plan | Codex Dev |
| 2026-05-12 | Added runtime topology gate for DigitalOcean-hosted Task Hub; historical Paperclip localhost blocker later superseded by hosted Paperclip confirmation | Codex PM |
| 2026-05-12 | Updated W3 gate after PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare; live work now waits on Task Hub hosting plus service-auth verification | Codex PM |
| 2026-05-13 | Recorded W1-07 service-auth topology for W3: Paperclip calls Task Hub webhook through Cloudflare Access service token plus signed webhook headers; W3 live work remains blocked until QA/PM and Paperclip owner inputs | Codex PM / Dev |
| 2026-05-13 | Accepted W1-07 service-auth topology after PR #11 QA/PM pass and merge at `fa87ac4`; W3 live work now waits on Paperclip owner input confirmation | Codex PM |
| 2026-05-13 | Held W3 live connector implementation while the Paperclip server is offline; non-blocked V0.2 work is routed back to W2-06 | Codex PM |
| 2026-05-13 | Prepared `V0.2-W3-02` live webhook plan while Paperclip is offline: inbound contract, env validation, Cloudflare Access service-token expectations, HMAC canonical format, idempotency/replay behavior, and blocked owner inputs; no live route implemented | Codex PM / Dev |
