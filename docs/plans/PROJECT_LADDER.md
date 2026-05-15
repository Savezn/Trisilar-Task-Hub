# Project Ladder - Trisilar Task Hub

**Doc Role:** Project-wide roadmap ladder and release gate plan
**Status:** Active
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-15 - **Updated by:** Codex PM / Integration Owner
**Related Docs:** `../../TODO.md`, `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `../reference/PROJECT_CONTEXT.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../testing/TEST_STRATEGY.md`, `../logs/DECISION_LOG.md`

---

## How to Use This Document

- Use this as the project-wide ladder before choosing the next Dev/QA/PM task.
- Use `CURRENT_SPRINT.md` only for the current snapshot and next action.
- Use version plans, such as `VERSION_0_2_PLAN.md`, for detailed implementation phases.
- Use `TODO.md` as the high-level index that points here, not as a duplicate of this ladder.
- Update this document when PM changes release sequencing, quality gates, or the definition of "done" for a version.

---

## Ladder Principle

Trisilar Task Hub should climb in small, verifiable product layers:

```text
Stable local command center
-> safe internal access
-> full usable UI
-> controlled AI handoff
-> release-grade reliability
-> broader team operations
```

The product model now uses this long-term operating model:

```text
Trello = execution surface
Task Hub = command center and review/control layer
Review Queue = human approval gate
Paperclip and future AI agents = controlled intake sources
Runtime governance = access, secrets, monitoring, rollback, audit
Codex agents = development workforce operating through branches/worktrees
```

Do not expand into a heavy project-management platform. Each ladder level should reduce coordination overhead for a small team using Trello, AI agents, and review gates. See `../reference/ORGANIZATION_OPERATING_MODEL.md` for the durable model.

---

## Current Ladder

| Level | Version / Track | Status | Outcome | Release Gate |
|---|---|---|---|---|
| L0 | V0.1 Local MVP | Complete | Stable local Task Hub with modularized routes/pages, Today, Review Queue, Calendar, Planner, OKR, Weekly Focus, and release acceptance | V0.1 release acceptance passed |
| L1 | V0.2 Access Foundation | Complete for dev/demo baseline | Teammates can access stable dev/demo Task Hub safely with environment, persistence, and access-control boundaries; Paperclip runtime health and Task Hub service-token reachability are confirmed for W3 planning; random ngrok remains manual-demo-only | Production deploy remains a separate runtime decision |
| L2 | V0.2 Full UI Redesign | Complete on `origin/dev@523c948` | Every production page aligns with `docs/design/ui-design-v1-0/` while preserving existing workflows | `V0.2-W2-01`-`V0.2-W2-06` QA/PM accepted and integrated; W2-06 Integration QA/PM accepted on `dev` |
| L3 | V0.2 Paperclip Foundation | Complete for V0.2 / standing dev-demo monitor active | Paperclip task handoff has a contract, mock adapter, attribution, audit trail, signed inbound webhook, preserved human gate, safe cleanup for accumulated test sessions, retained traceability, and read-only operations visibility | Contract/mock verification passed; W3-02 signed webhook and live interop passed; W3-03 standing dev/demo observation active; W3-04/W3-04a cleanup merged to `dev@7ea4650`; runtime cleanup completed with 0 pending / 6 rejected / 0 Trello-linked; W3-05 operations status and copy polish merged/deployed at `dev@2c302dc`; closeout status is on `origin/dev@ff20e48` |
| L4 | V0.2 Integration Release | Complete | Accepted W1/W2/W3 work runs together on `dev` without regressions | Release/integration cleanup QA passed on clean `origin/dev@8027324`; workstream branch/worktree residue cleaned |
| L5 | V0.3 Product Reliability + UX Stabilization | Complete on dev/dev-demo; PM accepted for main promotion through PR #20 | UX issue intake, route-by-route usability review, Review Queue clarity, audit visibility, repeatable browser regression, and release checklist for `dev -> main` | RUX-02A through RUX-06 are PM accepted, integrated, deployed to dev/demo, and release-candidate verified; production deploy remains a separate runtime decision |
| L6 | V0.4 Live AI Operations | Active; production private runtime + Cloudflare Access route prepared; staged canary pending service-auth and Settings connection | Paperclip/live AI handoff can operate with approval gates, attribution, and no accidental Trello/Calendar side effects | Production service-token path, Settings signing-secret connection, staged canary, then 24-hour read-only monitoring |
| L7 | V0.5 Team Operating System | Future | Team onboarding, management reporting, portfolio rhythm, and non-developer usability are mature enough for routine company use | Team pilot feedback and operational adoption pass |

---

## Active Level Details

### L1 - V0.2 Access Foundation

**Status:** Complete for the V0.2 dev/demo access baseline. `V0.2-W1-05` random ngrok manual demo path is accepted; `V0.2-W1-06` Cloudflare Access gate and `V0.2-W1-08` DigitalOcean hosted dev/demo runtime are accepted for dev/demo; `V0.2-W1-07` service-auth topology is accepted; Paperclip runtime inputs are confirmed.

**Goal:**
Provide a safe dev/demo preview environment before wider teammate access.

**Must include:**

- Local/dev machine running the app from the `dev` baseline for manual demo fallback.
- Random ngrok route for short manual demos only.
- DigitalOcean hosted dev/demo runtime running Task Hub from the `dev` baseline; current checkpoint is `dev@b9961fa` at `https://taskhub.trisila.online`.
- Hosted Paperclip URL and health path recorded: `https://paperclip.trisila.online` and `/healthz`.
- Cloudflare route for the PM-approved preview hostname.
- Local or dashboard-managed dev-only secrets; no secret values in git.
- Stable `APP_DATA_DIR` for file-backed runtime data.
- `APP_BASE_URL` and OAuth redirect URI configured for the current demo URL or stable preview hostname.
- Temporary Basic Auth before sharing the ngrok demo URL.
- Cloudflare Access email allowlist before sharing a stable Cloudflare preview URL.
- Cloudflare Access service-token plus signed-webhook machine-auth pattern before Paperclip/API automation.
- Non-destructive preview app smoke.

