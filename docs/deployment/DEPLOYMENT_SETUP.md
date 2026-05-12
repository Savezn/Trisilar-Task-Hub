# Deployment Setup - V0.2-W1-02

**Doc Role:** Deploy-readiness reference for company access
**Status:** Active - deploy-readiness reference plus DigitalOcean/Cloudflare hosted dev path for Task Hub
**Owner Role:** Dev
**Implemented by:** Codex Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-12 - **Updated by:** Codex PM
**Related Docs:** `../../README.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `DEV_ENVIRONMENT_DEPLOYMENT.md`, `../plans/VERSION_0_2_PLAN.md`

---

## Purpose

This document describes how to configure Trisilar Task Hub for a hosted dev or production environment without deploying production yet.

For the prepared `V0.2-W1-03` dev deployment config and `V0.2-W1-05` no-domain ngrok demo handoff, see `DEV_ENVIRONMENT_DEPLOYMENT.md`.

`V0.2-W1-02` keeps the app as a long-running Node/Express service and adds deploy-readiness only. Legacy label: W1b.

- hosted OAuth callback configuration
- persistent runtime JSON location
- health check endpoint
- placeholder-only environment documentation

---

## Approved Platform Decision

Demo/current preview target:

- random ngrok URL + temporary Basic Auth is the accepted W1 manual demo path.
- The app runs on a local/dev machine and is exposed through ngrok.
- Temporary Basic Auth protects the demo URL before teammate access.
- Random ngrok URLs are accepted for short manual human demos only; repeat Paperclip testing should use a reserved/static ngrok domain or stable Cloudflare hostname.
- This does not satisfy the stable access or Paperclip integration gate.

Next hosted dev/demo target:

- DigitalOcean is the preferred next hosted dev/demo runtime for Task Hub.
- Cloudflare remains the DNS/security front door, with Cloudflare Access for human teammate access.
- Use Cloudflare Tunnel on the Droplet when possible so app ports do not need to be exposed directly.
- If using proxied DNS instead of Tunnel, put Nginx/Caddy or equivalent reverse proxy on the Droplet and expose only 80/443.
- Prefer Droplet over DigitalOcean App Platform while runtime state is file-backed through `APP_DATA_DIR`.
- Prepare the Cloudflare hostname and Access policy before public exposure. Deploy Task Hub privately on the Droplet first, then connect the Cloudflare route and verify Access before sharing the URL.

Paid hosted target:

- Render Web Service remains the previously approved managed paid target for dev and production.
- Railway Service remains an equivalent managed alternate if Trisilar chooses Railway operationally.
- Do not use Vercel for W1 because the current app uses a long-running Express process and file-backed runtime state.
- Managed Render/Railway setup is deferred unless PM reselects it.

Default access gate:

- Temporary Basic Auth in front of the no-domain ngrok demo URL.
- Cloudflare Access email allowlist in front of stable Cloudflare or hosted URLs.
- Cloudflare Access service token, signed webhook headers, or equivalent service-auth for future Paperclip/API calls.
- Tailscale is acceptable for a private first preview.
- `trycloudflare` remains a troubleshooting option only; its random URL is not suitable for repeat teammate or Paperclip handoff.

Integration identity rule:

- V0.2 uses team-owned shared integration identities, not per-user OAuth/RBAC.
- Dev and production should use separate Trello and Google credential sets wherever practical.
- Do not reuse production Trello tokens, Google refresh tokens, OAuth redirect URIs, calendar IDs, or platform secrets in dev.

---

## Render Setup

Create one service for dev and one separate service for production.

Dev service:

| Setting | Value |
|---|---|
| Type | Web Service |
| Source branch | `dev` |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check path | `/healthz` |
| Node version | Node 20+ |
| Persistent disk | Mount a disk and point `APP_DATA_DIR` to that mount path |

Production service:

| Setting | Value |
|---|---|
| Type | Web Service |
| Source branch | `main` |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check path | `/healthz` |
| Node version | Node 20+ |
| Persistent disk | Separate production disk and separate `APP_DATA_DIR` |

Do not assign or announce the production domain until Cloudflare Access blocks anonymous traffic and PM approves the allowlist.

---

## Railway Alternate

Use the same service shape if Railway is selected:

| Setting | Value |
|---|---|
| Service type | Node web service |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check path | `/healthz` |
| Runtime env vars | Configure through Railway environment variables only |
| Persistent volume | Mount volume and set `APP_DATA_DIR` to that path |

Keep dev and production as separate Railway environments or projects with separate variables and volumes.

---

## Required Environment Variables

Configure these in the platform dashboard only. Do not commit real values.

| Variable | Dev | Production | Notes |
|---|---|---|---|
| `TRELLO_API_KEY` | Dev integration key | Production integration key | Prefer separate team-owned credentials per environment. |
| `TRELLO_TOKEN` | Dev token | Production token | Can mutate Trello; keep environment-specific. |
| `GOOGLE_CLIENT_ID` | Dev OAuth client | Production OAuth client | Must allow the matching redirect URI. |
| `GOOGLE_CLIENT_SECRET` | Dev secret | Production secret | Platform secret only. |
| `GOOGLE_REFRESH_TOKEN` | Dev refresh token | Production refresh token | Generate through admin/bootstrap flow. |
| `GOOGLE_CALENDAR_ID` | Dev/shared test calendar | Production team calendar | Avoid dev writes to production calendars. |
| `GOOGLE_REDIRECT_URI` | Current ngrok callback for temporary demo, then `https://taskhub-dev.trisilar.com/auth/callback` after domain exists | `https://taskhub.trisilar.com/auth/callback` | Must match Google OAuth console. |
| `APP_BASE_URL` | Current ngrok URL for temporary demo, then `https://taskhub-dev.trisilar.com` after domain exists | `https://taskhub.trisilar.com` | Used for OAuth callback messaging. |
| `APP_DATA_DIR` | Dev persistent disk path | Production persistent disk path | Stores runtime JSON files. |
| `PORT` | Platform-managed | Platform-managed | The app already reads `process.env.PORT`. |

