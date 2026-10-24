// src/cms/api.js
// Read-only access to published website content. Every function resolves to
// `null` on ANY failure (offline API, timeout, 404, bad JSON) — callers then
// fall back to the content built into the components, so the CMS can never
// take the site down.

// Lets the CMS API live on a different host than the rest of the API during a
// migration; defaults to the normal API base URL.
export const BASE_URL = (
  import.meta.env.VITE_CMS_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ""
).replace(/\/$/, "");

export const TIMEOUT_MS = 5000;
const CACHE_PREFIX = "pcrg-cms:";

async function getJson(path) {
  if (!BASE_URL) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // "no-cache" = always revalidate with the server (cheap 304 when nothing
    // changed), so published edits show up on the very next page load.
    const res = await fetch(`${BASE_URL}${path}`, {
      signal: controller.signal,
      cache: "no-cache",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// localStorage helpers — storage can be unavailable (private mode, quota).
export function readCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export function writeCache(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(CACHE_PREFIX + key);
    } else {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
    }
  } catch {
    /* ignore */
  }
}

export const fetchBootstrap = () => getJson("/api/site/bootstrap");

export const fetchPage = (key) =>
  getJson(`/api/site/pages/${encodeURIComponent(key)}`);

// ---------------------------------------------------------------------------
// Draft preview (staff only). Uses the dashboard login token; resolves null
// on any failure so preview falls back to published content.
// ---------------------------------------------------------------------------
async function getStaffJson(path) {
  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch {
    return null;
  }
  if (!BASE_URL || !token) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export const fetchPreview = (kind, key) =>
  getStaffJson(`/api/cms/site/preview/${encodeURIComponent(kind)}/${encodeURIComponent(key)}`);

export const fetchStaffPageList = () => getStaffJson("/api/cms/site/documents?kind=page");
