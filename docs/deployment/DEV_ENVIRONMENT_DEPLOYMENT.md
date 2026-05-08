# Dev Environment Deployment - V0.2-W1-03 / V0.2-W1-05

**Doc Role:** Dev deployment config and no-cost preview runtime handoff
**Status:** `V0.2-W1-05` no-domain ngrok demo path active; `V0.2-W1-06` Cloudflare Access path blocked until domain/subdomain exists
**Owner Role:** Dev
**Implemented by:** Codex Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM
**Related Docs:** `DEPLOYMENT_SETUP.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../plans/VERSION_0_2_PLAN.md`, `../../README.md`

---

## Purpose

This document records the `V0.2-W1-03` dev deployment config and the `V0.2-W1-05` no-cost preview runtime handoff. It documents env var names without secret values and keeps production untouched. Legacy label: W1c.

Current no-domain runtime decision: use ngrok + temporary Basic Auth for a short teammate demo while no Trisilar domain/subdomain is available. Cloudflare named tunnel + Cloudflare Access remains the stable access-gated path after DNS is available.

---

## Platform Decision

Use ngrok + temporary Basic Auth as the current no-domain W1 teammate demo path. The app runs on a local/dev machine, ngrok exposes it through a public demo URL, and the Basic Auth proxy gates access before sharing.

Use Cloudflare Tunnel + Cloudflare Access as the durable no-cost teammate preview path once a domain/subdomain is available. At that point, `cloudflared` should expose the app through the dev hostname, and Cloudflare Access should gate human teammate access by email allowlist.

Keep Render as the default paid hosted dev service because `V0.2-W1-02` approved Render as the default long-running Node/Express host with persistent disk support. Paid Render setup is deferred until always-on runtime is justified.

Use Railway only if Trisilar account availability makes Railway faster operationally or PM chooses it as the paid hosted alternate. The alternate Railway config is included, but it is not the W1 no-cost preview path.

---

## Added Configuration

| File | Purpose |
|---|---|
| `render.yaml` | Render Blueprint for the dev web service on branch `dev` with `/healthz`, `APP_DATA_DIR`, and placeholder secret slots |
| `railway.toml` | Railway alternate service config with the same build/start/health check shape |

No production service is configured in W1. Paid hosted dev service creation is deferred while W1 uses the local tunnel preview path.

---

## No-Domain ngrok Demo Path

Run the app on the local/dev machine and expose it through ngrok while no domain/subdomain is available:

| Setting | Value |
|---|---|
| Local app | `http://localhost:3000` |
| Temporary proxy | Local Basic Auth proxy |
| Tunnel connector | ngrok |
| Public URL | Random ngrok URL unless a reserved/static ngrok domain is configured |
| Access gate | Temporary Basic Auth |
| `APP_BASE_URL` | Current ngrok URL when testing hosted callbacks |
| `GOOGLE_REDIRECT_URI` | Current ngrok URL + `/auth/callback` when testing hosted callbacks |
| `APP_DATA_DIR` | Stable local preview data directory |

Local helper artifacts outside git:

| File | Purpose |
|---|---|
| `C:\Users\User\Desktop\Start Trisilar TaskHub Demo (ngrok).lnk` | Manual Desktop shortcut to start the demo |
| `C:\Users\User\Desktop\Start-Trisilar-TaskHub-Demo-Ngrok.ps1` | Local launcher for app, Basic Auth proxy, and ngrok |
| `C:\Users\User\Desktop\Trisilar-TaskHub-current-demo-url.txt` | Local-only handoff file with current URL and temporary credentials |
| `C:\Users\User\Desktop\Trisilar-TaskHub-Demo-Ngrok.local.example.ps1` | Local-only example override file |

Rules:

- Do not commit Desktop launcher files or generated handoff files.
- Share the current URL and temporary password out of band.
- Random ngrok URLs are acceptable for a one-off human demo.
- Paperclip or repeat multi-agent testing should use a reserved/static ngrok domain, or the endpoint must be updated manually every run.
- The ngrok demo does not replace `V0.2-W1-06` stable Cloudflare Access verification.

---

## Stable Cloudflare Preview Path

Run the app on the local/dev machine and expose it through Cloudflare Tunnel:

