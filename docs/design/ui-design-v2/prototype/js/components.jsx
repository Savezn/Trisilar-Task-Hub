/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Trisilar Task Hub — UI Design V2 · Components
// Shell + atoms + composites. Loaded as a single Babel script.
// ─────────────────────────────────────────────────────────────────────────

const { useState } = React;

// ── Tiny inline icon set ─────────────────────────────────────────────────
const Ic = {};
function makeIcon(d, vb = "0 0 24 24", stroke = 1.6) {
  return ({ size = 16 }) => (
    <svg width={size} height={size} viewBox={vb} fill="none" stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d}/></svg>
  );
}
Ic.Today    = makeIcon("M3 10h18M5 4h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM8 3v4M16 3v4");
Ic.Review   = makeIcon("M12 3l2.39 5.16L20 9l-4 3.9.94 5.6L12 16l-4.94 2.5L8 12.9 4 9l5.61-.84L12 3z");
Ic.Tasks    = makeIcon("M3 6h18M3 12h18M3 18h18");
Ic.Boards   = makeIcon("M4 4h6v16H4zM14 4h6v9h-6z");
Ic.Calendar = makeIcon("M3 10h18M5 4h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM8 3v4M16 3v4");
Ic.Planner  = makeIcon("M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11");
Ic.OKR      = makeIcon("M12 12m-9 0a9 9 0 1018 0a9 9 0 10-18 0M12 12m-4 0a4 4 0 108 0a4 4 0 10-8 0M12 12h0");
Ic.Focus    = makeIcon("M3 4h6M3 12h6M3 20h6M14 4l7 7-7 7");
Ic.Trace    = makeIcon("M4 6h10M4 12h10M4 18h6M19 8l-3 3 3 3");
Ic.Settings = makeIcon("M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8L4.2 6a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V2a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z");
Ic.Search   = makeIcon("M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3");
Ic.Plus     = makeIcon("M12 5v14M5 12h14");
Ic.Refresh  = makeIcon("M3 12a9 9 0 0115.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 01-15.5 6.3L3 16M3 21v-5h5");
Ic.Filter   = makeIcon("M3 5h18M6 12h12M10 19h4");
Ic.Bell     = makeIcon("M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M9 21a3 3 0 006 0");
Ic.More     = makeIcon("M12 5h.01M12 12h.01M12 19h.01");
Ic.Check    = makeIcon("M5 12l5 5L20 7");
Ic.X        = makeIcon("M6 6l12 12M6 18L18 6");
Ic.Copy     = makeIcon("M9 9h10v10H9zM5 5h10v4M5 5v10h4");
Ic.External = makeIcon("M14 4h6v6M20 4l-9 9M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6");
Ic.AI       = makeIcon("M12 3l2.39 5.16L20 9l-4 3.9.94 5.6L12 16l-4.94 2.5L8 12.9 4 9l5.61-.84L12 3z");
Ic.Chevron  = makeIcon("M9 6l6 6-6 6");
Ic.Down     = makeIcon("M6 9l6 6 6-6");
Ic.Warning  = makeIcon("M12 9v4M12 17h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z");
Ic.Plug     = makeIcon("M9 2v6M15 2v6M7 8h10v4a5 5 0 01-10 0V8zM12 17v5");
Ic.Slash    = makeIcon("M5 5l14 14M5 19L19 5");
Ic.Menu     = makeIcon("M4 6h16M4 12h16M4 18h16");
Ic.ArrowR   = makeIcon("M5 12h14M13 5l7 7-7 7");
Ic.Lock     = makeIcon("M5 11h14v10H5zM8 11V7a4 4 0 118 0v4");
Ic.Eye      = makeIcon("M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z");
Ic.Inbox    = makeIcon("M22 12h-6l-2 3h-4l-2-3H2M2 12V5a2 2 0 012-2h16a2 2 0 012 2v7M2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6");

