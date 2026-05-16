function sanitizeError(value) {
  if (!value) return "";
  const text = String(value);
  return text
    .replace(/\b[A-Za-z0-9_-]{24,}\b/g, "[redacted]")
    .replace(/token\s+[^\s,;]+/gi, "token [redacted]")
    .replace(/key\s+[^\s,;]+/gi, "key [redacted]");
}

function classifyTrelloStatus(status = {}) {
  const state = String(status.state || "").toLowerCase();
  const configured = Boolean(status.configured);
  const verified = Boolean(status.verified || status.connected);

  if (verified || state === "verified") {
    return {
      ok: true,
      code: "verified",
      summary: "Trello runtime is verified.",
      nextAction: "No Trello credential action required.",
    };
  }

  if (!configured || state === "disconnected") {
    return {
      ok: false,
      code: "missing_credentials",
      summary: "Trello runtime credentials are not configured.",
      nextAction: "Set runtime-only TRELLO_API_KEY and TRELLO_TOKEN, then recreate or restart the Task Hub runtime.",
    };
  }

  if (state === "invalid") {
    return {
      ok: false,
      code: "invalid_credentials",
      summary: "Trello runtime credentials are configured but rejected by Trello.",
      nextAction: "Rotate or reissue the runtime-only Trello token/key pair, then recreate or restart the Task Hub runtime.",
    };
  }

  if (state === "rate_limited") {
    return {
      ok: false,
      code: "rate_limited",
      summary: "Trello runtime verification hit a Trello rate limit.",
      nextAction: "Wait for the retry window, then rerun this diagnostic before changing credentials.",
    };
  }

  return {
    ok: false,
    code: "unavailable",
    summary: "Trello runtime status could not be verified.",
    nextAction: "Check Task Hub runtime network egress and Trello API availability before rotating credentials.",
  };
}

function buildTrelloStatusReport({ status, endpoint }) {
  const classification = classifyTrelloStatus(status);
  const lines = [
    "Trello runtime diagnostic",
    `endpoint: ${endpoint}`,
    `configured: ${Boolean(status?.configured)}`,
    `verified: ${Boolean(status?.verified || status?.connected)}`,
    `state: ${status?.state || "unknown"}`,
    `classification: ${classification.code}`,
    `summary: ${classification.summary}`,
    `next_action: ${classification.nextAction}`,
  ];

  const error = sanitizeError(status?.error);
  if (error) lines.push(`runtime_error: ${error}`);
  return `${lines.join("\n")}\n`;
}

module.exports = {
  buildTrelloStatusReport,
  classifyTrelloStatus,
  sanitizeError,
};
