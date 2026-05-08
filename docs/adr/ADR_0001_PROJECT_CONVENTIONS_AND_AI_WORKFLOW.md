# ADR 0001 - Project Conventions and AI Workflow

**Status:** Accepted
**Date:** 2026-05-08
**Owner:** PM
**Updated by:** Codex PM

---

## Context

Trisilar Task Hub is now using multiple AI agents and parallel V0.2 workstreams:

- W1 Company Access + Deployment
- W2 Full UI Redesign
- W3 Paperclip Multi-Agent Integration

The previous workflow relied heavily on chat prompts and `CURRENT_SPRINT.md`. That worked for linear V0.1 tasks, but it is not sufficient for parallel work because agents can overwrite prompts, commit on the wrong branch, or duplicate planning context.

The project also needs clearer conventions for version planning, phase/task naming, documentation ownership, architecture references, test gates, and AI handoff.

---

## Decision

The project will use a layered documentation and workflow model:

1. `.ai-instructions.md` is the universal first-read file for every AI agent.
2. `CODEX.md`, `CLAUDE.md`, and `GEMINI.md` are agent-specific extensions only.
3. `CURRENT_SPRINT.md` stays short and PM-owned.
4. `TODO.md` becomes the high-level roadmap index.
5. Version plans in `docs/plans/` own scope, workstreams, sequencing, and release logic.
6. `docs/reference/PROJECT_CONTEXT.md` owns stable product context.
7. `docs/reference/ARCHITECTURE.md` owns the current technical architecture.
8. `docs/testing/TEST_STRATEGY.md` owns verification policy and automated test-suite roadmap.
9. `docs/adr/` owns durable architecture/process decisions.
10. Parallel workstreams must use separate branches and separate git worktrees.

The required branch flow remains:

```text
feature/* -> dev -> main
```

---

## Consequences

Positive:

- Agents have a stable read order.
- Workstream prompts no longer depend only on `CURRENT_SPRINT.md`.
- Branch/worktree rules are explicit.
- Architecture and process decisions become durable.
- QA and test expectations are easier to enforce.

Tradeoffs:

- There are more docs, so indexes must stay accurate.
- PM must keep `CURRENT_SPRINT.md`, version plans, and roadmap references aligned.
- Agents must avoid broad edits to documentation files with Thai or typographic text.

---

## Alternatives Considered

| Alternative | Why not chosen |
|---|---|
| Keep all instructions in `CURRENT_SPRINT.md` | Too fragile for parallel W1/W2/W3 sessions |
| Keep all conventions in agent-specific files only | Causes drift between Codex, Claude, and Gemini |
| Use chat-only conventions | Not durable and hard for future agents to verify |
| Delay ADRs until later | Architecture/process decisions are already affecting active work |

---

## Related Docs

- `.ai-instructions.md`
- `CONTRIBUTING.md`
- `TODO.md`
- `docs/reference/PROJECT_CONTEXT.md`
- `docs/reference/ARCHITECTURE.md`
- `docs/testing/TEST_STRATEGY.md`
- `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md`
- `docs/plans/VERSION_0_2_PLAN.md`
