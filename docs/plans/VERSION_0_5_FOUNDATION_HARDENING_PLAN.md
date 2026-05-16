# Version 0.5 Foundation Hardening Plan

**Doc Role:** Active V0.5 foundation plan for persistence, tests, and contracts before UI V2 / Team Operating System implementation
**Status:** FND-05 integrated via PR #30 / hosted dev-demo SQLite canary selected, blocked on host access
**Version:** V0.5
**Owner:** PM / Architecture / Dev / QA
**Created:** 2026-05-15
**Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `../../TODO.md`, `PROJECT_LADDER.md`, `../testing/TEST_STRATEGY.md`, `../reference/ARCHITECTURE.md`, `../reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `../adr/ADR_0003_FOUNDATION_BEFORE_UI_TEAM_OS.md`, `../adr/ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md`, `../deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md`

---

## Purpose

V0.5 makes the codebase safe enough for larger UI V2 and Team Operating System expansion.

V0.4 production Paperclip work can continue as a Runtime/QA track. V0.5 may start in parallel while V0.4 is in a read-only monitoring or waiting state, as long as V0.5 does not touch production runtime, secrets, Cloudflare policy, Paperclip live flags, or webhook auth behavior.

---

## Scope

### In Scope

- ADR-backed persistence, test-gate, and data-contract decisions.
- Meaningful `npm test` coverage for deterministic API routes and Trello model normalization.
- Schema/contract validation for app-owned data shapes.
- SQLite migration for app-owned runtime state.
- JSON import/backups, rollback notes, and `APP_DATA_DIR` boundary preservation.
- Integration QA that proves current API behavior and Paperclip safety are preserved.

### Out of Scope

- UI V2 production implementation.
- Team Operating System product features.
- Full rewrite execution.
- Production runtime, Cloudflare, secret, or live Paperclip flag changes.
- Trello, Calendar, or Google Tasks writes during migration/test work.

---

## Phase Ladder

| ID | Phase | Owner Role | Status | Outcome |
|---|---|---|---|---|
| `V0.5-FND-01` | Foundation ADRs + planning acceptance | PM / Architecture | Accepted via PR #28 at `dev@aaf8f58` | Confirm sequencing, persistence, test gates, and contract guardrails before implementation |
| `V0.5-FND-02` | Deterministic test baseline | Dev / QA | Integrated via PR #30 at `dev@e3380ac` | Replace placeholder `npm test` with meaningful route/model tests that do not require live secrets |
| `V0.5-FND-03` | Data contract validation | Dev / QA | Integrated via PR #30 at `dev@e3380ac` | Validate app-owned Review Queue, config, Paperclip public connection, and normalized Trello card shapes |
| `V0.5-FND-04` | SQLite persistence migration | Dev / QA / Runtime | Integrated via PR #30 at `dev@e3380ac` | Move app-owned JSON state to SQLite with JSON import/backups, rollback notes, and env-flagged runtime reader canary |
| `V0.5-FND-05` | Foundation integration QA | QA / Integration / PM | Post-merge QA pass / hosted dev-demo canary selected | Verify tests, migration, contracts, optional SQLite runtime backend, and existing Paperclip safety gates together before any production switch |

---

## Delivery Rules

- Preserve existing public API response shapes unless an ADR explicitly approves a change.
- Treat SQLite as an internal persistence change, not a new external API.
- Keep `APP_DATA_DIR` as the environment boundary for local/dev/prod data.
- Keep Review Queue as the human approval gate.
- Do not create Trello cards, Calendar events, or Google Tasks during V0.5 automated tests.
- Do not mix V0.5 foundation edits into the dirty UI V2 design artifact worktree.
- Use dedicated branches/worktrees for implementation slices.

Recommended branches:

```text
codex/v05-foundation-hardening
codex/v05-test-contracts
codex/v05-sqlite-persistence
```

---

## Parallel Work Policy

Can proceed in parallel:

- V0.4 Runtime/QA production service-auth, staged canary, and read-only monitoring.
- UI V2 design-only screens, tokens, component inventory, and implementation handoff notes.
- Team OS docs-only pilot outline and onboarding assumptions.
- V0.5 test/contracts planning and non-runtime implementation.

Must be sequenced:

- SQLite migration after `V0.5-FND-01` ADR acceptance and `V0.5-FND-02` test baseline.
- UI V2 production implementation after V0.5 foundation acceptance.
- Team OS product implementation after UI shell/workflow stability.
- Full rewrite execution only after V0.5/V0.6 evidence shows it is still justified.

Do not run in parallel:

- Production runtime/secrets work with code that changes webhook auth or live flags.
- Multiple agents editing the same frontend shell or global stylesheet.
- SQLite migration and Team OS product features against the same unsettled data model.
- Full rewrite implementation while V0.4 canary/monitoring is active.

---

## Acceptance Criteria

- `npm test` is meaningful and passes.
- `npm.cmd run check:all` passes.
- Existing Paperclip contract/mock/docs/connection/operations/cleanup/webhook/production-readiness checks pass when relevant.
- SQLite migration imports existing JSON state without data loss.
- JSON backups or rollback notes exist for migration recovery.
- SQLite runtime reader remains behind `TASKHUB_STATE_BACKEND=sqlite`; JSON remains the default backend.
- Dev/prod `APP_DATA_DIR` boundaries remain explicit.
- No production secret, Cloudflare token, signing header, or raw auth value appears in docs, tests, logs, or fixtures.
- No automated test performs real Trello, Calendar, Google Tasks, or live Paperclip side effects.

---

## V0.5-FND-05 Local QA Evidence

On 2026-05-15, Codex Dev / QA ran local integration QA in the V0.5 foundation worktree with isolated temporary `APP_DATA_DIR` values only.

Passed checks:

- `npm.cmd ci`
- `npm test` with 25 deterministic tests passing
- `npm.cmd run verify:contracts` with 6 contract tests passing
- `npm.cmd run check:all` against a local isolated server
- `git diff --check`
- targeted `node --check` for modified backend and migration files
- Paperclip contract, mock, connection, operations, docs, cleanup, webhook, and production-readiness verification scripts
- `npm.cmd run migrate:sqlite:export` fails non-zero when `taskhub-state.sqlite` is missing
- normal `npm.cmd run migrate:sqlite` followed by `npm.cmd run migrate:sqlite:export` succeeds and retains the SQLite DB

SQLite backend canary rehearsal:

1. Seeded synthetic app-owned JSON runtime files under a temporary `APP_DATA_DIR`.
2. Ran `npm.cmd run migrate:sqlite`.
3. Started the server with `TASKHUB_STATE_BACKEND=sqlite`.
4. Ran `npm.cmd run check:all`.
5. Confirmed `/api/config` and `/api/reviews` read migrated state through SQLite.
6. Posted a synthetic Review Queue session without Trello, Calendar, Google Tasks, or live Paperclip side effects.
7. Confirmed SQLite `app_state` rows for `cardEvents`, `config`, and `reviewSessions`.
8. Ran `npm.cmd run migrate:sqlite:export` and confirmed rollback JSON included the SQLite-created Review Queue session.

Boundary:

- This was a local dev/demo-style rehearsal, not a hosted dev/demo runtime flip.
- Production remains JSON default.
- `TASKHUB_STATE_BACKEND=sqlite` remains an explicit environment-scoped canary flag.
- No production runtime, Cloudflare policy, live Paperclip flag, webhook auth behavior, or real external service side effect was changed.

---

## Hosted Dev/Demo SQLite Canary Decision

PM selected the hosted dev/demo SQLite canary path on 2026-05-15.

Status: selected, not executed from this workstation.

Completed before execution:

- V0.5 code is integrated through PR #30 at `dev@e3380ac`.
- Post-merge local QA passed `npm test` 25/25.
- Post-merge `check:all` passed with a controlled local server.
- Local SQLite canary rehearsal passed on `e3380ac`: JSON import, SQLite runtime read, `/healthz`, `/api/config`, `/api/reviews`, Paperclip operations read-only status, `verify:sqlite-canary`, and rollback export.
- Local persistence canary cycle passed: `npm.cmd run verify:persistence-canary-cycle` covers JSON import, SQLite runtime verification, rollback export, and JSON runtime verification in an isolated temp `APP_DATA_DIR`.

Current gate before hosted execution:

- Runtime Owner needs working DigitalOcean host access; the local SSH probe to `root@157.230.251.209` returned `Permission denied (publickey)`.
- Runtime Owner must confirm dev/demo `APP_DATA_DIR`, current source commit, backup location, and expected Paperclip live flag before restart.
- Production remains out of scope and must not receive `TASKHUB_STATE_BACKEND=sqlite` from this decision.

Runtime Owner runbook once gates are clear:

Detailed checklist: `../deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md`

```powershell
# On the hosted dev/demo runtime only, after V0.5 code is deployed from an accepted dev commit.
# Do not run on production.

