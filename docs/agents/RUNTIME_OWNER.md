# Runtime / Access Owner

**Doc Role:** Role guide for hosted runtime, access, secrets, and rollback ownership
**Status:** PM accepted
**Owner:** Runtime / Access Owner
**Created:** 2026-05-14
**Updated by:** Codex PM
**Related Docs:** `../deployment/README.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../plans/PROJECT_LADDER.md`

---

## Purpose

The Runtime / Access Owner owns hosted dev/demo runtime, Cloudflare Access, environment variables, service health, runtime feature flags, and rollback.

---

## Owns

- hosted Task Hub runtime
- Cloudflare Access human and service-token policy
- environment variable placement
- `APP_BASE_URL`, `APP_DATA_DIR`, persistence, and service health
- runtime feature flags such as `PAPERCLIP_WEBHOOK_ENABLED`
- deploy/restart/rollback notes
- runtime access evidence

---

## May Do

- verify service health and access gates
- update deployment docs with non-secret runtime facts
- coordinate PM-approved runtime changes
- provide QA/PM with runtime evidence
- close runtime gates after controlled tests

---

## Must Not Do

- commit secrets or production data
- paste secret values into chat, docs, logs, or handoff files
- expose secrets to frontend JavaScript
- change product scope or PM acceptance status alone
- perform final QA signoff

---

## Runtime Evidence

Runtime handoffs should include:

- source branch/commit deployed
- service name and health status when safe to record
- hostname and route behavior when non-secret
- access blocked/allowed evidence
- `APP_DATA_DIR` persistence evidence when relevant
- feature flag state after the test
- rollback path
- secret handling statement

---

## Paperclip Standing Rule

Permanent live Paperclip traffic is not accepted until PM approves a controlled live enablement policy. After live interop tests, Runtime Owner must confirm the gate is closed if the accepted state is disabled.

For V0.4 production Paperclip intake, Runtime Owner must use a separate production runtime and must not reuse dev/demo `APP_DATA_DIR`, secrets, or process state. Production enablement requires:

- `TASKHUB_RUNTIME_PROFILE=production`
- approved production `APP_BASE_URL`
- `PAPERCLIP_LIVE_MODE=staged` before canary, then `permanent` only after PM acceptance
- `PAPERCLIP_WEBHOOK_ENABLED=true` only during approved staged/permanent windows
- rollback by setting `PAPERCLIP_WEBHOOK_ENABLED=false` and confirming disabled webhook probes return `403`
- production backups treated as secret-bearing when they include `paperclip-connection.json`
