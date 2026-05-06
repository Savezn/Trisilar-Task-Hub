const _cache = {};

function cacheGet(key) {
  const e = _cache[key];
  return e && Date.now() < e.exp ? e.data : null;
}

function cacheSet(key, data, ttlMs) {
  _cache[key] = { data, exp: Date.now() + ttlMs };
}

function cacheInvalidate(prefix) {
  Object.keys(_cache).filter(k => k.startsWith(prefix)).forEach(k => delete _cache[k]);
}

module.exports = {
  cacheGet,
  cacheSet,
  cacheInvalidate
};