# 1. Optional local preflight from the deployed code tree; uses temp data only.
npm.cmd run verify:persistence-canary-cycle

# 2. Record current commit, service state, APP_DATA_DIR, and Paperclip flags without printing secrets.
# 3. Preserve or snapshot the current dev/demo APP_DATA_DIR using the approved runtime backup path.
npm.cmd ci
npm.cmd run migrate:sqlite

# 4. Set the canary flag in the dev/demo runtime environment only.
$env:TASKHUB_STATE_BACKEND = "sqlite"

# 5. Restart or reload taskhub-dashboard.service.
# 6. Verify from the host against the local service URL, not through Cloudflare Access.
#    - local /healthz returns 200
#    - /api/config returns 200
#    - /api/reviews returns 200
#    - Paperclip operations status remains read-only and does not expose secrets
#    - no Trello, Calendar, Google Tasks, or live Paperclip side effect is created
#    - the verification shell must see APP_DATA_DIR and TASKHUB_STATE_BACKEND=sqlite
$env:SQLITE_CANARY_BASE_URL = "http://127.0.0.1:3000"
npm.cmd run verify:sqlite-canary
npm.cmd run migrate:sqlite:export

# 7. Confirm rollback JSON files are present and usable.
# 8. PM decides whether dev/demo keeps SQLite canary enabled or removes TASKHUB_STATE_BACKEND to return to JSON.
#    If rolling back, remove TASKHUB_STATE_BACKEND, restart/reload, and verify the JSON-backed runtime.
$env:TASKHUB_STATE_BACKEND = ""
$env:JSON_ROLLBACK_BASE_URL = "http://127.0.0.1:3000"
npm.cmd run verify:json-rollback
```

Stop and rollback if `verify:sqlite-canary`, `/healthz`, `/api/config`, `/api/reviews`, or Paperclip operations status fails after restart. Remove `TASKHUB_STATE_BACKEND`, restart the dev/demo service, run `npm.cmd run verify:json-rollback`, and route QA/PM with evidence.

---

## Next Recommended Session

```text
Role: Integration Owner / Runtime Owner
Task: Execute hosted dev/demo SQLite canary from the latest accepted `dev` commit containing PR #30 foundation code after Runtime Owner host access is available

