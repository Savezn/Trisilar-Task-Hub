# Deployment Docs

**Doc Role:** Deployment documentation index
**Status:** Active
**Owner:** PM / Dev
**Last Updated:** 2026-05-15
**Updated by:** Codex PM

Deployment and hosted environment documents live here so deployment setup is not mixed with general reference docs.

| File | Purpose |
|---|---|
| `DEPLOYMENT_SETUP.md` | V0.2-W1-02 deploy-readiness setup for DigitalOcean/Cloudflare hosted dev for Task Hub, Render/Railway managed alternates, temporary ngrok demo, env vars, persistent state, and W1-07 service-auth planning; legacy label W1b |
| `DEV_ENVIRONMENT_DEPLOYMENT.md` | V0.2-W1-03 dev deployment config, V0.2-W1-05 ngrok demo handoff, V0.2-W1-06/V0.2-W1-08 Cloudflare + DigitalOcean runtime plan, and W1-07 Paperclip service-auth handoff |
| `DIGITALOCEAN_DASHBOARD_HANDOVER.md` | PM-normalized DigitalOcean Dashboard handoff reference for host layout, Paperclip Docs API boundary, and server-only token rules |
| `RUNTIME_OPERATIONS_RUNBOOK.md` | Runtime incident, restart, rollback, and production Paperclip operations runbook |
| `V05_SQLITE_CANARY_RUNTIME_CHECKLIST.md` | V0.5 hosted dev/demo SQLite canary checklist, rollback proof, stop conditions, and evidence template |
| `TROUBLESHOOTING.md` | Operator and QA troubleshooting guide for runtime, access, route, and Paperclip issues |
| `ENVIRONMENT_MATRIX.md` | Canonical non-secret environment inventory for local, dev/demo, and production |

Related docs:

- `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`
- `../reference/SECURITY_ACCESS_POLICY.md`
- `../reference/DATA_BACKUP_RETENTION_POLICY.md`
- `../operations/TEAM_ONBOARDING_GUIDE.md`
- `../plans/VERSION_0_2_PLAN.md`
- `../../README.md`

Notes:

- DigitalOcean Dashboard handoff facts are preserved as operational reference material, not as a new production-promotion decision.
