const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-whole-system-qc", "qc-fourth-pass-results.json");
const OUTPUT_DIR = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-whole-system-qc");
const OUTPUT_JSON = path.join(OUTPUT_DIR, "hidden-focusable-classification.json");
const OUTPUT_MD = path.join(OUTPUT_DIR, "hidden-focusable-classification.md");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeText(value, max = 84) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function selectorFor(item) {
  if (item.id) return `#${item.id}`;
  const tag = item.tag || "el";
  const cls = String(item.cls || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(part => `.${part}`)
    .join("");
  return `${tag}${cls}`;
}

function hasZeroRect(item) {
  const rect = item.rect || {};
  return Number(rect.w || 0) === 0 || Number(rect.h || 0) === 0;
}

function isVisiblyEnabledTree(item) {
  const css = item.css || {};
  return item.hidden !== true
    && item.inert !== true
    && item.disabled !== true
    && item.ariaHidden !== "true"
    && item.tabindex !== "-1"
    && css.display !== "none"
    && css.visibility !== "hidden"
    && css.pointerEvents !== "none";
}

function looksLikeModalOrDrawer(item) {
  const haystack = `${item.id || ""} ${item.cls || ""} ${item.name || ""}`.toLowerCase();
  return /(modal|drawer|dialog|transcript|cal-|card-|manage-|bulk|confirm|new group|save changes|add checklist|reminder|start date|due date|workspace id|paperclip|cancel|delete)/.test(haystack);
}

function looksResponsiveHidden(item) {
  const haystack = `${item.id || ""} ${item.cls || ""} ${item.name || ""}`.toLowerCase();
  return /(mobile|desktop|responsive|task-check-button|task-row|mobile-route|row-action|today-quick|add a task)/.test(haystack);
}

function looksLikeLegacyShellOrSupersededStatus(item) {
  const haystack = `${item.id || ""} ${item.cls || ""} ${item.name || ""}`.toLowerCase();
  return /(statusbar-group|statusbar-|refresh-btn|manage-btn|toggle-hidden-btn|sidebar|legacy)/.test(haystack);
}

function classify(item) {
  const css = item.css || {};
  if (item.hidden === true || item.inert === true || item.ariaHidden === "true" || css.display === "none" || css.visibility === "hidden") {
    return "tooling_only_hidden_state";
  }
  if (item.disabled === true || item.tabindex === "-1" || css.pointerEvents === "none") {
    return "likely_false_positive_disabled_or_inert";
  }
  if (css.opacity === "0" && isVisiblyEnabledTree(item)) {
    return "confirmed_risk_opacity_zero_visible_tree";
  }
  if (looksLikeLegacyShellOrSupersededStatus(item)) {
    return "needs_review_legacy_shell_or_superseded_status";
  }
  if (looksLikeModalOrDrawer(item)) {
    return "needs_review_modal_or_drawer_surface";
  }
  if (looksResponsiveHidden(item)) {
    return "needs_review_responsive_hidden_control";
  }
  if (hasZeroRect(item) && isVisiblyEnabledTree(item)) {
    return "confirmed_risk_zero_rect_visible_tree";
  }
  return "needs_review_uncategorized_focusable";
}

function addExample(bucket, item) {
  if (bucket.examples.length >= 8) return;
  bucket.examples.push({
    selector: selectorFor(item),
    name: safeText(item.name || item.ariaLabel || item.text),
    rect: item.rect || {},
    css: {
      display: item.css?.display,
      visibility: item.css?.visibility,
      opacity: item.css?.opacity,
      pointerEvents: item.css?.pointerEvents,
    },
  });
}

function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function run() {
  if (!fs.existsSync(INPUT)) {
    throw new Error(`Missing fourth-pass QC result: ${INPUT}`);
  }
  ensureDir(OUTPUT_DIR);
  const source = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  const routeBuckets = [];
  const categoryTotals = {};

  for (const result of source.results || []) {
    const items = result.data?.hiddenFocusable || [];
    const categories = {};
    for (const item of items) {
      const category = classify(item);
      categoryTotals[category] = (categoryTotals[category] || 0) + 1;
      if (!categories[category]) categories[category] = { count: 0, examples: [] };
      categories[category].count += 1;
      addExample(categories[category], item);
    }
    routeBuckets.push({
      route: result.route,
      viewport: result.viewport,
      screenshot: result.screenshot,
      total: items.length,
      categories,
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    source: path.relative(ROOT, INPUT).replace(/\\/g, "/"),
    categoryTotals,
    routes: routeBuckets,
  };
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report, null, 2));

  const total = Object.values(categoryTotals).reduce((sum, count) => sum + count, 0);
  const lines = [
    "# UI V2 Hidden Focusable Classification",
    "",
    `Generated: ${report.generatedAt}`,
    `Source: \`${report.source}\``,
    "",
    "This classifier keeps the fourth-pass raw scanner useful without turning every hidden/focusable signal into the same severity. It is evidence only; PM/UX acceptance still depends on route review.",
    "",
    "## Category Totals",
    "",
    "| Category | Count | Meaning |",
    "|---|---:|---|",
    `| confirmed_risk_zero_rect_visible_tree | ${categoryTotals.confirmed_risk_zero_rect_visible_tree || 0} | Focusable, enabled, visible-tree control with a zero-size rect. Review as a real keyboard/hit-test risk. |`,
    `| confirmed_risk_opacity_zero_visible_tree | ${categoryTotals.confirmed_risk_opacity_zero_visible_tree || 0} | Focusable, enabled control hidden by opacity. Review as a real invisible-control risk. |`,
    `| needs_review_modal_or_drawer_surface | ${categoryTotals.needs_review_modal_or_drawer_surface || 0} | Likely closed modal/drawer or modal child. Confirm the surface is inert/aria-hidden when closed. |`,
    `| needs_review_legacy_shell_or_superseded_status | ${categoryTotals.needs_review_legacy_shell_or_superseded_status || 0} | Legacy shell/statusbar signal from fourth-pass evidence. Fresh verifier or DOM proof may already supersede it. |`,
    `| needs_review_responsive_hidden_control | ${categoryTotals.needs_review_responsive_hidden_control || 0} | Likely responsive row/mobile/desktop control. Confirm the hidden breakpoint state is inert. |`,
    `| needs_review_uncategorized_focusable | ${categoryTotals.needs_review_uncategorized_focusable || 0} | Focusable signal that needs human classification. |`,
    `| likely_false_positive_disabled_or_inert | ${categoryTotals.likely_false_positive_disabled_or_inert || 0} | Disabled, inert, pointer-disabled, or removed from tab sequence. Usually not a blocker. |`,
    `| tooling_only_hidden_state | ${categoryTotals.tooling_only_hidden_state || 0} | Hidden/display-none/aria-hidden state. Keep in raw evidence, but do not treat as a blocker by itself. |`,
    `| total raw hiddenFocusable | ${total} | Raw fourth-pass scanner count before PM/UX interpretation. |`,
    "",
    "## Route Breakdown",
    "",
    "| Route | Viewport | Total | Confirmed | Needs review | Likely false/tooling | Screenshot |",
    "|---|---|---:|---:|---:|---:|---|",
    ...routeBuckets.map(route => {
      const confirmed = (route.categories.confirmed_risk_zero_rect_visible_tree?.count || 0)
        + (route.categories.confirmed_risk_opacity_zero_visible_tree?.count || 0);
      const review = (route.categories.needs_review_modal_or_drawer_surface?.count || 0)
        + (route.categories.needs_review_legacy_shell_or_superseded_status?.count || 0)
        + (route.categories.needs_review_responsive_hidden_control?.count || 0)
        + (route.categories.needs_review_uncategorized_focusable?.count || 0);
      const falsey = (route.categories.likely_false_positive_disabled_or_inert?.count || 0)
        + (route.categories.tooling_only_hidden_state?.count || 0);
      return `| ${route.route} | ${route.viewport} | ${route.total} | ${confirmed} | ${review} | ${falsey} | \`${route.screenshot}\` |`;
    }),
    "",
    "## Top Confirmed-Risk Examples",
    "",
    ...routeBuckets.flatMap(route => {
      const examples = [
        ...(route.categories.confirmed_risk_zero_rect_visible_tree?.examples || []),
        ...(route.categories.confirmed_risk_opacity_zero_visible_tree?.examples || []),
      ].slice(0, 3);
      if (!examples.length) return [];
      return [
        `### ${route.route} / ${route.viewport}`,
        "",
        ...examples.map(example => `- \`${example.selector}\` ${example.name ? `- ${example.name}` : ""} (${example.rect.w || 0}x${example.rect.h || 0})`),
        "",
      ];
    }),
    "## QC Interpretation",
    "",
    "- Treat confirmed-risk rows as candidates for direct Dev fixes or fresh DOM verification.",
    "- Treat modal/drawer and responsive rows as review queues: they may be acceptable after shared inert/aria-hidden rules are verified.",
    "- Treat tooling-only hidden states as evidence retention, not blockers.",
    "- If a future scanner reports only raw totals, regenerate this classifier before escalating the issue.",
  ];
  fs.writeFileSync(OUTPUT_MD, `${lines.join("\n")}\n`);
  console.log(`Hidden focusable classification written: ${OUTPUT_MD}`);
}

run();
