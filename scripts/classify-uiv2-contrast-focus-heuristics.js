const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-whole-system-qc", "qc-third-pass-results.json");
const OUTPUT_DIR = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-whole-system-qc");
const OUTPUT_JSON = path.join(OUTPUT_DIR, "contrast-focus-heuristic-classification.json");
const OUTPUT_MD = path.join(OUTPUT_DIR, "contrast-focus-heuristic-classification.md");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function routeKey(result) {
  return result.route?.key || result.route || "unknown";
}

function viewportKey(result) {
  return result.viewport?.key || result.viewport || "unknown";
}

function selectorFor(item) {
  if (item.id) return `#${item.id}`;
  const classes = clean(item.className || item.cls)
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map(name => `.${name}`)
    .join("");
  return `${item.tag || "el"}${classes}`;
}

function isAlphaBackground(value) {
  const bg = clean(value).toLowerCase();
  return bg.startsWith("rgba(") || bg.includes("transparent");
}

function isInteractive(item) {
  const tag = clean(item.tag).toLowerCase();
  const role = clean(item.role).toLowerCase();
  return tag === "button"
    || tag === "input"
    || tag === "select"
    || tag === "textarea"
    || tag === "a"
    || role === "button"
    || role === "tab"
    || role === "option";
}

function classifyContrast(item) {
  const cls = clean(item.className).toLowerCase();
  const tag = clean(item.tag).toLowerCase();
  if (isAlphaBackground(item.bg)) {
    return "needs_review_alpha_background_compositing";
  }
  if (cls.includes("sortable-header") || tag === "th") {
    return "needs_review_dense_table_header_token";
  }
  if (cls.includes("settings-mobile-section-label")) {
    return "needs_review_mobile_section_label_token";
  }
  if (cls.includes("eyebrow")) {
    return "needs_review_eyebrow_muted_token";
  }
  if (Number(item.ratio || 0) >= 3) {
    return "likely_low_risk_muted_supporting_text";
  }
  return "needs_review_unclassified_low_contrast";
}

function classifyTarget(item) {
  const cls = clean(item.className).toLowerCase();
  const id = clean(item.id).toLowerCase();
  const name = clean(item.name || item.text || item.title).toLowerCase();
  const tag = clean(item.tag).toLowerCase();
  const role = clean(item.role).toLowerCase();
  if (item.disabled) return "likely_false_positive_disabled_control";
  if (cls.includes("statusbar-group") || cls.includes("has-status-help")) {
    return "superseded_status_strip_compact_signal";
  }
  if (cls.includes("nav-item") && cls.includes("scope-item")) {
    return "needs_review_sidebar_scope_hit_area";
  }
  if (tag === "input" || id.includes("search")) {
    return "needs_review_compact_search_input_target";
  }
  if (cls.includes("sortable-header") || tag === "th") {
    return "needs_review_dense_table_or_sort_target";
  }
  if (cls.includes("seg") || cls.includes("filter-chip") || cls.includes("chip")) {
    return "needs_review_segment_or_chip_hit_area";
  }
  if (cls.includes("icon") || cls.includes("iconbtn") || name.includes("refresh") || name.includes("notification")) {
    return "needs_review_compact_icon_button_target";
  }
  if (cls.includes("task") || name.includes("mark done") || name.includes("open ") || name.includes("edit ")) {
    return "needs_review_dense_row_action_target";
  }
  if (!isInteractive({ ...item, tag, role })) {
    return "likely_false_positive_static_text_or_layout";
  }
  return "needs_review_unclassified_focus_target";
}