**Done when:**

- Local and tunneled `GET /healthz` pass.
- Anonymous access is blocked by the active access gate.
- Approved teammate access works.
- PM accepted `V0.2-W1-06` stable access-gated preview evidence and `V0.2-W1-08` Task Hub hosted dev/demo runtime evidence as dev/demo complete. `V0.2-W1-05` random ngrok is already accepted for short manual teammate demo only.
- Paperclip runtime input checkpoint is recorded before W3 live connector work starts.

### L2 - V0.2 Full UI Redesign

**Status:** `V0.2-W2-01` through `V0.2-W2-06` are QA/PM accepted and integrated; `V0.2-W2-06` is PM accepted on `origin/dev@523c948`.

**Goal:**
Make the whole app feel like one coherent command center, not a mix of old screens and one redesigned page.

**Required ladder:**

| Canonical ID | Alias | Status | Outcome |
|---|---|---|---|
| `V0.2-W2-01` | `W2a` | Accepted | Shell foundation, mobile nav baseline, Today redesign |
| `V0.2-W2-02` | `W2b` | Accepted `d33d8f7` | Review Queue redesign and shared task drawer foundation |
| `V0.2-W2-03` | `W2c` | Accepted `ea807fd` | Tasks inbox and cross-board task rows |
| `V0.2-W2-04` | `W2d` | Accepted `47ebd84` / integrated on `dev@0b77aed` | Boards monitor and team board views |
| `V0.2-W2-05` | `W2e` | Accepted `4638df7` / integrated on `dev@3fca059` | Calendar and Planner redesign |
| `V0.2-W2-06` | `W2f` | Integrated / PM accepted on `origin/dev@523c948` | Settings, OKR, and Weekly Focus polish |

**Done when:**

- Every production route has desktop/mobile visual QA evidence.
- Existing live workflows still work or are verified with controlled responses when credentials are unavailable.
- No mobile page-level horizontal overflow remains.
- PM accepted `V0.2-W2-06` (`W2f`) integration on `origin/dev@523c948` and explicitly marked the integrated Full UI Redesign complete.

### L3 - V0.2 Paperclip Foundation

**Status:** Mock integration accepted; live connector code and live interop accepted at `c1e4df2`; runtime webhook gate remains disabled by default.

**Goal:**
Allow AI-agent output to enter Task Hub through a contract-first review path.

**Already accepted:**

- Contract validation.
- Mock endpoint.
- Duplicate `requestId` rejection.
- Invalid payload field-level errors.
- Session/task attribution and audit persistence.
- No live Paperclip call.
- No Trello/Calendar side effect before approval.

