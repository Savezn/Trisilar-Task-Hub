// ── P6-1: Friendly error mapper ───────────────────────────────────────────────
// Logs full error to console, returns safe message to client
function friendlyError(e) {
  const msg = String(e?.message || e || "").toLowerCase();
  console.error("[Server Error Detail]", e); // Log full error object for debugging
  if (
    msg.includes("invalid key") || msg.includes("invalid token") ||
    msg.includes("unauthorized")  || msg.includes("401") ||
    msg.includes("not authorized")
  ) {
    return "Trello connection needs Runtime verification. Credentials are missing, expired, or invalid.";
  }
  if (
    msg.includes("invalid_grant") || msg.includes("invalid grant") ||
    msg.includes("token has been expired") || msg.includes("token expired") ||
    msg.includes("invalid credentials")
  ) {
    return "Google Calendar session expired. Please reconnect.";
  }
  if (msg.includes("invalid_client") || msg.includes("invalid client")) {
    return "Google Calendar not connected. Check credentials in .env";
  }
  if (msg.includes("429") || msg.includes("rate limit") || msg.includes("api_token_limit")) {
    return "Trello rate limit reached. Wait a moment and refresh.";
  }
  return "Internal server error";
}

module.exports = {
  friendlyError
};
