# AI Agent Governance - Trisilar Task Hub

**Doc Role:** Governance model for AI-originated work, role boundaries, Review Queue safety, and agent attribution
**Status:** Draft for PM review
**Owner:** PM / Documentation Workflow Owner
**Created:** 2026-05-14
**Updated by:** Codex PM / Documentation Architect
**Related Docs:** `ORGANIZATION_OPERATING_MODEL.md`, `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `../agents/PM.md`, `../plans/PROJECT_LADDER.md`

---

## Purpose

This document defines how AI agents may participate in Trisilar Task Hub operations and development without losing human control, auditability, branch hygiene, or secret safety.

---

## Governance Rule

```text
AI may prepare work.
Humans approve side effects.
Repo agents work on scoped branches.
Runtime owners control runtime flags and secrets.
QA owns pass/fail evidence.
PM owns acceptance and next-action routing.
```

---

## AI-Originated Product Work

AI-originated tasks from Paperclip or future agents must enter Task Hub through Review Queue or an equivalent approved review path.

Required data:

- source system
- source environment
- request id
- agent id/name/role
- agent run id
- parent run id when applicable
- source evidence or artifact reference
- proposed task data
- Review Queue session id
- audit events for intake, edit, approval/rejection, and external write attempt

Rules:

- AI may propose task creation, task updates, summaries, links, and rationale.
- AI may not create Trello cards, Calendar events, or Google Tasks without human approval.
- Confidence score does not remove the Review Queue requirement.
- Rejected or held proposals must remain auditable until the retention policy says otherwise.
- Large source evidence should be stored as bounded excerpts or references, not unbounded raw text.

---

## Repo Agent Roles

Long-term work is split into role lanes. Each session should act as one role.

| Role | Primary responsibility |
|---|---|
| PM / Product Owner | Scope, sequence, acceptance, project ladder, next action |
| UX / Product Experience Owner | Usability, workflow clarity, route-level acceptance |
| Frontend Product Dev | UI implementation and frontend regressions |
| Core Workflow / Backend Dev | Routes, review store, task diff, persistence, workflow APIs |
| AI Integration Owner | Paperclip/future agent contracts, HMAC/idempotency/audit behavior |
| Runtime / Access Owner | Hosted runtime, Cloudflare Access, env vars, flags, rollback |
| QA / Release Owner | Evidence, regression checks, pass/fail reports, release readiness |
| Integration Owner | Accepted-branch merges into `dev`, conflict resolution, integration QA routing |
| Documentation / Agent Workflow Owner | Durable docs, handoff quality, future skill extraction |

Role docs live in `docs/agents/`.

---

## Role Boundary Rules

- PM decides scope and acceptance; PM does not perform QA signoff.
- QA reports findings and evidence; QA does not implement fixes.
- Dev implements and verifies owned changes; Dev does not mark final acceptance.
- Integration Owner merges accepted branches into `dev`; feature agents do not merge sibling branches into each other.
- Runtime Owner manages runtime flags/secrets/access; product agents do not enable runtime behavior directly.
- Documentation Owner updates durable process docs; status docs still stay short and current.

When a task crosses role boundaries, stop and route the next role instead of silently expanding scope.

---

## Secret And Runtime Safety

Agents must never commit, print, paste into docs, expose in browser JavaScript, or include in handoff files:

- API tokens
- OAuth secrets
- Cloudflare Access Client Secret
- HMAC signing secrets
- production data exports
- private service credentials

Allowed in docs:

- placeholder env var names
- non-secret hostnames already approved for docs
- non-secret source/environment identifiers
- command names and verification results with secrets redacted

Runtime flags such as `PAPERCLIP_WEBHOOK_ENABLED` may only be changed by the Runtime Owner or by an explicitly assigned runtime task. `PAPERCLIP_WEBHOOK_ENABLED=false` remains the default until PM accepts a controlled live enablement policy.

---

## Development Agent Attribution

Meaningful PM/Dev/QA/docs/runtime updates should include:

```text
Role:
Branch:
Worktree:
Owned files:
Implemented by / Updated by:
Reviewed by:
Verification:
Commit:
Next role:
```

For AI-originated product work, preserve:

```text
source system
request id
agent run id
source evidence
human decision
external side effect result
```

---

## Acceptance Gates

| Work type | Gate |
|---|---|
| Docs-only | `git diff --check`; PM review |
| Frontend UX change | Desktop/mobile route review, console/page error check, relevant script checks |
| Backend workflow change | Route/model verification, smoke/check script, persistence review |
| Paperclip/AI integration | Contract, HMAC/idempotency, mock/live boundary, no pre-approval side effects |
| Runtime/access change | Health, access block/allow evidence, secret placement, rollback plan |
| `dev -> main` release | Integration QA, release checklist, PM acceptance |

---

## Future Skill Extraction

Do not create a reusable Codex skill from these docs until PM explicitly asks.

Recommended sequence:

1. Stabilize the operating model docs.
2. Use role docs in real PM/Dev/QA/Runtime sessions.
3. Extract one concise `trisilar-task-hub-workflow` skill only after the docs prove useful.

The future skill should teach agents how to work in this repo. It should not contain current commit hashes, live runtime values, status snapshots, or secrets.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created AI agent governance draft for V0.3 PM review | Codex PM / Documentation Architect |
