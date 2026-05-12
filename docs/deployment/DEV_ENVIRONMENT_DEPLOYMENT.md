# Dev Environment Deployment - V0.2-W1-03 / V0.2-W1-05

**Doc Role:** Dev deployment config and no-cost preview runtime handoff
**Status:** `V0.2-W1-05` accepted as random ngrok URL manual demo only; next path is DigitalOcean hosted dev/demo behind Cloudflare
**Owner Role:** Dev
**Implemented by:** Codex Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-12 - **Updated by:** Codex PM
**Related Docs:** `DEPLOYMENT_SETUP.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../plans/VERSION_0_2_PLAN.md`, `../../README.md`

---

## Purpose

This document records the `V0.2-W1-03` dev deployment config and the `V0.2-W1-05` no-cost preview runtime handoff. It documents env var names without secret values and keeps production untouched. Legacy label: W1c.

Current runtime decision: keep random ngrok URL + temporary Basic Auth as the accepted short manual teammate demo path only. The next W1 path is DigitalOcean hosted dev/demo behind Cloudflare. Paperclip currently runs on localhost on Noffy's machine, so stable Paperclip integration remains deferred until Paperclip has a reachable hostname or calls Task Hub through an approved service-auth path.

---

## Platform Decision

Use random ngrok URL + temporary Basic Auth as the current W1 manual teammate demo path. The app runs on a local/dev machine, ngrok exposes it through a public demo URL, and the Basic Auth proxy gates access before sharing. This path is accepted for manual demo only, not permanent Paperclip automation or stable service integration.

Use DigitalOcean Droplet + Cloudflare as the next stable dev/demo runtime. Cloudflare should own DNS/security/access, and the Droplet should run Task Hub from `dev` with persistent `APP_DATA_DIR`. Cloudflare Tunnel is preferred when possible; proxied DNS plus reverse proxy is acceptable if PM/DevOps choose it.

Keep Render as the previously approved managed hosted dev service because `V0.2-W1-02` approved Render as a long-running Node/Express host with persistent disk support. Render setup is deferred unless PM reselects it.

Use Railway only if Trisilar account availability makes Railway faster operationally or PM chooses it as the managed hosted alternate. The alternate Railway config is included, but it is not the next planned W1 path.

---

## Added Configuration

| File | Purpose |
|---|---|
| `render.yaml` | Render Blueprint for the dev web service on branch `dev` with `/healthz`, `APP_DATA_DIR`, and placeholder secret slots |
| `railway.toml` | Railway alternate service config with the same build/start/health check shape |

No production service is configured in W1. The next hosted work is dev/demo only and must not create or promote a production service.

---

## No-Domain ngrok Demo Path

Run the app on the local/dev machine and expose it through ngrok only for short manual demos or fallback preview windows:

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
- Random ngrok URLs are accepted for a one-off human demo.
- Paperclip or repeat multi-agent testing should use a reserved/static ngrok domain, or the endpoint must be updated manually every run.
- The ngrok demo does not replace `V0.2-W1-06` stable Cloudflare Access verification.

---

## Stable Cloudflare Preview Path

Run the app on the DigitalOcean Droplet or local/dev machine and expose it through Cloudflare:

| Setting | Value |
|---|---|
| Local app | `http://localhost:<taskhub-port>` |
| Connector | `cloudflared` Tunnel preferred; proxied DNS + reverse proxy acceptable |
| Dev hostname | `taskhub-dev.<cloudflare-domain>` or PM-confirmed equivalent |
| Access gate | Cloudflare Access email allowlist |
| `APP_BASE_URL` | `https://taskhub-dev.<cloudflare-domain>` |
| `GOOGLE_REDIRECT_URI` | `https://taskhub-dev.<cloudflare-domain>/auth/callback` |
| `APP_DATA_DIR` | Stable hosted dev/demo data directory |

Rules:

- Keep the runtime host online during teammate preview.
- Store dev secrets in server-only `.env` or approved runtime secret storage only.
- Do not commit secrets or generated runtime data.
- Verify anonymous access is blocked before sharing the URL.
- Use Cloudflare Access before sharing a stable hostname.

---

## DigitalOcean Dev/Demo Runtime

Use this path for `V0.2-W1-08` if PM confirms DigitalOcean.

| Setting | Value |
|---|---|
| Runtime role | Dev/demo only |
| Source branch | `dev` |
| Runtime | Node 20+ |
| Process manager | PM2, systemd, or equivalent |
| Bind target | `localhost:<taskhub-port>` |
| Cloudflare route | `taskhub-dev.<cloudflare-domain>` to the Droplet |
| Access gate | Cloudflare Access email allowlist |
| Service auth | Cloudflare Access service token or signed webhook headers for future agent/API access |
| `APP_BASE_URL` | `https://taskhub-dev.<cloudflare-domain>` |
| `GOOGLE_REDIRECT_URI` | `https://taskhub-dev.<cloudflare-domain>/auth/callback` |
| `APP_DATA_DIR` | Persistent server directory |

