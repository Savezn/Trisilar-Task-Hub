# Deployment Setup - V0.2 W1b

**Doc Role:** Deploy-readiness reference for company access
**Status:** Ready for QA review
**Owner Role:** Dev
**Implemented by:** Codex Dev
**Created:** 2026-05-08
**Last Updated:** 2026-05-08 - **Updated by:** Codex Dev
**Related Docs:** `../../README.md`, `BRANCH_ENVIRONMENT_WORKFLOW.md`, `DEV_ENVIRONMENT_DEPLOYMENT.md`, `../plans/VERSION_0_2_PLAN.md`

---

## Purpose

This document describes how to configure Trisilar Task Hub for a hosted dev or production environment without deploying production yet.

For the prepared W1c dev-only service path, see `DEV_ENVIRONMENT_DEPLOYMENT.md`.

W1b keeps the app as a long-running Node/Express service and adds deploy-readiness only:

- hosted OAuth callback configuration
- persistent runtime JSON location
- health check endpoint
- placeholder-only environment documentation

---

## Approved Platform Decision

Default target:

- Render Web Service for dev and production.
- Railway Service is an equivalent alternate if Trisilar chooses Railway operationally.
- Do not use Vercel for W1 because the current app uses a long-running Express process and file-backed runtime state.

Default access gate:

- Cloudflare Access email allowlist in front of the hosted URLs.
- Tailscale is acceptable for a private first preview.
- Temporary Basic Auth is a fallback only when a public URL is needed before Cloudflare Access is ready. Credentials must be env-only and temporary.

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
| `GOOGLE_REDIRECT_URI` | `https://taskhub-dev.trisilar.com/auth/callback` | `https://taskhub.trisilar.com/auth/callback` | Must match Google OAuth console. |
| `APP_BASE_URL` | `https://taskhub-dev.trisilar.com` | `https://taskhub.trisilar.com` | Used for OAuth callback messaging. |
| `APP_DATA_DIR` | Dev persistent disk path | Production persistent disk path | Stores runtime JSON files. |
| `PORT` | Platform-managed | Platform-managed | The app already reads `process.env.PORT`. |

`GEMINI_API_KEY` is not required for the web dashboard unless the CLI agent path is deployed.

---

## Persistent Runtime Files

When `APP_DATA_DIR` is set, the app stores these files in that directory:

- `review-sessions.json`
- `card-events.json`
- `bu-config.json`

Local development keeps the current defaults when `APP_DATA_DIR` is unset.

---

## Cloudflare Access

Protect both URLs before teammate preview:

- `taskhub-dev.trisilar.com`
- `taskhub.trisilar.com`

Rules:

- Allow only approved Trisilar teammate emails or a Trisilar Google group.
- Do not rely on obscured platform URLs as access control.
- QA must verify anonymous access is blocked before any production use.

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

- Do not deploy production in W1b.
- Do not implement W2 UI redesign.
- Do not implement W3 Paperclip integration.
- Do not add per-user RBAC or personal OAuth.
- Do not commit secrets or generated credential files.
