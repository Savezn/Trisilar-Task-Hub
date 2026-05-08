// ── Detail Drawer ────────────────────────────────────────────────────────────
function TaskDrawer({ task, onClose }) {
  if (!task) return null;
  const board = getBoard(task.board);
  return (
    <>
      <div className={"drawer-back" + (task ? " show" : "")} onClick={onClose}/>
      <div className={"drawer" + (task ? " show" : "")}>
        <div className="drawer-h">
          <span className="bu-dot" style={{ background: board?.color, width: 10, height: 10 }}/>
          <h2 style={{flex: 1}}>{task.title}</h2>
          <button className="btn btn-icon" onClick={onClose}><Icon.X size={16}/></button>
        </div>
        <div className="drawer-body">
          <div className="field">
            <div className="field-label">Board · List</div>
            <div className="field-val"><BoardTag id={task.board}/> · {task.list}</div>
          </div>
          <div className="field">
            <div className="field-label">Owner</div>
            <div className="field-val"><AvatarStack ids={task.members}/> {task.members?.map(id => getMember(id)?.name).join(", ") || "Unassigned"}</div>
          </div>
          <div className="field">
            <div className="field-label">Due</div>
            <div className="field-val"><DueChip iso={task.due} dueComplete={task.dueComplete}/></div>
          </div>
          {task.labels?.length > 0 && (
            <div className="field">
              <div className="field-label">Labels</div>
              <div style={{display: "flex", gap: 6, flexWrap: "wrap"}}>
                {task.labels.map(id => <Label key={id} id={id}/>)}
              </div>
            </div>
          )}
          {task.checklist?.total > 0 && (
            <div className="field">
              <div className="field-label">Checklist</div>
              <div className="field-val">
                <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 6}}>
                  <span style={{fontWeight: 600}}>{task.checklist.done}/{task.checklist.total}</span>
                  <div style={{flex: 1, height: 6, background: "var(--surface-3)", borderRadius: 3, overflow: "hidden"}}>
                    <div style={{height: "100%", width: `${task.checklist.done/task.checklist.total*100}%`, background: "var(--accent)"}}/>
                  </div>
                </div>
              </div>
            </div>
          )}
          {task.desc && (
            <div className="field">
              <div className="field-label">Description</div>
              <div className="field-val">{task.desc}</div>
            </div>
          )}
          <div className="field">
            <div className="field-label">Sync</div>
            <label className="row" style={{ fontSize: 13 }}>
              <input type="checkbox" defaultChecked={task.gcal}/>
              <Icon.Calendar size={13}/> Google Calendar
            </label>
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn btn-danger"><Icon.Trash size={13}/>Delete</button>
          <div className="spacer"/>
          <button className="btn btn-out" onClick={onClose}>Close</button>
          <button className="btn btn-primary"><Icon.Check size={13}/>Save</button>
        </div>
      </div>
    </>
  );
}

// ── App root ────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#4f46e5",
  "density": "cozy",
  "theme": "light",
  "rounded": "soft"
}/*EDITMODE-END*/;

