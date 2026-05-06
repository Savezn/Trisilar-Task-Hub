// Smoke test — assumes server is already running on PORT (default 3000)
// Usage: npm run smoke
// Exit code 0 = all pass, 1 = any fail

const PORT = process.env.PORT || 3000;
const BASE = `http://localhost:${PORT}`;

const CHECKS = [
  { label: "GET /",                    url: `${BASE}/` },
  { label: "GET /api/config",          url: `${BASE}/api/config` },
  { label: "GET /api/calendar/status", url: `${BASE}/api/calendar/status` },
  { label: "GET /api/reviews",         url: `${BASE}/api/reviews` },
];

async function run() {
  let anyFail = false;

  for (const { label, url } of CHECKS) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`PASS  ${label}  (${res.status})`);
      } else {
        console.log(`FAIL  ${label}  (${res.status})`);
        anyFail = true;
      }
    } catch (err) {
      console.log(`FAIL  ${label}  (${err.message})`);
      anyFail = true;
    }
  }

  process.exit(anyFail ? 1 : 0);
}

run();
