// ── API ───────────────────────────────────────────────────────────────────────
const api = {
  async req(method, url, body) {
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  },
  get:  (url)        => api.req("GET",    url),
  post: (url, body)  => api.req("POST",   url, body),
  put:  (url, body)  => api.req("PUT",    url, body),
  del:  (url)        => api.req("DELETE", url),
};
