// src/cms/content.js
// Public Blog & Events data (published items only, from /api/content).
import { useEffect, useState } from "react";
import { BASE_URL, TIMEOUT_MS } from "./api";

// → { status: "ok" | "notfound" | "error", data }
export async function fetchContent(path) {
  if (!BASE_URL) return { status: "error", data: null };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/api/content${path}`, {
      signal: controller.signal,
      cache: "no-cache",
    });
    if (res.status === 404) return { status: "notfound", data: null };
    if (!res.ok) return { status: "error", data: null };
    return { status: "ok", data: await res.json() };
  } catch {
    return { status: "error", data: null };
  } finally {
    clearTimeout(timer);
  }
}

// List hook: useContentList("blog", { limit: 3 }) → { items, total, pages, status }
export function useContentList(collection, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  ).toString();
  const [state, setState] = useState({ items: [], total: 0, pages: 1, status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));
    fetchContent(`/${collection}${query ? `?${query}` : ""}`).then(({ status, data }) => {
      if (cancelled) return;
      setState({
        items: Array.isArray(data?.docs) ? data.docs : [],
        total: data?.total || 0,
        pages: data?.pages || 1,
        status,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [collection, query]);

  return state;
}

// ---------------------------------------------------------------- dates
const TZ = "Africa/Lagos";

export function formatDate(value, opts = { day: "numeric", month: "long", year: "numeric" }) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-NG", { timeZone: TZ, ...opts }).format(d);
}

export const formatTime = (value) =>
  formatDate(value, { hour: "numeric", minute: "2-digit", hour12: true });

// "12 March 2027 · 10:00 am – 2:00 pm" / multi-day ranges
export function formatEventWhen(startAt, endAt) {
  if (!startAt) return "";
  const startDay = formatDate(startAt);
  if (!endAt) return `${startDay} · ${formatTime(startAt)}`;
  const endDay = formatDate(endAt);
  return startDay === endDay
    ? `${startDay} · ${formatTime(startAt)} – ${formatTime(endAt)}`
    : `${startDay} – ${endDay}`;
}

// Day/month badge for event cards.
export function dateBadge(value) {
  return {
    day: formatDate(value, { day: "numeric" }),
    month: formatDate(value, { month: "short" }).toUpperCase(),
  };
}
