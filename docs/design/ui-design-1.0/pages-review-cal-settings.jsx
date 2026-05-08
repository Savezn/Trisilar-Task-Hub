// ── Review Queue ────────────────────────────────────────────────────────────
function ReviewPage({ sessions, setSessions, openTask }) {
  const [activeId, setActiveId] = useState(sessions[0]?.id);
  const [selected, setSelected] = useState(new Set());
  const [showTranscript, setShowTranscript] = useState(true);
  const session = sessions.find(s => s.id === activeId) || sessions[0];

  const updateTaskStatus = (taskId, status) => {
    setSessions(ss => ss.map(s => s.id !== session.id ? s : ({
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    })));
    setSelected(new Set([...selected].filter(x => x !== taskId)));
  };

  const toggleSelect = (id) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  const bulkApprove = () => {
    setSessions(ss => ss.map(s => s.id !== session.id ? s : ({
      ...s,
      tasks: s.tasks.map(t => selected.has(t.id) ? { ...t, status: "approved" } : t)
    })));
    setSelected(new Set());
  };

  const pendingCount = sessions.reduce((n, s) => n + s.tasks.filter(t => t.status === "pending").length, 0);

  const diffBadge = (status) => {
    const map = {
      create_new: { cls: "diff-create", label: "Create new", icon: <Icon.Plus size={11}/> },
      update_existing: { cls: "diff-update", label: "Update existing", icon: <Icon.GitMerge size={11}/> },
      possible_duplicate: { cls: "diff-dup", label: "Possible duplicate", icon: <Icon.AlertTriangle size={11}/> },
    };
    const m = map[status] || map.create_new;
    return <span className={"diff-badge " + m.cls}>{m.icon}{m.label}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title"><Icon.Sparkles size={22} style={{verticalAlign: "-3px", marginRight: 8, color: "var(--purple)"}}/>Review Queue</div>
        <div className="page-sub">{pendingCount} task{pendingCount !== 1 && "s"} awaiting approval across {sessions.length} sessions · AI-extracted from meetings</div>
      </div>

      <div className="rev-grid">
        <div>
          <div className="toolbar" style={{ marginBottom: 12 }}>
            <button className="btn btn-out btn-sm"><Icon.Plus size={13}/>New session</button>
            {selected.size > 0 && (
              <>
                <span style={{ color: "var(--ink-3)", fontSize: 12 }}>{selected.size} selected</span>
                <button className="btn btn-ok btn-sm" onClick={bulkApprove}><Icon.Check size={13}/>Approve all</button>
                <button className="btn btn-sm btn-danger" onClick={() => setSelected(new Set())}>Clear</button>
              </>
            )}
          </div>

          {sessions.map(s => {
            const pending = s.tasks.filter(t => t.status === "pending").length;
            const approved = s.tasks.filter(t => t.status === "approved").length;
            const isActive = s.id === activeId;
            return (
              <div key={s.id} className={classNames("session-card", isActive && "active")}>
                <div className="session-h" onClick={() => setActiveId(s.id)}>
                  <div className="side-avatar" style={{ width: 32, height: 32, fontSize: 11, background: "var(--purple)" }}>
                    {s.source === "discord" ? <Icon.Slack size={14}/> : <Icon.Upload size={14}/>}
                  </div>
                  <div className="session-h-body">
                    <div className="session-title">{s.title}</div>
                    <div className="session-sub">
                      <span>{fmtDateTime(toDate(s.createdAt))}</span>
                      <span>·</span>
                      <span>{s.source === "discord" ? "Discord" : "Manual upload"}</span>
                      <span>·</span>
                      <span>{s.tasks.length} tasks extracted</span>
                    </div>
                  </div>
                  <div className="session-stats">
                    {pending > 0 && <span className="chip chip-purple">{pending} pending</span>}
                    {approved > 0 && <span className="chip chip-ok">{approved} approved</span>}
                  </div>
                </div>

                {isActive && (
                  <div>
                    {s.tasks.map(t => {
                      const isSel = selected.has(t.id);
                      const owner = getMember(t.owner);
                      const board = getBoard(t.targetBoard);
                      return (
                        <div key={t.id}
                             className={classNames("review-task",
                               t.status === "approved" && "approved",
                               t.status === "rejected" && "rejected",
                               isSel && "selected")}>
                          <div className="review-task-h">
                            <div className="task-check"
                                 style={isSel ? {background: "var(--accent)", borderColor: "var(--accent)", color: "white"} : {}}
                                 onClick={() => toggleSelect(t.id)}>
                              {isSel && <Icon.Check size={11} weight={3}/>}
                            </div>
                            <div className="review-task-title">{t.title}</div>
                            {diffBadge(t.diffStatus)}
                            <div title={`${Math.round(t.confidence * 100)}% confidence`}
                                 style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <span className="confidence-bar"><span style={{ width: `${t.confidence * 100}%` }}/></span>
                              <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--ink-3)", minWidth: 26, textAlign: "right" }}>{Math.round(t.confidence * 100)}%</span>
                            </div>
                          </div>

                          <div className="review-task-meta-row">
                            <span><span className="label">Owner</span>
                              {owner ? <><Avatar id={owner.id} size="sm"/> {owner.name}</> : <span style={{color: "var(--ink-4)"}}>Unassigned</span>}
                            </span>
                            <span><span className="label">Due</span>
                              {t.deadline ? <DueChip iso={t.deadline}/> : <span style={{color: "var(--ink-4)"}}>None</span>}
                            </span>
                            <span><span className="label">Board</span>
                              {board && <BoardTag id={board.id}/>} <span style={{ color: "var(--ink-4)" }}>· {t.targetList}</span>
                            </span>
                            <span><span className="label">Priority</span>
                              <span className={classNames("chip", t.priority === "high" ? "chip-over" : t.priority === "medium" ? "chip-warn" : "chip-out")}>
                                <Icon.Flag size={10}/>{t.priority}
                              </span>
                            </span>
                          </div>

                          {t.reasoning && (
                            <div className="review-reasoning">
                              <strong style={{ color: "var(--purple)" }}>AI:</strong> {t.reasoning}
                            </div>
                          )}

                          <div className="review-actions">
                            <label className="row" style={{ fontSize: 12, color: "var(--ink-3)", cursor: "pointer" }}>
                              <input type="checkbox" defaultChecked={t.syncCalendar}/>
                              <Icon.Calendar size={12}/> Sync to Calendar
                            </label>
                            <label className="row" style={{ fontSize: 12, color: "var(--ink-3)", cursor: "pointer" }}>
                              <input type="checkbox" defaultChecked={t.syncTasks}/>
                              <Icon.CheckSquare size={12}/> Sync to Google Tasks
                            </label>
                            <div className="spacer"/>
                            {t.status === "pending" && (
                              <>
                                <button className="btn btn-sm"><Icon.Edit size={12}/>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => updateTaskStatus(t.id, "rejected")}>
                                  <Icon.X size={12}/>Reject
                                </button>
                                <button className="btn btn-sm btn-ok" onClick={() => updateTaskStatus(t.id, "approved")}>
                                  <Icon.Check size={12}/>Approve
                                </button>
                              </>
                            )}
                            {t.status === "approved" && (
                              <span className="chip chip-ok"><Icon.Check size={11}/>Approved · pushed to Trello</span>
                            )}
                            {t.status === "rejected" && (
                              <>
                                <span className="chip">Rejected</span>
                                <button className="btn btn-xs" onClick={() => updateTaskStatus(t.id, "pending")}>Undo</button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <div className="transcript-card">
            <div className="transcript-h">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ flex: 1 }}>Meeting context</h3>
                <button className="btn btn-icon btn-sm" onClick={() => setShowTranscript(!showTranscript)}>
                  {showTranscript ? <Icon.EyeOff size={14}/> : <Icon.Eye size={14}/>}
                </button>
              </div>
              <div className="transcript-h-sub">{session.title}</div>
            </div>
            <div className="transcript-body">
              <div style={{ marginBottom: 16, padding: 12, background: "var(--surface-2)", borderRadius: 8, fontSize: 12.5 }}>
                <strong style={{ color: "var(--purple)", display: "block", marginBottom: 4 }}>📝 Summary</strong>
                {session.summary}
              </div>
              {showTranscript && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Transcript</div>
                  {session.transcript.split("\n").filter(Boolean).map((line, i) => {
                    const m = line.match(/^([^:]+):\s*(.*)$/);
                    return (
                      <div key={i} style={{ marginBottom: 8 }}>
                        {m ? <><span className="speaker">{m[1]}:</span>{m[2]}</> : line}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Calendar (month grid) ───────────────────────────────────────────────────
function CalendarPage({ tasks }) {
  const [cursor, setCursor] = useState(new Date());
  const monthName = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Mon = 0
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) {
    const d = new Date(firstOfMonth); d.setDate(d.getDate() - (startWeekday - i));
    cells.push({ date: d, other: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d), other: false });
  }
  while (cells.length % 7 !== 0 || cells.length < 35) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last); d.setDate(d.getDate() + 1);
    cells.push({ date: d, other: true });
    if (cells.length >= 42) break;
  }

  // synthetic Google events to mix in
  const gcalEvents = [
    { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), title: "All-hands" },
    { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), title: "1:1 with Tan" },
    { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), title: "Vendor demo" },
  ];

  const eventsForDay = (d) => {
    const trello = tasks.filter(t => t.due && isSameDay(toDate(t.due), d)).map(t => ({
      title: t.title, kind: t.dueComplete ? "ok" : (toDate(t.due) < today && !isSameDay(toDate(t.due), today) ? "over" : "tre"),
    }));
    const gc = gcalEvents.filter(e => isSameDay(e.date, d)).map(e => ({ title: e.title, kind: "gcal" }));
    return [...gc, ...trello];
  };

  return (
    <div>
      <div className="toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button className="btn btn-icon btn-sm" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
            <Icon.ChevronRight size={14} style={{ transform: "rotate(180deg)" }}/>
          </button>
          <h2 style={{ fontSize: 17, fontWeight: 600, minWidth: 180, textAlign: "center" }}>{monthName}</h2>
          <button className="btn btn-icon btn-sm" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
            <Icon.ChevronRight size={14}/>
          </button>
          <button className="btn btn-out btn-sm" onClick={() => setCursor(new Date())}>Today</button>
        </div>
        <div className="spacer"/>
        <div className="seg">
          <button>Day</button>
          <button>Week</button>
          <button className="on">Month</button>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, color: "var(--ink-3)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent)" }}/>Trello</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--info)" }}/>Google</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--over)" }}/>Overdue</span>
        </div>
        <button className="btn btn-primary"><Icon.Plus size={14}/>New event</button>
      </div>

      <div className="cal-grid">
        <div className="cal-h">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="cal-body">
          {cells.map((c, i) => {
            const events = eventsForDay(c.date);
            const isToday = isSameDay(c.date, today);
            return (
              <div key={i} className={classNames("cal-day", c.other && "other", isToday && "today")}>
                <div className="cal-day-num">{c.date.getDate()}</div>
                {events.slice(0, 3).map((e, idx) => (
                  <div key={idx} className={"cal-evt ev-" + e.kind} title={e.title}>
                    {e.title}
                  </div>
                ))}
                {events.length > 3 && (
                  <div style={{ fontSize: 10.5, color: "var(--ink-3)", padding: "0 6px" }}>+{events.length - 3} more</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Settings ────────────────────────────────────────────────────────────────
function SettingsPage() {
  const [section, setSection] = useState("integrations");
  const [tog, setTog] = useState({ autoCal: true, hiddenBoards: true, aiReview: true, gcalNotif: false, weeklyDigest: true });
  const setT = (k) => setTog(t => ({ ...t, [k]: !t[k] }));

  return (
    <div className="content-narrow">
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-sub">Workspace, integrations, and preferences</div>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          {[
            ["integrations","Integrations"],
            ["workspace","Workspace"],
            ["bus","Business Units"],
            ["boards","Board Visibility"],
            ["ai","AI & Review"],
            ["notif","Notifications"],
            ["account","Account"],
          ].map(([k, l]) => (
            <button key={k} className={section === k ? "on" : ""} onClick={() => setSection(k)}>{l}</button>
          ))}
        </div>

        <div>
          {section === "integrations" && (
            <>
              <div className="settings-card">
                <h3>Integrations</h3>
                <div className="sub">Connect external tools so Trisilar can read & write tasks</div>

                <div className="integ">
                  <div className="integ-ico" style={{ background: "#0079bf", color: "white" }}><Icon.Trello size={20}/></div>
                  <div className="integ-body">
                    <div className="integ-name">Trello</div>
                    <div className="integ-sub">Source of truth for boards, lists, cards · 7 boards visible</div>
                  </div>
                  <span className="chip chip-ok"><span className="chip-dot"/>Connected</span>
                  <button className="btn btn-out btn-sm">Manage</button>
                </div>

                <div className="integ">
                  <div className="integ-ico" style={{ background: "#fef3c7", color: "#92400e" }}><Icon.Calendar size={20}/></div>
                  <div className="integ-body">
                    <div className="integ-name">Google Calendar</div>
                    <div className="integ-sub">pim@trisilar.com · synced 2 minutes ago</div>
                  </div>
                  <span className="chip chip-ok"><span className="chip-dot"/>Connected</span>
                  <button className="btn btn-out btn-sm">Manage</button>
                </div>

                <div className="integ">
                  <div className="integ-ico" style={{ background: "#dbeafe", color: "#1e40af" }}><Icon.CheckSquare size={20}/></div>
                  <div className="integ-body">
                    <div className="integ-name">Google Tasks</div>
                    <div className="integ-sub">Daily Planner integration — required for Planner page</div>
                  </div>
                  <button className="btn btn-accent btn-sm"><Icon.Link size={12}/>Connect</button>
                </div>

                <div className="integ">
                  <div className="integ-ico" style={{ background: "#f3e8ff", color: "#6b21a8" }}><Icon.Slack size={20}/></div>
                  <div className="integ-body">
                    <div className="integ-name">Discord — Whisper Bot</div>
                    <div className="integ-sub">Auto-ingest meeting transcripts (coming soon)</div>
                  </div>
                  <span className="chip">Soon</span>
                </div>
              </div>

              <div className="settings-card">
                <h3>Sync behaviour</h3>
                <div className="sub">Control what gets pushed automatically</div>
                <div className="toggle">
                  <div className="toggle-body">
                    <div className="toggle-title">Auto-sync Trello cards with due dates → Google Calendar</div>
                    <div className="toggle-sub">When off, you'll be asked per task on save</div>
                  </div>
                  <div className={"switch " + (tog.autoCal ? "on" : "")} onClick={() => setT("autoCal")}/>
                </div>
                <div className="toggle">
                  <div className="toggle-body">
                    <div className="toggle-title">Hide boards stay hidden across Today, Tasks, Calendar</div>
                    <div className="toggle-sub">Recommended — keeps focus on active work</div>
                  </div>
                  <div className={"switch " + (tog.hiddenBoards ? "on" : "")} onClick={() => setT("hiddenBoards")}/>
                </div>
                <div className="toggle">
                  <div className="toggle-body">
                    <div className="toggle-title">Require human review for AI-extracted tasks</div>
                    <div className="toggle-sub">Off = direct push to Trello (not recommended)</div>
                  </div>
                  <div className={"switch " + (tog.aiReview ? "on" : "")} onClick={() => setT("aiReview")}/>
                </div>
              </div>
            </>
          )}

          {section === "bus" && (
            <div className="settings-card">
              <h3>Business Units</h3>
              <div className="sub">Group boards by team — used in sidebar and reporting</div>
              {MOCK_BU_GROUPS.map(g => (
                <div key={g.id} className="integ">
                  <div className="integ-ico" style={{ background: g.color, color: "white" }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{g.name[0]}</span>
                  </div>
                  <div className="integ-body">
                    <div className="integ-name">{g.name}</div>
                    <div className="integ-sub">{g.boards.length} boards · {g.boards.map(id => getBoard(id)?.name).filter(Boolean).join(", ")}</div>
                  </div>
                  <button className="btn btn-out btn-sm"><Icon.Edit size={12}/>Edit</button>
                </div>
              ))}
              <button className="btn btn-out" style={{ marginTop: 12 }}><Icon.Plus size={14}/>New business unit</button>
            </div>
          )}

          {section === "ai" && (
            <div className="settings-card">
              <h3>AI & Review</h3>
              <div className="sub">How AI processes meetings and proposes tasks</div>
              <div className="toggle">
                <div className="toggle-body">
                  <div className="toggle-title">Auto-create review session from Discord transcripts</div>
                  <div className="toggle-sub">Triggers when bot is tagged in a voice channel</div>
                </div>
                <div className={"switch on"}/>
              </div>
              <div className="toggle">
                <div className="toggle-body">
                  <div className="toggle-title">Show AI confidence and reasoning in review queue</div>
                </div>
                <div className={"switch on"}/>
              </div>
              <div className="toggle">
                <div className="toggle-body">
                  <div className="toggle-title">Use semantic match (in addition to fuzzy similarity)</div>
                  <div className="toggle-sub">Better duplicate detection · uses 2× tokens</div>
                </div>
                <div className={"switch"}/>
              </div>
            </div>
          )}

          {(section !== "integrations" && section !== "bus" && section !== "ai") && (
            <div className="settings-card">
              <h3 style={{ textTransform: "capitalize" }}>{section}</h3>
              <div className="sub">Configuration for this section.</div>
              <div className="empty"><div className="emoji">🛠</div><h3>Placeholder</h3>Detailed settings live here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Planner / OKR placeholders ──────────────────────────────────────────────
function PlannerPage() {
  return (
    <div className="content-narrow empty" style={{ marginTop: 80 }}>
      <div className="emoji">📝</div>
      <h3>Daily Planner — coming soon</h3>
      <div style={{ marginTop: 8 }}>Pulls from Google Tasks + Trello cards due today/tomorrow.<br/>Connect Google Tasks in Settings to enable.</div>
      <button className="btn btn-accent" style={{ marginTop: 16 }}><Icon.Link size={14}/>Connect Google Tasks</button>
    </div>
  );
}
function OkrPage() {
  return (
    <div className="content-narrow empty" style={{ marginTop: 80 }}>
      <div className="emoji">🎯</div>
      <h3>OKR & Portfolio — coming soon</h3>
      <div style={{ marginTop: 8 }}>Map Project Boards back to OKR Board, with progress feedback loop.<br/>Configure naming convention in Settings → AI & Review.</div>
    </div>
  );
}

Object.assign(window, { ReviewPage, CalendarPage, SettingsPage, PlannerPage, OkrPage });
