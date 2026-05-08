# Architecture Decision Records

**Doc Role:** ADR index and process
**Status:** Active
**Owner:** PM / Dev
**Last Updated:** 2026-05-08
**Updated by:** Codex PM

ADRs record decisions that future agents must not rediscover from chat history.

---

## When to Create an ADR

Create an ADR for decisions affecting:

- architecture
- branch/worktree workflow
- deployment/runtime model
- persistence/storage
- API or integration contracts
- frontend module/build strategy
- auth/access/security
- automated test gates
- AI multi-agent coordination

Do not create ADRs for tiny implementation details, typo fixes, or one-off QA results.

---

## Naming

```text
ADR_0001_SHORT_TITLE.md
ADR_0002_SHORT_TITLE.md
```

Use uppercase snake case after the numeric prefix.

---

## Template

```markdown
# ADR 0000 - Title

**Status:** Proposed | Accepted | Superseded
**Date:** YYYY-MM-DD
**Owner:** PM / Dev
**Updated by:** Agent name

## Context

## Decision

## Consequences

## Alternatives Considered

## Related Docs
```

---

## Index

| ADR | Status | Decision |
|---|---|---|
| `ADR_0001_PROJECT_CONVENTIONS_AND_AI_WORKFLOW.md` | Accepted | Establish universal AI/project conventions, worktree rules, docs split, and ADR usage |
