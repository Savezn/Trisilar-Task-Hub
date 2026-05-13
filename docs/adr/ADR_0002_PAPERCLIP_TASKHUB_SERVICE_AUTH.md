# ADR 0002 - Paperclip to Task Hub Service Auth

**Status:** Accepted
**Date:** 2026-05-13
**Owner:** PM / Dev
**Updated by:** Codex PM / Dev

---

## Context

Task Hub is accepted as a Cloudflare-protected DigitalOcean dev/demo runtime at `https://taskhub.trisila.online`. Paperclip is hosted separately on DigitalOcean behind Cloudflare by the Paperclip owner.

Human users access Task Hub through Cloudflare Access email login. That interactive login is not suitable for Paperclip or other machine clients. W3 live connector work needs a service-auth topology before any live endpoint is implemented.

Task Hub must remain the human review and approval boundary. Paperclip may propose tasks, but Paperclip must not write directly to Trello, Google Calendar, or Google Tasks through this app.

---

## Decision

Use Paperclip-to-Task-Hub webhook as the first live integration direction.

```text
Hosted Paperclip
  -> Cloudflare Access service token
  -> Task Hub Cloudflare hostname
  -> Task Hub Paperclip webhook adapter
  -> Review Queue
  -> human approval
  -> existing Trello / Google paths
```

Do not start with Task Hub polling Paperclip. Task Hub may later call a Paperclip health/readiness endpoint for diagnostics, but that is not required for the first W3 live connector.

Use two layers of machine auth:

1. Cloudflare Access service token at the edge.
2. Signed webhook headers at the Task Hub application boundary.

Human Cloudflare Access email allowlists and machine/API auth are separate policies. The service token is for Paperclip runtime calls only and must not be used as a human login bypass.

Recommended live endpoint shape for W3:

```text
POST /api/integrations/paperclip/webhook
```

The route remains W3-owned and must not be implemented in W1. W1 only records the topology, env var names, and handoff rules.

---

## Required Runtime Names

Task Hub runtime names:

- `PAPERCLIP_WEBHOOK_ENABLED`
- `PAPERCLIP_WEBHOOK_SIGNING_SECRET`
- `PAPERCLIP_WEBHOOK_MAX_SKEW_SECONDS`
- `PAPERCLIP_ALLOWED_SOURCE_ID`
- `PAPERCLIP_ALLOWED_ENVIRONMENT`
- `PAPERCLIP_BASE_URL`
- `PAPERCLIP_HEALTH_PATH`
- `CLOUDFLARE_ACCESS_AUD`
- `CLOUDFLARE_ACCESS_TEAM_DOMAIN`

Paperclip runtime names:

- `TASKHUB_BASE_URL`
- `TASKHUB_PAPERCLIP_WEBHOOK_PATH`
- `TASKHUB_WEBHOOK_SIGNING_SECRET`
- `TASKHUB_CF_ACCESS_CLIENT_ID`
- `TASKHUB_CF_ACCESS_CLIENT_SECRET`

Do not commit values for any of these names. Store values only in platform dashboards or server-only environment files.

---

## Signed Webhook Requirement

Paperclip requests should include:

- `X-TaskHub-Request-Id`
- `X-TaskHub-Timestamp`
- `X-TaskHub-Signature`
- `X-Paperclip-Source`
- `X-Paperclip-Agent-Run-Id`

The signature should be HMAC-SHA256 over a stable canonical string that includes method, path, timestamp, request id, and raw request body.

Task Hub should reject requests when:

- the Cloudflare Access service token is missing or invalid,
- the timestamp is outside the configured skew window,
- the signature is invalid,
- the `requestId` has already been processed with a different payload,
- the source/environment is not allowed.

---

## Idempotency and Replay

`requestId` is the idempotency key. Re-sending the same `requestId` with the same payload must not create duplicate review sessions. Re-sending the same `requestId` with a different payload must be rejected and logged for audit.

The future W3 implementation should persist:

- `requestId`
- payload hash
- received timestamp
- source system/environment
- Paperclip agent/run identifiers
- resulting Task Hub review session id

---

## Consequences

Positive:

- Keeps Task Hub as the human approval boundary.
- Avoids storing Paperclip service credentials in browser code.
- Gives Cloudflare a clear edge-control role while still allowing app-level replay protection.
- Lets W3 implement the live route after auth topology is accepted.

Tradeoffs:

- Paperclip owner must configure service-token headers and webhook signing.
- Task Hub W3 implementation must preserve the raw request body or equivalent canonical body for signature verification.
- Cloudflare Access service-token setup is operationally separate from human email allowlists.

---

## Alternatives Considered

| Alternative | Why not chosen |
|---|---|
| Human Cloudflare Access login for Paperclip | Machine clients should not depend on interactive email login |
| Basic Auth for Paperclip | Acceptable for short demos, but weaker and not aligned with Cloudflare Access deployment |
| Task Hub polling Paperclip first | Adds scheduler/state complexity and is not needed for the first live task handoff |
| Cloudflare Access service token only | Good edge gate, but app-level signed request and idempotency are still needed for replay/audit protection |

---

## Related Docs

- `docs/plans/VERSION_0_2_PLAN.md`
- `docs/plans/VERSION_0_2_W1_COMPANY_ACCESS_DEPLOYMENT_PLAN.md`
- `docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md`
- `docs/deployment/DEPLOYMENT_SETUP.md`
- `docs/deployment/DEV_ENVIRONMENT_DEPLOYMENT.md`