Read:
- docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md
- docs/adr/ADR_0003_FOUNDATION_BEFORE_UI_TEAM_OS.md
- docs/adr/ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md
- docs/testing/TEST_STRATEGY.md
- docs/reference/ARCHITECTURE.md
- docs/reference/DATA_BACKUP_RETENTION_POLICY.md
- docs/deployment/ENVIRONMENT_MATRIX.md
- docs/deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md

Expected output:
- Runtime Owner uses `docs/deployment/V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md`, optionally runs `npm.cmd run verify:persistence-canary-cycle` as a temp-data preflight, then runs `npm.cmd run migrate:sqlite`, starts dev/demo with `TASKHUB_STATE_BACKEND=sqlite`, verifies health/config/reviews/Paperclip read-only status with `npm.cmd run verify:sqlite-canary`, then proves rollback with `npm.cmd run migrate:sqlite:export` and `npm.cmd run verify:json-rollback` if the canary is rolled back.
- If host access or deploy readiness is missing, record a blocker instead of changing runtime state.
- If canary fails, remove `TASKHUB_STATE_BACKEND`, restart dev/demo, verify JSON-backed health/config/reviews, and route QA/PM.
- Production SQLite switch remains out of scope until a separate PM/Runtime acceptance.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-15 | Created V0.5 Foundation Hardening plan and inserted it before UI V2 / Team OS implementation | Codex PM |
| 2026-05-15 | Accepted FND-01 roadmap/ADR plan via PR #28 and routed next to FND-02 deterministic test baseline in the foundation worktree | Codex PM / Integration Owner |
| 2026-05-15 | Implemented deterministic `npm test`, app-owned contracts, SQLite migration/rollback, env-flagged SQLite runtime-state backend, and FND-05 local QA evidence | Codex Dev / QA |
| 2026-05-15 | PM selected hosted dev/demo SQLite canary path; initial execution was held until dev integration and Runtime Owner host access were available | Codex PM / Runtime Owner |
| 2026-05-15 | Integrated FND-02/03/04/05 through PR #30 at `dev@e3380ac`; post-merge `npm test`, controlled `check:all`, and local SQLite canary rehearsal passed; hosted execution remains blocked by DigitalOcean SSH publickey access | Codex Integration Owner / QA |
| 2026-05-15 | Added `verify:sqlite-canary` for Runtime Owner read-only hosted canary verification of SQLite `app_state`, health/config/reviews, and Paperclip operations status before rollback export | Codex Dev / QA |
| 2026-05-15 | Added `verify:json-rollback` for Runtime Owner read-only rollback verification after removing the SQLite backend flag and restarting JSON-backed dev/demo | Codex Dev / QA |
| 2026-05-15 | Added `verify:persistence-canary-cycle` local preflight covering JSON import, SQLite runtime verification, rollback export, and JSON runtime verification using temp data only | Codex Dev / QA |
| 2026-05-16 | Added dedicated Runtime Owner SQLite canary checklist with preflight, backup, stop conditions, rollback proof, and evidence template | Codex Dev / QA |