**Live connector acceptance:**
Live Paperclip connector uses the accepted W1 access boundaries. Paperclip is hosted on DigitalOcean behind Cloudflare by the Paperclip owner. Runtime inputs are confirmed: base URL `https://paperclip.trisila.online`, health path `/healthz`, source id `paperclip-do-dev`, environment `dev`, local runtime port `3100`, service `paperclip.service`, and Task Hub service-token `/healthz` check status `200` from the Paperclip server. `V0.2-W3-02` is accepted after signed webhook local QA and live interop returned HTTP `201` for request `pc_live_interop_20260514115714`, created Review Queue session `5c5ad00e-d7b8-4c34-91d2-b17a1ca1566a`, and kept the task `pending`. W3 merged to `dev` at `a89c26a`. `V0.2-W3-03` controlled live enablement policy is PM accepted, a runtime-local signed canary window passed for request `pc_w3_03_window_20260514062346`, a true external sender window passed for request `pc_true_external_20260514064709`, the standing dev/demo observation start passed for request `pc_standing_observation_20260514092342`, and two follow-up canaries passed with 0 Trello-linked side effects. Runtime is `PAPERCLIP_WEBHOOK_ENABLED=true` for dev/demo observation; routine monitoring is now read-only to avoid unnecessary pending canary tasks. Keep secret values out of docs/git and preserve rollback readiness.

### L4 - V0.2 Integration Release

**Status:** Complete. V0.2 release/integration cleanup QA passed on clean `origin/dev@8027324`, and stale W1/W2/W3 branches/worktrees were removed after verification.

**Goal:**
Promote only a coherent internal preview release, not partial work labeled as done.

**Release candidate gate:**

- W1 `V0.2-W1-06` Cloudflare Access evidence and `V0.2-W1-08` DigitalOcean hosted dev/demo evidence for Task Hub accepted for release-grade access. `V0.2-W1-05` random ngrok acceptance covers manual demo only.
- W2 full UI redesign accepted and integrated through `V0.2-W2-06` (`W2f`) on `origin/dev@523c948`.
- W3 mock integration and W3 live connector verification remain passing.
- `npm.cmd run check:all` passes with `node server.js` running.
- Paperclip contract/mock/live webhook verification passes.
- Desktop/mobile smoke across all production routes passes.
- PM decides whether to merge `dev -> main`.

---

## Future Level Details

### L5 - V0.3 Product Reliability + UX Stabilization

Focus:

- UX issue intake and prioritization.
- Route-by-route usability review.
- Review Queue flow clarity.
- Docs / Review / Task linking clarity.
- Today and Tasks decision-flow polish.
- Mobile/desktop regression checks.
- Empty/error/loading state clarity.
- Audit/trace visibility for AI-originated work.
- Test coverage and repeatable browser regression.
- Release checklist for `dev -> main`.
- Scoped backend module migration from root modules into `src/` only when justified by tests and ADRs.

V0.3 should stabilize the human workflow before expanding live AI automation. A system with many AI-generated tasks will be hard to trust if review, task linking, and daily decision flow are unclear.

### L6 - V0.4 Live AI Operations

Focus:

- Controlled Paperclip live enablement only after named runtime owner, QA canary, rollback path, and monitoring/audit expectations are recorded for the approved window.
- Approval-gated Trello/Calendar writes.
- Agent attribution, audit trails, replay/debug views.
- Failure handling for duplicate, stale, partial, or low-confidence AI output.

Current V0.4 route:

```text
V0.4 repo readiness integrated to dev@7e069b5
-> Runtime Owner prepared separate production Task Hub at https://taskhub-prod.trisila.online
-> Runtime Owner / Paperclip Owner complete production service-token path and Settings signing-secret connection
-> QA / Runtime / Paperclip Owner run staged production canary and negative checks
-> 24-hour read-only monitoring
-> PM decides permanent enablement
```

### L7 - V0.5 Team Operating System

Focus:

- Teammate onboarding and non-developer usage.
- Management/portfolio reporting.
- Team rhythm support for weekly planning and review.
- Lower-friction operations without replacing Trello project boards.

---

## Guardrails

- Do not merge partial W2 visual work to `main` as "full redesign."
- Do not start live Paperclip calls before approval gates, attribution, and no-side-effect checks are preserved.
- Do not treat W1 deployment docs or repo readiness as runtime/access verification.
- Do not add broad platform features that make the tool heavier for a small team.
- Do not use `main` as an integration branch.
- Do not skip QA after behavior-changing Dev work.

---

## Current PM Routing

Current routing:

