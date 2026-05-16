/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Trisilar Task Hub — UI Design V2 · Mobile Screens
// 390×844 artboards. Bottom-nav pattern keeps core routes one tap away.
// ─────────────────────────────────────────────────────────────────────────

function MStatusBar({ time = "9:32" }) {
  return (
    <div className="m-status">
      <span>{time}</span>
      <span style={{display:"flex", gap:6}}>
        <span className="mono" style={{fontSize:11}}>5G</span>
        <span style={{width:18, height:10, border:"1px solid var(--ink-3)", borderRadius:2, padding:1, display:"inline-flex"}}>
          <span style={{flex:1, background:"var(--ink-2)", borderRadius:1}} />
        </span>
      </span>
    </div>
  );
}

function MTopbar({ title, sub, right }) {
  return (
    <div className="m-topbar">
      <button className="iconbtn"><Ic.Menu size={16} /></button>
      <div className="m-route">
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {right || <button className="iconbtn"><Ic.Refresh size={14} /></button>}
    </div>
  );
}

const MOB_TABS = [
  { id: "today",  label: "Today",  ic: Ic.Today,  badge: null },
  { id: "review", label: "Review", ic: Ic.Review, badge: "4", badgeKind: "ai" },
  { id: "tasks",  label: "Tasks",  ic: Ic.Tasks,  badge: null },
  { id: "boards", label: "Boards", ic: Ic.Boards, badge: "3" },
  { id: "more",   label: "More",   ic: Ic.More,   badge: null },
];

function MTabBar({ active }) {
  return (
    <nav className="m-tabbar">
      {MOB_TABS.map(t => {
        const I = t.ic;
        return (
          <div key={t.id} className={cx("m-tab", active === t.id && "on")}>
            <span className="ic"><I size={18} /></span>
            <span>{t.label}</span>
            {t.badge && <span className={cx("badge", t.badgeKind)}>{t.badge}</span>}
          </div>
        );
      })}
    </nav>
  );
}

function MShell({ active, title, sub, children, right }) {
  return (
    <div className="m-app">
      <MStatusBar />
      <MTopbar title={title} sub={sub} right={right} />
      <div className="m-content">{children}</div>
      <MTabBar active={active} />
    </div>
  );
}

// ── M01. TODAY ────────────────────────────────────────────────────────
function MToday() {
  return (
    <MShell active="today" title="Today" sub="Sat, 15 May 2026">
      <div className="m-card" style={{background:"var(--ink)", color:"#fff", border:0}}>
        <div className="m-eyebrow" style={{color:"#8b95ad"}}>Next up · 16:00</div>
        <div className="m-title" style={{color:"#fff"}}>P0 Revenue dashboard follow-up</div>
        <div style={{font:"var(--t-mono-sm)", color:"#a1a8b8"}}>Revenue Q2 · Next · Pim Suriya · 3/5</div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginTop:4}}>
          <button className="btn primary" style={{justifyContent:"center"}}><Ic.External size={12} /> Open</button>
          <button className="btn" style={{background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.12)", color:"#fff", justifyContent:"center"}}><Ic.Check size={12} /> Done</button>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
        <div className="m-card" style={{gap:2}}>
          <div className="m-eyebrow" style={{color:"var(--over-ink)"}}>Overdue</div>
          <div style={{font:"700 22px/1 var(--font-sans)"}}>1</div>
          <div style={{font:"var(--t-mono-sm)", color:"var(--ink-4)"}}>Bug Triage · 2d</div>
        </div>
        <div className="m-card" style={{gap:2, borderColor:"var(--warn-mid)"}}>
          <div className="m-eyebrow" style={{color:"var(--warn-ink)"}}>Due Today</div>
          <div style={{font:"700 22px/1 var(--font-sans)"}}>2</div>
          <div style={{font:"var(--t-mono-sm)", color:"var(--ink-4)"}}>2 boards</div>
        </div>
      </div>

      <div className="m-card" style={{padding:0, gap:0, background:"var(--ai-tint)", borderColor:"var(--ai-mid)"}}>
        <div style={{padding:"10px 12px", display:"flex", alignItems:"center", gap:8}}>
          <span style={{width:24, height:24, background:"var(--ai)", color:"#fff", borderRadius:4, display:"grid", placeItems:"center", font:"700 11px var(--font-mono)"}}>AI</span>
          <div style={{flex:1, minWidth:0}}>
            <div style={{font:"600 13px/1.3 var(--font-sans)", color:"var(--ai-ink)"}}>4 proposals await approval</div>
            <div style={{font:"var(--t-mono-sm)", color:"var(--ai-ink)", opacity:0.7}}>paperclip · production · 1 missing owner</div>
          </div>
          <button className="btn ai sm">Open<Ic.ArrowR size={11} /></button>
        </div>
      </div>

      <div style={{font:"var(--t-eyebrow)", color:"var(--ink-4)", padding:"4px 4px 0"}}>Today's work · 5</div>
      {TODAY_TASKS.slice(0,5).map(t => (
        <div key={t.id} className="m-trow">
          <div className="row1">
            <div className="ttitle">{t.title}</div>
            <Due text={t.due} state={t.dueState} />
          </div>
          <div className="row2">
            <BoardTag id={t.board} />
            <span style={{color:"var(--ink-5)"}}>·</span>
            <span>{t.list}</span>
            {t.labels?.slice(0,1).map(id => <Label key={id} id={id} />)}
            <span style={{marginLeft:"auto"}}><AvatarStack ids={t.members||[]} size="sm" /></span>
          </div>
        </div>
      ))}
    </MShell>
  );
}

