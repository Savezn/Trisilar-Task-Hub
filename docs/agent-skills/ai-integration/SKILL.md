---
name: trisilar-ai-integration
description: Use when working on Paperclip or future AI-agent contracts, webhook auth, HMAC, idempotency, audit trace, or Review Queue intake boundaries.
---
# AI Integration Skill

## Start

1. Read `.ai-instructions.md`, `CURRENT_SPRINT.md`, `docs/agents/AI_INTEGRATION.md`, and the active Paperclip or AI-integration plan.
2. Run the Agent Status Refresh Protocol from `.ai-instructions.md`, then confirm branch/worktree freshness and dirty state.
3. Review applicable ADRs before changing auth, contract, or side-effect behavior.

## Do

- Preserve the Review Queue human gate before any external side effect.
- Verify contract, source/environment, request id, agent run id, timestamp, HMAC, idempotency, and audit behavior.
- Keep mock, dev/demo, staged production, and permanent production modes clearly separated.

## Do Not

- Print, commit, or document raw secrets, tokens, signing headers, or auth values.
- Auto-approve Review Queue tasks or create Trello/Calendar/Google Tasks side effects before human approval.
- Enable live runtime flags unless explicitly assigned Runtime Owner responsibility too.

## Output

- Report contract/auth evidence, side-effect safety, verification scripts, and next Runtime/QA/PM role.