```text
Paperclip runtime inputs confirmed
-> Task Hub service-token /healthz check from Paperclip server passed
-> V0.2-W3-02 live Paperclip -> Task Hub webhook connector accepted
-> W3 merged to dev at a89c26a
-> V0.2-W3-03 controlled live enablement policy accepted
-> limited runtime-local canary window passed
-> true external Paperclip sender window passed
-> standing dev/demo enablement policy planning started
-> standing dev/demo observation window started
-> two follow-up canaries passed with 0 Trello-linked side effects
-> runtime gate is PAPERCLIP_WEBHOOK_ENABLED=true for dev/demo observation
-> routine monitoring is read-only unless PM/QA requests active probing
-> V0.2-W3-04 Paperclip Review Queue cleanup accepted and merged to dev@7ea4650
-> V0.2-W3-04a cleanup audit retention accepted and merged to dev@7ea4650
-> runtime cleanup completed: 0 pending / 0 approved / 6 rejected / 0 Trello-linked
-> V0.2-W3-05 Paperclip Live Operations Hardening accepted at b0d70ff
-> V0.2-W3-05 merged/deployed at dev@2c302dc and closed out at origin/dev@ff20e48
-> V0.3 operating model and long-term agent roles accepted
-> V0.3 operating model merged to dev at ed9fae0
-> V0.3 Product Reliability + UX Stabilization accepted through V0.3-RUX-06
-> V0.3 RUX integrated through PR #18 and merged to origin/dev@02fe7cf
-> dev/demo runtime deployed from dev@02fe7cf and runtime QA passed
-> PR #19 closed V0.3 docs on origin/dev@e05eb66
-> PR #20 release candidate verified and PM accepted for main promotion
```

This is now a post-V0.3 main release route. Do not reopen W1 Task Hub runtime work, do not deploy production, do not expose service-token or HMAC secret values, and do not change the standing Paperclip dev/demo observation policy. Production deployment remains a separate Runtime / PM decision.

---

## Change Attribution

