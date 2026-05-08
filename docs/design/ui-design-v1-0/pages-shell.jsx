// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, collapsed, setCollapsed, pendingReview, overdueCount, openCommand }) {
  const navTop = [
  { id: "today", label: "Today", icon: <Icon.Today size={17} />, badge: null },
  { id: "review", label: "Review Queue", icon: <Icon.Sparkles size={17} />, badge: pendingReview, badgeKind: "purple" },
  { id: "tasks", label: "Tasks", icon: <Icon.Inbox size={17} />, badge: null },
  { id: "boards", label: "Boards", icon: <Icon.Layout size={17} />, badge: null },
  { id: "calendar", label: "Calendar", icon: <Icon.Calendar size={17} />, badge: null }];

  const navMid = [
  { id: "planner", label: "Daily Planner", icon: <Icon.CheckSquare size={17} />, badge: "Soon", badgeKind: "muted" },
  { id: "okr", label: "OKR", icon: <Icon.Target size={17} />, badge: "Soon", badgeKind: "muted" }];

  return (
    <aside className="side">
      <div className="side-head">
        <div className="side-logo">⬡</div>
        {!collapsed &&
        <div className="side-title">
            Trisilar <small>Task Hub</small>
          </div>
        }
        {!collapsed &&
        <button className="side-collapse" onClick={() => setCollapsed(true)} title="Collapse">
            <Icon.ChevronsLeft size={15} />
          </button>
        }
        {collapsed &&
        <button className="side-collapse" onClick={() => setCollapsed(false)} title="Expand" style={{ position: "absolute", right: 8, top: 8 }}>
            <Icon.ChevronsRight size={15} />
          </button>
        }
      </div>

      {!collapsed &&
      <div className="side-search" onClick={openCommand}>
          <Icon.Search size={14} className="side-search-icon" />
          <input placeholder="Search task, board…" readOnly />
          <span className="side-search-kbd">⌘K</span>
        </div>
      }

      <div className="side-nav">
        <div className="side-section">
          {!collapsed && <div className="side-section-h">Workspace</div>}
          {navTop.map((it) =>
          <div key={it.id} className={classNames("nav-item", page === it.id && "active")}
          onClick={() => setPage(it.id)} title={collapsed ? it.label : ""}>
              <span className="ico">{it.icon}</span>
              <span className="lbl">{it.label}</span>
              {it.badge != null && it.badge !== 0 && it.badge !== "Soon" &&
            <span className={classNames("badge", it.badgeKind === "purple" && "")}
            style={it.badgeKind === "purple" ? { background: "var(--purple)" } : {}}>{it.badge}</span>
            }
              {it.badge === "Soon" && <span className="badge muted">Soon</span>}
              {it.id === "today" && overdueCount > 0 &&
            <span className="badge danger">{overdueCount}</span>
            }
            </div>
          )}
        </div>

        <div className="side-section">
          {!collapsed && <div className="side-section-h">Coming soon</div>}
          {navMid.map((it) =>
          <div key={it.id} className={classNames("nav-item", page === it.id && "active")}
          onClick={() => setPage(it.id)} title={collapsed ? it.label : ""}>
              <span className="ico">{it.icon}</span>
              <span className="lbl">{it.label}</span>
              <span className="badge muted">Soon</span>
            </div>
          )}
        </div>

        <div className="side-section">
          {!collapsed &&
          <div className="side-section-h">
              <span>Business Units</span>
              <button title="Manage"><Icon.Settings size={11} /></button>
            </div>
          }
          {MOCK_BU_GROUPS.map((g) =>
          <div key={g.id} className="bu-row" title={collapsed ? g.name : ""}>
              <span className="bu-dot" style={{ background: g.color }}></span>
              <span className="lbl">{g.name}</span>
              <span className="count">{g.boards.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="side-foot">
        <div className="side-avatar">PS</div>
        {!collapsed &&
        <>
            <div className="side-foot-name">
              Pim Suriya
              <small>Operations Lead</small>
            </div>
            <div className="side-foot-status" title="Trello & Calendar connected">
              <span className="status-pip" />
            </div>
          </>
        }
      </div>
    </aside>);

}

// ── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ title, subtitle, crumbs, actions, theme, setTheme }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        {crumbs ?
        <div className="crumbs">
            {crumbs.map((c, i) =>
          <React.Fragment key={i}>
                {i > 0 && <Icon.ChevronRight size={13} className="sep" />}
                <span className={i === crumbs.length - 1 ? "here" : ""}>{c}</span>
              </React.Fragment>
          )}
          </div> :

        <h2>{title}</h2>
        }
        {subtitle && <span style={{ color: "var(--ink-3)", fontSize: 13 }}>· {subtitle}</span>}
      </div>
      <div className="topbar-actions">
        <button className="btn btn-icon" title="Refresh"><Icon.RefreshCw size={15} /></button>
        <button className="btn btn-icon" title="Notifications"><Icon.Bell size={15} /></button>
        <button className="btn btn-icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Theme">
          {theme === "dark" ? <Icon.Sun size={15} /> : <Icon.Moon size={15} />}
        </button>
        <span style={{ width: 1, height: 22, background: "var(--line)", margin: "0 4px" }} />
        {actions}
      </div>
    </div>);

}

