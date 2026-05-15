# Version 0.5 Foundation Hardening Plan

**Doc Role:** Active V0.5 foundation plan for persistence, tests, and contracts before UI V2 / Team Operating System implementation
**Status:** PM routed / ready for scoped Dev planning
**Version:** V0.5
**Owner:** PM / Architecture / Dev / QA
**Created:** 2026-05-15
**Updated by:** Codex PM
**Related Docs:** `../../CURRENT_SPRINT.md`, `../../TODO.md`, `PROJECT_LADDER.md`, `../testing/TEST_STRATEGY.md`, `../reference/ARCHITECTURE.md`, `../reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `../adr/ADR_0003_FOUNDATION_BEFORE_UI_TEAM_OS.md`, `../adr/ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md`

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
| `V0.5-FND-01` | Foundation ADRs + planning acceptance | PM / Architecture | Routed | Confirm sequencing, persistence, test gates, and contract guardrails before implementation |
| `V0.5-FND-02` | Deterministic test baseline | Dev / QA | Pending | Replace placeholder `npm test` with meaningful route/model tests that do not require live secrets |
| `V0.5-FND-03` | Data contract validation | Dev / QA | Pending | Validate app-owned Review Queue, config, Paperclip public connection, and normalized Trello card shapes |
| `V0.5-FND-04` | SQLite persistence migration | Dev / QA / Runtime | Pending | Move app-owned JSON state to SQLite with JSON import/backups and rollback notes |
| `V0.5-FND-05` | Foundation integration QA | QA / Integration / PM | Pending | Verify tests, migration, contracts, and existing Paperclip safety gates together on `dev` |

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
- Dev/prod `APP_DATA_DIR` boundaries remain explicit.
- No production secret, Cloudflare token, signing header, or raw auth value appears in docs, tests, logs, or fixtures.
- No automated test performs real Trello, Calendar, Google Tasks, or live Paperclip side effects.

---

## Next Recommended Session

```text
Role: PM / Architecture
Task: Accept V0.5-FND-01 and route deterministic test baseline

Read:
- docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md
- docs/adr/ADR_0003_FOUNDATION_BEFORE_UI_TEAM_OS.md
- docs/adr/ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md
- docs/testing/TEST_STRATEGY.md
- docs/reference/ARCHITECTURE.md

Expected output:
- PM acceptance or hold for V0.5-FND-01.
- Exact Dev handoff for V0.5-FND-02 `npm test` baseline.
- Branch/worktree assignment that avoids current UI V2 design artifacts.
```

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-15 | Created V0.5 Foundation Hardening plan and inserted it before UI V2 / Team OS implementation | Codex PM |
