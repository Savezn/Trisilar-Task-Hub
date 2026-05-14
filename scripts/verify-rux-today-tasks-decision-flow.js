const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

const today = read("public/js/pages/today.js");
const tasks = read("public/js/pages/all-tasks.js");
const css = read("public/style.css");
const pkg = JSON.parse(read("package.json"));

const checks = [
  {
    name: "Today renders explicit source and next-action cues",
    pass: today.includes("buildTodayDecisionCue")
      && today.includes("Source: Trello")
      && today.includes("Next action:")
      && today.includes("Start here"),
  },
  {
    name: "Today Review Queue copy preserves human approval boundary",
    pass: today.includes("Needs human approval")
      && today.includes("Review before execution")
      && !today.includes("AI Review"),
  },
  {
    name: "Tasks renders source, context, owner, due, and next-action cues",
    pass: tasks.includes("taskDecisionMeta")
      && tasks.includes("taskSourceLabel")
      && tasks.includes("taskNextActionLabel")
      && tasks.includes("Source: Trello")
      && tasks.includes("Next action:"),
  },
  {
    name: "Decision-flow CSS classes exist for Today and Tasks",
    pass: css.includes(".today-decision-line")
      && css.includes(".today-decision-chip")
      && css.includes(".task-source-pill")
      && css.includes(".task-next-action"),
  },
  {
    name: "Package exposes RUX-04 verification command",
    pass: pkg.scripts && pkg.scripts["verify:rux-decision-flow"] === "node scripts/verify-rux-today-tasks-decision-flow.js",
  },
];

const failures = checks.filter(check => !check.pass);
if (failures.length) {
  console.error("RUX-04 Today/Tasks decision-flow verification failed:");
  failures.forEach(check => console.error(`- ${check.name}`));
  process.exit(1);
}

console.log("RUX-04 Today/Tasks decision-flow verification passed.");