| Date | Change | Updated by |
|---|---|---|
| 2026-05-08 | Created project-wide ladder after W2 scope clarification and V0.2 doc consolidation | Codex PM |
| 2026-05-08 | Updated L1 W1 access language to canonical `V0.2-W1-05`/`V0.2-W1-06` no-cost preview structure | Codex PM |
| 2026-05-08 | Accepted `V0.2-W2-02` at `d33d8f7` and routed L2 to W2-02 integration into `dev` before `V0.2-W2-03` starts | Codex PM |
| 2026-05-08 | Updated L1 to reflect no-domain ngrok + temporary Basic Auth demo path while keeping Cloudflare Access as the stable release-grade gate | Codex PM |
| 2026-05-09 | Accepted W1.4 random ngrok URL path for manual teammate demo only; stable Paperclip/service endpoint remains deferred | Codex PM |
| 2026-05-12 | Rebaselined L1 to DigitalOcean hosted dev/demo behind Cloudflare; historical Paperclip localhost blocker later superseded by hosted Paperclip confirmation | Codex PM |
| 2026-05-12 | Updated L1/L3 after PM confirmed Paperclip is already hosted on DigitalOcean behind Cloudflare; remaining runtime path is Task Hub plus service-auth verification | Codex PM |
| 2026-05-13 | Recorded L1 runtime checkpoint after Task Hub was configured on DigitalOcean behind Cloudflare Access at `taskhub.trisila.online`; QA acceptance and service-auth planning remain open | Codex PM |
| 2026-05-13 | Accepted `V0.2-W1-06` and `V0.2-W1-08` as Cloudflare-protected DigitalOcean dev/demo runtime complete after QA pass; routed L1 next to `V0.2-W1-07` service-auth planning | Codex PM |
| 2026-05-13 | Planned `V0.2-W1-07` service-auth topology using Paperclip -> Task Hub webhook with Cloudflare Access service token plus signed webhook headers; routed L1 next to QA/PM review | Codex PM / Dev |
| 2026-05-13 | Accepted `V0.2-W1-07` after PR #11 QA/PM pass and merge at `fa87ac4`; routed L1 next to Paperclip owner input confirmation before W3 live connector planning | Codex PM |
| 2026-05-13 | Held W1 Paperclip runtime verification while the Paperclip server is offline; kept L1 Task Hub runtime accepted and routed non-blocked work back to L2 `V0.2-W2-06` | Codex PM |
| 2026-05-13 | Accepted `V0.2-W2-06` at `bd3e441`; routed L2 next to Dev Integration into `dev` | Codex PM |
| 2026-05-13 | Accepted `V0.2-W2-06` integration on `origin/dev@523c948`; marked L2 Full UI Redesign complete on the integrated `dev` line | Codex PM |
| 2026-05-09 | Accepted `V0.2-W2-03` at `ea807fd` and routed L2 to W2-03 integration into `dev` before `V0.2-W2-04` starts | Codex PM |
| 2026-05-14 | Recorded Paperclip runtime inputs and Task Hub service-token `/healthz` success from the Paperclip server; routed L3 next to `V0.2-W3-02` live webhook connector | Codex PM / Runtime |
| 2026-05-14 | Accepted `V0.2-W3-02` live webhook connector code and live signed sender interop; kept runtime `PAPERCLIP_WEBHOOK_ENABLED=false` after test | Codex PM / Paperclip Owner / QA |
| 2026-05-14 | PM accepted `V0.2-W3-03` controlled live enablement policy after W3 merge to `dev` at `a89c26a`; runtime gate remains closed until PM approves a named live window | Codex PM |
| 2026-05-14 | Completed limited `V0.2-W3-03` runtime-local signed canary window; runtime returned to `PAPERCLIP_WEBHOOK_ENABLED=false` | Codex Runtime Owner / QA |
| 2026-05-14 | PM held standing Paperclip enablement and routed next to a true external Paperclip sender window; runtime gate remains `PAPERCLIP_WEBHOOK_ENABLED=false` | Codex PM |
| 2026-05-14 | Completed true external `V0.2-W3-03` Paperclip sender window from Paperclip runtime host/env through Cloudflare Access and HMAC; runtime returned to `PAPERCLIP_WEBHOOK_ENABLED=false` | Codex Runtime Owner / Paperclip Owner / QA |
| 2026-05-14 | Started planning standing dev/demo enablement policy for `V0.2-W3-03`; Monitor Owner, Rollback Owner, monitoring checklist, stop conditions, rollback steps, and PM acceptance criteria are recorded before any standing flag change | Codex PM |
| 2026-05-14 | Started `V0.2-W3-03` standing dev/demo observation window; runtime `PAPERCLIP_WEBHOOK_ENABLED=true`; canary/replay/negative checks passed and Review Queue human gate remained intact | Codex PM / Runtime Owner / QA / Paperclip Owner |
| 2026-05-14 | Continued standing dev/demo observation with read-only routine monitoring after two follow-up canaries passed and pending Paperclip tasks reached 6 with 0 Trello-linked side effects | Codex PM |
| 2026-05-14 | Planned `V0.2-W3-04` Paperclip Review Queue Cleanup as the next L3 hygiene step before further Paperclip feature expansion | Codex PM |
| 2026-05-14 | Accepted `V0.2-W3-04` and `V0.2-W3-04a`; cleanup and audit retention merged to `dev@7ea4650`, deployed to runtime, and cleaned Paperclip test artifacts from 6 pending to 0 pending / 6 rejected / 0 Trello-linked | Codex PM / Runtime Owner / QA |
| 2026-05-14 | Planned `V0.2-W3-05` Paperclip Live Operations Hardening as the next L3 operations visibility step | Codex PM |
| 2026-05-14 | Accepted `V0.2-W3-05` at `b0d70ff`; read-only operations visibility is integrated on latest `origin/dev` | Codex PM / QA / Integration Owner |
| 2026-05-14 | Merged and deployed `V0.2-W3-05` to `dev@2c302dc`; L3 Paperclip Foundation is complete for V0.2 while standing dev/demo read-only monitoring continues | Codex PM / Runtime Owner / QA |
| 2026-05-14 | Added V0.3 Product Reliability + UX Stabilization and long-term agent operating model review route | Codex PM / Documentation Architect |
| 2026-05-14 | Accepted the V0.3 operating model and routed next to V0.3 Product Reliability + UX Stabilization planning; deferred reusable Codex skill extraction | Codex PM |
| 2026-05-14 | Recorded V0.3 RUX PM acceptance through RUX-06 and later closed it on dev/dev-demo at `origin/dev@02fe7cf` | Codex PM / Integration Owner |
| 2026-05-14 | Closed V0.3 RUX on `origin/dev@02fe7cf` and dev/demo runtime after runtime QA pass | Codex PM / Runtime Owner / QA |
| 2026-05-14 | Accepted PR #20 V0.3 `dev -> main` release candidate after release QA pass | Codex PM / QA / Integration Owner |
