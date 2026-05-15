# ADR 0004 - V0.5 Persistence, Tests, and Contracts

**Status:** Accepted
**Date:** 2026-05-15
**Owner:** PM / Architecture / Dev / QA
**Updated by:** Codex PM

---

## Context

Task Hub has grown from a local MVP into a Cloudflare-protected internal command center with Trello, Google, Review Queue, and Paperclip integration paths.

The current architecture still uses file-backed JSON runtime state, mostly smoke/verification scripts, and informal app-owned data contracts. This is workable for MVP/dev-demo use, but it is too fragile for UI V2 implementation, Team Operating System expansion, and future production Paperclip operations.

---

## Decision

V0.5 will harden the foundation before larger product expansion:

1. Replace the placeholder `npm test` with meaningful deterministic tests.
2. Add schema/contract validation for app-owned data shapes.
3. Migrate app-owned runtime JSON state to SQLite.
4. Preserve existing public API response shapes by default.
5. Keep `APP_DATA_DIR` as the environment boundary for data files and backups.

SQLite is the default persistence target for V0.5 because Task Hub is a small internal Node/Express service with app-owned runtime state and DigitalOcean-hosted long-running runtime. Postgres or a managed database can be reconsidered only after team usage or scale requires it.

---

## Required Test Direction

`npm test` must become a real gate. Initial coverage should prioritize:

- deterministic API route tests without live Trello/Google credentials,
- Trello model normalization tests,
- Review Queue and config shape tests,
- Paperclip contract/public connection shape tests,
- JSON-to-SQLite migration tests.

Live Trello, Google, Cloudflare, or production Paperclip checks remain smoke/manual/runtime validation, not the only correctness gate.

---

## Required Contract Direction

Validate app-owned shapes before larger UI or Team OS features depend on them:

- Review Queue session/task,
- config and workspace visibility,
- Paperclip public connection/operations state,
- normalized Trello card metadata.

Do not change existing response shapes unless PM accepts an ADR-backed contract change.

---

## Required Persistence Direction

Move app-owned state from JSON files to SQLite through a staged migration:

- import existing JSON files on first migration,
- keep JSON backups or rollback notes,
- preserve `APP_DATA_DIR` isolation,
- avoid production/dev data mixing,
- avoid real Trello/Calendar/Google/Paperclip side effects during migration tests.

---

## Consequences

Positive:

- Reduces data-loss and contract-drift risk.
- Gives UI V2 and Team OS safer implementation boundaries.
- Makes CI/release gates more meaningful.
- Keeps deployment simple for the current DigitalOcean runtime.

Tradeoffs:

- Adds migration work before visible product features.
- Requires test fixtures and migration evidence before SQLite is accepted.
- Requires PM/QA discipline to prevent opportunistic response-shape changes.

---

## Alternatives Considered

| Alternative | Why not chosen |
|---|---|
| Keep JSON state until Team OS is built | Leaves data persistence fragile while feature scope grows |
| Move directly to Postgres | More operational overhead than the current internal tool needs |
| Start with frontend framework migration | Does not fix persistence or contract risk |
| Keep `npm test` as placeholder and rely on smoke scripts | Too weak for migration and larger UI changes |

---

## Related Docs

- `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md`
- `docs/testing/TEST_STRATEGY.md`
- `docs/reference/ARCHITECTURE.md`
- `docs/deployment/ENVIRONMENT_MATRIX.md`
- `docs/reference/DATA_BACKUP_RETENTION_POLICY.md`
