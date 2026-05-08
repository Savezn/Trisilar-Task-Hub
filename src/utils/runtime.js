const fs = require("fs");
const path = require("path");

const APP_ROOT = path.join(__dirname, "../..");

function trimTrailingSlash(value) {
  return value ? value.replace(/\/+$/, "") : "";
}

function getLocalBaseUrl() {
  return `http://localhost:${process.env.PORT || 3000}`;
}

function getAppBaseUrl() {
  return trimTrailingSlash(process.env.APP_BASE_URL) || getLocalBaseUrl();
}

function getGoogleRedirectUri() {
  return process.env.GOOGLE_REDIRECT_URI || `${getAppBaseUrl()}/auth/callback`;
}

function getDataDir() {
  const configured = process.env.APP_DATA_DIR;
  return configured ? path.resolve(configured) : APP_ROOT;
}

function getDataFilePath(filename) {
  const dir = getDataDir();
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, filename);
}

module.exports = {
  getAppBaseUrl,
  getGoogleRedirectUri,
  getDataDir,
  getDataFilePath,
};
