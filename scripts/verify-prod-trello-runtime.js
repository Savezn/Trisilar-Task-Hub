#!/usr/bin/env node
const { buildTrelloStatusReport } = require("../src/utils/trello-runtime-diagnostics");

const endpoint = process.env.TASKHUB_TRELLO_STATUS_URL || process.argv[2] || "http://127.0.0.1:3301/api/trello/status";

async function main() {
  const response = await fetch(endpoint, {
    headers: { accept: "application/json" },
  });
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    throw new Error(`Trello status endpoint returned HTTP ${response.status}`);
  }
  if (!contentType.includes("application/json")) {
    throw new Error(`Trello status endpoint did not return JSON (${contentType || "no content-type"})`);
  }

  const status = await response.json();
  const report = buildTrelloStatusReport({ status, endpoint });
  process.stdout.write(report);

  if (!status.verified && !status.connected) {
    process.exitCode = 1;
  }
}

main()
  .catch(error => {
    console.error(`Trello runtime diagnostic failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit(process.exitCode || 0);
  });
