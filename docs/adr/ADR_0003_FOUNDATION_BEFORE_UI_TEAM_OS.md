# ADR 0003 - Foundation Before UI V2 and Team OS

**Status:** Accepted
**Date:** 2026-05-15
**Owner:** PM
**Updated by:** Codex PM

---

## Context

V0.4 Paperclip production work is blocked only by runtime/service-auth setup, staged canary, and 24-hour monitoring. Waiting for that window should not stop isolated repo/design work.

At the same time, the app is still a Node/Express dashboard with static frontend scripts and app-owned JSON runtime state. A full UI or Team Operating System rewrite before persistence, tests, and contracts are stronger would compound too many risks at once.

---

## Decision

Insert `V0.5 Foundation Hardening` before UI V2 product implementation and before the Team Operating System pilot.

The sequence is:

```text
V0.4 Live AI Operations closeout
-> V0.5 Foundation Hardening
-> V0.6 UI V2 Design System implementation
-> V0.7 Team Operating System pilot
-> V0.8+ Full Rewrite decision only if still justified
```

V0.4 Runtime/QA may continue in parallel with V0.5, UI V2 design-only work, and Team OS docs-only planning. Full rewrite work remains deferred.

---

## Consequences

Positive:

- Uses V0.4 monitoring wait time productively.
- Keeps runtime/secrets work isolated from repo hardening.
- Reduces risk before large UI or workflow expansion.
- Gives UI V2 and Team OS stable tests/contracts to build on.

Tradeoffs:

- Team Operating System product features move later.
- UI V2 implementation waits for V0.5 foundation acceptance.
- PM must manage more than one active lane without letting branches collide.

---

## Alternatives Considered

| Alternative | Why not chosen |
|---|---|
| Wait for V0.4 to finish before any other work | Wastes the 24-hour monitoring window and blocks independent docs/test planning |
| Start Full Rewrite immediately | Combines persistence, frontend, and operating-model risk before test/contracts are ready |
| Implement UI V2 before persistence/tests | Improves appearance but leaves fragile data and verification foundations |
| Start Team OS product features next | Builds larger workflow features before the codebase can safely support them |

---

## Related Docs

- `docs/plans/PROJECT_LADDER.md`
- `docs/plans/VERSION_0_5_FOUNDATION_HARDENING_PLAN.md`
- `docs/adr/ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md`
- `docs/testing/TEST_STRATEGY.md`
- `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`
