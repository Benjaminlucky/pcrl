// utils/cms/siteCache.js
// Tiny in-process cache for the public site API. Every visitor hits
// /api/site/*, but content only changes on publish, so responses are cached
// here and the whole cache is cleared on any publish/unpublish/delete.
// (Shared hosting runs a single process, so in-memory is sufficient.)

const TTL_MS = 5 * 60 * 1000;
const store = new Map();

export function cacheGet(key) {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (hit.expires < Date.now()) {
    store.delete(key);
    return undefined;
  }
  return hit.value;
}

export function cacheSet(key, value) {
  if (store.size > 500) store.clear(); // hard cap, never grows unbounded
  store.set(key, { value, expires: Date.now() + TTL_MS });
  return value;
}

export function clearSiteCache() {
  store.clear();
}
