# Environment Matrix - Trisilar Task Hub

**Doc Role:** Canonical non-secret environment inventory
**Status:** Active
**Owner:** Runtime Owner / PM
**Created:** 2026-05-15
**Updated by:** Codex PM / Runtime Owner
**Related Docs:** `RUNTIME_OPERATIONS_RUNBOOK.md`, `TROUBLESHOOTING.md`, `DEPLOYMENT_SETUP.md`, `DEV_ENVIRONMENT_DEPLOYMENT.md`, `../plans/VERSION_0_4_LIVE_AI_OPERATIONS_PAPERCLIP_PRODUCTION_PLAN.md`

---

## Purpose

Use this matrix to orient agents and operators before runtime, QA, deployment, or Paperclip work. It records non-secret runtime facts only.

If this matrix conflicts with live runtime evidence, verify live state and update this document through a Runtime Owner docs task.

---

## Environment Summary

| Environment | Hostname | Source branch / commit | Runtime role | Access |
|---|---|---|---|---|
| Local development | `http://localhost:3000` by default | active branch | implementation and local checks | local machine only |
| Dev/demo | `https://taskhub.trisila.online` | accepted `dev` runtime | internal preview and dev/demo Paperclip observation | Cloudflare Access |
| Production | `https://taskhub-prod.trisila.online` | accepted production runtime commit | production Paperclip intake and real team use after staged acceptance | Cloudflare Access |

---

## Runtime Matrix

| Field | Local | Dev/demo | Production |
|---|---|---|---|
| Runtime profile | default/dev | dev/demo | `production` |
| Expected branch | topic branch or `dev` | `dev` | accepted production release/runtime commit |
| Public access | not public | blocked by Cloudflare Access | blocked by Cloudflare Access |
| Human access | local user | Cloudflare Access email login | Cloudflare Access email login |
| Machine access | none by default | service-token path when approved | production service-token path only |
| Data directory | local fallback or local `APP_DATA_DIR` | dev/demo `APP_DATA_DIR` | `/home/trisilar/taskhub-prod-data` per current V0.4 plan |
| Paperclip source id | mock/dev as assigned | `paperclip-do-dev` | `paperclip-do-prod` |
| Paperclip environment | mock/dev as assigned | `dev` | `production` |
| Default webhook gate | disabled unless task says otherwise | standing dev/demo policy may be enabled | disabled before staged/permanent approval |
| Live mode | not production | dev/demo observation | `disabled`, `staged`, or `permanent` |

---

## Production Current State

As of the current V0.4 plan:

- production private runtime is prepared
- Cloudflare tunnel route, DNS, and Access app are prepared
- anonymous public access should be blocked
- production service-token validation is pending
- Paperclip Settings signing-secret connection is pending
- staged production canary is not approved yet
- no production Trello, Calendar, or Google Tasks write is required for acceptance

Do not claim permanent production integration until staged QA, read-only monitoring, and PM acceptance are recorded.

---

## Required Evidence By Environment

| Environment | Minimum evidence |
|---|---|
| Local | branch, worktree, `git status --short --branch`, relevant verification command |
| Dev/demo | source commit, service health, access block/allow evidence, relevant route checks |
| Production | source commit, private runtime health, Cloudflare Access block, separate `APP_DATA_DIR`, disabled gate before staged window, rollback path |

---

## Non-Secret Env Var Names

These names may appear in docs without values:

- `APP_BASE_URL`
- `APP_DATA_DIR`
- `TASKHUB_RUNTIME_PROFILE`
- `PAPERCLIP_ALLOWED_SOURCE_ID`
- `PAPERCLIP_ALLOWED_ENVIRONMENT`
- `PAPERCLIP_WEBHOOK_ENABLED`
- `PAPERCLIP_LIVE_MODE`
- `TASKHUB_BASE_URL`
- `TASKHUB_PAPERCLIP_WEBHOOK_PATH`
- `TASKHUB_CF_ACCESS_CLIENT_ID`
- `TASKHUB_CF_ACCESS_CLIENT_SECRET`
- `TASKHUB_WEBHOOK_SIGNING_SECRET`

Values for secrets must remain runtime-only.

---

## Update Rule

Update this matrix when:

- hostname changes
- runtime service changes
- source branch policy changes
- `APP_DATA_DIR` location changes
- Cloudflare Access policy changes
- Paperclip source/environment changes
- production staged/permanent state changes
