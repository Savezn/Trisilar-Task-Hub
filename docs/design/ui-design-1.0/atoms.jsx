// ── Shared UI helpers ─────────────────────────────────────────────────────────
const { useState, useMemo, useEffect, useRef } = React;

function classNames(...xs) {return xs.filter(Boolean).join(" ");}

// Date helpers
function toDate(iso) {return iso ? new Date(iso) : null;}
function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function daysBetween(a, b) {
  const ms = 1000 * 60 * 60 * 24;
  const aa = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bb - aa) / ms);
}
function fmtTime(d) {
  if (!d) return "";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d) {
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function fmtDateTime(d) {
  if (!d) return "";
  return `${fmtDate(d)} · ${fmtTime(d)}`;
}
function dueState(iso) {
  if (!iso) return "none";
  const d = toDate(iso);
  const now = new Date();
  if (isSameDay(d, now)) return "today";
  if (d < now) return "over";
  const diff = daysBetween(now, d);
  if (diff <= 2) return "soon";
  if (diff <= 7) return "upcoming";
  return "far";
}
function relDue(iso) {
  if (!iso) return "—";
  const d = toDate(iso);
  const now = new Date();
  if (isSameDay(d, now)) return `Today · ${fmtTime(d)}`;
  const diff = daysBetween(now, d);
  if (diff === 1) return `Tomorrow · ${fmtTime(d)}`;
  if (diff === -1) return `Yesterday · ${fmtTime(d)}`;
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff <= 7) return `In ${diff}d · ${fmtTime(d)}`;
  return fmtDateTime(d);
}

// Member lookup
function getMember(id) {return MEMBERS.find((m) => m.id === id);}
function getBoard(id) {return MOCK_BOARDS.find((b) => b.id === id);}
function getBU(id) {return MOCK_BU_GROUPS.find((g) => g.id === id);}

// ── Atoms ───────────────────────────────────────────────────────────────────
function Avatar({ id, size = "md" }) {
  const m = getMember(id);
  if (!m) return null;
  const cls = size === "sm" ? "av av-sm" : size === "lg" ? "av av-lg" : "av";
  return <span className={cls} style={{ background: m.color }} title={m.name}>{m.initials}</span>;
}
function AvatarStack({ ids, size = "sm", max = 3 }) {
  if (!ids || !ids.length) return <span style={{ color: "var(--ink-4)", fontSize: 11 }}>Unassigned</span>;
  const shown = ids.slice(0, max);
  const more = ids.length - shown.length;
  return (
    <span className="av-stack">
      {shown.map((id) => <Avatar key={id} id={id} size={size} />)}
      {more > 0 && <span className={`av av-${size}`} style={{ background: "var(--ink-4)" }}>+{more}</span>}
    </span>);

}
function Label({ id }) {
  const l = LABELS[id];if (!l) return null;
  return <span className="lbl-pill" style={{ background: l.color, color: l.text, fontSize: "1.5px", padding: "1px 6px" }}>{l.name}</span>;
}
function BoardTag({ id }) {
  const b = getBoard(id);if (!b) return null;
  return (
    <span className="board-tag">
      <span className="board-dot" style={{ background: b.color }}></span>
      {b.name}
    </span>);

}
function DueChip({ iso, dueComplete }) {
  if (!iso) return <span className="task-due due-far">No due</span>;
  const state = dueComplete ? "done" : dueState(iso);
  return <span className={`task-due due-${state}`}>{relDue(iso)}</span>;
}
function ChecklistMini({ done, total }) {
  if (!total) return null;
  return (
    <span className="checklist-mini">
      <Icon.CheckSquare size={12} weight={2} />
      {done}/{total}
    </span>);

}

// ── Task row ───────────────────────────────────────────────────────────────
function TaskRow({ task, onOpen, onToggle }) {
  const isDone = task.dueComplete || task.list === "Done";
  return (
    <div className={classNames("task", isDone && "done")} onClick={() => onOpen?.(task)}>
      <div className="task-check" onClick={(e) => {e.stopPropagation();onToggle?.(task);}}>
        {isDone && <Icon.Check size={11} weight={3} />}
      </div>
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <BoardTag id={task.board} />
          <span className="sep">·</span>
          <span>{task.list}</span>
          {task.checklist?.total > 0 &&
          <><span className="sep">·</span><ChecklistMini {...task.checklist} /></>
          }
          {task.gcal &&
          <><span className="sep">·</span>
              <span className="gcal-mark" title="Synced to Google Calendar"><Icon.Calendar size={11} /></span>
            </>
          }
        </div>
      </div>
      <div className="task-right">
        {task.labels?.map((id) => <Label key={id} id={id} />)}
        <AvatarStack ids={task.members} />
        <DueChip iso={task.due} dueComplete={isDone} />
      </div>
    </div>);

}

Object.assign(window, {
  classNames, toDate, isSameDay, daysBetween, fmtTime, fmtDate, fmtDateTime,
  dueState, relDue, getMember, getBoard, getBU,
  Avatar, AvatarStack, Label, BoardTag, DueChip, ChecklistMini, TaskRow
});