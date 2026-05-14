# Handoff - V0.3 Project Operating Model And Agent Structure

**Doc Role:** Single handoff prompt for the next PM / Documentation Architect agent
**Status:** Ready for handoff
**Created:** 2026-05-14
**Owner:** PM

---

## Purpose

Use this handoff to start a new Codex session from `dev`, create a new branch, and define the long-term Trisilar Task Hub project operating model and agent team structure.

This is a docs-only planning task. It should prepare the project for long-term development with humans and AI agents working together, including Codex-based parallel development across multiple branches and worktrees.

---

## Plain-Language Project Context

Trisilar Task Hub started as a demo/local task dashboard, but it is becoming the core operating system for the organization.

The long-term product should coordinate:

- Human daily operations.
- Trello project boards as execution surfaces.
- Task Hub as the command center and review/control layer.
- Paperclip and future AI agents as controlled intake sources.
- Review Queue as the mandatory human approval gate before any external side effects.
- Runtime governance for access, secrets, monitoring, rollback, and audit.
- Codex agents working in parallel on separate branches and worktrees.

The old `W1 / W2 / W3` workstream structure was useful for V0.2:

- `W1`: access, deployment, runtime, service auth.
- `W2`: full UI redesign.
- `W3`: Paperclip integration.

For long-term development, this is not enough. The project now needs durable role ownership across product, UX, frontend, core workflow, AI integration, runtime, QA/release, integration, and documentation/agent workflow.

---

## Current State To Preserve

- V0.2 W1 access/runtime work is accepted for dev/demo.
- V0.2 W2 full UI redesign is integrated and PM accepted.
- V0.2 W3 Paperclip mock path, live connector, limited window, and true external sender window passed.
- `PAPERCLIP_WEBHOOK_ENABLED=false` remains the runtime default.
- Paperclip live standing dev/demo enablement is not accepted until PM explicitly accepts the standing policy and names owners.
- Review Queue remains the human gate. AI can propose work; it must not bypass human approval.
- Secrets must never be committed, printed in docs, exposed to frontend, or included in handoff files.

---

## Branch / Worktree Instructions

Start from the integration branch:

```text
Base branch:
dev

Create new branch:
feature/project-operating-model-agent-structure
```

Preflight:

```powershell
git fetch origin
git checkout dev
git pull --ff-only origin dev
git checkout -b feature/project-operating-model-agent-structure
git status --short --branch
```

If using a separate Codex worktree, create a dedicated worktree for the new branch. Do not run multiple Codex agents in the same working directory.

---

## Read First

- `CODEX.md`
- `.ai-instructions.md`
- `CONTRIBUTING.md`
- `CURRENT_SPRINT.md`
- `MVP_PRD.md`
- `docs/plans/PROJECT_LADDER.md`
- `docs/plans/VERSION_0_2_PLAN.md`
- `docs/plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md`
- `docs/reference/PROJECT_CONTEXT.md`
- `docs/reference/ARCHITECTURE.md`
- `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md`
- `docs/reference/FILE_ORGANIZATION.md`
- `docs/testing/TEST_STRATEGY.md`
- `docs/logs/DECISION_LOG.md`
- `docs/logs/QA_LOG.md`

---

## Goal

Create the long-term project operating model and agent team structure for Trisilar Task Hub.

The output should make the project suitable for:

1. Human daily operations.
2. AI-generated work intake.
3. Review Queue as the human approval and safety gate.
4. UX/product quality ownership.
5. Runtime/access/secrets ownership.
6. QA/release governance.
7. Codex-based parallel development with multiple agents, branches, and worktrees.
8. Future reusable Codex skills once the operating docs stabilize.

---

## Required Docs To Create

Create these files:

```text
docs/reference/ORGANIZATION_OPERATING_MODEL.md
docs/reference/AI_AGENT_GOVERNANCE.md
docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md
docs/agents/PM.md
docs/agents/UX_OWNER.md
docs/agents/DEV_FRONTEND.md
docs/agents/DEV_CORE.md
docs/agents/AI_INTEGRATION.md
docs/agents/RUNTIME_OWNER.md
docs/agents/QA_RELEASE.md
docs/agents/INTEGRATION_OWNER.md
docs/agents/DOCUMENTATION_WORKFLOW_OWNER.md
```