// ── Small helpers ────────────────────────────────────────────────────────
function cx(...xs) { return xs.filter(Boolean).join(" "); }
function getMember(id) { return MEMBERS.find(m => m.id === id); }
function getBoard(id)  { return BOARDS.find(b => b.id === id); }
function getBU(id)     { return BU_GROUPS.find(g => g.id === id); }

// ── Atoms ────────────────────────────────────────────────────────────────
function Avatar({ id, size = "" }) {
  const m = getMember(id);
  if (!m) return <span className={cx("av","ghost", size)}>?</span>;
  return <span className={cx("av", size)} style={{ background: m.color }} title={m.name}>{m.initials}</span>;
}
function AvatarStack({ ids = [], size = "sm", max = 3 }) {
  if (!ids.length) return <span className={cx("av","ghost", size)}>—</span>;
  const shown = ids.slice(0, max);
  const more = ids.length - shown.length;
  return (
    <span className="av-stack">
      {shown.map(id => <Avatar key={id} id={id} size={size} />)}
      {more > 0 && <span className={cx("av", size)} style={{ background: "#555b67" }}>+{more}</span>}
    </span>
  );
}
function Chip({ tone = "muted", children, sm }) {
  return <span className={cx("chip", tone, sm && "sm")}>{children}</span>;
}
function Due({ text, state = "none" }) {
  return <span className={cx("due", state)}><span className="due-mark" />{text}</span>;
}
function Label({ id }) {
  const l = LABELS[id]; if (!l) return null;
  return <Chip tone={l.v} sm>{l.name}</Chip>;
}
function BoardTag({ id }) {
  const b = getBoard(id); if (!b) return null;
  return <span className="board-tag"><span className="dot" style={{ background: b.color }} />{b.name}</span>;
}
function KV({ k, v, tone }) {
  return <span className="kv"><span className="k">{k}</span><span className={cx("v", tone)}>{v}</span></span>;
}
function Trace({ id, short }) {
  return (
    <span className="trace" title={id}>
      <span className="pre">run</span>
      <span className="mono">{short || id}</span>
      <span className="copy"><Ic.Copy size={10} /></span>
    </span>
  );
}
function Confidence({ v, level = "med" }) {
  return (
    <span className={cx("conf", level)}>
      <span className="bar"><i style={{ width: `${Math.round(v * 100)}%` }} /></span>
      <span>{Math.round(v * 100)}%</span>
    </span>
  );
}
function Risk({ level = "low" }) {
  const segs = level === "high" ? 5 : level === "med" ? 3 : 1;
  return (
    <span className={cx("risk", level)}>
      <span className="risk-segs">
        {[0,1,2,3,4].map(i => <i key={i} className={i < segs ? "on" : ""} />)}
      </span>
      <span className="risk-label">{level.toUpperCase()}</span>
    </span>
  );
}
function DiffBadge({ kind }) {
  const cfg = {
    create:    { glyph: "+", label: "Create new" },
    update:    { glyph: "Δ", label: "Update existing" },
    duplicate: { glyph: "≈", label: "Possible duplicate" },
    missing:   { glyph: "!", label: "Missing context" },
  }[kind] || { glyph: "?", label: kind };
  return (
    <span className={cx("diff", kind)}>
      <span className="glyph">{cfg.glyph}</span>
      <span>{cfg.label}</span>
    </span>
  );
}
function Sparkline({ data, tone = "brand" }) {
  const max = Math.max(...data, 1);
  return (
    <span className="spark">
      {data.map((v, i) => {
        const h = Math.max(2, Math.round((v / max) * 18));
        const cls = i === data.length - 1 ? "up" : v < max * 0.4 ? "dim" : "";
        return <i key={i} style={{ height: h }} className={cls} />;
      })}
    </span>
  );
}
function Toggle({ on }) { return <span className={cx("toggle", on && "on")} />; }

