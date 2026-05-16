/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Trisilar Task Hub — UI Design V2 · Screens 3: OKR, Weekly Focus, AI Trace, Settings
// ─────────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════
// 07. OKR / PORTFOLIO
// ══════════════════════════════════════════════════════════════════════
function ScreenOKR() {
  return (
    <Shell
      active="okr"
      crumb={["OKR / Portfolio"]}
      title="OKR / Portfolio"
      actions={<><button className="btn"><Ic.Filter size={12} /> Filter</button><button className="btn primary"><Ic.Plus size={12} /> Objective</button></>}
    >
      <RouteBar
        title="Q2 2026 · mid-quarter"
        sub={<><span>4 objectives · 11 key results</span><span>·</span><span>cycle ends 30 Jun 2026 · 46 days remaining</span></>}
        actions={
          <div className="seg">
            <button className="on">All</button>
            <button>On track</button>
            <button>At risk</button>
            <button>Behind</button>
          </div>
        }
      />

      <div className="stat-strip" style={{marginBottom:16}}>
        <div className="stat-cell ok"><span className="k">On track</span><span className="v">2</span><span className="d">Revenue · Marketing</span></div>
        <div className="stat-cell warn"><span className="k">At risk</span><span className="v">1</span><span className="d">Paperclip canary</span></div>
        <div className="stat-cell over"><span className="k">Behind</span><span className="v">1</span><span className="d">Hiring</span></div>
        <div className="stat-cell"><span className="k">Avg progress</span><span className="v">52%</span><span className="d">Cycle pace 53%</span></div>
      </div>

      <div className="panel" style={{padding:0}}>
        {OBJECTIVES.map(o => (
          <div key={o.id} className="okr-obj">
            <div className="okr-obj-head">
              <div style={{flex:1, minWidth:0}}>
                <div className="okr-obj-title">{o.name}</div>
                <div className="okr-obj-meta">
                  <KV k="owner" v={getMember(o.owner)?.name} />
                  <span> · </span>
                  <KV k="cycle" v="Q2 2026" />
                  <span> · </span>
                  <KV k="krs" v={`${o.krs.length} key results`} />
                </div>
                <div className={cx("okr-progress", o.status)}>
                  <i style={{width: `${Math.round(o.progress * 100)}%`}} />
                </div>
              </div>
              <div style={{textAlign:"right", display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end"}}>
                <div style={{font:"600 24px/1 var(--font-sans)", fontVariantNumeric:"tabular-nums"}}>{Math.round(o.progress * 100)}%</div>
                {o.status === "on" && <Chip tone="ok" sm>On track</Chip>}
                {o.status === "risk" && <Chip tone="warn" sm>At risk</Chip>}
                {o.status === "behind" && <Chip tone="over" sm>Behind</Chip>}
              </div>
            </div>
            <div style={{marginTop:14, borderTop:"1px solid var(--line-2)"}}>
              {o.krs.map((kr, i) => (
                <div key={i} className="kr-row">
                  <span className="kr-name">{kr.name}</span>
                  <span className="kr-bar"><i style={{width: `${Math.round(kr.pct * 100)}%`}} /></span>
                  <BoardTag id={kr.link} />
                  <span className="num">{Math.round(kr.pct * 100)}%</span>
                  <button className="btn sm ghost"><Ic.ArrowR size={11} /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 08. WEEKLY FOCUS
// ══════════════════════════════════════════════════════════════════════
function ScreenWeeklyFocus() {
  const doNow = TODAY_TASKS.slice(0, 3);
  const reviewAI = REVIEW_SESSIONS[0].proposals.slice(0, 3);
  const blocked = [{ title: "Confirm Trello connection state after refresh", board: "b-ops-hr", reason: "Auth refresh pending" }];
  const schedule = TODAY_TASKS.slice(3, 6);

  return (
    <Shell
      active="focus"
      crumb={["Weekly Focus"]}
      title="Weekly Focus"
      actions={<><div className="seg"><button>Last week</button><button className="on">This week</button><button>Next week</button></div></>}
    >
      <RouteBar
        title="Week of 11 – 17 May 2026"
        sub={<><span>Prioritized from due dates, labels, review status, and blocked signals.</span><span>·</span><KV k="owner" v="Everyone" /></>}
        actions={<>
          <button className="btn"><Ic.Filter size={12} /> Owner</button>
          <button className="btn ai sm">Open Review Queue · 4<Ic.ArrowR size={11} /></button>
        </>}
      />

      <div className="lanes">
        <div className="lane">
          <div className="lane-head">
            <div className="lane-name do"><span className="pip" /> Do Now</div>
            <div className="lane-count">{doNow.length}</div>
          </div>
          <div className="lane-body">
            {doNow.map(t => (
              <div key={t.id} className="lane-item">
                <div className="lt">{t.title}</div>
                <div className="lm">
                  <BoardTag id={t.board} />
                  <span style={{color:"var(--ink-5)"}}>·</span>
                  <Due text={t.due} state={t.dueState} />
                </div>
                <div className="lm">
                  <AvatarStack ids={t.members || []} />
                  <div style={{marginLeft:"auto", display:"flex", gap:4}}>{t.labels?.map(id => <Label key={id} id={id} />)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lane">
          <div className="lane-head">
            <div className="lane-name review"><span className="pip" /> Review AI</div>
            <div className="lane-count">{reviewAI.length}</div>
          </div>
          <div className="lane-body">
            {reviewAI.map(p => (
              <div key={p.id} className="lane-item" style={{borderColor:"var(--ai-mid)", background:"var(--ai-tint)"}}>
                <div className="lt">{p.title}</div>
                <div className="lm">
                  <DiffBadge kind={p.diff} />
                </div>
                <div className="lm">
                  <Confidence v={p.confidence} level={p.confLevel} />
                  <span style={{marginLeft:"auto"}}><Risk level={p.risk} /></span>
                </div>
              </div>
            ))}
            <button className="btn sm ghost" style={{justifyContent:"center"}}>Open queue<Ic.ArrowR size={11} /></button>
          </div>
        </div>

        <div className="lane">
          <div className="lane-head">
            <div className="lane-name blocked"><span className="pip" /> Waiting / Blocked</div>
            <div className="lane-count">{blocked.length}</div>
          </div>
          <div className="lane-body">
            {blocked.map((b, i) => (
              <div key={i} className="lane-item" style={{borderColor:"var(--warn-mid)", background:"var(--warn-soft)"}}>
                <div className="lt">{b.title}</div>
                <div className="lm">
                  <Chip tone="warn" sm>Blocked</Chip>
                  <span>{b.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lane">
          <div className="lane-head">
            <div className="lane-name schedule"><span className="pip" /> Schedule</div>
            <div className="lane-count">{schedule.length}</div>
          </div>
          <div className="lane-body">
            {schedule.map(t => (
              <div key={t.id} className="lane-item">
                <div className="lt">{t.title}</div>
                <div className="lm">
                  <BoardTag id={t.board} />
                  <span style={{color:"var(--ink-5)"}}>·</span>
                  <Due text={t.due} state={t.dueState} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 09. DOCS / AI TRACE
// ══════════════════════════════════════════════════════════════════════
function ScreenTrace() {
  return (
    <Shell
      active="trace"
      crumb={["Docs", "AI Trace"]}
      title="Docs / AI Trace"
      actions={<><button className="btn"><Ic.Filter size={12} /> Filter</button><button className="btn"><Ic.External size={12} /> Export</button></>}
    >
      <RouteBar
        title="Paperclip & agent run history"
        sub={<>
          <KV k="auth" v="webhook · enforced" />
          <KV k="retention" v="90 days · runs · 365 days · approved tasks" />
          <span>·</span>
          <span>6 runs visible · 4 approved · 1 in review · 1 orphan</span>
        </>}
      />

      <div className="filterbar" style={{marginBottom:16}}>
        <span className="search-sm"><Ic.Search size={13} /><input placeholder="Search run id, agent, title…" /></span>
        <span className="filter-chip on"><span className="k">env:</span> production <Ic.X size={11} /></span>
        <span className="filter-chip"><span className="k">env:</span> staged</span>
        <span className="filter-chip"><span className="k">status:</span> any</span>
        <span className="filter-chip"><span className="k">agent:</span> any</span>
        <span className="filter-chip"><span className="k">window:</span> 14d</span>
      </div>

      <div className="panel" style={{padding:0}}>
        <div className="trace-row" style={{background:"var(--surface-2)", borderBottom:"1px solid var(--line)"}}>
          <span className="eyebrow">Run id</span>
          <span className="eyebrow">Title · session</span>
          <span className="eyebrow">Agent · env</span>
          <span className="eyebrow">Received</span>
          <span className="eyebrow">Status</span>
        </div>
        {TRACE_RUNS.map(r => (
          <div key={r.id} className="trace-row">
            <span><Trace id={r.id} /></span>
            <div>
              <div className="ttitle">{r.linkTitle || <span style={{color:"var(--ink-4)"}}>— no linked session —</span>}</div>
              <div className="tdesc">
                {r.session ? <span className="tlink mono">session · {r.session}</span> : <span className="tlink missing mono">no session linked · {r.rejectReason}</span>}
                {" · "}{r.tasks} task{r.tasks === 1 ? "" : "s"}
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:2}}>
              <span style={{font:"500 12px/1 var(--font-sans)", color:"var(--ink-2)"}}>{r.agent}</span>
              <span className={cx("kv mono", r.env === "production" ? "" : "")}>
                <span className="k">env</span>
                <span className={cx("v", r.env === "production" ? "env-prod" : "env-stage")}>{r.env}</span>
              </span>
            </div>
            <span className="mono" style={{color:"var(--ink-3)"}}>{r.received}</span>
            <span>
              {r.status === "approved" && <Chip tone="ok" sm>Approved</Chip>}
              {r.status === "review" && <Chip tone="ai" sm>In review</Chip>}
              {r.status === "rejected" && <Chip tone="over" sm>Rejected</Chip>}
              {r.status === "missing" && <Chip tone="warn" sm>Orphan</Chip>}
            </span>
          </div>
        ))}
      </div>

      {/* Inspect card */}
      <div style={{marginTop:16}}>
        <div className="evidence-card">
          <div className="ec-head">
            <span className="eyebrow">Inspecting</span>
            <Trace id="pc-run-20260513-009" />
            <Chip tone="over" sm>Rejected</Chip>
            <span style={{marginLeft:"auto", display:"flex", gap:6}}>
              <button className="btn sm"><Ic.Copy size={11} /> Copy as report</button>
              <button className="btn sm warn-outline"><Ic.Lock size={12} /> Rollback hint</button>
            </span>
          </div>
          <div className="ec-body">
            <dl className="fkv" style={{gridTemplateColumns:"140px 1fr"}}>
              <dt>agent</dt><dd>Doc Aide · agent</dd>
              <dt>request</dt><dd className="mono">req-26-05-13-0021</dd>
              <dt>environment</dt><dd><span style={{color:"var(--warn-ink)", fontWeight:600}}>staged</span></dd>
              <dt>received</dt><dd>13 May 2026 · 11:04</dd>
              <dt>tasks proposed</dt><dd>1</dd>
              <dt>tasks created</dt><dd>0 · rejected before side-effect</dd>
              <dt>reject reason</dt><dd style={{color:"var(--over-ink)"}}>Missing required field: <span className="mono">owner</span></dd>
              <dt>side effects</dt><dd>None (gate held) · Trello · GCal · GTasks all untouched</dd>
            </dl>

            <div>
              <div className="dr-label" style={{marginBottom:8}}>Audit timeline</div>
              <div className="timeline">
                <div className="tl-row ai">
                  <div className="tl-when">11:04</div>
                  <div className="tl-what">Paperclip submitted 1 proposed task</div>
                </div>
                <div className="tl-row over">
                  <div className="tl-when">11:04</div>
                  <div className="tl-what">Hub validation failed · owner missing</div>
                  <div className="tl-extra">Side effects blocked · no external writes</div>
                </div>
                <div className="tl-row">
                  <div className="tl-when">11:05</div>
                  <div className="tl-what">Run rejected automatically</div>
                  <div className="tl-extra">Logged for review · no human action required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 10. SETTINGS
// ══════════════════════════════════════════════════════════════════════
function ScreenSettings() {
  return (
    <Shell
      active="settings"
      crumb={["Settings"]}
      title="Settings"
      actions={<button className="btn"><Ic.External size={12} /> Operations runbook</button>}
    >
      <RouteBar
        title="Operational control"
        sub={<><span>Integrations · workspace visibility · BU groups · Paperclip mode · access</span></>}
      />

      <div className="set-grid">
        <aside className="set-side">
          <div className="sl on">Integrations</div>
          <div className="sl">Workspace visibility</div>
          <div className="sl">Hidden boards</div>
          <div className="sl">BU groups</div>
          <div className="sl">Paperclip · AI intake</div>
          <div className="sl">Access & policy</div>
          <div className="sl">Audit · retention</div>
          <div className="sl">Notifications</div>
          <div className="sl">Display</div>
        </aside>

        <div className="set-block">
          <Panel title="Integrations" eyebrow="Connections" tight>
            {INTEGRATIONS.map(intg => (
              <div className="intg-row" key={intg.id}>
                <div className="ic"><Ic.Plug size={13} /></div>
                <div className="nm">
                  {intg.name}
                  <small>{intg.meta}</small>
                </div>
                <div>
                  {intg.status === "ok" && <Chip tone="ok" sm><span className="dot" />Connected</Chip>}
                  {intg.status === "warn" && <Chip tone="warn" sm><span className="dot" />Staged</Chip>}
                  {intg.status === "off" && <Chip tone="muted" sm><span className="dot" />Not connected</Chip>}
                </div>
                <button className="btn sm">{intg.action}</button>
              </div>
            ))}
          </Panel>

          <Panel
            eyebrow="Paperclip · AI intake"
            title={<><span>Intake mode</span><Chip tone="warn" sm>Staged</Chip></>}
            actions={<button className="btn warn-outline sm"><Ic.Lock size={12} /> Pause intake</button>}
          >
            <div className="stack">
              <div className="set-row">
                <div className="sk">
                  <div className="nm">Intake mode</div>
                  <div className="ds">Controls whether Paperclip can submit proposals. Production intake requires Runtime Owner approval before enabling.</div>
                </div>
                <div className="seg">
                  <button>Disabled</button>
                  <button className="on">Staged</button>
                  <button disabled style={{opacity:0.5}}>Permanent</button>
                </div>
                <button className="btn sm">Audit</button>
              </div>
              <div className="set-row">
                <div className="sk">
                  <div className="nm">Production intake</div>
                  <div className="ds">Live agent traffic — currently <strong>not approved</strong> by Runtime Owner.</div>
                </div>
                <div><Chip tone="warn">Not approved</Chip></div>
                <button className="btn sm" disabled style={{opacity:0.6}}>Request</button>
              </div>
              <div className="set-row">
                <div className="sk">
                  <div className="nm">Signing secret</div>
                  <div className="ds">Webhook signing material. Status only — never displayed.</div>
                </div>
                <div className="sv"><Ic.Lock size={11} /> ●●●●●●●● · configured · last rotated 12 May 2026</div>
                <button className="btn sm">Rotate</button>
              </div>
              <div className="set-row">
                <div className="sk">
                  <div className="nm">Side-effect policy</div>
                  <div className="ds">Side effects (Trello, GCal, GTasks writes) remain gated by Review Queue. Cannot be disabled.</div>
                </div>
                <div className="sv">Locked · always human-gated</div>
                <Chip tone="ok" sm>Enforced</Chip>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Workspace" title="Visible boards · BU groups" actions={<button className="btn sm">Edit groups</button>}>
            <div className="stack">
              {BU_GROUPS.slice(0,4).map(g => {
                const boards = BOARDS.filter(b => b.bu === g.id);
                return (
                  <div className="set-row" key={g.id} style={{gridTemplateColumns:"180px 1fr auto"}}>
                    <div className="sk">
                      <div className="nm"><span style={{display:"inline-block", width:8, height:8, borderRadius:2, background:g.color, marginRight:6, verticalAlign:"middle"}} />{g.name}</div>
                      <div className="ds">{boards.length} boards</div>
                    </div>
                    <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
                      {boards.map(b => <Chip key={b.id} tone="muted" sm>{b.name}</Chip>)}
                    </div>
                    <Toggle on />
                  </div>
                );
              })}
              <div className="set-row" style={{gridTemplateColumns:"180px 1fr auto"}}>
                <div className="sk">
                  <div className="nm">Hidden boards</div>
                  <div className="ds">Excluded from Boards Monitor and All Tasks.</div>
                </div>
                <div className="sv mono" style={{color:"var(--ink-4)"}}>8 boards hidden</div>
                <button className="btn sm">Review</button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}

Object.assign(window, { ScreenOKR, ScreenWeeklyFocus, ScreenTrace, ScreenSettings });
