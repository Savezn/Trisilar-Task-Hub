const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const docsPage = fs.readFileSync(path.join(root, "public", "js", "pages", "docs.js"), "utf8");
const reviewPage = fs.readFileSync(path.join(root, "public", "js", "pages", "review.js"), "utf8");
const stylesheet = fs.readFileSync(path.join(root, "public", "style.css"), "utf8");

function pass(label) {
  console.log(`PASS ${label}`);
}

assert(docsPage.includes("docsLinkedTaskStateLabel"), "Docs page must centralize linked-task state labels");
assert(docsPage.includes("Missing local Review Queue task"), "Docs page must spell out missing Review Queue links");
assert(!docsPage.includes("relatedStatuses.map(item => esc(item.status || \"unknown\")).join(\", \")"), "Docs list must not render raw linked-task statuses");
assert(docsPage.includes("renderDocsListTraceChips"), "Docs list must render labeled source/type/status trace chips");
assert(docsPage.includes("Source system") && docsPage.includes("Source mode"), "Docs metadata must split source system and mode");
assert(docsPage.includes("docsTraceChip(\"Status\""), "Docs viewer header must label status chip text");
assert(stylesheet.includes(".docs-trace-chip-label"), "Styles must preserve visible labels inside trace chips");
pass("Docs list and viewer use labeled trace/state copy");

assert(reviewPage.includes("paperclip_webhook: \"Paperclip webhook\""), "Review source labels must include Paperclip webhook");
assert(reviewPage.includes("paperclip_docs_mock: \"Paperclip docs mock\""), "Review source labels must include Paperclip docs mock");
assert(reviewPage.includes("agentRunId: doc.agent?.runId"), "Review linked docs must carry agent run context");
assert(reviewPage.includes("review-linked-doc-meta"), "Review linked docs must render labeled trace metadata");
assert(reviewPage.includes("Run:"), "Review linked docs must expose agent run label");
assert(stylesheet.includes(".review-linked-doc-meta"), "Styles must support readable Review linked-doc trace metadata");
pass("Review Queue linked Paperclip docs expose trace context");

console.log("RUX AI trace clarity verification passed.");