// ── M02. REVIEW QUEUE ─────────────────────────────────────────────────
function MReview() {
  const session = REVIEW_SESSIONS[0];
  return (
    <MShell active="review" title="Review Queue" sub="4 pending · paperclip">
      <div className="m-card" style={{borderColor:"var(--ai-mid)", background:"var(--ai-tint)", gap:6}}>
        <div className="m-eyebrow" style={{color:"var(--ai-ink)"}}>Session · pc-run-20260515-001</div>
        <div className="m-title" style={{color:"var(--ai-ink)"}}>Weekly Marketing Sync</div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap", font:"var(--t-mono-sm)"}}>
          <KV k="env" v="production" tone="env-prod" />
          <KV k="agent" v="PM Assistant" />
          <KV k="received" v="09:32" />
        </div>
      </div>

      {session.proposals.map(p => (
        <div key={p.id} className="m-trow" style={{padding:12}}>
          <div className="row1" style={{alignItems:"flex-start"}}>
            <div style={{flex:1, minWidth:0}}>
              <div className="ttitle">{p.title}</div>
              <div style={{display:"flex", gap:6, marginTop:4, flexWrap:"wrap"}}>
                <DiffBadge kind={p.diff} />
              </div>
            </div>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, fontSize:11.5, marginTop:6, paddingTop:8, borderTop:"1px solid var(--line-2)"}}>
            <div>
              <span style={{color:"var(--ink-4)"}}>Owner</span>
              <div style={{display:"flex", alignItems:"center", gap:6, marginTop:2}}>
                {p.owner ? <><Avatar id={p.owner} size="sm" /><span>{getMember(p.owner)?.name.split(" ")[0]}</span></> : <span style={{color:"var(--over-ink)"}}>● none</span>}
              </div>
            </div>
            <div>
              <span style={{color:"var(--ink-4)"}}>Target</span>
              <div style={{marginTop:2}}>{getBoard(p.targetBoard)?.name}</div>
            </div>
            <div>
              <span style={{color:"var(--ink-4)"}}>Risk</span>
              <div style={{marginTop:2}}><Risk level={p.risk} /></div>
            </div>
            <div>
              <span style={{color:"var(--ink-4)"}}>Confidence</span>
              <div style={{marginTop:2}}><Confidence v={p.confidence} level={p.confLevel} /></div>
            </div>
          </div>
          <div className="m-actions">
            <button className="btn">Reject</button>
            <button className="btn primary" disabled={!p.ownerOk}>{p.ownerOk ? "Approve" : "Resolve owner"}</button>
          </div>
        </div>
      ))}
    </MShell>
  );
}

// ── M03. ALL TASKS (filters collapsed to chips) ───────────────────────
function MAllTasks() {
  return (
    <MShell active="tasks" title="All Tasks" sub="118 visible · 6 boards"
      right={<button className="iconbtn"><Ic.Filter size={14} /></button>}>
      <div className="search-sm" style={{width:"100%"}}><Ic.Search size={14} /><input placeholder="Search tasks…" /></div>
      <div style={{display:"flex", gap:6, overflowX:"auto", paddingBottom:4}}>
        <span className="filter-chip on"><span className="k">status:</span> open</span>
        <span className="filter-chip on"><span className="k">due:</span> 14d</span>
        <span className="filter-chip"><span className="k">board:</span> any</span>
        <span className="filter-chip"><span className="k">owner:</span> any</span>
      </div>

      {TODAY_TASKS.slice(0,7).map(t => (
        <div key={t.id} className="m-trow">
          <div className="row1">
            <div style={{flex:1, minWidth:0}}>
              <div className="ttitle">{t.title}</div>
              <div className="row2" style={{marginTop:4}}>
                <BoardTag id={t.board} />
                <span style={{color:"var(--ink-5)"}}>·</span>
                <span>{t.list}</span>
              </div>
            </div>
            <Due text={t.due} state={t.dueState} />
          </div>
          <div className="row2" style={{justifyContent:"space-between"}}>
            <div style={{display:"flex", gap:4}}>{t.labels?.map(id => <Label key={id} id={id} />)}</div>
            <AvatarStack ids={t.members||[]} size="sm" />
          </div>
        </div>
      ))}
    </MShell>
  );
}

