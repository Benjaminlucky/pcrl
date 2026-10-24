// src/cms/hooks.js
// Hooks for reading published CMS content. All of them return null/defaults
// when the CMS has nothing, so callers keep their built-in content.
import { createContext, useContext, useEffect } from "react";
import { mergeContent } from "./merge";

export const ContentContext = createContext(null);
export const SectionContext = createContext(null);

const useContentContext = () => useContext(ContentContext);

// Global settings (logo, footer text, …) or null.
export function useSiteSettings() {
  return useContentContext()?.bootstrap?.settings ?? null;
}

// Published menu items, or null when the menu isn't managed by the CMS.
export function useMenu(key) {
  const items = useContentContext()?.bootstrap?.menus?.[key];
  return Array.isArray(items) && items.length ? items : null;
}

// { page, status } for a CMS page key.
export function usePage(key) {
  const ctx = useContentContext();
  const entry = ctx?.pages?.[key];
  useEffect(() => {
    if (ctx && key && !entry) ctx.loadPage(key);
  }, [ctx, key, entry]);
  if (!ctx) return { page: null, status: "ready" };
  return { page: entry?.data ?? null, status: entry?.status ?? "loading" };
}

// Inside a section component: returns built-in `defaults` with any CMS
// overrides for this section applied. Outside <PageSections> → `defaults`.
export function useSection(defaults) {
  const overrides = useContext(SectionContext);
  return mergeContent(defaults, overrides);
}

// Which CMS page (if any) lives at `path`. `ready` is false until the site
// bootstrap has been answered (or failed), so callers can wait before
// deciding a URL is a 404.
export function useCmsPageForPath(path) {
  const ctx = useContentContext();
  const clean = path.replace(/\/+$/, "") || "/";
  const match = ctx?.bootstrap?.pages?.find((p) => p.path === clean);
  return { key: match?.key ?? null, title: match?.title ?? "", ready: !ctx || ctx.bootstrapReady };
}
