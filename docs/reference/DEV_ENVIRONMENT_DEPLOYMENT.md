# Dev Environment Deployment - V0.2 W1c

**Doc Role:** Hosted dev environment setup handoff
**Status:** Runtime setup blocked on Trisilar platform/DNS/Access configuration
**Owner Role:** Dev
**Implemented by:** Codex Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex Dev
**Related Docs:** `DEPLOYMENT_SETUP.md`, `BRANCH_ENVIRONMENT_WORKFLOW.md`, `../plans/VERSION_0_2_PLAN.md`, `../../README.md`

---

## Purpose

This document records the W1c dev environment deployment path only. It prepares the hosted dev service from branch `dev`, documents env var names without secret values, and keeps production untouched.

---

## Platform Decision

Use Render as the default W1c dev service because W1b approved Render as the default long-running Node/Express host with persistent disk support.

Use Railway only if Trisilar account availability makes Railway faster operationally. The alternate Railway config is included, but Render remains the primary path for W1c.

---

## Added Configuration

| File | Purpose |
|---|---|
| `render.yaml` | Render Blueprint for the dev web service on branch `dev` with `/healthz`, `APP_DATA_DIR`, and placeholder secret slots |
| `railway.toml` | Railway alternate service config with the same build/start/health check shape |

No production service is configured in W1c.

---

## Render Dev Service

Create or connect the Render service from the Trisilar GitHub repo using the committed `render.yaml`.

| Setting | Value |
|---|---|
| Service name | `trisilar-task-hub-dev` |
| Source branch | `dev` |
| Build command | `npm install` |
| Start command | `npm start` |
| Node version | `20` |
| Health check path | `/healthz` |
| Persistent disk name | `taskhub-dev-data` |
| Persistent disk mount | `/var/data` |
| `APP_DATA_DIR` | `/var/data` |
| Proposed dev URL | `https://taskhub-dev.trisilar.com` |
| Proposed OAuth callback | `https://taskhub-dev.trisilar.com/auth/callback` |

Required Render environment variable names:

| Variable | Source |
|---|---|
| `APP_BASE_URL` | Non-secret hosted dev URL |
| `GOOGLE_REDIRECT_URI` | Non-secret hosted dev callback URL |
| `APP_DATA_DIR` | Non-secret persistent disk mount path |
| `GOOGLE_CALENDAR_ID` | Dev Google calendar/resource only |
| `GOOGLE_CLIENT_ID` | Dev Google OAuth client only |
| `GOOGLE_CLIENT_SECRET` | Render secret only |
| `GOOGLE_REFRESH_TOKEN` | Render secret only |
| `TRELLO_API_KEY` | Dev Trello key only |
| `TRELLO_TOKEN` | Render secret only |

Do not reuse production Trello tokens, Google refresh tokens, OAuth clients, calendar IDs, or platform secrets in dev where practical.

---

## Railway Alternate

If Railway is selected instead of Render, use `railway.toml` and configure one dev environment only.

Required Railway variable names:

- `APP_BASE_URL`
- `GOOGLE_REDIRECT_URI`
- `APP_DATA_DIR`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `TRELLO_API_KEY`
- `TRELLO_TOKEN`

Attach a Railway volume for file-backed runtime state and set `APP_DATA_DIR` to the mounted path. Keep the dev volume separate from any future production volume.

---

## Cloudflare Access Gate

Before teammate preview, protect the hosted dev URL with Cloudflare Access:

1. Add the dev hostname, for example `taskhub-dev.trisilar.com`, to Cloudflare DNS.
2. Create a Cloudflare Access application for the dev hostname.
3. Add an email allowlist policy for approved Trisilar teammate emails or a Trisilar Google group.
4. Verify anonymous access is blocked before sharing the URL.
5. Verify at least one approved teammate can pass Access and load the app.

Do not rely on the Render or Railway platform URL as access control.

---

## Local Verification Completed

