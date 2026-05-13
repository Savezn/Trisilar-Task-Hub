# Project Ladder - Trisilar Task Hub

**Doc Role:** Project-wide roadmap ladder and release gate plan
**Status:** Active
**Owner:** PM
**Created:** 2026-05-08
**Last Updated:** 2026-05-13 - **Updated by:** Codex PM
**Related Docs:** `../../TODO.md`, `../../CURRENT_SPRINT.md`, `VERSION_0_2_PLAN.md`, `../reference/PROJECT_CONTEXT.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../testing/TEST_STRATEGY.md`, `../logs/DECISION_LOG.md`

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

The product model stays:

```text
Project Boards = execution surfaces
Task Hub = command center, review queue, portfolio/focus layer
```

Do not expand into a heavy project-management platform. Each ladder level should reduce coordination overhead for a small team using Trello, AI agents, and review gates.

---

## Current Ladder

| Level | Version / Track | Status | Outcome | Release Gate |
|---|---|---|---|---|
| L0 | V0.1 Local MVP | Complete | Stable local Task Hub with modularized routes/pages, Today, Review Queue, Calendar, Planner, OKR, Weekly Focus, and release acceptance | V0.1 release acceptance passed |
| L1 | V0.2 Access Foundation | Active / W1.4 demo accepted; W1.5/W1.7 dev-demo runtime accepted; W1.6 service-auth accepted; Paperclip runtime verification held | Teammates can access stable dev/demo Task Hub safely with environment, persistence, and access-control boundaries; Paperclip is already hosted by its owner but currently offline; random ngrok remains manual-demo-only | Paperclip owner inputs required before W3 live; production/release-grade promotion remains out of scope |
| L2 | V0.2 Full UI Redesign | Complete on `origin/dev@523c948` | Every production page aligns with `docs/design/ui-design-v1-0/` while preserving existing workflows | `V0.2-W2-01`-`V0.2-W2-06` QA/PM accepted and integrated; W2-06 Integration QA/PM accepted on `dev` |
| L3 | V0.2 Paperclip Foundation | Accepted mock / live future | Paperclip task handoff has a contract, mock adapter, attribution, and audit trail without uncontrolled side effects | Contract/mock verification passed; live connector remains separately gated |
| L4 | V0.2 Integration Release | Planned | Accepted W1/W2/W3 work runs together on `dev` without regressions | Integration QA pass on `dev`; PM accepts release candidate |
| L5 | V0.3 Reliability Hardening | Planned | Automated tests, deterministic fixtures, browser regression, CI gate, backend structure hardening | Test strategy implemented enough to reduce manual QA risk |
| L6 | V0.4 Live AI Operations | Planned | Paperclip/live AI handoff can operate with approval gates, attribution, and no accidental Trello/Calendar side effects | Live connector QA with controlled production-like data |
| L7 | V0.5 Team Operating System | Future | Team onboarding, management reporting, portfolio rhythm, and non-developer usability are mature enough for routine company use | Team pilot feedback and operational adoption pass |

---

## Active Level Details

### L1 - V0.2 Access Foundation

**Status:** Active / `V0.2-W1-05` random ngrok manual demo path is accepted; `V0.2-W1-06` Cloudflare Access gate and `V0.2-W1-08` DigitalOcean hosted dev/demo runtime are accepted for dev/demo; `V0.2-W1-07` service-auth topology is accepted; Paperclip runtime verification is held while the Paperclip server is offline.

**Goal:**
Provide a safe dev/demo preview environment before wider teammate access.

**Must include:**

- Local/dev machine running the app from the `dev` baseline for manual demo fallback.
- Random ngrok route for short manual demos only.
- DigitalOcean hosted dev/demo runtime running Task Hub from the `dev` baseline; current checkpoint is `dev@b9961fa` at `https://taskhub.trisila.online`.
- Hosted Paperclip URL recorded, with exact health/readiness path still required from the Paperclip owner.
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
- Paperclip server comes online and PM accepts Paperclip owner inputs before W3 live connector work starts.

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

**Status:** Mock integration accepted; live connector remains future work blocked by runtime/auth topology.

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

**Next live step:**
Live Paperclip connector should be planned only after W1 access boundaries are stable. Paperclip is already hosted on DigitalOcean behind Cloudflare by the Paperclip owner, but runtime verification is held while the Paperclip server is offline. W1-07 service-auth topology is accepted; W3 now needs Paperclip owner confirmation of health/readiness and service-token/signing support before live connector work proceeds.

### L4 - V0.2 Integration Release

**Status:** Planned after active V0.2 gaps close.

**Goal:**
Promote only a coherent internal preview release, not partial work labeled as done.

**Release candidate gate:**

- W1 `V0.2-W1-06` Cloudflare Access evidence and `V0.2-W1-08` DigitalOcean hosted dev/demo evidence for Task Hub accepted for release-grade access. `V0.2-W1-05` random ngrok acceptance covers manual demo only.
- W2 full UI redesign accepted and integrated through `V0.2-W2-06` (`W2f`) on `origin/dev@523c948`.
- W3 mock integration remains passing.
- `npm.cmd run check:all` passes with `node server.js` running.
- Paperclip contract/mock verification passes.
- Desktop/mobile smoke across all production routes passes.
- PM decides whether to merge `dev -> main`.

---

## Future Level Details

### L5 - V0.3 Reliability Hardening

Focus:

- Route and model tests.
- Deterministic Trello/Paperclip fixtures.
- Browser regression for navigation and visual overflow.
- CI verification gate.
- Scoped backend module migration from root modules into `src/` when justified by tests and ADRs.

### L6 - V0.4 Live AI Operations

Focus:

- Live Paperclip connector.
- Approval-gated Trello/Calendar writes.
- Agent attribution, audit trails, replay/debug views.
- Failure handling for duplicate, stale, partial, or low-confidence AI output.

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

Current W2 routing:

```text
V0.2-W2-06 integrated on origin/dev@523c948
-> Integration QA passed
-> PM integration accepted
-> W2 workstream hold / complete
```

This is a W2-only closeout. Do not route W1 deployment/access work or W3 Paperclip work from this W2 handoff.

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
