/**
 * Frontend Verification Script
 * Implemented by: Gemini Dev (2026-05-07)
 * 
 * Checks:
 * 1. Syntax of all frontend JS files (node --check)
 * 2. Presence of all scripts referenced in index.html
 * 3. Script load order contract (Core -> Pages -> App)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');

console.log('🔍 Starting Frontend Verification...\n');

let failed = false;

function fail(msg) {
  console.error(`❌ ${msg}`);
  failed = true;
}

function pass(msg) {
  console.log(`✅ ${msg}`);
}

// 1. Syntax Check
const jsFiles = [];
function findJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findJsFiles(fullPath);
    } else if (entry.name.endsWith('.js')) {
      jsFiles.push(fullPath);
    }
  }
}

findJsFiles(PUBLIC_DIR);

console.log(`--- Syntax Check (${jsFiles.length} files) ---`);
for (const file of jsFiles) {
  const relativePath = path.relative(PUBLIC_DIR, file);
  try {
    execSync(`node --check "${file}"`);
    pass(`Syntax: ${relativePath}`);
  } catch (e) {
    fail(`Syntax error in ${relativePath}`);
  }
}

// 2. Load Order & Presence Check
console.log('\n--- Load Order & Presence Check ---');
const indexContent = fs.readFileSync(INDEX_HTML, 'utf8');
const scriptRegex = /<script src="([^"]+)"><\/script>/g;
const loadedScripts = [];
let match;

while ((match = scriptRegex.exec(indexContent)) !== null) {
  loadedScripts.push(match[1]);
}

if (loadedScripts.length === 0) {
  fail('No scripts found in index.html');
} else {
  // Check presence
  loadedScripts.forEach(src => {
    const filePath = path.join(PUBLIC_DIR, src);
    if (fs.existsSync(filePath)) {
      pass(`Present: ${src}`);
    } else {
      fail(`Missing file referenced in index.html: ${src}`);
    }
  });

  // Check contract
  const coreScripts = ['js/utils.js', 'js/api.js', 'js/state.js', 'js/router.js'];
  const appScript = 'app.js';

  // Core scripts should be first (and in specific order if needed, but at least before pages)
  let coreIdx = -1;
  coreScripts.forEach(core => {
    const idx = loadedScripts.indexOf(core);
    if (idx === -1) {
      fail(`Core script ${core} not found in index.html`);
    } else if (idx <= coreIdx) {
      fail(`Core script ${core} out of order. Expected after previous core script.`);
    }
    coreIdx = idx;
  });

  const lastCoreIdx = Math.max(...coreScripts.map(s => loadedScripts.indexOf(s)));
  const appIdx = loadedScripts.indexOf(appScript);

  if (appIdx === -1) {
    fail('app.js not found in index.html');
  } else if (appIdx !== loadedScripts.length - 1) {
    fail('app.js should be the last script loaded.');
  }

  // Page modules should be between core and app
  loadedScripts.forEach((src, idx) => {
    if (src.startsWith('js/pages/')) {
      if (idx < lastCoreIdx) {
        fail(`Page module ${src} loaded before core scripts.`);
      }
      if (idx > appIdx && appIdx !== -1) {
        fail(`Page module ${src} loaded after app.js.`);
      }
    }
  });

  if (!failed) pass('Script load order contract verified.');
}

console.log('\n--- Summary ---');
if (failed) {
  console.error('❌ Frontend verification FAILED.');
  process.exit(1);
} else {
  console.log('✅ Frontend verification PASSED.');
  process.exit(0);
}