function classifyGenericControl(item) {
  const cls = clean(item.className).toLowerCase();
  const id = clean(item.id).toLowerCase();
  const name = clean(item.name).toLowerCase();
  if (cls.includes("statusbar-group")) return "superseded_status_strip_role_note";
  if (id.includes("topbar-filter")) return "needs_review_route_filter_action_help";
  if (name === "open settings") return "superseded_planner_contextual_settings_cta";
  if (name === "open kr detail") return "superseded_okr_contextual_kr_detail_labels";
  if (name === "manage" || name === "policy" || name === "visible") {
    return "superseded_settings_contextual_action_labels";
  }
  if (clean(item.tag).toLowerCase() !== "button" && clean(item.role).toLowerCase() === "button") {
    return "needs_review_custom_role_button";
  }
  return "needs_review_unclassified_generic_control";
}

function addExample(bucket, item, extra = {}) {
  if (!bucket.examples) bucket.examples = [];
  if (bucket.examples.length >= 8) return;
  bucket.examples.push({
    selector: selectorFor(item),
    text: clean(item.text || item.name || item.title).slice(0, 96),
    ratio: item.ratio,
    color: item.color,
    bg: item.bg,
    rect: item.rect || {},
    ...extra,
  });
}

function increment(group, category, item, extra) {
  if (!group[category]) group[category] = { count: 0, examples: [] };
  group[category].count += 1;
  addExample(group[category], item, extra);
}

function sumCategoryTotals(routes, field) {
  const totals = {};
  for (const route of routes) {
    for (const [category, bucket] of Object.entries(route[field] || {})) {
      totals[category] = (totals[category] || 0) + bucket.count;
    }
  }
  return totals;
}

function totalCounts(totals) {
  return Object.values(totals).reduce((sum, count) => sum + count, 0);
}

function examplesFor(routes, field, category, limit = 6) {
  const examples = [];
  for (const route of routes) {
    const bucket = route[field]?.[category];
    if (!bucket) continue;
    for (const example of bucket.examples) {
      examples.push({
        route: route.route,
        viewport: route.viewport,
        screenshot: route.screenshot,
        ...example,
      });
      if (examples.length >= limit) return examples;
    }
  }
  return examples;
}

function formatExamples(routes, field, categories) {
  const lines = [];
  for (const category of categories) {
    const examples = examplesFor(routes, field, category);
    if (!examples.length) continue;
    lines.push(`### ${category}`, "");
    for (const example of examples) {
      const ratio = example.ratio === undefined ? "" : ` ratio ${example.ratio}`;
      const text = example.text ? ` - ${example.text}` : "";
      lines.push(`- ${example.route} / ${example.viewport} / \`${example.selector}\`${ratio}${text} (\`${example.screenshot}\`)`);
    }
    lines.push("");
  }
  return lines;
}