Verification:

- `GET /healthz` returns `200` from the Cloudflare hostname.
- Anonymous browser access is blocked by Cloudflare Access.
- Approved teammate access passes Cloudflare Access and loads the app.
- Runtime JSON files persist under `APP_DATA_DIR` after app restart.
- `/planner` handles Google Tasks disconnected/reconnect state without blocking Trello deadlines.
- No production service is deployed.
- No secrets are committed.

Paperclip note:

- Paperclip currently runs on localhost on Noffy's machine.
- If Paperclip calls Task Hub, configure Paperclip to use the stable Task Hub hostname plus service-auth.
- If Task Hub must call Paperclip, Noffy must expose Paperclip through its own stable Cloudflare Tunnel/hostname or Paperclip must move to hosted runtime.
- Do not mark W3 live integration ready while Paperclip is localhost-only.

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

This remains the stable access model for repeat teammate preview and future service-token patterns. PM now expects Cloudflare to sit in front of the DigitalOcean hosted dev/demo runtime.

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

- DigitalOcean runtime from branch `dev` succeeds, or PM explicitly reselects Render/Railway.
- `GET /healthz` returns `200` through the hosted service.
- Anonymous access to the dev URL is blocked by Cloudflare Access.
- Approved teammate access passes Cloudflare Access.
- The app loads without destructive writes.
- Runtime JSON files are written under the configured persistent disk or volume.
- Paperclip runtime dependency is recorded: localhost-only on Noffy's machine, Cloudflare Tunnel, or hosted runtime.

---

## 2026-05-09 W1.4 QA / PM Acceptance

Reviewed by Codex QA and accepted by Codex PM as a demo-only runtime path.

QA evidence:

- Anonymous/no-auth access through ngrok returned `401`.
- Authenticated `GET /healthz` through ngrok returned `200`.
- Authenticated `GET /` loaded Task Hub content.
- `/api/calendar/status` returned `redirectUri` matching the current ngrok URL + `/auth/callback`.
- `APP_DATA_DIR` is stable and local-only: `C:\Users\User\AppData\Local\TrisilarTaskHub\demo-data`.
- Git status showed no repo changes.
- No production deployment, paid Render/Railway use, W2 UI redesign, or new W3 Paperclip behavior was observed.

PM acceptance:

- `V0.2-W1-05` is accepted as a short manual teammate demo path only.
- Use the current local handoff file: `C:\Users\User\Desktop\Trisilar-TaskHub-current-demo-url.txt`.
- Keep Basic Auth enabled and share URL/password out of band only.
- Do not use the random ngrok URL for permanent Paperclip automation or stable service integration.
- This acceptance is historical for W1.4 only. Current W1 planning has moved toward DigitalOcean hosted dev/demo behind Cloudflare.

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

Historical conclusion:

- `V0.2-W1-05` can support a short two-person manual demo without paid hosting or a domain.
- For Paperclip repeat testing, use a reserved/static ngrok domain or update Paperclip with the current URL each run.
- This conclusion predates the later DigitalOcean + Cloudflare rebaseline.

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

Historical conclusion:

- Repo-side `V0.2-W1-03` configuration is ready.
- The stable Cloudflare `V0.2-W1-06` runtime setup was blocked at the time because Cloudflare Tunnel/DNS, local secret values, and Cloudflare Access policy were not configured.
- No production deployment was attempted.
- No secrets were committed.

---

## Current Runtime Blockers

The current ngrok demo path is available for short-lived preview, but stable Cloudflare/DigitalOcean access cannot complete from the repo alone. These Trisilar runtime items are required for `V0.2-W1-06` / `V0.2-W1-08`:

- Confirm Cloudflare domain and preview hostname, default `taskhub-dev.<cloudflare-domain>`, or record a PM-approved alternate.
- Confirm DigitalOcean account access and Droplet details.
- Install or authenticate `cloudflared` on the Droplet if using Cloudflare Tunnel.
- Run the app from the `dev` baseline with stable `APP_DATA_DIR`.
- Configure dev-only Trello and Google credentials on the server or in a secure runtime dashboard; do not put values in chat or git.
- Configure the dev Google OAuth redirect URI.
- Configure DNS/Tunnel for the dev hostname.
- Configure Cloudflare Access email allowlist.
- Run anonymous-blocked and approved-teammate access verification.
- Confirm whether Paperclip remains localhost on Noffy's machine, is exposed through Cloudflare Tunnel, or will move to hosted runtime.

For repeat Paperclip demo use before stable Cloudflare/DigitalOcean verification, configure a reserved/static ngrok domain or explicitly update Paperclip with the current manual URL for that run. Random URLs remain unsuitable for permanent automation.

---

## Non-Goals

- No production deployment.
- No merge to `main`.
- No committed secrets.
- No W2 UI redesign.
- No W3 Paperclip integration.
- No behavior changes beyond W1 dev deployment/no-cost preview configuration.