Create `docs/agents/` if it does not exist.

---

## Required Docs To Update

Update these files:

```text
CURRENT_SPRINT.md
docs/plans/PROJECT_LADDER.md
docs/plans/VERSION_0_2_PLAN.md
docs/reference/FILE_ORGANIZATION.md
```

Update `CODEX.md` and `docs/reference/BRANCH_ENVIRONMENT_WORKFLOW.md` only if the new operating model changes repo-level Codex rules or branch/worktree rules. Do not duplicate large content across files; point to the new reference docs when possible.

---

## Product Operating Model Direction

Use this model:

```text
Trello = execution surface
Task Hub = command center and review/control layer
Review Queue = human approval gate
Paperclip and future AI agents = controlled intake sources
Runtime governance = access, secrets, monitoring, rollback, audit
Codex agents = development workforce operating through branches/worktrees
```

Key principles:

- Do not turn Task Hub into a heavy project-management platform.
- Keep Trello as the board/card execution layer.
- Make Task Hub the place to decide what matters today, what needs review, and what should be pushed outward.
- AI should suggest, summarize, prepare, link, and draft. It should not create external side effects without human approval.
- Review Queue remains mandatory before Trello, Google Calendar, or Google Tasks side effects.
- Paperclip must stay configurable through UI/runtime settings, not hardcoded.
- Every AI-originated task must preserve source, request id, agent run id, evidence, linked task/doc context, and audit trail.
- UX must become an ongoing ownership lane, not a one-time redesign project.

---

## Recommended Long-Term Agent Roles

Define these as role docs under `docs/agents/`:

1. **PM / Product Owner**
   - Owns scope, sequence, acceptance decisions, project ladder, and next action routing.
   - Updates `CURRENT_SPRINT.md` after PM decisions.

2. **UX / Product Experience Owner**
   - Owns usability, workflow clarity, page friction, wording, navigation, empty states, and mobile/desktop UX acceptance.
   - Runs route-by-route usability review before feature acceptance when user-facing workflows change.

3. **Frontend Product Dev**
   - Owns UI implementation, page modules, interaction behavior, and frontend regression fixes.
   - Works from UX-approved scope and preserves existing workflows.

4. **Core Workflow / Backend Dev**
   - Owns backend routes, review-store behavior, task diff, persistence, data normalization, and internal workflow APIs.
   - Does not change runtime flags or secrets.

5. **AI Integration Owner**
   - Owns Paperclip/future agent contracts, HMAC/idempotency/audit behavior, mock/live boundary, and agent attribution.
   - Must preserve Review Queue human gate.

6. **Runtime / Access Owner**
   - Owns hosted dev/demo runtime, Cloudflare Access, env vars, APP_DATA_DIR, service health, runtime feature flags, and rollback.
   - Never commits secrets.

7. **QA / Release Owner**
   - Owns QA evidence, pass/fail reports, regression checks, branch acceptance, and release readiness.
   - Does not implement fixes while acting as QA.

8. **Integration Owner**
   - Owns merging accepted feature branches into `dev`, resolving integration conflicts, running integration QA, and preventing branch contamination.
   - Does not merge sibling workstream branches into each other.

9. **Documentation / Agent Workflow Owner**
   - Owns docs organization, role docs, handoff quality, future skill extraction, and keeping durable prompts concise.
   - Ensures docs do not become stale duplicates of `CURRENT_SPRINT.md`.

---

## Codex Parallel Development Model

Create `docs/reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md` with these rules.

### When Parallel Codex Work Helps

Parallel work is useful when:

- Work slices are independent.
- File ownership is mostly separate.
- Contracts/interfaces are agreed before implementation.
- Each branch can be verified independently.
- Integration QA will run after accepted branches merge into `dev`.

Good examples:

- UX planning docs while backend work continues elsewhere.
- Frontend page polish separate from backend route work.
- AI contract fixture work separate from unrelated UI work.
- QA branch review while Dev works on a different branch.
- Docs governance separate from runtime config work.

### When Parallel Work Should Be Avoided

Avoid parallel work when:

