const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "docs", "logs", "screenshots", "v06-uiv2-interaction-matrix");
const FULL_FIDELITY_AUDIT = path.join(ROOT, "docs", "logs", "UI_V2_FULL_ROUTE_FIDELITY_AUDIT.md");
const BASE_URL = (process.env.UIV2_APP_BASE_URL || `http://127.0.0.1:${process.env.PORT || "3032"}`).replace(/\/+$/, "");
const VIEWPORT = { width: 1440, height: 900 };

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanName(value) {
  return String(value || "shot")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function waitForApp(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForSelector("#board-content", { timeout: 15000 });
  await page.waitForTimeout(250);
}

async function route(page, routePath) {
  await page.goto(`${BASE_URL}${routePath}`, { waitUntil: "domcontentloaded" });
  await waitForApp(page);
}

async function shot(page, name, label, results) {
  const fileName = `${cleanName(name)}.png`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
  results.screenshots.push({ label, file: path.relative(ROOT, filePath).replace(/\\/g, "/") });
  return filePath;
}

async function hoverFocusOpenMatrix(page, results, config) {
  await route(page, config.route);
  const locator = page.locator(config.selector).first();
  const count = await locator.count();
  const entry = {
    id: config.id,
    route: config.route,
    selector: config.selector,
    exists: count > 0,
    checks: {},
  };
  results.controls.push(entry);
  if (!count) return;

  await shot(page, `${config.id}-default`, `${config.id} default`, results);

  await locator.hover();
  await page.waitForTimeout(120);
  entry.checks.hoverCursor = await locator.evaluate(el => getComputedStyle(el).cursor).catch(() => "unknown");
  await shot(page, `${config.id}-hover`, `${config.id} hover`, results);

  await locator.focus();
  await page.waitForTimeout(120);
  entry.checks.focusVisible = await locator.evaluate(el => {
    const styles = getComputedStyle(el);
    return {
      outline: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
      boxShadow: styles.boxShadow,
      activeId: document.activeElement?.id || "",
      activeText: document.activeElement?.textContent?.trim().slice(0, 80) || "",
    };
  }).catch(() => null);
  await shot(page, `${config.id}-focus`, `${config.id} focus`, results);

  if (config.open) {
    await locator.click();
    await page.waitForTimeout(250);
    entry.checks.open = await page.evaluate(openSelector => {
      const surface = document.querySelector(openSelector);
      const trigger = document.activeElement;
      return {
        openSelector,
        exists: Boolean(surface),
        visible: Boolean(surface && surface.getBoundingClientRect().width && surface.getBoundingClientRect().height),
        triggerId: trigger?.id || "",
        triggerText: trigger?.textContent?.trim().slice(0, 80) || "",
      };
    }, config.open).catch(() => null);
    await shot(page, `${config.id}-open`, `${config.id} open`, results);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(160);
    entry.checks.afterEscapeFocus = await page.evaluate(() => ({
      activeId: document.activeElement?.id || "",
      activeText: document.activeElement?.textContent?.trim().slice(0, 100) || "",
      activeTag: document.activeElement?.tagName || "",
    })).catch(() => null);
  }

  if (config.click) {
    await locator.click({ force: Boolean(config.forceClick) });
    await page.waitForTimeout(250);
    entry.checks.afterClick = await page.evaluate(config.click).catch(error => ({ error: error.message }));
    await shot(page, `${config.id}-clicked`, `${config.id} clicked`, results);
  }
}

async function run() {
  ensureDir(OUTPUT_DIR);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });
  const results = {
    baseUrl: BASE_URL,
    viewport: VIEWPORT,
    generatedAt: new Date().toISOString(),
    controls: [],
    screenshots: [],
    console: [],
    pageErrors: [],
  };

  page.on("console", msg => {
    if (["warning", "error"].includes(msg.type())) {
      results.console.push({ type: msg.type(), text: msg.text() });
    }
  });
  page.on("pageerror", error => results.pageErrors.push(error.message));

  const matrices = [
    {
      id: "statusbar-details",
      route: "/today",
      selector: "#statusbar-details",
      open: "#statusbar-tooltip",
    },
    {
      id: "topbar-scope",
      route: "/today",
      selector: ".topbar .scope-pick",
      open: "#topbar-scope-popover",
    },
    {
      id: "topbar-notifications",
      route: "/today",
      selector: "#topbar-notifications-btn",
      open: "#topbar-notification-popover",
    },
    {
      id: "today-filter-highlight",
      route: "/today",
      selector: "#today-topbar-filter",
      click: () => ({
        highlighted: Boolean(document.querySelector(".today-grid .seg.uiv2-control-highlight")),
        activeText: document.activeElement?.textContent?.trim() || "",
        toast: document.querySelector("#toast.show")?.textContent?.trim() || "",
      }),
    },
    {
      id: "today-quick-add",
      route: "/today",
      selector: "#today-topbar-quick-add",
      click: () => ({
        quickPanelOpen: document.querySelector("#today-quick-panel")?.hidden === false,
        activeId: document.activeElement?.id || "",
      }),
    },
    {
      id: "review-filter-focus",
      route: "/review",
      selector: "#review-topbar-filter",
      click: () => ({
        highlighted: Boolean(document.querySelector("#review-filterbar.uiv2-control-highlight")),
        activeText: document.activeElement?.textContent?.trim() || "",
      }),
    },
    {
      id: "review-manual-upload",
      route: "/review",
      selector: "#review-topbar-upload",
      open: "#transcript-modal:not(.hidden)",
    },
    {
      id: "docs-filter-popover",
      route: "/docs",
      selector: "#docs-topbar-filter",
      open: "#docs-filter-popover",
    },
    {
      id: "docs-export",
      route: "/docs",
      selector: "#docs-topbar-export",
    },
    {
      id: "all-tasks-due-sort",
      route: "/all",
      selector: ".sortable-header[data-sort='due']",
      click: () => ({
        dueHeaderSort: document.querySelector(".sortable-header[data-sort='due']")?.closest("th")?.getAttribute("aria-sort") || null,
        activeText: document.activeElement?.textContent?.trim() || "",
      }),
    },
    {
      id: "boards-warning-menu",
      route: "/boards",
      selector: ".bm-more-btn",
      click: () => ({
        toast: document.querySelector("#toast.show")?.textContent?.trim() || "",
      }),
    },
    {
      id: "planner-week-segment",
      route: "/planner",
      selector: ".route-bar .seg button[onclick=\"setPlannerWindow('week')\"]",
      click: () => ({
        pressed: document.querySelector(".route-bar .seg button[onclick=\"setPlannerWindow('week')\"]")?.getAttribute("aria-pressed"),
        routeTitle: document.querySelector(".route-bar h2, .routebar-title, #board-title")?.textContent?.trim() || "",
      }),
    },
    {
      id: "calendar-week-segment",
      route: "/calendar",
      selector: ".cal-view-seg button:nth-child(2)",
      click: () => ({
        pressed: document.querySelector(".cal-view-seg button:nth-child(2)")?.getAttribute("aria-pressed"),
        className: document.querySelector(".cal-view-seg button:nth-child(2)")?.className || "",
        toast: document.querySelector("#toast.show")?.textContent?.trim() || "",
      }),
    },
    {
      id: "calendar-event-draft",
      route: "/calendar",
      selector: "#cal-add",
      open: "#cal-event-modal:not(.hidden)",
    },
    {
      id: "okr-risk-segment",
      route: "/okr",
      selector: ".route-bar .seg [data-okr-objective-status='risk']",
      click: () => ({
        pressed: document.querySelector(".route-bar .seg [data-okr-objective-status='risk']")?.getAttribute("aria-pressed"),
        activeRows: document.querySelectorAll(".okr-objective").length,
      }),
    },
    {
      id: "weekly-focus-next-week",
      route: "/focus",
      selector: ".topbar-route-actions .seg button[onclick='setWeeklyFocusWeekOffset(1)']",
      click: () => ({
        pressed: document.querySelector(".topbar-route-actions .seg button[onclick='setWeeklyFocusWeekOffset(1)']")?.getAttribute("aria-pressed"),
        title: document.querySelector(".route-bar h2, .routebar-title, #board-title")?.textContent?.trim() || "",
      }),
    },
    {
      id: "weekly-focus-owner",
      route: "/focus",
      selector: "[data-action='owner-filter']",
      click: () => ({
        activeId: document.activeElement?.id || "",
        toast: document.querySelector("#toast.show")?.textContent?.trim() || "",
      }),
    },
    {
      id: "settings-first-integration",
      route: "/settings",
      selector: "[data-settings-integration]",
      click: () => ({
        editorVisible: Boolean(document.querySelector("#settings-integration-editor")?.textContent?.includes("Session-only draft")),
        activeIntegration: document.querySelector("[data-settings-integration].active")?.getAttribute("data-settings-integration") || null,
      }),
    },
    {
      id: "all-tasks-readonly-table",
      route: "/all",
      selector: ".tasks-primary-filterbar .filter-chip.is-readonly[disabled]",
    },
  ];

  for (const config of matrices) {
    await hoverFocusOpenMatrix(page, results, config);
  }

  results.global = await page.evaluate(() => ({
    overflowX: Math.max(
      0,
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
      document.body.scrollWidth - document.body.clientWidth,
    ),
    buttonsMissingType: [...document.querySelectorAll("button:not([type])")].length,
    statusbarFocusableGroups: [...document.querySelectorAll(".shell-status-strip .statusbar-group[tabindex='0']")].length,
    statusbarDetailsReady: Boolean(document.querySelector("#statusbar-details.has-status-help")?.dataset.statusDesc),
    enabledControlsWithDefaultCursor: [...document.querySelectorAll("button:not(:disabled):not([aria-disabled='true']), [role='button']:not([aria-disabled='true']), .sortable-header")]
      .filter(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== "hidden"
          && style.display !== "none"
          && style.cursor === "default";
      })
      .slice(0, 20)
      .map(el => ({
        tag: el.tagName,
        id: el.id || "",
        cls: el.className || "",
        text: el.textContent?.trim().slice(0, 80) || "",
      })),
  })).catch(() => null);

  const jsonPath = path.join(OUTPUT_DIR, "interaction-matrix-results.json");
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  const lines = [
    "# UI V2 Interaction Matrix Evidence",
    "",
    `Generated: ${results.generatedAt}`,
    `Base URL: ${BASE_URL}`,
    `Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`,
    "",
    "## Controls",
    "",
    "| Control | Route | Exists | Key checks |",
    "|---|---|---:|---|",
    ...results.controls.map(control => {
      const checks = [
        control.checks.hoverCursor ? `cursor=${control.checks.hoverCursor}` : "",
        control.checks.afterEscapeFocus ? `escapeFocus=${control.checks.afterEscapeFocus.activeId || control.checks.afterEscapeFocus.activeTag}` : "",
        control.checks.afterClick ? `afterClick=${JSON.stringify(control.checks.afterClick).replace(/\|/g, "/")}` : "",
      ].filter(Boolean).join("; ");
      return `| ${control.id} | ${control.route} | ${control.exists ? "yes" : "no"} | ${checks || "captured default/hover/focus"} |`;
    }),
    "",
    "## Screenshots",
    "",
    ...results.screenshots.map(screenshot => `- ${screenshot.label}: \`${screenshot.file}\``),
    "",
    "## State Fixture Proof",
    "",
    `Source: \`${path.relative(ROOT, FULL_FIDELITY_AUDIT).replace(/\\/g, "/")}\``,
    "",
    ...readStateFixtureRows(),
    "",
    "## Console / Page Errors",
    "",
    `- Console warning/error count: ${results.console.length}`,
    `- Page error count: ${results.pageErrors.length}`,
    `- Final overflowX: ${results.global?.overflowX ?? "n/a"}`,
    `- Final buttons missing type: ${results.global?.buttonsMissingType ?? "n/a"}`,
    `- Statusbar focusable groups: ${results.global?.statusbarFocusableGroups ?? "n/a"}`,
    `- Statusbar details ready: ${results.global?.statusbarDetailsReady ?? "n/a"}`,
    `- Enabled controls with default cursor: ${results.global?.enabledControlsWithDefaultCursor?.length ?? "n/a"}`,
  ];
  fs.writeFileSync(path.join(OUTPUT_DIR, "interaction-matrix-summary.md"), `${lines.join("\n")}\n`);

  await browser.close();
  console.log(`Interaction matrix captured: ${jsonPath}`);
  if (results.pageErrors.length || results.console.some(item => item.type === "error")) {
    process.exitCode = 1;
  }
}

function readStateFixtureRows() {
  if (!fs.existsSync(FULL_FIDELITY_AUDIT)) {
    return ["- Full-route audit has not been generated yet."];
  }
  const rows = fs.readFileSync(FULL_FIDELITY_AUDIT, "utf8")
    .split(/\r?\n/)
    .filter(line => line.startsWith("| ") && !line.startsWith("| ---") && !line.includes("| Route |"))
    .map(line => line.split("|").map(cell => cell.trim()))
    .filter(cells => cells.length >= 8)
    .map(cells => `- ${cells[1]}: ${cells[6]}`);
  return rows.length ? rows : ["- No route state rows found in the full-route audit."];
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
