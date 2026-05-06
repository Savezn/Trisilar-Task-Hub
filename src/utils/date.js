// Returns today's date string (YYYY-MM-DD) in Asia/Bangkok (UTC+7)
function todayBangkok() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

module.exports = {
  todayBangkok
};
