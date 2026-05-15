# Security And Access Policy - Trisilar Task Hub

**Doc Role:** Secret handling, access control, and service-token policy
**Status:** Active
**Owner:** Runtime Owner / PM
**Created:** 2026-05-15
**Updated by:** Codex PM / Runtime Owner
**Related Docs:** `AI_AGENT_GOVERNANCE.md`, `../deployment/RUNTIME_OPERATIONS_RUNBOOK.md`, `../deployment/ENVIRONMENT_MATRIX.md`, `DATA_BACKUP_RETENTION_POLICY.md`, `../adr/ADR_0002_PAPERCLIP_TASKHUB_SERVICE_AUTH.md`

---

## Purpose

This policy keeps Task Hub usable by a small team without allowing secrets, service tokens, or production data to leak through git, docs, browser code, screenshots, or chat.

---

## Access Model

| Access type | Rule |
|---|---|
| Human access | Cloudflare Access email login for hosted environments |
| Machine access | Cloudflare Access service token at the edge plus app-level signed webhook when required |
| Local development | Local `.env` or operator shell only |
| Production Paperclip | Separate production runtime, production service token, and runtime-only signing secret |

Anonymous public access to hosted Task Hub routes and `/healthz` must be blocked before production use.

---

## Secret Handling

Never commit, paste, screenshot, or log raw values for:

- API tokens
- OAuth secrets
- Cloudflare Access Client Secret
- HMAC signing secrets
- raw auth headers
- production data exports
- production `APP_DATA_DIR` backups

Allowed in docs:

- env var names
- placeholder values such as `<runtime-only secret>`
- non-secret hostnames
- non-secret source ids and environment names
- redacted verification summaries

---

## Runtime Ownership

Runtime Owner owns:

- Cloudflare Access policy
- service-token setup and rotation coordination
- environment variable placement
- runtime flags such as `PAPERCLIP_WEBHOOK_ENABLED`
- production `APP_DATA_DIR`
- rollback evidence

Product/Dev/QA agents must not enable production runtime behavior unless explicitly assigned Runtime Owner responsibility.

---

## Paperclip Service Auth

Paperclip-to-Task-Hub production traffic requires:

- Cloudflare Access service-token headers configured only in Paperclip runtime
- Task Hub webhook signing secret stored only in Task Hub runtime connection state
- matching Paperclip signing secret configured only in Paperclip runtime
- `PAPERCLIP_ALLOWED_SOURCE_ID=paperclip-do-prod`
- `PAPERCLIP_ALLOWED_ENVIRONMENT=production`
- Review Queue pending task creation only until a human approves external side effects

No signing secret, service token, raw header, or auth value may appear in git, docs, browser JavaScript, screenshots, or chat.

---

## Access Review

Review access when:

- production Paperclip staged mode starts
- `PAPERCLIP_LIVE_MODE` changes
- a teammate leaves or changes responsibility
- a service token may have been exposed
- production hostname, tunnel, or Access app changes
- a backup/restore operation touches secret-bearing data

Minimum review evidence:

- who owns the runtime
- which environment was reviewed
- whether anonymous access is blocked
- whether service-token reachability was verified without printing token values
- whether rollback path is known

---

## Secret Exposure Response

If a secret may have leaked:

1. Stop sharing the channel or artifact where the leak occurred.
2. Disable affected token/secret where possible.
3. Rotate the secret out of band.
4. Confirm app health after rotation.
5. Record a redacted decision/QA note.
6. Do not copy the exposed value into remediation docs.

If Paperclip signing material is affected, keep `PAPERCLIP_WEBHOOK_ENABLED=false` until Runtime Owner and QA complete re-verification.

---

## Stop Conditions

Stop work and route PM/Runtime Owner if:

- anonymous production access is not blocked
- a secret-bearing backup is not protected
- a token or signing secret appears in repo/docs/chat
- Paperclip can create external side effects before human approval
- runtime flags are changed without owner assignment
- rollback to `PAPERCLIP_WEBHOOK_ENABLED=false` cannot be verified
