// ── Tasks page (inbox) ──────────────────────────────────────────────────────
function TasksPage({ tasks, openTask }) {
  const [filter, setFilter] = useState("all");
  const [groupBy, setGroupBy] = useState("due");
  const [search, setSearch] = useState("");

  const now = new Date();
  const filtered = useMemo(() => {
    let xs = tasks;
    if (filter === "today") xs = xs.filter(t => t.due && isSameDay(toDate(t.due), now) && !t.dueComplete);
    else if (filter === "overdue") xs = xs.filter(t => t.due && toDate(t.due) < now && !isSameDay(toDate(t.due), now) && !t.dueComplete);
    else if (filter === "upcoming") xs = xs.filter(t => t.due && !t.dueComplete && toDate(t.due) > now && daysBetween(now, toDate(t.due)) <= 7 && !isSameDay(toDate(t.due), now));
    else if (filter === "nodue") xs = xs.filter(t => !t.due);
    else if (filter === "done") xs = xs.filter(t => t.dueComplete || t.list === "Done");
    if (search) xs = xs.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    return xs;
  }, [tasks, filter, search]);

  const counts = {
    all: tasks.length,
    today: tasks.filter(t => t.due && isSameDay(toDate(t.due), now) && !t.dueComplete).length,
    overdue: tasks.filter(t => t.due && toDate(t.due) < now && !isSameDay(toDate(t.due), now) && !t.dueComplete).length,
    upcoming: tasks.filter(t => t.due && !t.dueComplete && toDate(t.due) > now && daysBetween(now, toDate(t.due)) <= 7 && !isSameDay(toDate(t.due), now)).length,
    nodue: tasks.filter(t => !t.due).length,
    done: tasks.filter(t => t.dueComplete || t.list === "Done").length,
  };

  // Group
  const groups = useMemo(() => {
    if (groupBy === "none") return [{ label: null, items: filtered }];
    if (groupBy === "due") {
      const buckets = { Overdue: [], Today: [], Tomorrow: [], "This week": [], "Later": [], "No due date": [] };
      filtered.forEach(t => {
        if (!t.due) buckets["No due date"].push(t);
        else {
          const d = toDate(t.due);
          if (d < now && !isSameDay(d, now)) buckets.Overdue.push(t);
          else if (isSameDay(d, now)) buckets.Today.push(t);
          else {
            const diff = daysBetween(now, d);
            if (diff === 1) buckets.Tomorrow.push(t);
            else if (diff <= 7) buckets["This week"].push(t);
            else buckets.Later.push(t);
          }
        }
      });
      return Object.entries(buckets).filter(([, v]) => v.length).map(([label, items]) => ({ label, items }));
    }
    if (groupBy === "board") {
      const m = {};
      filtered.forEach(t => { (m[t.board] ||= []).push(t); });
      return Object.entries(m).map(([id, items]) => ({ label: getBoard(id)?.name || id, items, color: getBoard(id)?.color }));
    }
    if (groupBy === "owner") {
      const m = { Unassigned: [] };
      filtered.forEach(t => {
        if (!t.members?.length) m.Unassigned.push(t);
        else t.members.forEach(uid => { (m[getMember(uid)?.name || uid] ||= []).push(t); });
      });
      return Object.entries(m).filter(([, v]) => v.length).map(([label, items]) => ({ label, items }));
    }
    return [{ label: null, items: filtered }];
  }, [filtered, groupBy]);

  return (
    <div className="content-narrow">
      <div className="page-header">
        <div className="page-title">Tasks</div>
        <div className="page-sub">Cross-board inbox · {tasks.length} tasks across {new Set(tasks.map(t => t.board)).size} boards</div>
      </div>

      <div className="toolbar">
        <div className="search-input">
          <Icon.Search size={14} className="ico" />
          <input placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="seg">
          {[["all","All"],["today","Today"],["overdue","Overdue"],["upcoming","Upcoming"],["nodue","No due"],["done","Done"]].map(([k, lbl]) => (
            <button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>
              {lbl}<span className="pill">{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="spacer" />
        <span style={{ color: "var(--ink-3)", fontSize: 12 }}>Group by</span>
        <div className="seg">
          {[["due","Due"],["board","Board"],["owner","Owner"],["none","None"]].map(([k, lbl]) => (
            <button key={k} className={groupBy === k ? "on" : ""} onClick={() => setGroupBy(k)}>{lbl}</button>
          ))}
        </div>
        <button className="btn btn-primary"><Icon.Plus size={14}/>New task</button>
      </div>

      <div className="table-wrap">
        <div className="tr th">
          <div></div>
          <div>Task</div>
          <div>Board · List</div>
          <div>Owner</div>
          <div>Due</div>
          <div style={{textAlign: "right"}}>Status</div>
        </div>
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            {g.label && (
              <div className="tr-group">
                {g.color && <span className="bu-dot" style={{ background: g.color }} />}
                {g.label} · {g.items.length}
              </div>
            )}
            {g.items.map(t => {
              const isDone = t.dueComplete || t.list === "Done";
              return (
                <div key={t.id} className="tr" onClick={() => openTask(t)}>
                  <div className={classNames("task-check", isDone && "done")} onClick={e => e.stopPropagation()}
                       style={isDone ? { background: "var(--accent)", borderColor: "var(--accent)", color: "white" } : {}}>
                    {isDone && <Icon.Check size={11} weight={3}/>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: isDone ? "line-through" : "none" }}>
                      {t.title}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      {t.labels?.map(id => <Label key={id} id={id} />)}
                      {t.checklist?.total > 0 && <ChecklistMini {...t.checklist} />}
                      {t.gcal && <span className="gcal-mark"><Icon.Calendar size={11}/></span>}
                    </div>
                  </div>
                  <div>
                    <BoardTag id={t.board} />
                    <div style={{ color: "var(--ink-4)", fontSize: 11, marginTop: 2 }}>{t.list}</div>
                  </div>
                  <div><AvatarStack ids={t.members} /></div>
                  <div><DueChip iso={t.due} dueComplete={isDone} /></div>
                  <div style={{ textAlign: "right" }}>
                    <button className="btn btn-icon btn-sm"><Icon.MoreH size={14}/></button>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Boards (Kanban) ─────────────────────────────────────────────────────────
function BoardsPage({ tasks, openTask }) {
  const [boardId, setBoardId] = useState(MOCK_BOARDS[0].id);
  const board = getBoard(boardId);
  const lists = useMemo(() => {
    const order = ["Backlog", "Planning", "This Week", "Doing", "In Review", "In Progress", "Review", "Scheduled", "Someday", "Done"];
    const present = [...new Set(tasks.filter(t => t.board === boardId).map(t => t.list))];
    return present.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [boardId, tasks]);

  return (
    <div>
      <div className="toolbar" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="bu-dot" style={{ background: board.color, width: 12, height: 12, borderRadius: 4 }}/>
          <select value={boardId} onChange={e => setBoardId(e.target.value)}
                  style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, padding: "7px 10px", fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
            {MOCK_BU_GROUPS.map(g => (
              <optgroup key={g.id} label={g.name}>
                {g.boards.map(bid => <option key={bid} value={bid}>{getBoard(bid)?.name}</option>)}
              </optgroup>
            ))}
          </select>
          <span className="chip chip-out" style={{ marginLeft: 4 }}>{getBU(board.bu)?.name}</span>
        </div>
        <div className="search-input" style={{ maxWidth: 260 }}>
          <Icon.Search size={14} className="ico" />
          <input placeholder="Filter cards…" />
        </div>
        <div className="spacer"/>
        <button className="btn btn-out"><Icon.Filter size={14}/>Filters</button>
        <button className="btn btn-out"><Icon.User size={14}/>Members</button>
        <button className="btn btn-primary"><Icon.Plus size={14}/>Add card</button>
      </div>

      <div className="kanban">
        {lists.map(listName => {
          const items = tasks.filter(t => t.board === boardId && t.list === listName);
          return (
            <div className="kanban-col" key={listName}>
              <div className="kanban-col-h">
                <span>{listName}</span>
                <span className="count">{items.length}</span>
                <div className="pull">
                  <button className="btn btn-icon btn-sm"><Icon.Plus size={13}/></button>
                  <button className="btn btn-icon btn-sm"><Icon.MoreH size={13}/></button>
                </div>
              </div>
              <div className="kanban-cards">
                {items.map(t => {
                  const isDone = t.dueComplete || t.list === "Done";
                  return (
                    <div className="kc" key={t.id} onClick={() => openTask(t)}>
                      {t.labels?.length > 0 && (
                        <div className="kc-labels">
                          {t.labels.map(id => <Label key={id} id={id} />)}
                        </div>
                      )}
                      <div className="kc-title" style={{ textDecoration: isDone ? "line-through" : "none", color: isDone ? "var(--ink-3)" : "var(--ink)" }}>
                        {t.title}
                      </div>
                      <div className="kc-foot">
                        <div className="kc-foot-l">
                          {t.due && <DueChip iso={t.due} dueComplete={isDone} />}
                          {t.checklist?.total > 0 && <ChecklistMini {...t.checklist} />}
                          {t.gcal && <span className="gcal-mark" title="Calendar synced"><Icon.Calendar size={11}/></span>}
                        </div>
                        <div className="kc-foot-r">
                          <AvatarStack ids={t.members} max={3} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button className="btn btn-sm" style={{ justifyContent: "flex-start", color: "var(--ink-3)" }}>
                  <Icon.Plus size={12}/>Add card
                </button>
              </div>
            </div>
          );
        })}
        <button className="btn btn-out" style={{ height: 38 }}><Icon.Plus size={14}/>Add list</button>
      </div>
    </div>
  );
}

Object.assign(window, { TasksPage, BoardsPage });