// ── App shell ────────────────────────────────────────────────────────────
const NAV = [
  { id: "today",   label: "Today",        ic: Ic.Today,    badge: 2,         badgeKind: "warn" },
  { id: "review",  label: "Review Queue", ic: Ic.Review,   badge: 4,         badgeKind: "ai" },
  { id: "tasks",   label: "All Tasks",    ic: Ic.Tasks },
  { id: "boards",  label: "Boards Monitor", ic: Ic.Boards, badge: 3,         badgeKind: "warn" },
  { id: "cal",     label: "Calendar",     ic: Ic.Calendar },
  { id: "planner", label: "Planner",      ic: Ic.Planner,  badge: "off",     badgeKind: "muted" },
  { id: "okr",     label: "OKR / Portfolio", ic: Ic.OKR },
  { id: "focus",   label: "Weekly Focus", ic: Ic.Focus },
  { id: "trace",   label: "Docs / AI Trace", ic: Ic.Trace },
  { id: "settings",label: "Settings",     ic: Ic.Settings },
];

function StatusStrip({ env = "design-preview", connected = ["trello", "gcal"], warn = ["paperclip"], down = ["gtasks"] }) {
  return (
    <div className="statusbar">
      <span className="sb-group"><span className="sb-dot" /><span className="sb-key">env</span><span className="sb-val">{env}</span></span>
      <span className="sb-sep" />
      <span className="sb-group"><span className="sb-key">build</span><span className="sb-val">v2.0.0-preview</span></span>
      <span className="sb-sep" />
      <span className="sb-group"><span className="sb-key">workspace</span><span className="sb-val">trisilar</span></span>
      <span className="sb-right">
        <span className="sb-group"><span className="sb-dot" /><span className="sb-val">trello</span></span>
        <span className="sb-group"><span className="sb-dot" /><span className="sb-val">gcal</span></span>
        <span className="sb-group"><span className="sb-dot warn" /><span className="sb-val">paperclip · staged</span></span>
        <span className="sb-group"><span className="sb-dot off" /><span className="sb-val">gtasks · off</span></span>
        <span className="sb-sep" />
        <span className="sb-group sb-time"><span className="sb-key">last sync</span><span className="sb-val">2m ago</span></span>
      </span>
    </div>
  );
}

function Sidebar({ active = "today" }) {
  return (
    <aside className="side">
      <div className="side-head">
        <div className="side-logo">T<span style={{position:"absolute", bottom:3, right:4, width:4, height:4, background:"var(--brand)", borderRadius:1}} /></div>
        <div className="side-title">Trisilar<small>Task Hub · v2</small></div>
      </div>

      <div className="side-search">
        <span className="side-search-icon"><Ic.Search size={14} /></span>
        <input placeholder="Search tasks, boards, runs…" readOnly />
        <span className="side-search-kbd">⌘K</span>
      </div>

      <nav className="side-nav">
        <div className="side-section-h">Workspace</div>
        {NAV.map(n => {
          const I = n.ic;
          return (
            <div key={n.id} className={cx("nav-item", active === n.id && "active")}>
              <span className="ico"><I size={15} /></span>
              <span className="lbl">{n.label}</span>
              {n.badge != null && n.badge !== "off" && (
                <span className={cx("badge", n.badgeKind)}>{n.badge}</span>
              )}
              {n.badge === "off" && <span className="badge muted">off</span>}
            </div>
          );
        })}

        <div className="side-section-h" style={{marginTop: 12}}>Scope</div>
        {BU_GROUPS.slice(0, 4).map(g => (
          <div key={g.id} className="nav-item">
            <span className="ico" style={{color: g.color}}>●</span>
            <span className="lbl">{g.name}</span>
          </div>
        ))}
      </nav>

      <div className="side-foot">
        <div className="conn-row"><span className="dot" /> trello · ok</div>
        <div className="conn-row"><span className="dot" /> gcal · ok</div>
        <div className="conn-row"><span className="dot warn" /> paperclip · staged</div>
        <div className="conn-row"><span className="dot off" /> gtasks · off</div>
      </div>
    </aside>
  );
}