function run() {
  if (!fs.existsSync(INPUT)) {
    throw new Error(`Missing third-pass QC result: ${INPUT}`);
  }
  ensureDir(OUTPUT_DIR);
  const source = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  const routes = [];

  for (const result of source.results || []) {
    const dom = result.dom || {};
    const route = {
      route: routeKey(result),
      viewport: viewportKey(result),
      screenshot: result.screenshot,
      lowContrastTotal: (dom.lowContrast || []).length,
      smallTargetTotal: (dom.smallTargets || []).length,
      genericControlTotal: (dom.genericControls || []).length,
      duplicateNameTotal: (dom.duplicateNames || []).length,
      contrast: {},
      targets: {},
      genericControls: {},
    };

    for (const item of dom.lowContrast || []) {
      increment(route.contrast, classifyContrast(item), item);
    }
    for (const item of dom.smallTargets || []) {
      increment(route.targets, classifyTarget(item), item);
    }
    for (const item of dom.genericControls || []) {
      increment(route.genericControls, classifyGenericControl(item), item);
    }
    routes.push(route);
  }

  const contrastTotals = sumCategoryTotals(routes, "contrast");
  const targetTotals = sumCategoryTotals(routes, "targets");
  const genericTotals = sumCategoryTotals(routes, "genericControls");
  const report = {
    generatedAt: new Date().toISOString(),
    source: path.relative(ROOT, INPUT).replace(/\\/g, "/"),
    totals: {
      contrast: contrastTotals,
      targets: targetTotals,
      genericControls: genericTotals,
      lowContrastTotal: totalCounts(contrastTotals),
      smallTargetTotal: totalCounts(targetTotals),
      genericControlTotal: totalCounts(genericTotals),
    },
    routes,
  };
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report, null, 2));

  const lines = [
    "# UI V2 Contrast / Focus Heuristic Classification",
    "",
    `Generated: ${report.generatedAt}`,
    `Source: \`${report.source}\``,
    "",
    "This classifier keeps the third-pass scanner useful without treating every contrast, focus, or target-size heuristic as an automatic product defect. It is evidence only; PM/UX visual review and current verifier evidence remain authoritative.",
    "",
    "## Contrast Category Totals",
    "",
    "| Category | Count | Meaning |",
    "|---|---:|---|",
    `| needs_review_alpha_background_compositing | ${contrastTotals.needs_review_alpha_background_compositing || 0} | Computed contrast is unreliable because the sampled background is transparent/alpha; review against the actual painted card background before escalating. |`,
    `| needs_review_dense_table_header_token | ${contrastTotals.needs_review_dense_table_header_token || 0} | Dense table header or sortable header text uses muted tokens; review against UI V2 hierarchy and readability. |`,
    `| needs_review_mobile_section_label_token | ${contrastTotals.needs_review_mobile_section_label_token || 0} | Mobile Settings section label uses a muted token; review for readability on compact surfaces. |`,
    `| needs_review_eyebrow_muted_token | ${contrastTotals.needs_review_eyebrow_muted_token || 0} | Eyebrow/support label uses muted token below normal text contrast; usually a design-token review, not an immediate blocker. |`,
    `| likely_low_risk_muted_supporting_text | ${contrastTotals.likely_low_risk_muted_supporting_text || 0} | Supporting text above 3:1; keep human-reviewed rather than auto-failing. |`,
    `| needs_review_unclassified_low_contrast | ${contrastTotals.needs_review_unclassified_low_contrast || 0} | Low contrast signal without a known component category. |`,
    `| total lowContrast signals | ${report.totals.lowContrastTotal} | Raw third-pass low-contrast candidate count. |`,
    "",
    "## Focus / Target Category Totals",
    "",
    "| Category | Count | Meaning |",
    "|---|---:|---|",
    `| superseded_status_strip_compact_signal | ${targetTotals.superseded_status_strip_compact_signal || 0} | Third-pass status-strip target signal superseded by later grouped Status details evidence. |`,
    `| needs_review_dense_table_or_sort_target | ${targetTotals.needs_review_dense_table_or_sort_target || 0} | Dense table or sortable header target. Review against effective hit-area evidence. |`,
    `| needs_review_segment_or_chip_hit_area | ${targetTotals.needs_review_segment_or_chip_hit_area || 0} | Segment/chip target may be compact; review with density policy. |`,
    `| needs_review_sidebar_scope_hit_area | ${targetTotals.needs_review_sidebar_scope_hit_area || 0} | Sidebar Scope workspace row is compact; review against sidebar navigation density and click target comfort. |`,
    `| needs_review_compact_search_input_target | ${targetTotals.needs_review_compact_search_input_target || 0} | Search field/control is compact; review focus ring and effective target size. |`,
    `| needs_review_compact_icon_button_target | ${targetTotals.needs_review_compact_icon_button_target || 0} | Icon/button target may need hover/focus/hit-area proof. |`,
    `| needs_review_dense_row_action_target | ${targetTotals.needs_review_dense_row_action_target || 0} | Dense row action target; check row-action evidence before escalating. |`,
    `| likely_false_positive_static_text_or_layout | ${targetTotals.likely_false_positive_static_text_or_layout || 0} | Static layout/text picked up by target scanner; generally not actionable. |`,
    `| likely_false_positive_disabled_control | ${targetTotals.likely_false_positive_disabled_control || 0} | Disabled control signal; usually not an active hit-area issue. |`,
    `| needs_review_unclassified_focus_target | ${targetTotals.needs_review_unclassified_focus_target || 0} | Small/focus target that needs component-level interpretation. |`,
    `| total smallTarget signals | ${report.totals.smallTargetTotal} | Raw third-pass small-target candidate count. |`,
    "",
    "## Generic Control Category Totals",
    "",
    "| Category | Count | Meaning |",
    "|---|---:|---|",
    `| superseded_status_strip_role_note | ${genericTotals.superseded_status_strip_role_note || 0} | Status strip role signal superseded by later grouped Status details model. |`,
    `| needs_review_route_filter_action_help | ${genericTotals.needs_review_route_filter_action_help || 0} | Route Filter button needs visible help/state proof; later interaction evidence may supersede it. |`,
    `| superseded_planner_contextual_settings_cta | ${genericTotals.superseded_planner_contextual_settings_cta || 0} | Planner repeated Settings CTA signal superseded by later contextual CTA labels. |`,
    `| superseded_okr_contextual_kr_detail_labels | ${genericTotals.superseded_okr_contextual_kr_detail_labels || 0} | OKR repeated KR detail action signal superseded by later contextual labels. |`,
    `| superseded_settings_contextual_action_labels | ${genericTotals.superseded_settings_contextual_action_labels || 0} | Settings repeated Manage/Visible/Policy signal superseded by later contextual action labels. |`,
    `| needs_review_custom_role_button | ${genericTotals.needs_review_custom_role_button || 0} | Non-button element with role=button; confirm native semantics or keyboard support. |`,
    `| needs_review_unclassified_generic_control | ${genericTotals.needs_review_unclassified_generic_control || 0} | Generic control signal that still needs human interpretation. |`,
    `| total genericControl signals | ${report.totals.genericControlTotal} | Raw third-pass generic-control candidate count. |`,
    "",
    "## Route Breakdown",
    "",
    "| Route | Viewport | Low contrast | Small targets | Generic controls | Duplicate names | Screenshot |",
    "|---|---|---:|---:|---:|---:|---|",
    ...routes.map(route => `| ${route.route} | ${route.viewport} | ${route.lowContrastTotal} | ${route.smallTargetTotal} | ${route.genericControlTotal} | ${route.duplicateNameTotal} | \`${route.screenshot}\` |`),
    "",
    "## Example Signals",
    "",
    ...formatExamples(routes, "contrast", [
      "needs_review_alpha_background_compositing",
      "needs_review_dense_table_header_token",
      "needs_review_mobile_section_label_token",
      "needs_review_eyebrow_muted_token",
      "needs_review_unclassified_low_contrast",
    ]),
    ...formatExamples(routes, "targets", [
      "superseded_status_strip_compact_signal",
      "needs_review_dense_table_or_sort_target",
      "needs_review_segment_or_chip_hit_area",
      "needs_review_sidebar_scope_hit_area",
      "needs_review_compact_search_input_target",
      "needs_review_compact_icon_button_target",
      "needs_review_dense_row_action_target",
      "needs_review_unclassified_focus_target",
    ]),
    "## QC Interpretation",
    "",
    "- Do not escalate transparent/alpha-background contrast signals until a screenshot or paint-aware check confirms the actual rendered contrast.",
    "- Treat eyebrow and dense-header contrast as design-token review items: they may be acceptable for hierarchy, but PM/UX should decide whether muted labels feel too faint.",
    "- Treat compact target signals as evidence prompts. Current R165 interaction-matrix and later verifier evidence may already supersede third-pass focus/target warnings for many controls.",
    "- If this classifier reports unclassified low-contrast or focus-target signals in future runs, inspect the component source and add a category before opening a broad Dev task.",
  ];
  fs.writeFileSync(OUTPUT_MD, `${lines.join("\n")}\n`);
  console.log(`Contrast/focus heuristic classification written: ${OUTPUT_MD}`);
}

run();
