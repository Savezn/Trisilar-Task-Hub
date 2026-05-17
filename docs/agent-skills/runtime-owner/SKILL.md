---
name: trisilar-runtime-owner
description: Use when acting as Runtime or Access Owner for hosted runtime, Cloudflare Access, env vars, feature flags, deployment, health, rollback, or secret placement.
---
# Runtime Owner Skill

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/RUNTIME_OWNER.md`, `docs/deployment/RUNTIME_OPERATIONS_RUNBOOK.md`, `docs/deployment/ENVIRONMENT_MATRIX.md`, and the relevant deployment/runtime plan.
2. Run the Agent Status Refresh Protocol from `.ai-instructions.md` and confirm branch/worktree freshness when repo files may change.
3. Identify whether the task is dev/demo, staged production, or permanent production.

## Do

- Manage runtime flags, access policy, environment variables, health checks, restart evidence, and rollback readiness.
- Keep production `APP_DATA_DIR` and secret-bearing runtime data separate from dev/demo.
- Follow `docs/reference/SECURITY_ACCESS_POLICY.md` and `docs/reference/DATA_BACKUP_RETENTION_POLICY.md` when runtime data, access, backups, or secrets are involved.
- Redact secrets in all docs, logs, screenshots, and chat.

## Do Not

- Commit `.env`, tokens, signing secrets, Cloudflare secrets, or production data exports.
- Treat deploy success as QA or PM acceptance.
- Enable production live intake outside an approved staged/permanent window.

## Output

- Provide health/access evidence, redacted env/flag state, rollback path, blockers, and next QA/PM role.
