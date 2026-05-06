const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "../../bu-config.json");
const DEFAULT_CONFIG = { groups: [], hiddenBoards: [], allowedWorkspaceIds: [] };

/**
 * Reads configuration from file
 */
function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")); }
  catch { return { ...DEFAULT_CONFIG }; }
}

/**
 * Writes configuration to file
 */
function writeConfig(data) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  readConfig,
  writeConfig
};
