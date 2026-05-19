# UI V2 Whole-System UX QC Third Pass Summary

Generated: 2026-05-18T02:24:03.088Z
Base: http://127.0.0.1:3032

## Route / Viewport Issue Signals

| Route | Viewport | Screenshot | Signals |
|---|---|---|---|
| today | desktop-1440x900 | qc3-today-desktop-1440x900.png | 10 small targets; 6 clipped text candidates; 6 low contrast candidates |
| review-queue | desktop-1440x900 | qc3-review-queue-desktop-1440x900.png | 16 small targets; 1 low contrast candidates |
| all-tasks | desktop-1440x900 | qc3-all-tasks-desktop-1440x900.png | 1 duplicate accessible-name groups; 80 small targets; 67 clipped text candidates; 12 low contrast candidates |
| boards-monitor | desktop-1440x900 | qc3-boards-monitor-desktop-1440x900.png | 10 small targets |
| calendar | desktop-1440x900 | qc3-calendar-desktop-1440x900.png | 13 small targets |
| planner | desktop-1440x900 | qc3-planner-desktop-1440x900.png | 1 duplicate accessible-name groups; 13 small targets; 3 clipped text candidates |
| okr-portfolio | desktop-1440x900 | qc3-okr-portfolio-desktop-1440x900.png | 1 duplicate accessible-name groups; 56 small targets; 15 clipped text candidates |
| weekly-focus | desktop-1440x900 | qc3-weekly-focus-desktop-1440x900.png | 13 small targets |
| docs-ai-trace | desktop-1440x900 | qc3-docs-ai-trace-desktop-1440x900.png | 12 small targets; 4 clipped text candidates; 6 low contrast candidates |
| settings | desktop-1440x900 | qc3-settings-desktop-1440x900.png | 2 duplicate accessible-name groups; 69 small targets; 10 low contrast candidates |
| today | app-pane-747x910 | qc3-today-app-pane-747x910.png | 2 clipped text candidates; 6 low contrast candidates |
| review-queue | app-pane-747x910 | qc3-review-queue-app-pane-747x910.png | 1 low contrast candidates |
| all-tasks | app-pane-747x910 | qc3-all-tasks-app-pane-747x910.png | 6 small targets; 2 clipped text candidates; 12 low contrast candidates |
| boards-monitor | app-pane-747x910 | qc3-boards-monitor-app-pane-747x910.png | 1 duplicate accessible-name groups; 4 small targets |
| calendar | app-pane-747x910 | qc3-calendar-app-pane-747x910.png | none detected by scanner |
| planner | app-pane-747x910 | qc3-planner-app-pane-747x910.png | 1 duplicate accessible-name groups; 3 small targets; 2 clipped text candidates |
| okr-portfolio | app-pane-747x910 | qc3-okr-portfolio-app-pane-747x910.png | 1 duplicate accessible-name groups; 46 small targets |
| weekly-focus | app-pane-747x910 | qc3-weekly-focus-app-pane-747x910.png | 8 small targets |
| docs-ai-trace | app-pane-747x910 | qc3-docs-ai-trace-app-pane-747x910.png | 1 small targets; 6 clipped text candidates; 6 low contrast candidates |
| settings | app-pane-747x910 | qc3-settings-app-pane-747x910.png | 2 duplicate accessible-name groups; 59 small targets; 10 low contrast candidates |
| today | mobile-small-375x667 | qc3-today-mobile-small-375x667.png | 1 low contrast candidates |
| review-queue | mobile-small-375x667 | qc3-review-queue-mobile-small-375x667.png | 1 low contrast candidates |
| all-tasks | mobile-small-375x667 | qc3-all-tasks-mobile-small-375x667.png | 1 small targets; 86 clipped text candidates |
| boards-monitor | mobile-small-375x667 | qc3-boards-monitor-mobile-small-375x667.png | none detected by scanner |
| calendar | mobile-small-375x667 | qc3-calendar-mobile-small-375x667.png | none detected by scanner |
| planner | mobile-small-375x667 | qc3-planner-mobile-small-375x667.png | 1 duplicate accessible-name groups; 3 small targets; 2 clipped text candidates |
| okr-portfolio | mobile-small-375x667 | qc3-okr-portfolio-mobile-small-375x667.png | 1 duplicate accessible-name groups; 46 small targets |
| weekly-focus | mobile-small-375x667 | qc3-weekly-focus-mobile-small-375x667.png | 8 small targets |
| docs-ai-trace | mobile-small-375x667 | qc3-docs-ai-trace-mobile-small-375x667.png | 1 small targets; 6 clipped text candidates; 5 low contrast candidates |
| settings | mobile-small-375x667 | qc3-settings-mobile-small-375x667.png | 2 low contrast candidates |

