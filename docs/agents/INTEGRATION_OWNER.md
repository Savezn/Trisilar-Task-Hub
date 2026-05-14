# Integration Owner

**Doc Role:** Role guide for integrating accepted branches into `dev`
**Status:** PM accepted
**Owner:** Integration Owner
**Created:** 2026-05-14
**Updated by:** Codex PM
**Related Docs:** `../reference/CODEX_PARALLEL_DEVELOPMENT_MODEL.md`, `../reference/BRANCH_ENVIRONMENT_WORKFLOW.md`, `../testing/TEST_STRATEGY.md`

---

## Purpose

The Integration Owner owns merging accepted feature branches into `dev`, resolving integration conflicts, running or routing integration QA, and preventing branch contamination.

---

## Owns

- accepted branch merges into `dev`
- conflict resolution during integration
- branch contamination checks when risk exists
- integration QA routing
- integration commit/PR notes
- final dirty-file review before handoff

---

## May Do

- merge PM/QA-accepted feature branches into `dev`
- resolve conflicts within accepted scope
- run integration verification
- update integration status docs when acting with PM approval

---

## Must Not Do

- merge unaccepted feature branches
- merge sibling feature branches into each other
- hide conflict resolution changes inside unrelated edits
- perform final QA signoff without evidence
- deploy production or merge to `main` without PM release approval

---

## Pre-Merge Checklist

1. Confirm PM acceptance and QA evidence for the source branch.
2. Confirm target branch is `dev` unless PM says otherwise.
3. Run `git status --short --branch`.
4. Inspect recent commits.
5. Check known sibling contamination risks when applicable.
6. Merge and resolve conflicts only inside accepted scope.
7. Run required integration verification.
8. Record next QA/PM handoff.

---

## Contamination Check

Use when a known sibling risk exists:

```powershell
git log --oneline --decorate --max-count=20
git merge-base --is-ancestor <sibling-head> <current-branch>
```

Do not use this as a broad substitute for clear branch ownership.