W1c was verified locally before platform setup:

```powershell
node server.js
npm.cmd run check:all
Invoke-WebRequest http://localhost:3000/healthz
```

Observed local results:

- `GET /healthz` returns `200`.
- `npm.cmd run check:all` passes while `node server.js` is running.
- Local OAuth callback remains `http://localhost:3000/auth/callback` when hosted env vars are unset.
- Hosted OAuth callback switches to `GOOGLE_REDIRECT_URI` when configured.
- `APP_DATA_DIR` persists `review-sessions.json`, `card-events.json`, and `bu-config.json` across a second Node process.

---

## Hosted Verification To Complete

After Trisilar configures the platform account, DNS, secrets, and Cloudflare Access:

- Render or Railway deployment from branch `dev` succeeds.
- `GET /healthz` returns `200` through the hosted service.
- Anonymous access to the dev URL is blocked by Cloudflare Access.
- Approved teammate access passes Cloudflare Access.
- The app loads without destructive writes.
- Runtime JSON files are written under the configured persistent disk or volume.

---

## 2026-05-08 Runtime Setup Attempt

Runtime setup by Codex Dev on branch `dev` at `53dc8ff`.

What was checked from the local workstation:

- Confirmed the local checkout is clean on `dev` and matches `origin/dev`.
- Confirmed `render.yaml` targets Render service `trisilar-task-hub-dev` on branch `dev`.
- Confirmed `railway.toml` remains available as the alternate Railway service config.
- Confirmed local environment variable names are present without exposing secret values.
- Checked local CLI availability: `render`, `railway`, `wrangler`, and `cloudflared` were not installed or available in PATH.
- Checked proposed DNS/hosted health endpoint: `taskhub-dev.trisilar.com` did not resolve, so hosted `/healthz` could not be verified.
- Ran hosted-equivalent local runtime with:
  - `APP_DATA_DIR` set to a temporary runtime directory.
  - `APP_BASE_URL=https://taskhub-dev.trisilar.com`.
  - `GOOGLE_REDIRECT_URI=https://taskhub-dev.trisilar.com/auth/callback`.
- Verified local `GET /healthz` returned `200`.
- Verified `/api/calendar/status` used the hosted `GOOGLE_REDIRECT_URI` value.
- Verified `APP_DATA_DIR` wrote runtime files under the configured directory for `bu-config.json` and `review-sessions.json`.
- Did not trigger Google Calendar sync, so `card-events.json` was not written in this pass; its path is still configured through the same `APP_DATA_DIR` helper and should be verified with a non-production sync action after hosted dev credentials are configured.
- Ran `npm.cmd run check:all` against the local hosted-equivalent server; frontend verification and smoke endpoints passed.
- Ran Paperclip contract/mock verification after W2/W3 integration; both passed.

Current conclusion:

- Repo-side W1c configuration is ready.
- Hosted runtime setup is blocked until a Trisilar-controlled platform account/workspace, DNS, secret values, and Cloudflare Access policy are configured.
- No production deployment was attempted.
- No secrets were committed.

---

## Current Runtime Blockers

W1c cannot complete hosted verification from the repo alone. These Trisilar runtime items are required:

- Confirm Render account/workspace access, or choose Railway explicitly.
- Install/authenticate the selected platform CLI or complete setup through the selected platform dashboard.
- Connect the GitHub repo service from branch `dev`.
- Configure dev-only Trello and Google credentials in the platform dashboard.
- Configure the dev Google OAuth redirect URI.
- Configure DNS for the dev hostname; `taskhub-dev.trisilar.com` did not resolve during this Codex Dev attempt.
- Configure Cloudflare Access email allowlist.
- Run anonymous-blocked and approved-teammate access verification.

---

## Non-Goals

- No production deployment.
- No merge to `main`.
- No committed secrets.
- No W2 UI redesign.
- No W3 Paperclip integration.
- No behavior changes beyond dev environment deployment configuration.
