const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-whole-system-qc", "qc-fourth-pass-results.json");
const OUTPUT_DIR = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-whole-system-qc");
const OUTPUT_JSON = path.join(OUTPUT_DIR, "absolute-element-classification.json");
const OUTPUT_MD = path.join(OUTPUT_DIR, "absolute-element-classification.md");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function selectorFor(item) {
  if (item.id) return `#${item.id}`;
  const cls = clean(item.cls)
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map(name => `.${name}`)
    .join("");
  return `${item.tag || "el"}${cls}`;
}

function categoryFor(item) {
  const cls = clean(item.cls);
  const selector = selectorFor(item);
  if (cls.includes("side-search-icon") || cls.includes("side-search-kbd")) {
    return "expected_sidebar_search_adornment";
  }
  if (cls.includes("mobile-route-bar")) {
    return "expected_mobile_bottom_nav";
  }
  if (cls.includes("set-side")) {
    return "expected_settings_sticky_side_nav";
  }
  if (item.position === "fixed" && Number.parseInt(item.zIndex, 10) >= 60) {
    return "needs_review_high_z_fixed_surface";
  }
  if (item.position === "absolute" || item.position === "fixed" || item.position === "sticky") {
    return "needs_review_unclassified_positioned_surface";
  }
  return "tooling_only_non_positioned";
}

function run() {
  if (!fs.existsSync(INPUT)) {
    throw new Error(`Missing fourth-pass QC result: ${INPUT}`);
  }
  ensureDir(OUTPUT_DIR);
  const source = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  const routes = [];
  const totals = {};
  const examples = {};

  for (const result of source.results || []) {
    const items = result.data?.absoluteBadges || [];
    const categories = {};
    for (const item of items) {
      const category = categoryFor(item);
      totals[category] = (totals[category] || 0) + 1;
      categories[category] = (categories[category] || 0) + 1;
      if (!examples[category]) examples[category] = [];
      if (examples[category].length < 6) {
        examples[category].push({
          route: result.route,
          viewport: result.viewport,
          selector: selectorFor(item),
          position: item.position,
          zIndex: item.zIndex,
          rect: item.rect,
          text: clean(item.text).slice(0, 80),
        });
      }
    }
    routes.push({
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
    totals,
    examples,
    routes,
  };
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report, null, 2));

  const allowed = (totals.expected_sidebar_search_adornment || 0)
    + (totals.expected_mobile_bottom_nav || 0)
    + (totals.expected_settings_sticky_side_nav || 0);
  const review = (totals.needs_review_high_z_fixed_surface || 0)
    + (totals.needs_review_unclassified_positioned_surface || 0);
  const total = Object.values(totals).reduce((sum, count) => sum + count, 0);

  const lines = [
    "# UI V2 Absolute / Fixed Element Classification",
    "",
    `Generated: ${report.generatedAt}`,
    `Source: \`${report.source}\``,
    "",
    "This classifier keeps the fourth-pass positioned-element scan from treating expected shell primitives as layout risks. It is evidence only; overlap, clipping, and z-index concerns still require screenshot review.",
    "",
    "## Category Totals",
    "",
    "| Category | Count | Meaning |",
    "|---|---:|---|",
    `| expected_sidebar_search_adornment | ${totals.expected_sidebar_search_adornment || 0} | Sidebar search icon / keyboard hint positioned inside the search field. |`,
    `| expected_mobile_bottom_nav | ${totals.expected_mobile_bottom_nav || 0} | Fixed mobile bottom navigation shell. |`,
    `| expected_settings_sticky_side_nav | ${totals.expected_settings_sticky_side_nav || 0} | Settings desktop sticky side navigation. |`,
    `| needs_review_high_z_fixed_surface | ${totals.needs_review_high_z_fixed_surface || 0} | Fixed high z-index surface not in the expected shell allowlist. |`,
    `| needs_review_unclassified_positioned_surface | ${totals.needs_review_unclassified_positioned_surface || 0} | Absolute/fixed/sticky element not in the expected shell allowlist. |`,
    `| tooling_only_non_positioned | ${totals.tooling_only_non_positioned || 0} | Scanner carryover with no positioned layout risk. |`,
    `| total positioned signals | ${total} | Raw fourth-pass absolute/fixed/sticky candidate count. |`,
    "",
    `Expected shell primitives: ${allowed}`,
    `Needs review: ${review}`,
    "",
    "## Route Breakdown",
    "",
    "| Route | Viewport | Total | Expected shell | Needs review | Screenshot |",
    "|---|---|---:|---:|---:|---|",
    ...routes.map(route => {
      const expected = (route.categories.expected_sidebar_search_adornment || 0)
        + (route.categories.expected_mobile_bottom_nav || 0)
        + (route.categories.expected_settings_sticky_side_nav || 0);
      const needsReview = (route.categories.needs_review_high_z_fixed_surface || 0)
        + (route.categories.needs_review_unclassified_positioned_surface || 0);
      return `| ${route.route} | ${route.viewport} | ${route.total} | ${expected} | ${needsReview} | \`${route.screenshot}\` |`;
    }),
    "",
    "## Review Rule",
    "",
    "- Do not escalate expected shell primitives unless they visibly overlap route content, clip important controls, or block pointer/focus access.",
    "- Escalate any future unclassified fixed or high-z surface with a screenshot and route/viewport geometry.",
    "- Keep this classifier paired with screenshot review; it does not replace PM/UX visual acceptance.",
  ];

  fs.writeFileSync(OUTPUT_MD, `${lines.join("\n")}\n`);
  console.log(`Absolute element classification written: ${OUTPUT_MD}`);
}

run();