// ── M04. BOARDS ───────────────────────────────────────────────────────
function MBoards() {
  return (
    <MShell active="boards" title="Boards" sub="9 boards · 5 BUs">
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
        <div className="m-card" style={{gap:2}}>
          <div className="m-eyebrow" style={{color:"var(--over-ink)"}}>Overdue</div>
          <div style={{font:"700 20px/1 var(--font-sans)"}}>10</div>
        </div>
        <div className="m-card" style={{gap:2}}>
          <div className="m-eyebrow" style={{color:"var(--warn-ink)"}}>Stale 7d+</div>
          <div style={{font:"700 20px/1 var(--font-sans)"}}>11</div>
        </div>
      </div>

      {BOARD_HEALTH.slice(0, 5).map(b => {
        const board = getBoard(b.id);
        return (
          <div key={b.id} className="board-card" style={{padding:12}}>
            <div className="bc-head">
              <div>
                <div className="bc-name"><span className="dot" style={{background: board.color}} />{board.name}</div>
                <div className="bc-meta">{getBU(board.bu).name} · owner {getMember(b.owner)?.name.split(" ")[0]}</div>
              </div>
              <Sparkline data={b.spark.slice(-9)} />
            </div>
            <div className="row" style={{justifyContent:"space-between"}}>
              <div className="bc-stat"><span className="k">Cards</span><span className="v tnum">{b.cards}</span></div>
              <div className="bc-stat"><span className="k">Over</span><span className="v tnum" style={{color: b.overdue>0?"var(--over)":""}}>{b.overdue}</span></div>
              <div className="bc-stat"><span className="k">Stale</span><span className="v tnum" style={{color: b.stale>2?"var(--warn)":""}}>{b.stale}</span></div>
              <div className="bc-stat"><span className="k">Pend</span><span className="v tnum" style={{color: b.pending>0?"var(--ai)":""}}>{b.pending}</span></div>
            </div>
            <div className="warnings">
              {b.overdue > 0 && <Chip tone="over" sm>{b.overdue} overdue</Chip>}
              {b.stale > 2 && <Chip tone="warn" sm>stale</Chip>}
              {b.pending > 0 && <Chip tone="ai" sm>{b.pending} pending</Chip>}
              {b.overdue === 0 && b.stale <= 2 && <Chip tone="ok" sm>healthy</Chip>}
            </div>
          </div>
        );
      })}
    </MShell>
  );
}

// ── M05. SETTINGS / MORE ─────────────────────────────────────────────
function MSettings() {
  return (
    <MShell active="more" title="More" sub="Routes · integrations · settings">
      {/* full nav drawer pattern shown as inline list */}
      <div className="m-card" style={{padding:0, overflow:"hidden"}}>
        {NAV.slice(4).map(n => {
          const I = n.ic;
          return (
            <div key={n.id} style={{display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderBottom:"1px solid var(--line-2)"}}>
              <span style={{width:28, height:28, borderRadius:6, background:"var(--surface-3)", display:"grid", placeItems:"center", color:"var(--ink-2)"}}><I size={14} /></span>
              <div style={{flex:1}}>
                <div style={{font:"500 13.5px/1.3 var(--font-sans)"}}>{n.label}</div>
              </div>
              {n.badge && n.badge !== "off" && <span className={cx("badge", n.badgeKind)} style={{font:"600 11px var(--font-mono)", background:"var(--brand)", color:"#fff", padding:"2px 6px", borderRadius:3}}>{n.badge}</span>}
              {n.badge === "off" && <Chip tone="muted" sm>off</Chip>}
              <Ic.Chevron size={13} />
            </div>
          );
        })}
      </div>

      <div style={{font:"var(--t-eyebrow)", color:"var(--ink-4)", padding:"8px 4px 0"}}>Integrations</div>
      <div className="m-card" style={{padding:0, gap:0}}>
        {INTEGRATIONS.map(intg => (
          <div key={intg.id} style={{display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderBottom:"1px solid var(--line-2)"}}>
            <span style={{width:24, height:24, borderRadius:5, background:"var(--surface-3)", display:"grid", placeItems:"center", color:"var(--ink-3)"}}><Ic.Plug size={12} /></span>
            <div style={{flex:1, minWidth:0}}>
              <div style={{font:"500 13px/1.3 var(--font-sans)"}}>{intg.name}</div>
              <div style={{font:"var(--t-mono-sm)", color:"var(--ink-4)", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{intg.meta}</div>
            </div>
            {intg.status === "ok"   && <Chip tone="ok"   sm><span className="dot" />ok</Chip>}
            {intg.status === "warn" && <Chip tone="warn" sm><span className="dot" />staged</Chip>}
            {intg.status === "off"  && <Chip tone="muted" sm><span className="dot" />off</Chip>}
          </div>
        ))}
      </div>

      <div style={{font:"var(--t-eyebrow)", color:"var(--ink-4)", padding:"8px 4px 0"}}>Status</div>
      <div className="m-card" style={{padding:"10px 12px", fontSize:12, fontFamily:"var(--font-mono)", color:"var(--ink-3)", background:"#0b0d12"}}>
        <div style={{color:"#c8ccd6"}}>env · design-preview</div>
        <div style={{color:"#c8ccd6"}}>build · v2.0.0-preview</div>
        <div style={{color:"#c8ccd6"}}>last sync · 2m ago</div>
      </div>
    </MShell>
  );
}

Object.assign(window, { MToday, MReview, MAllTasks, MBoards, MSettings });
