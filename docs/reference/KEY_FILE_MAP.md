# Key File Map - Trisilar Task Hub

**Doc Role:** Reference map for targeted grep/read workflows
**Status:** Active reference
**Last Updated:** 2026-05-08 - **Updated by:** Codex PM

Use this file when an agent needs to locate common frontend/backend functions without reading large files in full.

---

## Lookup Table
*(ช่วย Dev ใช้ Grep + offset/limit แทนการอ่านทั้งไฟล์)*

| สิ่งที่ต้องการ | ไฟล์ | คำสั่ง |
|---|---|---|
| `toast` / `esc` / format helpers | `public/js/utils.js` | อ่านทั้งไฟล์ (ok) |
| `api` object | `public/js/api.js` | อ่านทั้งไฟล์ (ok) |
| `S` global state / `COLORS` | `public/js/state.js` | อ่านทั้งไฟล์ (ok) |
| `navigateTo` | `public/js/router.js` | อ่านทั้งไฟล์ (ok) |
| Today page (showTodayPage, buildTodayRow) | `public/js/pages/today.js` | อ่านทั้งไฟล์ (ok) |
| Review Queue page (showReviewPage, buildSessionCard, updateReviewBadge) | `public/js/pages/review.js` | อ่านทั้งไฟล์ (ok) |
| `renderAllTasks` / All Tasks page | `public/app.js` | `Grep("renderAllTasks", "public/app.js")` |
| `refreshCurrentView` | `public/app.js` | `Grep("refreshCurrentView", "public/app.js")` |
| OKR page render | `public/js/pages/okr.js` | `Grep("renderOKRPage", "public/js/pages/okr.js")` |
| `exportTasksCSV` | `public/app.js` | `Grep("exportTasksCSV", "public/app.js")` |
| `openEditAllTasks` (shared modal) | `public/app.js` | `Grep("openEditAllTasks", "public/app.js")` |
| `getAllowedCards` | `public/app.js` | `Grep("getAllowedCards", "public/app.js")` |

---
