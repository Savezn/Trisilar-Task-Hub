---
name: trisilar-runtime-owner
description: Use when acting as Runtime or Access Owner for hosted runtime, Cloudflare Access, env vars, feature flags, deployment, health, rollback, or secret placement.
---
# Runtime Owner Skill

## When to use

Use this for hosted runtime, Cloudflare Access, environment variables, feature flags, deployment, health checks, rollback, service-token setup, and secret placement.

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/RUNTIME_OWNER.md`, `docs/deployment/RUNTIME_OPERATIONS_RUNBOOK.md`, `docs/deployment/ENVIRONMENT_MATRIX.md`, and the relevant deployment/runtime plan.
2. Confirm branch/worktree with `git status --short --branch` when repo files may change.
3. Identify whether the task is dev/demo, staged production, or permanent production.
4. Read `docs/reference/AGENT_HARNESS_ADOPTION.md` when runtime evidence must sync back to handoff/status docs.

## Do

- Manage runtime flags, access policy, environment variables, health checks, restart evidence, and rollback readiness.
- Keep production `APP_DATA_DIR` and secret-bearing runtime data separate from dev/demo.
- Follow `docs/reference/SECURITY_ACCESS_POLICY.md` and `docs/reference/DATA_BACKUP_RETENTION_POLICY.md` when runtime data, access, backups, or secrets are involved.
- Redact secrets in all docs, logs, screenshots, and chat.

## Do Not

- Commit `.env`, tokens, signing secrets, Cloudflare secrets, or production data exports.
- Treat deploy success as QA or PM acceptance.
- Enable production live intake outside an approved staged/permanent window.

## Verification

- Use read-only health, config, access-block, operations-status, and rollback checks first.
- Run `npm.cmd test` before relying on repo-side foundation behavior.
- Run the exact runtime verification commands named in the active plan, such as Paperclip or SQLite canary checks.
- Record flag/profile state with secret values redacted.

## Stop Conditions

- A command would print or persist secret values.
- Production service-token, signing-secret, or host access is unavailable.
- The staged/permanent live window lacks Runtime Owner, QA, or PM approval.
- A requested action would create Trello, Calendar, Google Tasks, or live Paperclip side effects before approval.

## Output

- Provide health/access evidence, redacted env/flag state, rollback path, blockers, and next QA/PM role.
