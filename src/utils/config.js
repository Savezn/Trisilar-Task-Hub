const { readRuntimeState, writeRuntimeState } = require("../persistence/runtime-state");
const DEFAULT_CONFIG = { groups: [], hiddenBoards: [], allowedWorkspaceIds: [] };

/**
 * Reads configuration from file
 */
function readConfig() {
  return readRuntimeState({
    name: "config",
    filename: "bu-config.json",
    defaultValue: DEFAULT_CONFIG,
  });
}

/**
 * Writes configuration to file
 */
function writeConfig(data) {
  writeRuntimeState({
    name: "config",
    filename: "bu-config.json",
    value: data,
  });
}

module.exports = {
  readConfig,
  writeConfig
};
