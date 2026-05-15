const {
  exportSqliteStateToJson,
  migrateJsonStateToSqlite,
} = require("../src/persistence/sqlite-migration");

function printUsage() {
  console.log("Usage: node scripts/migrate-json-state-to-sqlite.js [import|export]");
}

function main() {
  const command = process.argv[2] || "import";
  if (!["import", "export"].includes(command)) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const result = command === "export"
    ? exportSqliteStateToJson()
    : migrateJsonStateToSqlite();

  console.log(JSON.stringify({
    kind: result.kind,
    dataDir: result.dataDir,
    databaseFile: result.databaseFile,
    secretBearing: result.secretBearing,
    manifestFile: result.manifestFile,
    imported: result.imported?.map(item => item.name),
    exported: result.exported?.map(item => item.name),
    skipped: result.skipped,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message || String(error));
  process.exitCode = 1;
}