`GEMINI_API_KEY` is not required for the web dashboard unless the CLI agent path is deployed.

---

## DigitalOcean Droplet Setup

Use this for the next W1 hosted dev/demo runtime. PM decision is to host Task Hub on DigitalOcean behind Cloudflare. Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner and should be recorded as a service-auth dependency.

| Setting | Value |
|---|---|
| Droplet role | Dev/demo runtime only |
| Source branch | `dev` |
| Runtime | Node 20+ |
| Process manager | PM2, systemd, or equivalent |
| Task Hub bind | `localhost:<taskhub-port>` behind Cloudflare Tunnel or reverse proxy |
| Hosted Paperclip dependency | Confirm base URL and health/readiness path with Paperclip owner |
| Health check path | `/healthz` |
| Persistent state | Server directory assigned to `APP_DATA_DIR` |
| Proposed Task Hub hostname | `taskhub-dev.<cloudflare-domain>` |
| Proposed Paperclip hostname | Confirm current hosted Paperclip hostname with Paperclip owner |
| OAuth callback | `https://taskhub-dev.<cloudflare-domain>/auth/callback` |

Required server-only environment variable names:

- `APP_BASE_URL`
- `GOOGLE_REDIRECT_URI`
- `APP_DATA_DIR`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `TRELLO_API_KEY`
- `TRELLO_TOKEN`

Rules:

- Do not put real `.env` values in git, chat, or docs.
- Keep this dev/demo runtime separate from any future production service.
- Prepare Cloudflare hostname/routing and Access allowlist before exposing the Task Hub preview URL.
- Run Task Hub on a private/local bind first; do not use the raw Droplet IP or unprotected port as the teammate preview URL.
- Confirm backup/export handling for `APP_DATA_DIR` before relying on the Droplet for important state.
- Put Cloudflare Access in front before teammate preview.
- Record hosted Paperclip base URL, health/readiness path, and service-auth requirements from the Paperclip owner.
- Keep W3 live integration blocked until Task Hub hosted URL, hosted Paperclip URL, and service-auth are verified.

---

## Persistent Runtime Files

When `APP_DATA_DIR` is set, the app stores these files in that directory:

- `review-sessions.json`
- `card-events.json`
- `bu-config.json`

Local development keeps the current defaults when `APP_DATA_DIR` is unset.

---

## Temporary ngrok Demo

Use this only for short manual demos or fallback preview windows:

- Start the app from the local `dev` baseline.
- Set `APP_DATA_DIR` to a stable local data directory.
- Start the local Basic Auth proxy and ngrok tunnel.
- Share the current ngrok URL and temporary credentials out of band.
- For OAuth callback testing, set `APP_BASE_URL` and `GOOGLE_REDIRECT_URI` to the current ngrok URL.
- For Paperclip repeat testing, use a reserved/static ngrok domain. A random ngrok URL requires a fresh manual Paperclip endpoint update every run.

The temporary random ngrok demo is accepted for `V0.2-W1-05` manual teammate demo only. It does not satisfy the stable `V0.2-W1-06` Cloudflare Access release gate and must not be used as permanent Paperclip automation or stable service integration.

---

## Cloudflare Access

Protect both URLs before teammate preview:

- `taskhub-dev.<cloudflare-domain>`
- `taskhub.<cloudflare-domain>` when production is explicitly approved later

Rules:

- Allow only approved Trisilar teammate emails or a Trisilar Google group.
- Do not rely on obscured platform URLs as access control.
- QA must verify anonymous access is blocked before any production use.
- Agent/API calls should not depend on interactive email login. Use Cloudflare Access service tokens, signed webhook headers, or an approved machine-auth pattern.
- Paperclip is already hosted on DigitalOcean behind Cloudflare; W3 live connector work still needs service-auth verification with hosted Task Hub.

---

## Verification

Local verification:

```powershell
node server.js
npm.cmd run check:all
```

Manual checks:

- `GET /healthz` returns `200`.
- Local Google OAuth URLs use `http://localhost:3000/auth/callback` by default.
- Hosted envs use `GOOGLE_REDIRECT_URI`.
- With `APP_DATA_DIR` set, runtime JSON files are created in that directory and persist after process restart.
- No secrets appear in committed files, page source, or logs.

---

## Non-Goals

- Do not deploy production in W1.
- Do not implement W2 UI redesign.
- Do not implement W3 Paperclip integration.
- Do not add per-user RBAC or personal OAuth.
- Do not commit secrets or generated credential files.
