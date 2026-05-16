# AI Agent Governance - Trisilar Task Hub

**Doc Role:** Governance model for AI-originated work, role boundaries, Review Queue safety, and agent attribution
**Status:** PM accepted
**Owner:** PM / Documentation Workflow Owner
**Created:** 2026-05-14
**Updated by:** Codex Documentation Workflow Owner
**Related Docs:** `ORGANIZATION_OPERATING_MODEL.md`, `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `AGENT_HARNESS_ADOPTION.md`, `SECURITY_ACCESS_POLICY.md`, `DATA_BACKUP_RETENTION_POLICY.md`, `../agents/PM.md`, `../plans/PROJECT_LADDER.md`

---

## Purpose

This document defines how AI agents may participate in Trisilar Task Hub operations and development without losing human control, auditability, branch hygiene, or secret safety.

---

## PM Acceptance - 2026-05-14

PM accepts this governance model as the long-term role and safety boundary for AI-assisted operations and repo work.

Accepted decisions:

- Review Queue remains mandatory before external side effects.
- AI-originated work must preserve source, request id, agent run id, evidence, linked context, and audit trail.
- Runtime flags and secrets remain owned by Runtime / Access Owner.
- QA remains read-only while acting as QA.
- Integration Owner owns accepted-branch merges into `dev`.
- Lightweight repo-contained role `SKILL.md` entrypoints under `docs/agent-skills/` are approved for Codex, Claude, Gemini, and future agents.
- The reusable installed `trisilar-task-hub-workflow` Codex skill remains deferred until PM explicitly asks for local skill extraction.
- External agent-harness patterns may be distilled into repo docs, role skills, tests, and visible checklists, but full harness installs, broad rule packs, hidden hooks, and autonomous loops remain blocked without PM approval.

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

Role docs live in `docs/agents/`. Repo-contained role skill entrypoints live in `docs/agent-skills/` and should be loaded before the deeper role guide.

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

Runtime flags such as `PAPERCLIP_WEBHOOK_ENABLED` may only be changed by the Runtime Owner or by an explicitly assigned runtime task. `PAPERCLIP_WEBHOOK_ENABLED=false` remains the hard stop gate until PM accepts a controlled live enablement policy. Production Paperclip intake also requires `TASKHUB_RUNTIME_PROFILE=production`, an approved production hostname, `PAPERCLIP_LIVE_MODE=staged|permanent`, a separate production `APP_DATA_DIR`, and QA evidence that Review Queue remains the human gate before external side effects.

For detailed access-control, service-token, and backup/retention rules, use `SECURITY_ACCESS_POLICY.md` and `DATA_BACKUP_RETENTION_POLICY.md`. Production `APP_DATA_DIR` backups are secret-bearing when they include connection state such as `paperclip-connection.json`.

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

All repo work must pass Definition of Ready before it starts and Definition of Done before it is marked complete. DoR/DoD gates live in `../../CONTRIBUTING.md`, `BRANCH_ENVIRONMENT_WORKFLOW.md`, and `CODEX_PARALLEL_DEVELOPMENT_MODEL.md`.

| Work type | Gate |
|---|---|
| Docs-only | `git diff --check`; PM review |
| Frontend UX change | Desktop/mobile route review, console/page error check, relevant script checks |
| Backend workflow change | Route/model verification, smoke/check script, persistence review |
| Paperclip/AI integration | Contract, HMAC/idempotency, mock/live/production boundary, no pre-approval side effects |
| Runtime/access change | Health, access block/allow evidence, secret placement, runtime profile, live mode, rollback plan |
| `dev -> main` release | Integration QA, release checklist, PM acceptance |

Completion also requires clear PR/merge state, role-owned docs/logs, and branch/worktree/folder cleanup or an explicit blocker. Backup branches may remain as safety refs; locked folders may remain only when Git no longer registers them as worktrees and the handoff records the blocker.

---

## Role Skills And Future Skill Extraction

Repo-contained role skills under `docs/agent-skills/` are approved as basic role entrypoints for Codex, Claude, Gemini, and future agents. They should point agents toward the right role guide, branch/worktree checks, boundaries, and output format.

Role skills should use a consistent shape:

- `When to use`
- `Start`
- `Do`
- `Do not`
- `Verification`
- `Stop Conditions`
- `Output`

Do not create or install a reusable local Codex skill from these docs until PM explicitly asks. PM decision on 2026-05-14: defer the installed `trisilar-task-hub-workflow` skill and use the repo docs in real sessions first.

Recommended sequence:

1. Stabilize the operating model docs.
2. Use repo-contained role skills and role docs in real PM/Dev/QA/Runtime sessions.
3. Extract one concise installed `trisilar-task-hub-workflow` Codex skill only after PM explicitly requests it.

Repo-contained and future installed skills should teach agents how to work in this repo. They should not contain current commit hashes, live runtime values, status snapshots, or secrets.

Use `AGENT_HARNESS_ADOPTION.md` before importing patterns from external agent systems. External patterns must strengthen existing PM/QA/Runtime gates rather than replace them.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-14 | Created AI agent governance draft for V0.3 PM review | Codex PM / Documentation Architect |
| 2026-05-14 | PM accepted AI agent governance and deferred reusable skill extraction | Codex PM |
| 2026-05-15 | Added approved repo-contained role skill entrypoints while keeping installed Codex skill extraction deferred | Codex PM / Documentation Workflow Owner |
| 2026-05-16 | Added external agent-harness adoption boundary and role-skill shape | Codex Documentation Workflow Owner |
