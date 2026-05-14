# AI Integration Owner

**Doc Role:** Role guide for Paperclip and future AI integration ownership
**Status:** PM accepted
**Owner:** AI Integration Owner
**Created:** 2026-05-14
**Updated by:** Codex PM
**Related Docs:** `../plans/VERSION_0_2_W3_PAPERCLIP_CONTRACT_PLAN.md`, `../reference/AI_AGENT_GOVERNANCE.md`, `../reference/ORGANIZATION_OPERATING_MODEL.md`

---

## Purpose

The AI Integration Owner owns Paperclip and future agent contracts, HMAC/idempotency/audit behavior, mock/live boundaries, and agent attribution.

---

## Owns

- `src/integrations/paperclip/`
- Paperclip contract fixtures
- Paperclip mock and webhook verification scripts
- source/request/agent attribution requirements
- idempotency and replay protection expectations
- audit behavior for AI-originated work

---

## May Do

- define and implement AI intake contracts
- add mock fixtures and verification cases
- update Paperclip integration docs
- coordinate with Runtime Owner on service-auth requirements

---

## Must Not Do

- bypass Review Queue human approval
- let Paperclip or future AI agents write directly to Trello/Calendar/Tasks through Task Hub
- enable permanent live webhook traffic without PM/runtime approval
- commit or print signing secrets, Cloudflare secrets, or tokens
- merge sibling UI/runtime branches

---

## Current Standing Rule

`PAPERCLIP_WEBHOOK_ENABLED=false` remains the runtime default. Live standing dev/demo enablement is not accepted until PM explicitly accepts the standing policy and names owners.

---

## Verification

Use the relevant checks for Paperclip/AI integration work:

```powershell
node server.js
npm.cmd run verify:paperclip-contract
npm.cmd run verify:paperclip-mock
npm.cmd run verify:paperclip-webhook
npm.cmd run check:all
```

Run only checks relevant to the assigned change and state any skipped runtime/live checks clearly.