- Multiple agents need to edit the same frontend shell or same large file.
- Data model or contract is still undecided.
- One task depends on another unfinished branch.
- Runtime/secrets are involved.
- PM has not defined a clear owner, branch, write scope, and acceptance criteria.
- The work requires shared migration sequencing.

### Required Parallel Work Rules

- One agent = one role = one branch = one worktree = one ownership scope.
- Agents must not share one feature branch unless explicitly assigned to integration/review.
- Agents must not run in the same working directory.
- Agents must start from `dev` unless PM says otherwise.
- Agents must not merge sibling feature branches into each other.
- Dev agents stage specific files only. Never use `git add .`.
- PM owns task decomposition and next-action routing.
- QA owns acceptance evidence and branch pass/fail.
- Integration Owner owns accepted-branch merges into `dev`.
- Runtime Owner owns runtime changes, environment variables, flags, access, and rollback.
- `CURRENT_SPRINT.md`, `PROJECT_LADDER.md`, and logs remain the single source of truth for status and decisions.
- Role docs and future skills should describe process, not current commit hashes or transient runtime state.

### Branch Contamination Rule

The W3 history cleanup showed that sibling workstream contamination is a real risk. The new model must explicitly prevent cases like W2 UI commits entering W3 branches or W3 integration commits entering W2 branches.

Document how to verify:

```powershell
git status --short --branch
git log --oneline --decorate --max-count=20
git merge-base --is-ancestor <sibling-head> <current-branch>
```

Use the exact sibling commit check only when a known contamination risk exists.

---

## UX / Product Experience Direction

The user has started noticing UI/UX issues. Treat this as a sign that the project needs ongoing UX ownership, not only feature implementation.

Add a future phase:

```text
V0.3 Product Reliability + UX Stabilization
```

Recommended V0.3 focus:

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

Do not jump straight into larger AI automation if core UX is not stable. A system with many AI-generated tasks will become hard to trust if the human workflow is confusing.

---

## Future Codex Skill Direction

Do not create the reusable Codex skill yet unless PM explicitly asks for it.

Recommended sequence:

1. Create and stabilize the operating model docs.
2. Use the role docs in real PM/Dev/QA/Runtime sessions.
3. After the role docs prove useful, extract a single skill:

```text
skills/trisilar-task-hub-workflow/SKILL.md
skills/trisilar-task-hub-workflow/references/pm.md
skills/trisilar-task-hub-workflow/references/ux-owner.md
skills/trisilar-task-hub-workflow/references/dev.md
skills/trisilar-task-hub-workflow/references/qa.md
skills/trisilar-task-hub-workflow/references/runtime-owner.md
skills/trisilar-task-hub-workflow/references/ai-integration.md
```

Skill design rule:

- Keep `SKILL.md` concise.
- Put role details in references.
- Do not put current project status, commit hashes, secrets, or live runtime values in the skill.
- The skill should teach agents how to work in this repo, not replace `CURRENT_SPRINT.md`.

---

## Scope Constraints

This task is docs-only.

Do not:

- Change application code.
- Change runtime configuration.
- Enable `PAPERCLIP_WEBHOOK_ENABLED`.
- Commit secrets.
- Change W1/W2/W3 implementation behavior.
- Deploy production.
- Merge to `main`.
- Replace Trello as the execution surface.
- Bypass Review Queue human approval.

---

## Required Verification

Run:

```powershell
git status --short --branch
git diff --check
```

If only docs changed, do not run runtime verification unless PM explicitly asks. State that runtime checks were skipped because the change was docs-only.

---

## Commit

Recommended commit message:

```text
V0.3: define operating model and agent roles
```

Stage specific files only. Do not use `git add .`.

---

## Expected Final Output

The final response from the agent should include:

- Branch name.
- Commit hash.
- Files created.
- Files updated.
- Verification evidence.
- Short PM summary of the new structure.
- Clear next action.

Expected next action after completion:

```text
Role: PM
Task: Review and accept V0.3 project operating model and long-term agent team structure.

If accepted:
- Decide whether to create `trisilar-task-hub-workflow` Codex skill from the finalized docs.
- Decide whether to start V0.3 Product Reliability + UX Stabilization planning.

If held:
- List exact docs or role boundaries that need revision.
```