function Topbar({ crumb = ["Today"], title, actions }) {
  return (
    <div className="topbar">
      <div className="route-crumb">
        <span>trisilar</span>
        <span className="crumb-sep">/</span>
        {crumb.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="crumb-sep">/</span>}
            <span className={i === crumb.length - 1 ? "crumb-now" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="route-title">{title}</div>
      <div className="topbar-right">
        <div className="scope-pick"><span className="scope-dot" /> All BUs<Ic.Down size={11} /></div>
        <button className="iconbtn"><Ic.Refresh size={14} /></button>
        <button className="iconbtn"><Ic.Bell size={14} /></button>
        {actions}
      </div>
    </div>
  );
}

function Shell({ active, crumb, title, actions, children, statusProps }) {
  return (
    <div className="app">
      <StatusStrip {...statusProps} />
      <Sidebar active={active} />
      <main className="main">
        <Topbar crumb={crumb} title={title} actions={actions} />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

// ── Task row (cross-route) ──────────────────────────────────────────────
function TaskRow({ t, selected, done }) {
  return (
    <div className={cx("trow", selected && "selected", done && "done")}>
      <span className="tck"><Ic.Check size={9} /></span>
      <div className="tmain">
        <div className="ttitle">{t.title}</div>
        <div className="tmeta">
          <BoardTag id={t.board} />
          <span className="sep">·</span>
          <span>{t.list}</span>
          {t.checklist && (<><span className="sep">·</span><span className="mono">{t.checklist[0]}/{t.checklist[1]}</span></>)}
          {t.gcal && (<><span className="sep">·</span><span style={{color:"var(--info-ink)"}}>cal</span></>)}
          {t.ai && (<><span className="sep">·</span><Chip tone="ai" sm>AI</Chip></>)}
        </div>
      </div>
      <div className="tlabels">{t.labels?.map(id => <Label key={id} id={id} />)}</div>
      <div className="tmem"><AvatarStack ids={t.members || []} /></div>
      <div className="tdue"><Due text={t.due} state={t.dueState} /></div>
    </div>
  );
}

// ── Route bar (page-level header inside content area) ──────────────────
function RouteBar({ title, sub, actions }) {
  return (
    <div className="route-bar">
      <div>
        <div className="rb-title">{title}</div>
        {sub && <div className="rb-sub">{sub}</div>}
      </div>
      {actions && <div className="rb-actions">{actions}</div>}
    </div>
  );
}

// ── Panel ──────────────────────────────────────────────────────────────
function Panel({ title, eyebrow, actions, children, tight, foot }) {
  return (
    <section className="panel">
      {(title || eyebrow || actions) && (
        <header className="panel-head">
          <div>
            {eyebrow && <div className="eyebrow" style={{marginBottom:2}}>{eyebrow}</div>}
            {title && <div className="pt">{title}</div>}
          </div>
          {actions && <div className="pa">{actions}</div>}
        </header>
      )}
      <div className={cx("panel-body", tight && "tight")}>{children}</div>
      {foot && <footer className="panel-foot">{foot}</footer>}
    </section>
  );
}

// ── Empty/Loading/Error/Disconnected helpers ────────────────────────────
function StateCard({ kind, glyph, title, desc, actions }) {
  return (
    <div className={cx("state-card", kind)}>
      <div className="state-glyph">{glyph}</div>
      <div className="st-title">{title}</div>
      <div className="st-desc">{desc}</div>
      {actions && <div className="st-act">{actions}</div>}
    </div>
  );
}

// Export
Object.assign(window, {
  Ic, cx, getMember, getBoard, getBU,
  Avatar, AvatarStack, Chip, Due, Label, BoardTag, KV, Trace, Confidence, Risk, DiffBadge, Sparkline, Toggle,
  Shell, Sidebar, Topbar, StatusStrip, NAV,
  TaskRow, RouteBar, Panel, StateCard,
});