// ── Today ────────────────────────────────────────────────────────────────────
function Today({ tasks, openTask, sessions }) {
  const now = new Date();
  const overdue = tasks.filter((t) => !t.dueComplete && t.due && toDate(t.due) < now && !isSameDay(toDate(t.due), now));
  const today = tasks.filter((t) => t.due && isSameDay(toDate(t.due), now) && !t.dueComplete);
  const upcoming = tasks.filter((t) => {
    if (!t.due || t.dueComplete) return false;
    const d = toDate(t.due);
    if (d < now || isSameDay(d, now)) return false;
    return daysBetween(now, d) <= 7;
  }).sort((a, b) => toDate(a.due) - toDate(b.due));

  const hero = today[0] || overdue[0];
  const pendingTasks = sessions.flatMap((s) => s.tasks.filter((t) => t.status === "pending")).length;

  // events for today (simulated)
  const todayEvents = [
  { time: "10:00", title: "Weekly Marketing Sync", sub: "ห้องประชุม 3 · 60 min", source: "tre" },
  { time: "14:00", title: "Senior Designer Interview", sub: "Round 2 · with Nan", source: "gcal" },
  { time: "15:00", title: "Approve onboarding email v3", sub: "Trello deadline", source: "tre" },
  { time: "17:00", title: "Bug triage cutoff", sub: "8 issues to review", source: "tre" }];


  const dateLabel = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="content-narrow">
      <div className="page-header">
        <div className="page-title">Good afternoon, Pim 👋</div>
        <div className="page-sub">{dateLabel} · {today.length} due today, {overdue.length} overdue, {pendingTasks} pending review</div>
      </div>

      {/* KPI row */}
      <div className="kpi-row">
        <div className="kpi kpi-over">
          <div className="kpi-head"><span className="kpi-ico"><Icon.AlertTriangle size={14} /></span> Overdue</div>
          <div className="kpi-num">{overdue.length}</div>
          <div className="kpi-foot">{overdue.length ? `Oldest ${Math.abs(daysBetween(now, toDate(overdue[0].due)))}d ago` : "All caught up"}</div>
        </div>
        <div className="kpi kpi-today">
          <div className="kpi-head"><span className="kpi-ico"><Icon.Today size={14} /></span> Due Today</div>
          <div className="kpi-num">{today.length}</div>
          <div className="kpi-foot">{today.length ? "Across " + new Set(today.map((t) => t.board)).size + " boards" : "Open day"}</div>
        </div>
        <div className="kpi kpi-up">
          <div className="kpi-head"><span className="kpi-ico"><Icon.Clock size={14} /></span> Next 7 Days</div>
          <div className="kpi-num">{upcoming.length}</div>
          <div className="kpi-foot">Plan ahead</div>
        </div>
        <div className="kpi kpi-rev">
          <div className="kpi-head"><span className="kpi-ico"><Icon.Sparkles size={14} /></span> Pending Review</div>
          <div className="kpi-num">{pendingTasks}</div>
          <div className="kpi-foot">From {sessions.filter((s) => s.tasks.some((t) => t.status === "pending")).length} meetings</div>
        </div>
      </div>

      {/* Hero focus */}
      {hero &&
      <div className="focus-card">
          <div className="focus-eyebrow">
            <span className="pulse" style={{ textAlign: "left" }} />
            {dueState(hero.due) === "over" ? "Most Overdue" : "Next Up"} · {getBoard(hero.board)?.name}
          </div>
          <div className="focus-time">{relDue(hero.due)}</div>
          <div className="focus-title">{hero.title}</div>
          <div className="focus-meta">
            <AvatarStack ids={hero.members} size="sm" />
            {hero.checklist?.total > 0 &&
          <><span style={{ opacity: 0.5 }}>·</span>
              <span><Icon.CheckSquare size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />{hero.checklist.done}/{hero.checklist.total} subtasks</span></>
          }
            {hero.gcal &&
          <><span style={{ opacity: 0.5 }}>·</span>
              <span><Icon.Calendar size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />Synced to Calendar</span></>
          }
          </div>
          <div className="focus-actions">
            <button className="btn btn-primary" onClick={() => openTask(hero)}>Open task →</button>
            <button className="btn"><Icon.Check size={14} />Mark done</button>
            <button className="btn"><Icon.Clock size={14} />Snooze</button>
          </div>
        </div>
      }

      <div className="today-grid">
        {/* Left col — task lists */}
        <div>
          {overdue.length > 0 &&
          <div className="section">
              <div className="section-h">
                <h3>Overdue</h3>
                <span className="count">{overdue.length}</span>
              </div>
              <div className="task-list">
                {overdue.map((t) => <TaskRow key={t.id} task={t} onOpen={openTask} />)}
              </div>
            </div>
          }
          <div className="section">
            <div className="section-h">
              <h3>Due Today</h3>
              <span className="count">{today.length}</span>
              <div className="pull">
                <button className="btn btn-sm"><Icon.Plus size={13} />Quick add</button>
              </div>
            </div>
            {today.length > 0 ?
            <div className="task-list">
                {today.map((t) => <TaskRow key={t.id} task={t} onOpen={openTask} />)}
              </div> :

            <div className="card empty">
                <div className="emoji">🌤</div>
                <h3>Nothing due today</h3>
                <div>Enjoy the breathing room — or pull from upcoming.</div>
              </div>
            }
          </div>
          <div className="section">
            <div className="section-h">
              <h3>Upcoming · 7 days</h3>
              <span className="count">{upcoming.length}</span>
            </div>
            <div className="task-list">
              {upcoming.slice(0, 6).map((t) => <TaskRow key={t.id} task={t} onOpen={openTask} />)}
            </div>
          </div>
        </div>

        {/* Right col — widgets */}
        <div>
          {pendingTasks > 0 &&
          <div className="rev-mini" style={{ marginBottom: 16 }}>
              <div className="rev-mini-h">
                <Icon.Sparkles size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />
                AI Review · {pendingTasks} task{pendingTasks > 1 ? "s" : ""}
              </div>
              <div className="rev-mini-title">{sessions[0].title}</div>
              <div className="rev-mini-meta">
                <span>From {sessions[0].source === "discord" ? "Discord" : "Manual upload"} · {fmtTime(toDate(sessions[0].createdAt))}</span>
                <span>
                  <button className="btn btn-sm btn-accent">Review →</button>
                </span>
              </div>
            </div>
          }

          <div className="widget">
            <div className="widget-h">
              <h4>Today's Schedule</h4>
              <span className="pull"><span className="chip chip-out">4 events</span></span>
            </div>
            <div className="cal-peek">
              {todayEvents.map((e, i) =>
              <div key={i} className={classNames("cal-event", e.source)}>
                  <div className="cal-event-time">{e.time}</div>
                  <div>
                    <div className="cal-event-title">{e.title}</div>
                    <div className="cal-event-sub">{e.sub}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="widget">
            <div className="widget-h">
              <h4>Quick Actions</h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button className="btn btn-out" style={{ justifyContent: "flex-start" }}><Icon.Plus size={14} />New task</button>
              <button className="btn btn-out" style={{ justifyContent: "flex-start" }}><Icon.Upload size={14} />Upload meeting transcript</button>
              <button className="btn btn-out" style={{ justifyContent: "flex-start" }}><Icon.Calendar size={14} />New calendar event</button>
              <button className="btn btn-out" style={{ justifyContent: "flex-start" }}><Icon.Trello size={14} />Open Trello</button>
            </div>
          </div>

          <div className="widget" style={{ background: "linear-gradient(135deg, var(--ok-soft), var(--surface))", borderColor: "var(--ok-mid)" }}>
            <div className="widget-h">
              <h4 style={{ color: "var(--ok)" }}><Icon.Zap size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />Integrations</h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span><Icon.Trello size={12} style={{ verticalAlign: "-1px", color: "var(--info)" }} /> Trello</span><span style={{ color: "var(--ok)", fontWeight: 600 }}>● Connected</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span><Icon.Calendar size={12} style={{ verticalAlign: "-1px", color: "var(--info)" }} /> Google Calendar</span><span style={{ color: "var(--ok)", fontWeight: 600 }}>● Connected</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span><Icon.CheckSquare size={12} style={{ verticalAlign: "-1px", color: "var(--ink-4)" }} /> Google Tasks</span><span style={{ color: "var(--ink-4)" }}>Not connected</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

Object.assign(window, { Sidebar, Topbar, Today });