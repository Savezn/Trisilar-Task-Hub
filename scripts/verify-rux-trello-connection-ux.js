const assert = require("assert");
const fs = require("fs");
const path = require("path");

const { friendlyError } = require("../src/utils/errors");

const repoRoot = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(repoRoot, file), "utf8");

function assertNoDeveloperFacingTrelloCopy() {
  const message = friendlyError(new Error("401 unauthorized invalid key"));
  assert(!/\.env|api key/i.test(message), `Trello auth copy exposes implementation detail: ${message}`);
  assert(/runtime|credential|trello/i.test(message), `Trello auth copy should name the product boundary: ${message}`);
}

function assertTrelloStatusEndpointExists() {
  const trelloRoutes = read("src/routes/trello.routes.js");
  assert(
    trelloRoutes.includes('router.get("/trello/status"'),
    "Trello routes must expose GET /api/trello/status for verified connection state"
  );
  assert(
    /configured|verified|invalid|disconnected/.test(trelloRoutes),
    "Trello status route must distinguish configured, verified, invalid, and disconnected states"
  );
}

function assertFrontendUsesVerifiedStatus() {
  const appJs = read("public/app.js");
  const settingsJs = read("public/js/pages/settings.js");

  assert(
    appJs.includes('/api/trello/status'),
    "App init must load /api/trello/status instead of inferring status only from boards"
  );
  assert(
    !settingsJs.includes('boardCount ? "Connected" : "Ready"'),
    "Settings must not infer Trello connected/ready state from board count"
  );
  assert(
    /trelloConnection/i.test(settingsJs),
    "Settings should render Trello connection state from a named Trello connection helper/status"
  );
}

function assertRouteCopyUsesProductLanguage() {
  const routeFiles = [
    "public/js/pages/today.js",
    "public/js/pages/all-tasks.js",
    "public/js/pages/boards.js",
    "public/js/pages/okr.js",
    "public/app.js",
  ];
  for (const file of routeFiles) {
    let source = read(file);
    if (file === "public/app.js") {
      const focusBlock = source.match(/async function showWeeklyFocusPage\(\) \{[\s\S]*?\r?\n\}\r?\n\r?\nfunction renderWeeklyFocusPage/);
      assert(focusBlock, "public/app.js must contain showWeeklyFocusPage for Weekly Focus route verification");
      source = focusBlock[0];
    }
    assert(!/Error:\s*\$\{esc\(e\.message\)\}/.test(source), `${file} should not render raw Trello errors as generic Error: message`);
    assert(!/>\s*[^<]*\$\{esc\(e\.message\)\}/.test(source), `${file} should not render raw Trello errors directly into route failure copy`);
  }
}

assertNoDeveloperFacingTrelloCopy();
assertTrelloStatusEndpointExists();
assertFrontendUsesVerifiedStatus();
assertRouteCopyUsesProductLanguage();

console.log("RUX Trello connection UX verification passed.");
