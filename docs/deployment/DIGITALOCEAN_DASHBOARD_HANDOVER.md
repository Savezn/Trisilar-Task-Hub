# DigitalOcean Dashboard Handoff

## Document Role

This is a PM-normalized operational reference for the DigitalOcean Task Hub Dashboard handoff and Paperclip Docs API boundary.

It preserves durable runtime facts from the prior handoff without reopening V0.2 release status, W1 deployment acceptance, or W3 Paperclip acceptance.

## Status

- Current status: Reference / operational handoff preserved in source docs.
- Source handoff date: 2026-05-12.
- PM normalization date: 2026-05-15.
- Scope: DigitalOcean Dashboard runtime facts, local service layout, Paperclip Docs API boundary, and verification checklist.
- Not in scope: production promotion, live canary approval, secret disclosure, or new V0.3 product planning.

## Related Documents

- [Deployment Setup](./DEPLOYMENT_SETUP.md)
- [Dev Environment Deployment](./DEV_ENVIRONMENT_DEPLOYMENT.md)
- [Decision Log](../logs/DECISION_LOG.md)
- [V0.2 W3 Paperclip Contract Plan](../plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md)

## PM Summary

The prior handoff confirmed that the DigitalOcean host had a prepared Task Hub Dashboard path and a local Paperclip Docs API integration boundary. The important operating rule is simple:

Task Hub browser code must never receive the Paperclip Docs API token. If Task Hub reads Paperclip document content, it must do so through the Task Hub backend proxy, using server-only environment variables.

This document is a reference for future runtime or reliability work. It does not change the accepted V0.2 release baseline by itself.

## Current Baseline vs Handoff Facts

| Item | Current accepted baseline | Handoff fact to preserve |
| --- | --- | --- |
| Task Hub public route | `https://taskhub.trisila.online` behind Cloudflare Access | Same route family; verify active DNS/Access before QA |
| Task Hub local bind | `127.0.0.1:3000` | Dashboard was prepared to bind locally and stay private behind proxy/Access |
| Task Hub data path | `/home/trisilar/dashboard-data` | Earlier dashboard work also referenced `/home/trisilar/dashboard/` as an app directory |
| Paperclip public route | `https://paperclip.trisila.online` | Same hosted Paperclip dependency |
| Paperclip Docs API | Not part of browser contract | Local API handoff: `http://127.0.0.1:3201` |
| Docs API credential | Server-only if used | `DOCS_API_TOKEN` must never be exposed to browser bundles, client logs, or chat |

## Server Snapshot From Handoff

| Field | Value |
| --- | --- |
| Host | DigitalOcean Droplet |
| Address | `157.230.251.209` |
| SSH user | `trisilar` |
| OS | Ubuntu 24.04 |
| Node | `v22.22.2` |
| npm | `10.9.7` |
| Dashboard app directory | `/home/trisilar/dashboard/` |
| Dashboard bind | `127.0.0.1:3000` |
| Paperclip Docs API bind | `127.0.0.1:3201` |

Verify these values before using them for any new deployment or QA run. They are preserved as handoff evidence, not as a guarantee of current runtime state.

## Prepared Server Layout

The handoff referenced this target layout:

```text
/home/trisilar/dashboard/
  package.json
  package-lock.json
  .env
  deploy.sh
  deploy-files.sh
  tools/check-docs-api.mjs
  systemd/
    taskhub-dashboard.service
    paperclip-docs-api.service
```

The accepted V0.2 runtime docs use `/home/trisilar/dashboard-data` for app data. Keep app code, app data, generated runtime data, and local secrets separated when updating the host.

## Paperclip Docs API Boundary

If Task Hub reads document content from Paperclip, use the following boundary:

- Paperclip Docs API stays bound to localhost, normally `http://127.0.0.1:3201`.
- Task Hub backend reads the API using server-only configuration:
  - `DOCS_API_URL`
  - `DOCS_API_TOKEN`
- Browser routes call Task Hub endpoints only.
- Browser JavaScript must not call the Paperclip Docs API directly.
- `DOCS_API_TOKEN` must not be added to client-visible env vars, static assets, logs, screenshots, docs examples, or chat messages.

## Suggested Backend Proxy Shape

Use this shape for future implementation or verification work:

```text
Browser -> Task Hub backend route -> Paperclip Docs API localhost service
```

Recommended route behavior:

- Validate user access through the existing Task Hub session/auth boundary.
- Add `Authorization: Bearer <DOCS_API_TOKEN>` only inside the backend request.
- Return only the document fields needed by the UI.
- Redact token values from errors and logs.
- Fail closed when `DOCS_API_URL` or `DOCS_API_TOKEN` is missing.

## Deployment And Verification Checklist

Before relying on this handoff in a new runtime task:

1. Confirm the active branch and commit deployed to the DigitalOcean host.
2. Confirm `taskhub-dashboard.service` is active or identify the current process manager.
3. Confirm Task Hub is bound to `127.0.0.1:3000`, not a public interface.
4. Confirm Cloudflare Access or an equivalent gate protects the public route.
5. Confirm Paperclip is reachable through the approved dependency route.
6. If Docs API is used, confirm `DOCS_API_URL` points to localhost and `DOCS_API_TOKEN` exists only server-side.
7. Run a browser check through the public Task Hub route.
8. Run a server-side Docs API check without printing token values.
9. Record evidence in the relevant QA or release log before promoting the path.

## PM Decision

Accepted as a preserved operational handoff reference.

This document should be used by future V0.3 Product Reliability, UX Stabilization, or deployment reliability work when they need the DigitalOcean Dashboard context or the Paperclip Docs API token boundary.
