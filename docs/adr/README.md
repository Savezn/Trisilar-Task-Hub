# Architecture Decision Records

**Doc Role:** ADR index and process
**Status:** Active
**Owner:** PM / Dev
**Last Updated:** 2026-05-15
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
| `ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md` | Accepted | Use Paperclip-to-Task-Hub webhook with Cloudflare Access service token plus signed webhook headers before W3 live connector implementation |
| `ADR_0003_FOUNDATION_BEFORE_UI_TEAM_OS.md` | Accepted | Insert V0.5 Foundation Hardening before UI V2 product implementation, Team OS product work, and any full rewrite decision |
| `ADR_0004_V05_PERSISTENCE_TESTS_AND_CONTRACTS.md` | Accepted | Make deterministic tests, app-owned contracts, and SQLite persistence migration the V0.5 foundation direction |
