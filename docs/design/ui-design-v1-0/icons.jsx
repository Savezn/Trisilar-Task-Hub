// ── Lucide-style inline SVG icons ────────────────────────────────────────────
const I = (props, paths) => (
  <svg
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={props.weight || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={props.style}
    className={props.className}
  >
    {paths}
  </svg>
);

const Icon = {
  Sun: (p) => I(p, <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>),
  Moon: (p) => I(p, <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>),
  Today: (p) => I(p, <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="15" r="1.5" fill="currentColor"/></>),
  Inbox: (p) => I(p, <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>),
  Layout: (p) => I(p, <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></>),
  Calendar: (p) => I(p, <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>),
  Sparkles: (p) => I(p, <><path d="M12 3l1.9 5.7L20 11l-6.1 2.3L12 19l-1.9-5.7L4 11l6.1-2.3z"/><path d="M19 3v4M21 5h-4"/></>),
  Target: (p) => I(p, <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></>),
  Settings: (p) => I(p, <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>),
  Search: (p) => I(p, <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>),
  Plus: (p) => I(p, <path d="M12 5v14M5 12h14"/>),
  Check: (p) => I(p, <path d="M20 6 9 17l-5-5"/>),
  X: (p) => I(p, <path d="M18 6 6 18M6 6l12 12"/>),
  ChevronRight: (p) => I(p, <path d="m9 18 6-6-6-6"/>),
  ChevronDown: (p) => I(p, <path d="m6 9 6 6 6-6"/>),
  ChevronsLeft: (p) => I(p, <><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></>),
  ChevronsRight: (p) => I(p, <><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></>),
  Clock: (p) => I(p, <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>),
  AlertTriangle: (p) => I(p, <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4M12 17h.01"/></>),
  Filter: (p) => I(p, <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>),
  MoreH: (p) => I(p, <><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/><circle cx="5" cy="12" r="1.5" fill="currentColor"/></>),
  RefreshCw: (p) => I(p, <><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></>),
  Bell: (p) => I(p, <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>),
  CheckSquare: (p) => I(p, <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>),
  Square: (p) => I(p, <rect x="3" y="3" width="18" height="18" rx="2"/>),
  Link: (p) => I(p, <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>),
  Trello: (p) => I(p, <><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="3" height="9"/><rect x="14" y="7" width="3" height="5"/></>),
  Edit: (p) => I(p, <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></>),
  Trash: (p) => I(p, <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>),
  ArrowUp: (p) => I(p, <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>),
  ArrowRight: (p) => I(p, <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>),
  GitMerge: (p) => I(p, <><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></>),
  Zap: (p) => I(p, <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>),
  User: (p) => I(p, <><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></>),
  Eye: (p) => I(p, <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>),
  EyeOff: (p) => I(p, <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></>),
  Hash: (p) => I(p, <><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></>),
  Flag: (p) => I(p, <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>),
  Mic: (p) => I(p, <><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/></>),
  Upload: (p) => I(p, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>),
  Slack: (p) => I(p, <><rect x="13" y="2" width="3" height="8" rx="1.5"/><path d="M19 8.5h-3"/><rect x="14" y="13" width="8" height="3" rx="1.5"/><path d="M15.5 19v-3"/><rect x="8" y="14" width="3" height="8" rx="1.5"/><path d="M5 15.5h3"/><rect x="2" y="8" width="8" height="3" rx="1.5"/><path d="M8.5 5v3"/></>),
  GoogleCal: (p) => I(p, <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><text x="12" y="18" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none">31</text></>),
  Layers: (p) => I(p, <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>),
};

Object.assign(window, { Icon });
