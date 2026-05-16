/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Trisilar Task Hub — UI Design V2 · App entry
// Lays out every concept screen as an artboard inside a DesignCanvas.
// ─────────────────────────────────────────────────────────────────────────

const DESKTOP_W = 1440;
const DESKTOP_H = 900;
const MOB_W = 390;
const MOB_H = 844;

function App() {
  return (
    <DesignCanvas>

      {/* ── 00. Brief & how to use ────────────────────────────────── */}
      <DCSection
        id="overview"
        title="Trisilar Task Hub · UI Design V2"
        subtitle="Operational, calmer, sharper. Desktop + mobile concepts across 10 routes, with explicit states and audit traces."
      >
        <DCArtboard id="brief" label="Brief" width={760} height={520}>
          <div style={{background:"var(--surface)", color:"var(--ink)", padding:32, height:"100%", overflow:"hidden", borderRadius:8, border:"1px solid var(--line)"}}>
            <div className="eyebrow" style={{marginBottom:10}}>Internal operations command center — not a marketing site</div>
            <h1 style={{font:"600 30px/1.15 var(--font-sans)", letterSpacing:"-0.02em", marginBottom:14}}>Calmer, sharper, more durable.</h1>
            <p style={{fontSize:14, lineHeight:1.55, color:"var(--ink-3)", marginBottom:18, maxWidth:580}}>
              V2 keeps Trello as the execution surface and Task Hub as the command + review layer. Review Queue remains the human approval gate. Cobalt is for actions you take; violet is for proposals an agent made. Everything system-emitted is monospaced and copyable. Nothing reaches Trello, Calendar, or Google Tasks without explicit approval.
            </p>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginTop:20}}>
              <div>
                <div className="eyebrow" style={{marginBottom:8, color:"var(--brand-ink)"}}>What this delivers</div>
                <ul style={{listStyle:"none", padding:0, display:"grid", gap:6, fontSize:12.5, color:"var(--ink-2)"}}>
                  <li>· 10 desktop route concepts</li>
                  <li>· 5 mobile route concepts + 5-tab bottom nav</li>
                  <li>· Foundations: tokens · type · spacing · radius · elevation</li>
                  <li>· Component inventory (36 items)</li>
                  <li>· Empty · loading · error · disconnected · audit-trace states</li>
                  <li>· Implementation handoff for Frontend Dev</li>
                </ul>
              </div>
              <div>
                <div className="eyebrow" style={{marginBottom:8, color:"var(--ai-ink)"}}>Hard rules respected</div>
                <ul style={{listStyle:"none", padding:0, display:"grid", gap:6, fontSize:12.5, color:"var(--ink-2)"}}>
                  <li>· Trello = execution source of truth</li>
                  <li>· Task Hub = command + review layer</li>
                  <li>· Review Queue gates all AI side effects</li>
                  <li>· No secrets, no live calls, no auto-writes</li>
                  <li>· No landing page, no decorative hero</li>
                  <li>· No framework migration required</li>
                </ul>
              </div>
            </div>
            <div style={{marginTop:24, paddingTop:16, borderTop:"1px solid var(--line)", display:"flex", alignItems:"center", gap:16, font:"var(--t-mono-sm)", color:"var(--ink-4)"}}>
              <span>scroll · pan ·</span>
              <span>scroll-wheel + cmd / ctrl ·</span>
              <span>zoom · click ⤢ on any artboard for focus mode</span>
            </div>
          </div>
        </DCArtboard>

        <DCArtboard id="found-tokens" label="Foundations · tokens & type" width={1280} height={1700}>
          <BoardFoundations />
        </DCArtboard>
      </DCSection>

      {/* ── DESKTOP — operational routes ──────────────────────────── */}
      <DCSection
        id="desk-ops"
        title="Desktop · daily operational routes"
        subtitle="Today, Review Queue, All Tasks. The three screens the team opens first every morning."
      >
        <DCArtboard id="d-today" label="01 · Today" width={DESKTOP_W} height={DESKTOP_H}>
          <ScreenToday />
        </DCArtboard>
        <DCArtboard id="d-review" label="02 · Review Queue · safety-critical" width={DESKTOP_W} height={1100}>
          <ScreenReview />
        </DCArtboard>
        <DCArtboard id="d-tasks" label="03 · All Tasks" width={DESKTOP_W} height={DESKTOP_H}>
          <ScreenAllTasks />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="desk-monitor"
        title="Desktop · monitoring & schedule"
        subtitle="Boards, Calendar, Planner. Where you read the team's state instead of acting on a single task."
      >
        <DCArtboard id="d-boards" label="04 · Boards Monitor" width={DESKTOP_W} height={DESKTOP_H}>
          <ScreenBoards />
        </DCArtboard>
        <DCArtboard id="d-cal" label="05 · Calendar" width={DESKTOP_W} height={DESKTOP_H}>
          <ScreenCalendar />
        </DCArtboard>
        <DCArtboard id="d-planner" label="06 · Planner · with disconnected state" width={DESKTOP_W} height={DESKTOP_H}>
          <ScreenPlanner />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="desk-plan"
        title="Desktop · planning & governance"
        subtitle="OKR, Weekly Focus, Docs / AI Trace, Settings. Where strategy, audit, and runtime controls live."
      >
        <DCArtboard id="d-okr" label="07 · OKR / Portfolio" width={DESKTOP_W} height={DESKTOP_H}>
          <ScreenOKR />
        </DCArtboard>
        <DCArtboard id="d-focus" label="08 · Weekly Focus" width={DESKTOP_W} height={DESKTOP_H}>
          <ScreenWeeklyFocus />
        </DCArtboard>
        <DCArtboard id="d-trace" label="09 · Docs / AI Trace" width={DESKTOP_W} height={1080}>
          <ScreenTrace />
        </DCArtboard>
        <DCArtboard id="d-settings" label="10 · Settings" width={DESKTOP_W} height={1100}>
          <ScreenSettings />
        </DCArtboard>
      </DCSection>

      {/* ── MOBILE ───────────────────────────────────────────────── */}
      <DCSection
        id="mobile"
        title="Mobile · 390 × 844"
        subtitle="Bottom nav keeps the 4 most-used routes one tap away. The 5th tab opens a 'More' surface that exposes every other route. Review Queue approval actions remain safe — full-width buttons, owner gate enforced."
      >
        <DCArtboard id="m-today" label="M01 · Today" width={MOB_W} height={MOB_H}>
          <MToday />
        </DCArtboard>
        <DCArtboard id="m-review" label="M02 · Review Queue" width={MOB_W} height={MOB_H}>
          <MReview />
        </DCArtboard>
        <DCArtboard id="m-tasks" label="M03 · All Tasks" width={MOB_W} height={MOB_H}>
          <MAllTasks />
        </DCArtboard>
        <DCArtboard id="m-boards" label="M04 · Boards" width={MOB_W} height={MOB_H}>
          <MBoards />
        </DCArtboard>
        <DCArtboard id="m-more" label="M05 · More · routes + integrations" width={MOB_W} height={MOB_H}>
          <MSettings />
        </DCArtboard>
      </DCSection>

      {/* ── STATES ───────────────────────────────────────────────── */}
      <DCSection
        id="states"
        title="States · every route ships these"
        subtitle="Empty, loading, error, disconnected, audit-trace. Plain language. Names the owner / action. Never exposes raw API errors or secrets."
      >
        <DCArtboard id="states-all" label="All states · in one board" width={1280} height={1750}>
          <BoardStates />
        </DCArtboard>
      </DCSection>

      {/* ── INVENTORY + HANDOFF ──────────────────────────────────── */}
      <DCSection
        id="inv"
        title="Component inventory"
        subtitle="36 reusable surfaces grouped by role. Each declares the states it must implement."
      >
        <DCArtboard id="inv-all" label="Inventory · 36 components" width={1280} height={1900}>
          <BoardInventory />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="handoff"
        title="Implementation handoff"
        subtitle="For: Frontend Dev. Scope, visual direction, responsive, accessibility, safety-critical UX rules, tech direction, out-of-scope."
      >
        <DCArtboard id="handoff-doc" label="Handoff · ready for dev planning" width={1280} height={1450}>
          <BoardHandoff />
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
