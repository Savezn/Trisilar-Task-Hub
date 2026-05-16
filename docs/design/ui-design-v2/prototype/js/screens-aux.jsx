/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Trisilar Task Hub — UI Design V2 · Auxiliary boards
// Foundations · States · Component Inventory · Implementation Handoff
// ─────────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════
// FOUNDATIONS — design tokens (color, type, spacing, radius, elevation)
// ══════════════════════════════════════════════════════════════════════
function BoardFoundations() {
  const surfaces = [
    { n: "--bg",        h: "#f6f7f9" },
    { n: "--surface",   h: "#ffffff" },
    { n: "--surface-2", h: "#fbfcfd" },
    { n: "--surface-3", h: "#eef0f4" },
    { n: "--hover",     h: "#f1f3f7" },
    { n: "--selected",  h: "#e6ecf8" },
  ];
  const ink = [
    { n: "--ink",   h: "#0b0d12" },
    { n: "--ink-2", h: "#2b2f38" },
    { n: "--ink-3", h: "#555b67" },
    { n: "--ink-4", h: "#8a909c" },
    { n: "--ink-5", h: "#b8bdc8" },
    { n: "--ink-6", h: "#d6dae2" },
  ];
  const brand = [
    { n: "--brand",      h: "#1e58e6", role: "primary action · route active" },
    { n: "--brand-2",    h: "#3b6df7", role: "primary hover" },
    { n: "--brand-soft", h: "#e6edfd", role: "selection fill" },
    { n: "--brand-mid",  h: "#b8c8f7", role: "focus border" },
    { n: "--brand-ink",  h: "#0a3290", role: "primary text on soft" },
    { n: "--brand-tint", h: "#f3f6fe", role: "row selection" },
  ];
  const ai = [
    { n: "--ai",      h: "#7c3aed", role: "Paperclip / agent surface" },
    { n: "--ai-soft", h: "#f3eefe", role: "evidence backgrounds" },
    { n: "--ai-mid",  h: "#d6c5fb", role: "evidence borders" },
    { n: "--ai-ink",  h: "#4c1d95", role: "AI labels" },
    { n: "--ai-tint", h: "#faf7fe", role: "session lane tint" },
  ];
  const sem = [
    { n: "--over",  h: "#c8312b", role: "overdue · reject" },
    { n: "--warn",  h: "#b86a05", role: "due today · staged" },
    { n: "--ok",    h: "#137e52", role: "connected · approved" },
    { n: "--info",  h: "#0a6fb3", role: "gcal · upcoming" },
  ];

  return (
    <div style={{background:"var(--bg)", padding: 32, minHeight: "100%"}}>
      <div className="route-bar">
        <div>
          <div className="rb-title">Foundations · V2 design tokens</div>
          <div className="rb-sub">
            <span>Cobalt brand · violet AI · neutral cool surfaces · 4pt scale · single-source semantic statuses</span>
          </div>
        </div>
      </div>

      <Panel eyebrow="Color · Surfaces" title="Application canvas">
        <div className="swatches">
          {surfaces.map(s => (
            <div key={s.n} className="swatch">
              <div className="sw-fill" style={{background:s.h, borderBottom:"1px solid var(--line)"}} />
              <div className="sw-meta"><div className="nm">{s.n}</div><div className="hex">{s.h}</div></div>
            </div>
          ))}
        </div>
      </Panel>

      <div style={{height:16}} />

      <Panel eyebrow="Color · Ink" title="Text ramp">
        <div className="swatches">
          {ink.map(s => (
            <div key={s.n} className="swatch">
              <div className="sw-fill" style={{background:s.h}}>
                <span style={{color: parseInt(s.h.slice(1,3),16) < 130 ? "#fff" : "#000", padding:"8px 10px", display:"inline-block", font:"600 11px var(--font-mono)"}}>Aa</span>
              </div>
              <div className="sw-meta"><div className="nm">{s.n}</div><div className="hex">{s.h}</div></div>
            </div>
          ))}
        </div>
      </Panel>

      <div style={{height:16}} />

      <div className="grid-2">
        <Panel eyebrow="Color · Brand" title="Cobalt · action">
          <div className="swatches" style={{gridTemplateColumns:"repeat(2, 1fr)"}}>
            {brand.map(s => (
              <div key={s.n} className="swatch">
                <div className="sw-fill" style={{background:s.h, height:48}} />
                <div className="sw-meta"><div className="nm">{s.n} <span style={{color:"var(--ink-4)", fontWeight:400}}>· {s.role}</span></div><div className="hex">{s.h}</div></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel eyebrow="Color · AI / Agent" title="Violet · Paperclip">
          <div className="swatches" style={{gridTemplateColumns:"repeat(2, 1fr)"}}>
            {ai.map(s => (
              <div key={s.n} className="swatch">
                <div className="sw-fill" style={{background:s.h, height:48}} />
                <div className="sw-meta"><div className="nm">{s.n} <span style={{color:"var(--ink-4)", fontWeight:400}}>· {s.role}</span></div><div className="hex">{s.h}</div></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div style={{height:16}} />

      <Panel eyebrow="Color · Semantic status" title="State signaling — always paired with a label, never color-only">
        <div className="swatches" style={{gridTemplateColumns:"repeat(4, 1fr)"}}>
          {sem.map(s => (
            <div key={s.n} className="swatch">
              <div className="sw-fill" style={{background:s.h, height:48}} />
              <div className="sw-meta"><div className="nm">{s.n}</div><div className="hex">{s.h} · {s.role}</div></div>
            </div>
          ))}
        </div>
        <div style={{display:"flex", gap:12, marginTop:16, flexWrap:"wrap"}}>
          <Chip tone="over">Overdue</Chip>
          <Chip tone="warn">Due today</Chip>
          <Chip tone="info">Upcoming</Chip>
          <Chip tone="ai">Pending review</Chip>
          <Chip tone="ok">Approved</Chip>
          <Chip tone="muted">Blocked</Chip>
          <Chip tone="ok"><span className="dot" />Connected</Chip>
          <Chip tone="warn"><span className="dot" />Staged</Chip>
          <Chip tone="muted"><span className="dot" />Disconnected</Chip>
          <Chip tone="muted">Read-only</Chip>
        </div>
      </Panel>

      <div style={{height:16}} />

      <Panel eyebrow="Type" title="Onest · sans · system stack · JetBrains Mono · telemetry">
        <div style={{display:"flex", flexDirection:"column"}}>
          <div className="type-row"><span className="k">display · 28 / 1.15 · 600</span><span className="v" style={{font:"var(--t-display)"}}>Daily command center</span><span className="d">route titles only</span></div>
          <div className="type-row"><span className="k">h1 · 22 / 1.2 · 600</span><span className="v" style={{font:"var(--t-h1)"}}>Q2 2026 · mid-quarter</span><span className="d">section / hero</span></div>
          <div className="type-row"><span className="k">h2 · 17 / 1.25 · 600</span><span className="v" style={{font:"var(--t-h2)"}}>Weekly Marketing Sync</span><span className="d">panel + topbar</span></div>
          <div className="type-row"><span className="k">h3 · 14 / 1.3 · 600</span><span className="v" style={{font:"var(--t-h3)"}}>Today's work</span><span className="d">subsection title</span></div>
          <div className="type-row"><span className="k">body · 13 / 1.5</span><span className="v" style={{font:"var(--t-body)"}}>Default body text — used in task rows and panel content.</span><span className="d">primary body</span></div>
          <div className="type-row"><span className="k">meta · 12 / 1.4 · 500</span><span className="v" style={{font:"var(--t-meta)"}}>11 of 118 · scope: Everyone</span><span className="d">supporting copy</span></div>
          <div className="type-row"><span className="k">eyebrow · 11 · 600 · UPPER</span><span className="v eyebrow">Next up · 16:00 today</span><span className="d">labels + section heads</span></div>
          <div className="type-row"><span className="k">mono · 12 · 500</span><span className="v" style={{font:"var(--t-mono)"}}>pc-run-20260515-001</span><span className="d">run-ids, env, telemetry</span></div>
          <div className="type-row"><span className="k">mono-sm · 11 · 500</span><span className="v" style={{font:"var(--t-mono-sm)"}}>workspace · trisilar · v2.0.0-preview</span><span className="d">status strip</span></div>
        </div>
      </Panel>

      <div style={{height:16}} />

      <div className="grid-2">
        <Panel eyebrow="Spacing · 4pt" title="Layout rhythm">
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {[
              ["--s-1", 4, "pill padding"],
              ["--s-2", 8, "icon-to-label"],
              ["--s-3", 12, "row gap"],
              ["--s-4", 16, "panel inner"],
              ["--s-5", 20, "content padding"],
              ["--s-6", 24, "section gap"],
              ["--s-7", 32, "route gap"],
            ].map(([n, v, role]) => (
              <div key={n} style={{display:"grid", gridTemplateColumns:"120px 1fr 140px", alignItems:"center", gap:12}}>
                <span className="mono" style={{fontSize:11.5, color:"var(--ink-3)"}}>{n} · {v}px</span>
                <span style={{display:"inline-block", height:8, width:v*4, background:"var(--brand)", borderRadius:2}} />
                <span style={{font:"var(--t-mono-sm)", color:"var(--ink-4)"}}>{role}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel eyebrow="Radius + elevation" title="Geometry">
          <div style={{display:"flex", gap:12, marginBottom:20, flexWrap:"wrap"}}>
            {[["--r-xs",3],["--r-sm",4],["--r",6],["--r-md",8],["--r-lg",12]].map(([n,v]) => (
              <div key={n} style={{textAlign:"center", display:"flex", flexDirection:"column", gap:6}}>
                <div style={{width:64, height:48, background:"var(--surface)", border:"1px solid var(--line-strong)", borderRadius:v}} />
                <span className="mono" style={{fontSize:11, color:"var(--ink-3)"}}>{n} · {v}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex", gap:16}}>
            {[["--sh-xs","sh-xs"],["--sh-sm","sh-sm"],["--sh","sh"],["--sh-md","sh-md"]].map(([n,v]) => (
              <div key={n} style={{textAlign:"center", display:"flex", flexDirection:"column", gap:6}}>
                <div style={{width:72, height:48, background:"var(--surface)", border:"1px solid var(--line)", borderRadius:8, boxShadow:`var(${n})`}} />
                <span className="mono" style={{fontSize:11, color:"var(--ink-3)"}}>{n}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// STATES — empty · loading · error · disconnected · audit trace
// ══════════════════════════════════════════════════════════════════════
function BoardStates() {
  return (
    <div style={{background:"var(--bg)", padding: 32, minHeight: "100%"}}>
      <div className="route-bar">
        <div>
          <div className="rb-title">States · every route ships these</div>
          <div className="rb-sub">
            <span>Empty · loading · error · disconnected · audit trace. Plain language, no developer-only wording, no raw API errors.</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Empty — Review Queue */}
        <Panel eyebrow="Empty state · Review Queue" title="No proposals to review">
          <StateCard
            kind="empty"
            glyph={<Ic.Inbox size={20} />}
            title="Review queue is empty"
            desc="When Paperclip submits proposals from a meeting or workflow, they appear here for approval before anything reaches Trello or Calendar."
            actions={<><button className="btn">Open audit log</button><button className="btn primary">Manual upload</button></>}
          />
        </Panel>

        {/* Empty — filtered */}
        <Panel eyebrow="Filter no-results · All Tasks" title="No tasks match these filters">
          <StateCard
            kind="empty"
            glyph={<Ic.Filter size={20} />}
            title="No tasks match these filters"
            desc={<>Active filters: <span className="mono" style={{color:"var(--ink-2)"}}>status:open · due:14d · owner:Pim Suriya</span></>}
            actions={<><button className="btn">Clear owner</button><button className="btn">Widen due window</button><button className="btn ghost">Reset all</button></>}
          />
        </Panel>

        {/* Loading skeleton */}
        <Panel eyebrow="Loading · skeleton" title="Layout preserved">
          <div className="panel" style={{padding:0}}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{display:"grid", gridTemplateColumns:"16px 1fr 80px 60px 80px", gap:12, padding:"12px 16px", borderBottom:"1px solid var(--line-2)", alignItems:"center"}}>
                <span className="sk" style={{width:14, height:14, borderRadius:3}} />
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  <span className="sk" style={{height:12, width: `${60 + (i*7)%30}%`}} />
                  <span className="sk" style={{height:10, width:"40%"}} />
                </div>
                <span className="sk" style={{height:10, width:60}} />
                <span className="sk" style={{height:18, width:18, borderRadius:999}} />
                <span className="sk" style={{height:10, width:64}} />
              </div>
            ))}
          </div>
        </Panel>

        {/* Disconnected — Trello */}
        <Panel eyebrow="Disconnected · Trello" title="Plain-language, names owner & action">
          <StateCard
            kind="disconnected"
            glyph={<Ic.Plug size={20} />}
            title="Trello is disconnected"
            desc={<>Task Hub cannot read Trello boards or write cards until reconnected. Last successful sync: <span className="mono" style={{color:"var(--ink-2)"}}>12 May 14:21</span>. Ask Runtime Owner to refresh credentials in Settings.</>}
            actions={<>
              <button className="btn primary">Open Settings</button>
              <button className="btn">Why this happens</button>
            </>}
          />
        </Panel>

        {/* Error */}
        <Panel eyebrow="Error · safe wording" title="Plain language · next safe step · no raw errors">
          <StateCard
            kind="error"
            glyph={<Ic.Warning size={20} />}
            title="Something went wrong loading this view"
            desc="Your data is safe — nothing changed in Trello or Calendar. Try refreshing. If this keeps happening, share the run id below with Runtime Owner."
            actions={<>
              <button className="btn primary"><Ic.Refresh size={12} /> Retry</button>
              <button className="btn"><Ic.Copy size={12} /> Copy run id</button>
            </>}
          />
        </Panel>

        {/* Cloudflare Access blocked */}
        <Panel eyebrow="Access denied · Cloudflare" title="Policy block, not an outage">
          <StateCard
            kind="error"
            glyph={<Ic.Lock size={20} />}
            title="This route requires Cloudflare Access"
            desc={<>You're signed in to Task Hub but Cloudflare Access has not been verified for <span className="mono" style={{color:"var(--ink-2)"}}>/review</span>. Open Access in a new tab to authenticate, then return.</>}
            actions={<><button className="btn primary">Open Cloudflare Access</button><button className="btn">Return to Today</button></>}
          />
        </Panel>

        {/* Paperclip permanent not approved */}
        <Panel eyebrow="Production intake not approved" title="Hard gate · cannot bypass">
          <StateCard
            kind="error"
            glyph={<Ic.Lock size={20} />}
            title="Production Paperclip intake is not approved"
            desc="Live agent traffic has not been signed off by Runtime Owner. Staged intake remains available and routes through Review Queue with no external side effects."
            actions={<><button className="btn">Switch to staged</button><button className="btn primary">Request approval</button></>}
          />
        </Panel>

        {/* Signing-secret missing */}
        <Panel eyebrow="Signing secret · missing" title="Status display only — never the value">
          <StateCard
            kind="disconnected"
            glyph={<Ic.Lock size={20} />}
            title="Signing secret is not configured"
            desc={<>Paperclip cannot submit signed webhooks. Runtime Owner needs to set up the signing material before intake can resume. The secret value is never displayed here.</>}
            actions={<>
              <button className="btn primary">Open Operations runbook</button>
              <button className="btn">View setup steps</button>
            </>}
          />
        </Panel>
      </div>

      {/* Audit trace — wide */}
      <div style={{height: 16}} />
      <Panel
        eyebrow="Audit / trace · approved run"
        title="What happened before this Trello card existed"
        actions={<Trace id="pc-run-20260514-022" />}
      >
        <div className="timeline">
          <div className="tl-row ai">
            <div className="tl-when">14 May · 15:11:08</div>
            <div className="tl-what">Paperclip webhook received · signature verified</div>
            <div className="tl-extra">Source <span className="mono">paperclip · production</span> · 2 tasks proposed</div>
          </div>
          <div className="tl-row">
            <div className="tl-when">14 May · 15:11:09</div>
            <div className="tl-what">Hub validation passed · owner present · board valid · deadline plausible</div>
          </div>
          <div className="tl-row">
            <div className="tl-when">14 May · 15:14:22</div>
            <div className="tl-what">Reviewer opened session in Review Queue</div>
            <div className="tl-extra">Reviewer · Pim Suriya</div>
          </div>
          <div className="tl-row ai">
            <div className="tl-when">14 May · 15:14:55</div>
            <div className="tl-what">Reviewer edited owner from <span className="mono">m-tan</span> → <span className="mono">m-ek</span> on rt-6</div>
          </div>
          <div className="tl-row ok">
            <div className="tl-when">14 May · 15:15:31</div>
            <div className="tl-what">Approved · 2 tasks</div>
            <div className="tl-extra">Side effects executed: Trello (2 cards) · Google Tasks (1 entry)</div>
          </div>
          <div className="tl-row ok">
            <div className="tl-when">14 May · 15:15:33</div>
            <div className="tl-what">Trello write succeeded · 2 cards created on Roadmap and Bug Triage</div>
            <div className="tl-extra">Cards <span className="mono">b-prod-rd · planning · n2104</span> and <span className="mono">b-prod-bug · backlog · n0922</span></div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// COMPONENT INVENTORY
// ══════════════════════════════════════════════════════════════════════
function BoardInventory() {
  const items = [
    { g: "App shell", n: "AppShell", v: "navigation rail + topbar + status strip + content" },
    { g: "App shell", n: "Topbar / RouteBar", v: "route crumb · title · scope · refresh · primary action" },
    { g: "App shell", n: "StatusStrip", v: "env · build · workspace · 4 integration dots · last sync" },
    { g: "App shell", n: "MobileShell", v: "phone status bar + topbar + 5-tab bottom nav" },

    { g: "Task surfaces", n: "TaskRow", v: "compact row — title · board · list · checklist · labels · owners · due" },
    { g: "Task surfaces", n: "TaskTable", v: "dense table with sticky head · multi-select · grouping" },
    { g: "Task surfaces", n: "TaskDetailDrawer", v: "right-side · keeps route context · checklist · activity" },

    { g: "Review Queue", n: "SessionCard", v: "header with run id, source, env, agent, request id, received" },
    { g: "Review Queue", n: "ProposalRow", v: "title · owner · diff · risk · target board/list · confidence" },
    { g: "Review Queue", n: "BulkBar", v: "dark sticky · selected count · approve / reject / hold" },
    { g: "Review Queue", n: "InspectionDrawer", v: "diff view + evidence + side effects + audit timeline + actions" },

    { g: "AI / trace", n: "DiffBadge", v: "create · update · duplicate · missing · explicit glyph + label" },
    { g: "AI / trace", n: "RiskMeter", v: "5-segment bar · LOW · MED · HIGH" },
    { g: "AI / trace", n: "Confidence", v: "horizontal bar + percent · color by level" },
    { g: "AI / trace", n: "TraceChip", v: "monospaced run id with copy affordance" },
    { g: "AI / trace", n: "EvidenceBlock", v: "transcript excerpt · violet tint · attribution foot" },
    { g: "AI / trace", n: "AuditTimeline", v: "left-rail timeline with state-colored dots" },

    { g: "Chips / labels", n: "Chip", v: "muted · brand · ai · ok · warn · over · info · outline variants" },
    { g: "Chips / labels", n: "DueChip", v: "over · warn · upcoming · none · done · tabular-num text" },
    { g: "Chips / labels", n: "Label (trello)", v: "tiny squared pill in semantic tones" },
    { g: "Chips / labels", n: "BoardTag", v: "color square + board name" },
    { g: "Chips / labels", n: "KV (key-value)", v: "mono key + sans value · used for env, owner, run inline meta" },

    { g: "Inputs", n: "FilterBar", v: "search + filter chips + saved filters + add filter" },
    { g: "Inputs", n: "FilterChip", v: "k: v pair, removable, on / off states" },
    { g: "Inputs", n: "SegmentedControl", v: "two- or three-up view mode toggle" },
    { g: "Inputs", n: "Search (small)", v: "inline input within filter rows" },
    { g: "Inputs", n: "Toggle", v: "small switch · used for side-effect opt-ins" },

    { g: "Surfaces", n: "Panel", v: "flat-edge work surface · head · body · foot — avoid card-in-card" },
    { g: "Surfaces", n: "StatStrip", v: "4-cell horizontal · overdue · due today · upcoming · pending review" },
    { g: "Surfaces", n: "BoardCard", v: "name · BU · owner · 4 stats · sparkline · warning chips" },
    { g: "Surfaces", n: "Lane", v: "Weekly Focus column (Do / Review / Blocked / Schedule)" },

    { g: "States", n: "StateCard", v: "empty · loading · error · disconnected — title · desc · actions" },
    { g: "States", n: "Skeleton", v: "shimmer · preserves row dimensions" },
    { g: "States", n: "InlineNotice", v: "warn-tinted strip · used for Planner gtasks-off" },

    { g: "Settings", n: "IntegrationRow", v: "icon · name + meta · status chip · primary action" },
    { g: "Settings", n: "SettingRow", v: "key · control · value display · last-changed mono" },
  ];

  const groups = [...new Set(items.map(i => i.g))];

  return (
    <div style={{background:"var(--bg)", padding:32, minHeight:"100%"}}>
      <div className="route-bar">
        <div>
          <div className="rb-title">Component inventory</div>
          <div className="rb-sub">
            <span>36 reusable surfaces across 8 groups</span><span>·</span><span>States: default · hover · selected · disabled · loading · empty · error · disconnected</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {groups.map(g => (
          <Panel key={g} eyebrow="Group" title={g}>
            <div style={{display:"flex", flexDirection:"column"}}>
              {items.filter(i => i.g === g).map(i => (
                <div key={i.n} style={{display:"grid", gridTemplateColumns:"160px 1fr", gap:16, padding:"8px 0", borderBottom:"1px solid var(--line-2)"}}>
                  <span className="mono" style={{fontSize:12, color:"var(--ink)"}}>{i.n}</span>
                  <span style={{fontSize:12.5, color:"var(--ink-3)"}}>{i.v}</span>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// HANDOFF — implementation notes for Frontend Dev
// ══════════════════════════════════════════════════════════════════════
function BoardHandoff() {
  return (
    <div style={{background:"var(--bg)", padding:32, minHeight:"100%", maxWidth: 1280}}>
      <div className="route-bar">
        <div>
          <div className="rb-title">Implementation handoff · UI V2</div>
          <div className="rb-sub">
            <span>For: <strong style={{color:"var(--ink-2)"}}>Frontend Dev</strong></span><span>·</span><span>Design artifact only — keep separate from production app</span>
          </div>
        </div>
      </div>

      <Panel eyebrow="Scope · what this delivers" title="What ships with this design">
        <ul style={{listStyle:"none", padding:0, display:"grid", gap:8, fontSize:13}}>
          <li>· UI V2 concept screens for 10 routes — desktop + key mobile variants</li>
          <li>· Design token table (color, type, spacing, radius, elevation, statuses) implemented as CSS custom properties</li>
          <li>· Component inventory of ~36 reusable surfaces with their states</li>
          <li>· Responsive notes for 1440, 1366, 1024, 390, 375 viewports</li>
          <li>· Empty / loading / error / disconnected / audit-trace examples for every safety-critical path</li>
          <li>· No production secrets, no live Paperclip calls, no automatic Trello / Calendar / GTasks writes</li>
        </ul>
      </Panel>

      <div style={{height:16}} />

      <div className="grid-2">
        <Panel eyebrow="Visual direction" title="Why V2 looks different from V1">
          <ul style={{listStyle:"none", padding:0, display:"grid", gap:10, fontSize:13, color:"var(--ink-2)"}}>
            <li><strong>Cobalt action vs violet AI</strong> — V1 used a single indigo. V2 separates primary action (cobalt) from agent surfaces (violet) so reviewers can tell at a glance whether color signals "I can do this" or "AI proposed this".</li>
            <li><strong>Telemetry status strip</strong> — dark monospace top edge surfaces env, build, workspace, and the 4 integration states without consuming sidebar real estate.</li>
            <li><strong>Tighter radii (3–8px) and thinner lines</strong> — operational, instrument-like; less SaaS marketing.</li>
            <li><strong>Tabular numerics + JetBrains Mono</strong> for run-ids, counts, dates, env names — anything emitted by a system.</li>
            <li><strong>Diff + risk + confidence are first-class</strong> in the Review Queue, not buried in hover.</li>
            <li><strong>No card-in-card</strong> — panels are flat-edge work surfaces; cards reserved for repeated items.</li>
          </ul>
        </Panel>

        <Panel eyebrow="Responsive notes" title="Breakpoints and behavior">
          <div style={{display:"flex", flexDirection:"column", gap:10, fontSize:13}}>
            <div>
              <div style={{font:"600 12.5px var(--font-sans)"}}>1440 × 900 (desktop large)</div>
              <div style={{color:"var(--ink-3)"}}>Default. Sidebar 220px · drawer 460px on Review Queue. Stat strip 4-up. Table can show all 8 task columns.</div>
            </div>
            <div>
              <div style={{font:"600 12.5px var(--font-sans)"}}>1366 × 768 (laptop)</div>
              <div style={{color:"var(--ink-3)"}}>Sidebar still 220px. Review drawer collapses to 400px. Stat strip still 4-up.</div>
            </div>
            <div>
              <div style={{font:"600 12.5px var(--font-sans)"}}>1024 × 768 (tablet)</div>
              <div style={{color:"var(--ink-3)"}}>Sidebar collapses to icon rail (64px). Review drawer becomes a stacked panel below the queue. All Tasks drops the Source column into a "More" affordance per row.</div>
            </div>
            <div>
              <div style={{font:"600 12.5px var(--font-sans)"}}>≤ 768 (mobile)</div>
              <div style={{color:"var(--ink-3)"}}>Sidebar replaced by a 5-tab bottom nav (Today · Review · Tasks · Boards · More). Status strip moves into a "Status" item inside More. Drawers become full-screen sheets.</div>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Accessibility floor" title="WCAG 2.2 AA">
          <ul style={{listStyle:"none", padding:0, display:"grid", gap:8, fontSize:13}}>
            <li>· Body text contrast ≥ 4.5:1 (ink-2 / ink-3 on surface) — verified for primary palette</li>
            <li>· Large text contrast ≥ 3:1</li>
            <li>· Tap targets ≥ 24×24 desktop, ≥ 44×44 mobile (m-tab cells reserve 64px height)</li>
            <li>· Status chips always pair color with text label — never color-only</li>
            <li>· Diff and risk include explicit glyphs (+, Δ, ≈, !) for non-color discrimination</li>
            <li>· Focus ring tokens: <span className="mono">--focus-ring</span> (2px brand on white halo)</li>
            <li>· Skip-link to main on every shell; nav order preserved across routes</li>
            <li>· Drag/drop on Weekly Focus and Planner always has a keyboard menu equivalent</li>
          </ul>
        </Panel>

        <Panel eyebrow="Safety-critical UX rules" title="Non-negotiable behavior">
          <ul style={{listStyle:"none", padding:0, display:"grid", gap:8, fontSize:13}}>
            <li><strong>Review Queue gates every AI-originated external side effect.</strong> Approve buttons are disabled until required fields (owner, board, list) resolve.</li>
            <li><strong>Production intake requires Runtime Owner approval.</strong> If not approved, the Settings · Paperclip · Permanent option is disabled, not hidden.</li>
            <li><strong>Side-effect toggles in the drawer never default to off.</strong> Reviewers must explicitly opt out, not opt in, so missed approvals fail safe.</li>
            <li><strong>Run id, env, request id are always visible</strong> when proposing changes. The trace chip is always copyable.</li>
            <li><strong>Secrets, tokens, signing material are never displayed.</strong> Status only ("configured · last rotated …"). Rotate flow opens in a new modal.</li>
            <li><strong>Disconnected states name the integration and the owner/action</strong>, never raw .env wording.</li>
          </ul>
        </Panel>

        <Panel eyebrow="Tech direction" title="Build path (no framework migration required)">
          <ul style={{listStyle:"none", padding:0, display:"grid", gap:8, fontSize:13}}>
            <li>· V2 is implementable on the current static JS workflow — no framework rewrite. CSS tokens already in <span className="mono">css/tokens.css</span> can be promoted to the production stylesheet.</li>
            <li>· Component primitives (Chip, DiffBadge, Risk, Confidence, Trace, KV, StateCard) map cleanly onto vanilla JS render functions used in <span className="mono">public/js/pages/*.js</span>.</li>
            <li>· Topbar route-crumb pattern preserves existing route names. No router work needed.</li>
            <li>· Inspection drawer should be a sibling under the main content grid, not a portal, so keyboard focus and scroll position stay intact.</li>
            <li>· Mobile bottom nav can be progressively enhanced — fall back to the existing top hamburger if needed.</li>
            <li>· Foundations (tokens + atoms) can ship first as a single PR; route screens can follow incrementally.</li>
          </ul>
        </Panel>

        <Panel eyebrow="Out of scope · explicitly" title="What this design does NOT propose">
          <ul style={{listStyle:"none", padding:0, display:"grid", gap:8, fontSize:13, color:"var(--ink-2)"}}>
            <li>· No production code changes. This is a design artifact.</li>
            <li>· No framework migration (React/Vue/Svelte). Existing static JS workflow preserved.</li>
            <li>· No removal or rename of any of the 10 routes.</li>
            <li>· No automatic writes to Trello, Calendar, or Google Tasks. Review Queue remains the gate.</li>
            <li>· No exposure of real run-ids, request ids, signing secrets, or production data.</li>
            <li>· No landing page or marketing hero.</li>
          </ul>
        </Panel>
      </div>

      <div style={{height:16}} />

      <Panel eyebrow="PM review checklist" title="Self-check before sign-off">
        <div className="grid-2" style={{gap:24}}>
          <ul style={{listStyle:"none", padding:0, display:"grid", gap:6, fontSize:13}}>
            <li>· First screen shows actual Task Hub work (Today), not marketing</li>
            <li>· Top priority on Today identifiable within 10 seconds (Next-up dark hero)</li>
            <li>· Reviewer sees source, env, run-id, target, risk, side effects before Approve</li>
            <li>· Approve is gated by required fields — cannot bypass</li>
            <li>· Disconnected states name the integration and the owner/action</li>
          </ul>
          <ul style={{listStyle:"none", padding:0, display:"grid", gap:6, fontSize:13}}>
            <li>· Mobile preserves all 10 routes (5 tabs + "More" route list)</li>
            <li>· Dense lists readable without becoming noisy (4pt spacing, tabular nums)</li>
            <li>· All 10 routes have a designed screen</li>
            <li>· No secrets, raw tokens, or production data appear anywhere</li>
            <li>· Implementable without an immediate framework rewrite</li>
          </ul>
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { BoardFoundations, BoardStates, BoardInventory, BoardHandoff });
