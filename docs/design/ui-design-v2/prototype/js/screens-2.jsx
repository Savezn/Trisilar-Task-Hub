/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Trisilar Task Hub — UI Design V2 · Screens 2: Boards, Calendar, Planner
// ─────────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════
// 04. BOARDS MONITOR
// ══════════════════════════════════════════════════════════════════════
function ScreenBoards() {
  return (
    <Shell
      active="boards"
      crumb={["Boards Monitor"]}
      title="Boards Monitor"
      actions={<><button className="btn"><Ic.Refresh size={12} /> Sync</button><button className="btn"><Ic.External size={12} /> Trello workspace</button></>}
    >
      <RouteBar
        title="Board & team health"
        sub={<><span>9 boards visible</span><span>·</span><span>5 BU groups</span><span>·</span><span>last sync 2m ago</span></>}
        actions={
          <div className="seg">
            <button className="on">Board mode</button>
            <button>Team mode</button>
            <button>Convention warnings</button>
          </div>
        }
      />

      <div className="stat-strip" style={{marginBottom: 16}}>
        <div className="stat-cell over"><span className="k">Overdue cards</span><span className="v">10</span><span className="d">Across 5 boards</span></div>
        <div className="stat-cell warn"><span className="k">Stale 7d+</span><span className="v">11</span><span className="d">Bug Triage leads</span></div>
        <div className="stat-cell"><span className="k">Convention warnings</span><span className="v">7</span><span className="d">Naming · owners</span></div>
        <div className="stat-cell ai"><span className="k">AI-touched cards</span><span className="v">23</span><span className="d">Last 7 days</span></div>
      </div>

      <div className="filterbar" style={{marginBottom:16}}>
        <span className="search-sm"><Ic.Search size={13} /><input placeholder="Search boards…" /></span>
        <span className="filter-chip on"><span className="k">bu:</span> all <Ic.X size={11} /></span>
        <span className="filter-chip"><span className="k">health:</span> any</span>
        <span className="filter-chip"><span className="k">owner:</span> any</span>
        <span className="filter-chip"><span className="k">stale:</span> 7d+</span>
        <span style={{marginLeft:"auto"}}><span className="eyebrow">Sort:</span> <button className="btn sm">Stale desc<Ic.Down size={11} /></button></span>
      </div>

      <div className="grid-3">
        {BOARD_HEALTH.map(b => {
          const board = getBoard(b.id);
          const bu = getBU(board.bu);
          const warning = b.overdue > 2 || b.stale > 2;
          return (
            <div className="board-card" key={b.id}>
              <div className="bc-head">
                <div>
                  <div className="bc-name"><span className="dot" style={{background: board.color}} />{board.name}</div>
                  <div className="bc-meta">
                    <span>{bu.name}</span> · {board.lists} lists · owner <span style={{color:"var(--ink-2)"}}>{getMember(b.owner)?.name}</span>
                  </div>
                </div>
                <button className="iconbtn"><Ic.More size={14} /></button>
              </div>

              <div className="row" style={{justifyContent:"space-between", alignItems:"flex-end"}}>
                <div className="bc-stat"><span className="k">Cards</span><span className="v tnum">{b.cards}</span></div>
                <div className="bc-stat"><span className="k">Overdue</span>
                  <span className="v tnum" style={{color: b.overdue > 0 ? "var(--over)" : "var(--ink-3)"}}>{b.overdue}</span>
                </div>
                <div className="bc-stat"><span className="k">Stale 7d+</span>
                  <span className="v tnum" style={{color: b.stale > 2 ? "var(--warn)" : "var(--ink-3)"}}>{b.stale}</span>
                </div>
                <Sparkline data={b.spark} />
              </div>

              <div className="warnings">
                {b.overdue > 0 && <Chip tone="over" sm>{b.overdue} overdue</Chip>}
                {b.dueToday > 0 && <Chip tone="warn" sm>{b.dueToday} due today</Chip>}
                {b.pending > 0 && <Chip tone="ai" sm>{b.pending} pending review</Chip>}
                {b.conv > 0 && <Chip tone="info" sm>{b.conv} naming</Chip>}
                {b.stale > 2 && <Chip tone="warn" sm>stale</Chip>}
                {warning ? null : <Chip tone="ok" sm>healthy</Chip>}
              </div>

              <div className="row" style={{justifyContent:"space-between", borderTop:"1px solid var(--line-2)", paddingTop:10}}>
                <button className="btn sm ghost">Open <Ic.ArrowR size={11} /></button>
                <span style={{font:"var(--t-mono-sm)", color:"var(--ink-4)"}}>last activity · 18m</span>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 05. CALENDAR
// ══════════════════════════════════════════════════════════════════════
function ScreenCalendar() {
  // Build a static month grid (5 rows × 7 cols), starting 27 Apr; today is 15 May (Saturday).
  const startNum = 27; // 27 Apr
  const daysInPrev = 30;
  const today = 15;
  const cells = [];
  for (let i = 0; i < 35; i++) {
    let n = startNum + i;
    let muted = false;
    let isToday = false;
    if (n <= daysInPrev) muted = true;
    else {
      n -= daysInPrev;
      if (n === today) isToday = true;
      if (n > 31) { n -= 31; muted = true; }
    }
    cells.push({ n, muted, isToday });
  }

  return (
    <Shell
      active="cal"
      crumb={["Calendar"]}
      title="Calendar"
      actions={<><div className="seg"><button>Day</button><button>Week</button><button className="on">Month</button></div><button className="btn primary"><Ic.Plus size={12} /> Add</button></>}
    >
      <RouteBar
        title="May 2026"
        sub={<><span>Trello deadlines + Google Calendar + Review-derived events</span><span>·</span><KV k="gcal" v="ops@trisilar" /></>}
        actions={
          <div className="row" style={{gap:4}}>
            <button className="iconbtn"><Ic.Chevron size={13} style={{transform:"rotate(180deg)"}} /></button>
            <button className="btn sm">Today</button>
            <button className="iconbtn"><Ic.Chevron size={13} /></button>
          </div>
        }
      />

      <div className="cal-legend">
        <span className="li"><span className="sw" style={{background:"var(--info-soft)", borderLeft:"2px solid var(--info)"}} /> Google Calendar</span>
        <span className="li"><span className="sw" style={{background:"var(--brand-soft)", borderLeft:"2px solid var(--brand)"}} /> Trello deadline</span>
        <span className="li"><span className="sw" style={{background:"var(--ai-soft)", borderLeft:"2px solid var(--ai)"}} /> AI-proposed (post-approval)</span>
        <span className="li"><span className="sw" style={{background:"var(--over-soft)", borderLeft:"2px solid var(--over)"}} /> Overdue</span>
      </div>

      <div className="cal-grid">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className="cal-dow">{d}</div>)}
        {cells.map((c, i) => {
          const row = Math.floor(i / 7), col = i % 7;
          const evs = CAL_EVENTS[`${row}-${col}`] || [];
          return (
            <div key={i} className={cx("cal-day", c.muted && "muted", c.isToday && "today")}>
              <div className="cd-num">{c.n}</div>
              {evs.map((e, j) => <div key={j} className={cx("cal-evt", e.k)}>{e.t}</div>)}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 06. PLANNER
// ══════════════════════════════════════════════════════════════════════
function ScreenPlanner() {
  return (
    <Shell
      active="planner"
      crumb={["Planner"]}
      title={<><span>Planner</span><Chip tone="muted" sm>Read-only</Chip></>}
      actions={<button className="btn primary"><Ic.Plus size={12} /> Add task</button>}
    >
      <RouteBar
        title="Today's plan"
        sub={<>
          <KV k="gtasks" v="off" tone="env-prod" />
          <KV k="trello" v="connected" tone="ai" />
          <span>·</span>
          <span>Saturday, 15 May 2026</span>
        </>}
        actions={<div className="seg"><button className="on">Today</button><button>Tomorrow</button><button>This week</button></div>}
      />

      {/* Notice — gtasks disconnected */}
      <div className="panel" style={{marginBottom:16, borderColor:"var(--warn-mid)", background:"var(--warn-soft)"}}>
        <div style={{display:"flex", alignItems:"center", gap:12, padding:"10px 16px"}}>
          <span style={{width:24, height:24, display:"grid", placeItems:"center", borderRadius:5, background:"var(--warn-mid)", color:"var(--warn-ink)"}}>
            <Ic.Warning size={14} />
          </span>
          <div style={{flex:1, minWidth:0}}>
            <div style={{font:"600 13px/1.3 var(--font-sans)", color:"var(--warn-ink)"}}>Google Tasks is not connected</div>
            <div style={{font:"var(--t-meta)", color:"var(--warn-ink)", opacity:0.85}}>
              Planner is showing Trello deadlines only. Connect Google Tasks in Settings to add and complete personal tasks.
            </div>
          </div>
          <button className="btn">Open Settings</button>
        </div>
      </div>

      <div className="planner-cols">
        <div className="planner-col gtasks">
          <div className="col-head">
            <div className="col-source"><span className="dot" /> Google Tasks · Today</div>
            <span style={{font:"var(--t-mono-sm)", color:"var(--ink-4)"}}>not connected</span>
          </div>
          <div style={{padding:24}}>
            <StateCard
              kind="disconnected"
              glyph={<Ic.Plug size={20} />}
              title="Connect Google Tasks"
              desc="Once connected, your personal day plan from Google Tasks shows up here next to Trello deadlines. No tasks are written until you approve a connection."
              actions={<><button className="btn primary">Open Settings</button><button className="btn">Why this exists</button></>}
            />
          </div>
        </div>

        <div className="planner-col trello">
          <div className="col-head">
            <div className="col-source"><span className="dot" /> Trello · due today</div>
            <span style={{font:"var(--t-mono-sm)", color:"var(--ink-4)"}}>4 cards · across 3 boards</span>
          </div>
          {TODAY_TASKS.filter(t => t.dueState !== "upcoming").slice(0,4).map(t => (
            <div key={t.id} className="trow" style={{gridTemplateColumns:"16px 1fr auto"}}>
              <span className="tck" />
              <div className="tmain">
                <div className="ttitle">{t.title}</div>
                <div className="tmeta">
                  <BoardTag id={t.board} /><span className="sep">·</span><span>{t.list}</span>
                  {t.gcal && <><span className="sep">·</span><span style={{color:"var(--info-ink)"}}>cal</span></>}
                </div>
              </div>
              <Due text={t.due} state={t.dueState} />
            </div>
          ))}
          <div style={{padding:"10px 16px", borderTop:"1px solid var(--line-2)", display:"flex", justifyContent:"space-between", font:"var(--t-meta)", color:"var(--ink-3)"}}>
            <span>Source: trello · read-only</span>
            <button className="btn sm ghost">Open in Trello <Ic.External size={11} /></button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

Object.assign(window, { ScreenBoards, ScreenCalendar, ScreenPlanner });