function App() {
  const [page, setPage] = useState("today");
  const [collapsed, setCollapsed] = useState(false);
  const [openTask, setOpenTask] = useState(null);
  const [sessions, setSessions] = useState(MOCK_REVIEW_SESSIONS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [toast, setToast] = useState(null);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    // derive accent-2 (slightly lighter)
    document.documentElement.style.setProperty("--accent-2", t.accent);
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
    if (t.rounded === "sharp") {
      document.documentElement.style.setProperty("--r", "4px");
      document.documentElement.style.setProperty("--r-md", "5px");
      document.documentElement.style.setProperty("--r-lg", "6px");
    } else if (t.rounded === "round") {
      document.documentElement.style.setProperty("--r", "12px");
      document.documentElement.style.setProperty("--r-md", "14px");
      document.documentElement.style.setProperty("--r-lg", "18px");
    } else {
      document.documentElement.style.removeProperty("--r");
      document.documentElement.style.removeProperty("--r-md");
      document.documentElement.style.removeProperty("--r-lg");
    }
  }, [t]);

  const onTaskOpen = (task) => setOpenTask(task);
  const onTaskToggle = (task) => {
    setTasks(ts => ts.map(x => x.id === task.id ? {...x, dueComplete: !x.dueComplete} : x));
    setToast({ msg: `Marked "${task.title.slice(0, 36)}…" ${task.dueComplete ? "incomplete" : "complete"}`, kind: "ok"});
    setTimeout(() => setToast(null), 2200);
  };

  const pendingReview = sessions.reduce((n, s) => n + s.tasks.filter(x => x.status === "pending").length, 0);
  const overdueCount = tasks.filter(x => !x.dueComplete && x.due && new Date(x.due) < new Date() && !isSameDay(new Date(x.due), new Date())).length;

  const titleMap = {
    today: { title: "Today", crumbs: null },
    review: { title: "Review Queue", crumbs: null },
    tasks: { title: "Tasks", crumbs: null },
    boards: { title: "Boards", crumbs: null },
    calendar: { title: "Calendar", crumbs: null },
    settings: { title: "Settings", crumbs: null },
    planner: { title: "Daily Planner", crumbs: null },
    okr: { title: "OKR", crumbs: null },
  };

  const topActions = (
    <>
      {page === "today" && <button className="btn btn-primary"><Icon.Plus size={14}/>Quick add</button>}
      {page === "tasks" && <button className="btn btn-primary"><Icon.Plus size={14}/>New task</button>}
      {page === "boards" && <button className="btn btn-primary"><Icon.Plus size={14}/>Add card</button>}
      {page === "review" && <button className="btn btn-primary"><Icon.Upload size={14}/>New session</button>}
      {page === "calendar" && <button className="btn btn-primary"><Icon.Plus size={14}/>New event</button>}
    </>
  );

  return (
    <div className="app" data-side={collapsed ? "collapsed" : "open"}>
      <Sidebar
        page={page} setPage={setPage}
        collapsed={collapsed} setCollapsed={setCollapsed}
        pendingReview={pendingReview} overdueCount={overdueCount}
        openCommand={() => setToast({msg: "Command palette · ⌘K (placeholder)", kind: "ok"})}
      />
      <div className="main">
        <Topbar
          title={titleMap[page].title}
          theme={t.theme} setTheme={(th) => setTweak("theme", th)}
          actions={topActions}
        />
        <div className="content">
          {page === "today" && <Today tasks={tasks} sessions={sessions} openTask={onTaskOpen}/>}
          {page === "review" && <ReviewPage sessions={sessions} setSessions={setSessions} openTask={onTaskOpen}/>}
          {page === "tasks" && <TasksPage tasks={tasks} openTask={onTaskOpen}/>}
          {page === "boards" && <BoardsPage tasks={tasks} openTask={onTaskOpen}/>}
          {page === "calendar" && <CalendarPage tasks={tasks}/>}
          {page === "settings" && <SettingsPage/>}
          {page === "planner" && <PlannerPage/>}
          {page === "okr" && <OkrPage/>}
        </div>
      </div>

      <TaskDrawer task={openTask} onClose={() => setOpenTask(null)}/>

      <TweaksPanel title="Tweaks" defaultOpen={false}>
        <TweakSection title="Theme">
          <TweakRadio label="Mode" value={t.theme} options={[{value:"light", label:"Light"}, {value:"dark", label:"Dark"}]} onChange={v => setTweak("theme", v)}/>
          <TweakColor label="Accent" value={t.accent}
            options={["#4f46e5", "#0d9488", "#dc2626", "#7c3aed", "#0284c7"]}
            onChange={v => setTweak("accent", v)}/>
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio label="Density" value={t.density} options={[{value:"compact", label:"Compact"}, {value:"cozy", label:"Cozy"}, {value:"comfy", label:"Comfy"}]} onChange={v => setTweak("density", v)}/>
          <TweakSelect label="Corners" value={t.rounded} options={[{value:"sharp", label:"Sharp"}, {value:"soft", label:"Soft (default)"}, {value:"round", label:"Rounded"}]} onChange={v => setTweak("rounded", v)}/>
        </TweakSection>
        <TweakSection title="Demo data">
          <TweakButton onClick={() => { setSessions(MOCK_REVIEW_SESSIONS); setTasks(MOCK_TASKS); setToast({msg: "Reset demo data", kind: "ok"}); setTimeout(() => setToast(null), 1500); }}>Reset demo state</TweakButton>
        </TweakSection>
      </TweaksPanel>

      {toast && <div className="toast show"><Icon.Check size={13}/>{toast.msg}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