| Setting | Value |
|---|---|
| Local app | `http://localhost:3000` |
| Tunnel connector | `cloudflared` |
| Dev hostname | `taskhub-dev.trisilar.com` or PM-confirmed equivalent |
| Access gate | Cloudflare Access email allowlist |
| `APP_BASE_URL` | `https://taskhub-dev.trisilar.com` |
| `GOOGLE_REDIRECT_URI` | `https://taskhub-dev.trisilar.com/auth/callback` |
| `APP_DATA_DIR` | Stable local preview data directory |

Rules:

- Keep the local machine online during teammate preview.
- Store dev secrets in local `.env` or approved runtime secret storage only.
- Do not commit secrets or generated runtime data.
- Verify anonymous access is blocked before sharing the URL.
- Use Cloudflare Access only after a domain/subdomain is available.

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

This gate is deferred until Trisilar has a domain/subdomain for the dev preview hostname. It remains the stable access model for repeat teammate preview and future service-token patterns.

Before teammate preview, protect the hosted dev URL with Cloudflare Access:

1. Add the dev hostname, for example `taskhub-dev.trisilar.com`, to Cloudflare DNS.
2. Create a Cloudflare Access application for the dev hostname.
3. Add an email allowlist policy for approved Trisilar teammate emails or a Trisilar Google group.
4. Verify anonymous access is blocked before sharing the URL.
5. Verify at least one approved teammate can pass Access and load the app.

Do not rely on the Render or Railway platform URL as access control.

---

## Local Verification Completed

`V0.2-W1-03` was verified locally before platform/runtime setup:

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

## 2026-05-08 ngrok Demo Launcher Evidence

Runtime setup by Codex Dev for the no-domain temporary demo path.

What was verified locally:

- ngrok is installed and authenticated (`3.39.1-msix-stable`).
- ngrok config is present under the local user profile.
- The Desktop shortcut and local launcher start a local Task Hub server, a temporary Basic Auth proxy, and an ngrok tunnel.
- The smoke run returned a public `ngrok-free.dev` URL.
- `GET /healthz` returned `200` through the public ngrok URL after Basic Auth.
- The launcher writes the current URL and temporary credentials to a Desktop handoff file outside git.
- The smoke test stopped its local processes after verification.

Current conclusion:

- `V0.2-W1-05` can support a short two-person demo without paid hosting or a domain.
- For Paperclip repeat testing, use a reserved/static ngrok domain or update Paperclip with the current URL each run.
- `V0.2-W1-06` remains blocked until a domain/subdomain and Cloudflare Access policy are available.

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

- Repo-side `V0.2-W1-03` configuration is ready.
- The stable Cloudflare `V0.2-W1-06` runtime setup is blocked until Cloudflare Tunnel/DNS, local secret values, and Cloudflare Access policy are configured.
- No production deployment was attempted.
- No secrets were committed.

---

## Current Runtime Blockers

The current ngrok demo path is available for short-lived preview, but stable Cloudflare access cannot complete from the repo alone. These Trisilar runtime items are required for `V0.2-W1-06`:

- Confirm preview hostname, default `taskhub-dev.trisilar.com`, or record a PM-approved alternate.
- Confirm a domain/subdomain exists for that hostname.
- Install or authenticate `cloudflared` on the local/dev machine.
- Run the app locally from the `dev` baseline with stable `APP_DATA_DIR`.
- Configure dev-only Trello and Google credentials locally or in a secure runtime dashboard; do not put values in chat or git.
- Configure the dev Google OAuth redirect URI.
- Configure DNS for the dev hostname; `taskhub-dev.trisilar.com` did not resolve during this Codex Dev attempt.
- Configure Cloudflare Access email allowlist.
- Run anonymous-blocked and approved-teammate access verification.

For repeat Paperclip demo use before `V0.2-W1-06`, configure a reserved/static ngrok domain and set `APP_BASE_URL` / `GOOGLE_REDIRECT_URI` to that stable ngrok URL for the demo session.

---

## Non-Goals

- No production deployment.
- No merge to `main`.
- No committed secrets.
- No W2 UI redesign.
- No W3 Paperclip integration.
- No behavior changes beyond W1 dev deployment/no-cost preview configuration.
