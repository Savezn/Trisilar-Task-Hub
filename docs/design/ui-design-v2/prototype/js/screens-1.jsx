/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Trisilar Task Hub — UI Design V2 · Screens 1: Today, Review Queue, All Tasks
// ─────────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════
// 01. TODAY (desktop)
// ══════════════════════════════════════════════════════════════════════
function ScreenToday() {
  return (
    <Shell
      active="today"
      crumb={["Today"]}
      title="Today"
      actions={<><button className="btn"><Ic.Filter size={13} /> Filter</button><button className="btn primary"><Ic.Plus size={13} /> Quick add</button></>}
    >
      <RouteBar
        title="Daily command center"
        sub={<>
          <span>Saturday, 15 May 2026</span><span>·</span>
          <span>2 items need attention — 1 overdue, 2 due today, 4 pending review</span>
        </>}
      />

      {/* Stat strip — narrow, scannable */}
      <div className="stat-strip" style={{marginBottom: 16}}>
        <div className="stat-cell over"><span className="k">Overdue</span><span className="v">1</span><span className="d">Bug Triage · 2d</span></div>
        <div className="stat-cell warn"><span className="k">Due Today</span><span className="v">2</span><span className="d">Revenue Ops · Education W2</span></div>
        <div className="stat-cell"><span className="k">Next 7 Days</span><span className="v">5</span><span className="d">Across 4 boards</span></div>
        <div className="stat-cell ai"><span className="k">Pending Review</span><span className="v">4</span><span className="d">1 missing owner</span></div>
      </div>

      <div className="today-grid">
        <div className="stack">
          {/* Next up — hero */}
          <div className="next-up">
            <div className="eyebrow">Next up · 16:00 today</div>
            <div className="nu-title">P0 Revenue dashboard follow-up</div>
            <div className="nu-meta">
              <span>Revenue Q2 2026 · Next</span>
              <span>·</span>
              <span>Pim Suriya</span>
              <span>·</span>
              <span>3/5 checklist</span>
            </div>
            <div className="nu-actions">
              <button className="btn primary"><Ic.External size={12} /> Open in Trello</button>
              <button className="btn"><Ic.Check size={12} /> Mark done</button>
              <button className="btn"><Ic.Chevron size={12} /> Reschedule</button>
            </div>
          </div>

          <Panel
            title="Today's work"
            actions={<><span className="eyebrow">8 items</span><div className="seg"><button className="on">All</button><button>Mine</button><button>Risky</button></div></>}
            tight
          >
            {TODAY_TASKS.slice(0, 8).map(t => <TaskRow key={t.id} t={t} />)}
          </Panel>
        </div>

        <div className="stack">
          {/* Review Queue handoff */}
          <Panel
            eyebrow="AI Review Queue"
            title={<><span style={{display:"inline-flex", alignItems:"center", gap:8}}>4 tasks await approval<Chip tone="ai" sm>1 high risk</Chip></span></>}
            actions={<button className="btn ai sm">Open queue<Ic.ArrowR size={11} /></button>}
          >
            <div className="stack" style={{gap: 8}}>
              <div className="row" style={{justifyContent:"space-between"}}>
                <span className="kv"><span className="k">source</span><span className="v ai">paperclip</span></span>
                <span className="kv"><span className="k">env</span><span className="v env-prod">production</span></span>
                <span className="kv"><span className="k">last</span><span className="v">2m ago</span></span>
              </div>
              <div className="row" style={{gap:6, flexWrap:"wrap"}}>
                <DiffBadge kind="create" />
                <DiffBadge kind="update" />
                <DiffBadge kind="duplicate" />
                <DiffBadge kind="missing" />
              </div>
              <div style={{borderTop:"1px solid var(--line-2)", paddingTop:8, fontSize:12, color:"var(--ink-3)"}}>
                Run <span className="mono">pc-run-20260515-001</span> · PM Assistant
              </div>
            </div>
          </Panel>

          {/* Calendar peek */}
          <Panel title="Today on calendar" tight>
            <div style={{padding:"4px 0"}}>
              {[
                { t: "Weekly Marketing Sync", w: "10:00 · Meeting room 3", k: "gcal", who: ["m-pim","m-may"] },
                { t: "Interview · Sr Designer R2", w: "14:00 · Zoom", k: "gcal", who: ["m-nan"] },
                { t: "Songkran brief due", w: "17:00 · Trello deadline", k: "trello", who: ["m-pim"] },
                { t: "P0 Revenue follow-up", w: "16:00 · Trello deadline", k: "trello", who: ["m-pim"] },
              ].map((e, i) => (
                <div key={i} style={{display:"flex", alignItems:"center", gap:10, padding:"8px 16px", borderBottom: "1px solid var(--line-2)"}}>
                  <span className={cx("cal-evt", e.k)} style={{minWidth:0, flex:"0 0 auto", padding:"4px 8px"}}>
                    <span className="mono">{e.w.split(" · ")[0]}</span>
                  </span>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{font:"500 12.5px/1.3 var(--font-sans)"}}>{e.t}</div>
                    <div style={{font:"var(--t-mono-sm)", color:"var(--ink-4)", marginTop:2}}>{e.w.split(" · ")[1]}</div>
                  </div>
                  <AvatarStack ids={e.who} />
                </div>
              ))}
            </div>
          </Panel>

          {/* Blockers / convention warnings */}
          <Panel
            eyebrow="Cross-board signals"
            title="3 metadata warnings"
            actions={<button className="btn sm ghost">Open Boards<Ic.ArrowR size={11} /></button>}
          >
            <div className="stack" style={{gap:8}}>
              <div className="row" style={{justifyContent:"space-between"}}>
                <span><Chip tone="warn" sm>Stale</Chip> <strong>Bug Triage</strong> · 4 cards untouched 7+ days</span>
                <Avatar id="m-ek" size="sm" />
              </div>
              <div className="row" style={{justifyContent:"space-between"}}>
                <span><Chip tone="warn" sm>Missing owner</Chip> <strong>Content Calendar</strong> · 2 cards</span>
                <Avatar id="m-may" size="sm" />
              </div>
              <div className="row" style={{justifyContent:"space-between"}}>
                <span><Chip tone="info" sm>Naming</Chip> <strong>Revenue Q2</strong> · 3 cards skip BU prefix</span>
                <Avatar id="m-pim" size="sm" />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 02. REVIEW QUEUE (desktop) — the safety-critical screen
// ══════════════════════════════════════════════════════════════════════
function ScreenReview() {
  const session = REVIEW_SESSIONS[0];
  const selected = session.proposals[2]; // the missing-owner one

  return (
    <Shell
      active="review"
      crumb={["Review Queue"]}
      title={<><span>Review Queue</span><Chip tone="ai" sm>4 pending</Chip></>}
      actions={<><button className="btn"><Ic.Refresh size={13} /> Refresh</button><button className="btn"><Ic.Filter size={13} /> Filter</button></>}
    >
      <RouteBar
        title={<><span>AI Review Queue</span></>}
        sub={<>
          <KV k="source" v="paperclip" tone="ai" />
          <KV k="env" v="production" tone="env-prod" />
          <KV k="auth" v="webhook · signed" />
          <span>·</span>
          <span style={{color:"var(--ink-2)"}}>6 proposals · 4 pending · 2 approved · 0 rejected</span>
        </>}
        actions={<>
          <button className="btn"><Ic.External size={12} /> Open audit log</button>
          <button className="btn warn-outline"><Ic.Lock size={12} /> Block intake</button>
        </>}
      />

      {/* Bulk action bar */}
      <div className="bulkbar">
        <span className="count">2</span>
        <span>selected · across 1 session</span>
        <div className="b-actions">
          <button className="btn"><Ic.Check size={12} /> Approve…</button>
          <button className="btn"><Ic.X size={12} /> Reject…</button>
          <button className="btn"><Ic.Chevron size={12} /> Hold</button>
        </div>
      </div>

      <div className="rq-layout">
        {/* Left — session + proposals */}
        <div>
          {REVIEW_SESSIONS.map(s => (
            <div className="rq-session" key={s.id}>
              <div className="rq-session-head">
                <div>
                  <h3><span className="badge-ai">AI</span>{s.title}</h3>
                  <div className="meta">
                    <KV k="run" v={<span className="mono">{s.runId}</span>} />
                    <KV k="source" v={s.source} tone="ai" />
                    <KV k="env" v={s.sourceEnv} tone={s.sourceEnv === "production" ? "env-prod" : "env-stage"} />
                    <KV k="req" v={<span className="mono">{s.sourceRef}</span>} />
                    <KV k="agent" v={s.agent.name} />
                    <KV k="received" v={s.receivedAt} />
                  </div>
                </div>
                <div className="row" style={{gap:6, alignSelf:"start"}}>
                  <button className="btn sm"><Ic.External size={11} /> Trace</button>
                  <button className="btn sm"><Ic.Chevron size={11} /> Collapse</button>
                </div>
              </div>

              {s.proposals.map(p => (
                <div key={p.id} className={cx("rq-task", p.id === selected.id && "selected")}>
                  <div className="rqt-ck"><input type="checkbox" defaultChecked={p.id === selected.id} /></div>
                  <div className="rqt-main">
                    <div className="rqt-title">{p.title}</div>
                    <div className="rqt-sub">
                      {p.owner ? <><Avatar id={p.owner} size="sm" /><span>{getMember(p.owner)?.name}</span></> : <span style={{color:"var(--over-ink)"}}>● No owner</span>}
                      <span style={{color:"var(--ink-5)"}}>·</span>
                      <span>{p.deadline || <span style={{color:"var(--ink-4)"}}>no deadline</span>}</span>
                      {p.matchedTitle && <><span style={{color:"var(--ink-5)"}}>·</span><span style={{color:"var(--ink-4)"}}>vs “{p.matchedTitle}”</span></>}
                    </div>
                  </div>
                  <div className="rqt-diff">
                    <DiffBadge kind={p.diff} />
                    <Risk level={p.risk} />
                  </div>
                  <div className="rqt-target">
                    {getBoard(p.targetBoard)?.name}
                    <small>{p.targetList}</small>
                  </div>
                  <Confidence v={p.confidence} level={p.confLevel} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right — inspection drawer */}
        <aside className="drawer">
          <div className="drawer-head">
            <div className="dh-eyebrow"><Ic.AI size={11} /> AI proposal · review</div>
            <div className="dh-title">{selected.title}</div>
            <div className="dh-meta">
              <DiffBadge kind="missing" />
              <Risk level="high" />
              <Confidence v={selected.confidence} level="med" />
            </div>
          </div>

          <div className="drawer-body">
            <div className="dr-section">
              <div className="dr-label">Source & trace</div>
              <dl className="fkv">
                <dt>system</dt><dd><span className="kv"><span className="v ai">paperclip</span></span></dd>
                <dt>environment</dt><dd><span style={{color:"var(--over-ink)", fontWeight:600}}>production</span></dd>
                <dt>request</dt><dd className="mono">{session.sourceRef}</dd>
                <dt>agent</dt><dd>{session.agent.name} · <span style={{color:"var(--ink-4)"}}>agent</span></dd>
                <dt>run id</dt><dd><Trace id={session.runId} /></dd>
                <dt>received</dt><dd>{session.receivedAt}</dd>
                <dt>auth</dt><dd>webhook signature · verified <Ic.Check size={11} /></dd>
              </dl>
            </div>

            <div className="dr-section">
              <div className="dr-label">Proposed action <span className="mono" style={{color:"var(--ink-4)"}}>diff</span></div>
              <div className="diffview">
                <div className="diffview-head">
                  <span>{getBoard(selected.targetBoard)?.name} · {selected.targetList}</span>
                  <span>create_new</span>
                </div>
                <div className="diffview-row add">
                  <span className="mk">+</span><span className="fk">title</span><span className="fv">{selected.title}</span>
                </div>
                <div className="diffview-row add">
                  <span className="mk">+</span><span className="fk">due</span><span className="fv mono">2026-05-18 14:00</span>
                </div>
                <div className="diffview-row mod">
                  <span className="mk">!</span><span className="fk">owner</span>
                  <span className="fv" style={{color:"var(--over-ink)"}}>missing · required before approve</span>
                </div>
                <div className="diffview-row add">
                  <span className="mk">+</span><span className="fk">labels</span><span className="fv"><Chip tone="info" sm>Vendor</Chip></span>
                </div>
                <div className="diffview-row add">
                  <span className="mk">+</span><span className="fk">checklist</span><span className="fv">0 / 3</span>
                </div>
              </div>
            </div>

            <div className="dr-section">
              <div className="dr-label">Evidence · transcript excerpt</div>
              <div className="evidence">
                <div className="ev-body">…we need to schedule a vendor call about cloud infra renewal — I'll figure out who's available, but let's get something on the calendar in the next 3 days.</div>
                <div className="ev-foot">Weekly Marketing Sync · 09:12 · speaker: PM</div>
              </div>
            </div>

            <div className="dr-section">
              <div className="dr-label">External side effects on approve</div>
              <div className="stack" style={{gap:6}}>
                <div className="row" style={{justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--line-2)"}}>
                  <span><Chip tone="brand" sm>Trello</Chip> create card on Pipeline · In Progress</span>
                  <Toggle on />
                </div>
                <div className="row" style={{justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--line-2)"}}>
                  <span><Chip tone="info" sm>GCal</Chip> create event · ops@trisilar</span>
                  <Toggle on />
                </div>
                <div className="row" style={{justifyContent:"space-between", padding:"6px 0"}}>
                  <span><Chip tone="muted" sm>GTasks</Chip> add to Pim's task list</span>
                  <Toggle on={false} />
                </div>
              </div>
            </div>

            <div className="dr-section">
              <div className="dr-label">Audit timeline</div>
              <div className="timeline">
                <div className="tl-row ai">
                  <div className="tl-when">09:12</div>
                  <div className="tl-what">Paperclip extracted proposal from session</div>
                  <div className="tl-extra">Run <span className="mono">pc-run-20260515-001</span></div>
                </div>
                <div className="tl-row warn">
                  <div className="tl-when">09:12</div>
                  <div className="tl-what">Hub validation · owner field empty</div>
                  <div className="tl-extra">Awaiting human assignment</div>
                </div>
                <div className="tl-row">
                  <div className="tl-when">09:32</div>
                  <div className="tl-what">Routed to Review Queue · production</div>
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-foot">
            <div className="row" style={{justifyContent:"space-between", marginBottom:4}}>
              <span style={{font:"var(--t-meta)", color:"var(--ink-3)"}}>Approval will create <strong style={{color:"var(--ink-2)"}}>2 external side effects</strong></span>
              <button className="btn sm ghost">Edit before approve</button>
            </div>
            <div className="row" style={{gap:6}}>
              <button className="btn">Hold</button>
              <button className="btn danger" style={{flex:1}}><Ic.X size={12} /> Reject</button>
              <button className="btn primary" style={{flex:1.4}} disabled><Ic.Check size={12} /> Approve · resolve owner first</button>
            </div>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 03. ALL TASKS (desktop) — dense table
// ══════════════════════════════════════════════════════════════════════
function ScreenAllTasks() {
  return (
    <Shell
      active="tasks"
      crumb={["All Tasks"]}
      title="All Tasks"
      actions={<><button className="btn"><Ic.External size={12} /> Open in Trello</button><button className="btn primary"><Ic.Plus size={12} /> New task</button></>}
    >
      <RouteBar
        title="Cross-board task inbox"
        sub={<><span>118 tasks visible</span><span>·</span><span>6 boards · 5 BUs</span><span>·</span><span>scope: Everyone</span></>}
        actions={
          <div className="seg">
            <button className="on">Table</button>
            <button>List</button>
            <button>Group · board</button>
            <button>Group · owner</button>
          </div>
        }
      />

      {/* Filter row */}
      <div className="filterbar" style={{marginBottom:12}}>
        <span className="search-sm"><Ic.Search size={13} /><input placeholder="Search tasks…" /></span>
        <span className="filter-chip on"><span className="k">status:</span> open <Ic.X size={11} /></span>
        <span className="filter-chip on"><span className="k">due:</span> next 14d <Ic.X size={11} /></span>
        <span className="filter-chip"><span className="k">board:</span> any</span>
        <span className="filter-chip"><span className="k">owner:</span> any</span>
        <span className="filter-chip"><span className="k">source:</span> any</span>
        <span className="filter-chip"><span className="k">label:</span> any</span>
        <span className="filter-chip"><Ic.Plus size={11} /> Add filter</span>
        <span style={{marginLeft:"auto", display:"flex", gap:6}}>
          <button className="btn sm">Saved: <strong>Risky open · 14d</strong><Ic.Down size={11} /></button>
          <button className="btn sm ghost"><Ic.Refresh size={12} /></button>
        </span>
      </div>

      <div className="panel" style={{overflow:"hidden"}}>
        <table className="tbl">
          <thead>
            <tr>
              <th className="ck"><input type="checkbox" /></th>
              <th style={{width:"35%"}}>Task</th>
              <th>Board · List</th>
              <th>Owner</th>
              <th>Due</th>
              <th>Status</th>
              <th>Source</th>
              <th className="num">Δ</th>
            </tr>
          </thead>
          <tbody>
            {TODAY_TASKS.concat(TODAY_TASKS.slice(0,4)).slice(0,11).map((t, i) => (
              <tr key={i} className={i === 2 ? "selected" : ""}>
                <td className="ck"><input type="checkbox" defaultChecked={i===2} /></td>
                <td>
                  <div style={{display:"flex", alignItems:"center", gap:8}}>
                    <span className="tck" style={{width:13, height:13, borderRadius:3, border:"1.5px solid var(--ink-5)"}} />
                    <div>
                      <div style={{font:"500 13px/1.3 var(--font-sans)"}}>{t.title}</div>
                      <div style={{display:"flex", gap:4, marginTop:3}}>{t.labels?.map(id => <Label key={id} id={id} />)}</div>
                    </div>
                  </div>
                </td>
                <td><BoardTag id={t.board} /> <span style={{color:"var(--ink-4)"}}>· {t.list}</span></td>
                <td><AvatarStack ids={t.members || []} /></td>
                <td><Due text={t.due} state={t.dueState} /></td>
                <td>
                  {t.dueState === "over" && <Chip tone="over" sm>Overdue</Chip>}
                  {t.dueState === "warn" && <Chip tone="warn" sm>Due today</Chip>}
                  {t.dueState === "upcoming" && <Chip tone="muted" sm>Upcoming</Chip>}
                </td>
                <td>
                  {t.ai ? <Chip tone="ai" sm>AI · approved</Chip> : <Chip tone="muted" sm>Trello</Chip>}
                </td>
                <td className="num mono">{t.checklist ? `${t.checklist[0]}/${t.checklist[1]}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="panel-foot">
          <span>11 of 118</span>
          <span style={{marginLeft:"auto", display:"flex", gap:6}}>
            <button className="btn sm">Prev</button>
            <button className="btn sm">Next</button>
            <button className="btn sm ghost">Export</button>
          </span>
        </div>
      </div>
    </Shell>
  );
}

Object.assign(window, { ScreenToday, ScreenReview, ScreenAllTasks });