## Focus / Keyboard Risk Signals

| Route | Viewport | Bad focus count | First problematic samples |
|---|---|---:|---|
| docs-ai-trace | desktop-1440x900 | 6 | 9:Search tasks, boards, runs  no-ring<br>11:Scope filter All BUs. Open scope menu.  no-ring<br>16:(unnamed)  no-ring<br>22:env dev build ui-v2 workspace trisilar trello · ok gcal · ok paperclip · staged gtasks · off last sync 09:23 T Trisilar   no-ring |
| docs-ai-trace | app-pane-747x910 | 7 | 3:(unnamed)  no-ring<br>9:9:32 5G Docs / AI Trace Paperclip & agent run history auth webhook · enforced retention 90 days · runs · 365 days · appr  no-ring<br>12:(unnamed)  no-ring<br>18:9:32 5G Docs / AI Trace Paperclip & agent run history auth webhook · enforced retention 90 days · runs · 365 days · appr  no-ring |
| docs-ai-trace | mobile-small-375x667 | 7 | 3:(unnamed)  no-ring<br>9:9:32 5G Docs / AI Trace Paperclip & agent run history auth webhook · enforced retention 90 days · runs · 365 days · appr  no-ring<br>12:(unnamed)  no-ring<br>18:9:32 5G Docs / AI Trace Paperclip & agent run history auth webhook · enforced retention 90 days · runs · 365 days · appr  no-ring |
| settings | desktop-1440x900 | 2 | 9:Search tasks, boards, runs  no-ring<br>11:Scope filter All BUs. Open scope menu.  no-ring |
| settings | app-pane-747x910 | 0 | none |
| settings | mobile-small-375x667 | 3 | 9:9:32 5G More Routes · integrations · settings Calendar > Planner > OKR / Portfolio > Weekly Focus > Docs / AI Trace > Se  no-ring<br>18:9:32 5G More Routes · integrations · settings Calendar > Planner > OKR / Portfolio > Weekly Focus > Docs / AI Trace > Se  no-ring<br>27:9:32 5G More Routes · integrations · settings Calendar > Planner > OKR / Portfolio > Weekly Focus > Docs / AI Trace > Se  no-ring |
| today | desktop-1440x900 | 5 | 9:Search tasks, boards, runs  no-ring<br>11:Scope filter All BUs. Open scope menu.  no-ring<br>22:env dev build ui-v2 workspace trisilar trello · ok gcal · ok paperclip · staged gtasks · off last sync 09:23 T Trisilar   no-ring<br>31:Search tasks, boards, runs  no-ring |
| today | app-pane-747x910 | 3 | 9:9:32 5G Today Monday, 18 May 2026 Daily command center Monday, 18 May 2026 7 items need attention: 4 overdue / 3 due tod  no-ring<br>18:9:32 5G Today Monday, 18 May 2026 Daily command center Monday, 18 May 2026 7 items need attention: 4 overdue / 3 due tod  no-ring<br>27:9:32 5G Today Monday, 18 May 2026 Daily command center Monday, 18 May 2026 7 items need attention: 4 overdue / 3 due tod  no-ring |
| today | mobile-small-375x667 | 5 | 6:9:32 5G Today Monday, 18 May 2026 Next up · 18:00 today Create proof-based demo content library Project - Marketing Cont  no-ring<br>12:9:32 5G Today Monday, 18 May 2026 Next up · 18:00 today Create proof-based demo content library Project - Marketing Cont  no-ring<br>18:9:32 5G Today Monday, 18 May 2026 Next up · 18:00 today Create proof-based demo content library Project - Marketing Cont  no-ring<br>24:9:32 5G Today Monday, 18 May 2026 Next up · 18:00 today Create proof-based demo content library Project - Marketing Cont  no-ring |
| all-tasks | desktop-1440x900 | 1 | 3:(unnamed) |
| all-tasks | app-pane-747x910 | 6 | 7:9:32 5G All Tasks Cross-board inbox 8 hidden boards excluded from this inbox. Manage visibility in Settings. TASK BOARD   no-ring<br>10:(unnamed)  no-ring<br>17:9:32 5G All Tasks Cross-board inbox 8 hidden boards excluded from this inbox. Manage visibility in Settings. TASK BOARD   no-ring<br>20:(unnamed)  no-ring |
| all-tasks | mobile-small-375x667 | 14 | 2:9:32 5G All Tasks Cross-board inbox 8 hidden boards excluded from this inbox. Manage visibility in Settings. Weekly Spri  no-ring<br>5:(unnamed)  no-ring<br>7:9:32 5G All Tasks Cross-board inbox 8 hidden boards excluded from this inbox. Manage visibility in Settings. Weekly Spri  no-ring<br>10:(unnamed)  no-ring |

## Interaction Checks

```json
[
  {
    "name": "today-scope-picker",
    "before": {
      "expanded": "false",
      "text": "All BUs"
    },
    "after": {
      "expanded": "true",
      "text": "All BUs"
    },
    "popupVisible": 1,
    "focusAfterEscape": {
      "tag": "div",
      "id": "",
      "text": "Scope filter All BUs. Open scope menu.",
      "className": "scope-pick"
    }
  },
  {
    "name": "docs-filter-escape-focus-return",
    "openCount": 1,
    "focusAfterEscape": {
      "tag": "body",
      "id": "",
      "text": "env dev build ui-v2 workspace trisilar trello · ok gcal · ok paperclip · staged gtasks · off last sync 09:23 T Trisilar ",
      "className": ""
    },
    "ariaAfter": "false"
  },
  {
    "name": "docs-filter-stacking-baseline",
    "popupCount": 1,
    "notificationButtons": [
      {
        "i": 6,
        "id": "topbar-notifications-btn",
        "text": "Notifications",
        "cls": "btn btn-icon"
      }
    ]
  },
  {
    "name": "calendar-view-Day",
    "before": {
      "pressed": "false",
      "cls": "",
      "text": "Day"
    },
    "after": {
      "pressed": "true",
      "cls": "on",
      "text": "Day"
    }
  },
  {
    "name": "calendar-view-Week",
    "before": {
      "pressed": "false",
      "cls": "",
      "text": "Week"
    },
    "after": {
      "pressed": "true",
      "cls": "on",
      "text": "Week"
    }
  },
  {
    "name": "calendar-view-Month",
    "before": {
      "pressed": "false",
      "cls": "",
      "text": "Month"
    },
    "after": {
      "pressed": "true",
      "cls": "on",
      "text": "Month"
    }
  },
  {
    "name": "all-edit-card-modal",
    "missingEditCandidate": true
  },
  {
    "name": "settings-anchor-audit-retention",
    "focus": {
      "tag": "button",
      "id": "",
      "text": "Audit / retention",
      "className": "sl on"
    },
    "nearTop": []
  },
  {
    "name": "settings-anchor-notifications",
    "focus": {
      "tag": "button",
      "id": "",
      "text": "Notifications",
      "className": "sl on"
    },
    "nearTop": []
  },
  {
    "name": "settings-anchor-display",
    "focus": {
      "tag": "button",
      "id": "",
      "text": "Display",
      "className": "sl on"
    },
    "nearTop": []
  }
]
```