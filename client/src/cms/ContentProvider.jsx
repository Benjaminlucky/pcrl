// src/cms/ContentProvider.jsx
// Loads published website content (settings, menus, pages) and shares it.
// Strategy: render cached content instantly, refresh from the API in the
// background, and fall back to built-in content whenever nothing is available.
//
// Preview mode (?preview=1, staff logged in): shows DRAFT content instead,
// never touches the visitor cache, and shows a banner to exit.
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchBootstrap,
  fetchPage,
  fetchPreview,
  fetchStaffPageList,
  readCache,
  writeCache,
} from "./api";
import { PAGE_KEY_BY_PATH } from "./registry";
import { ContentContext } from "./hooks";

const PREVIEW_FLAG = "pcrg-cms-preview";

function detectPreview() {
  try {
    const param = new URLSearchParams(window.location.search).get("preview");
    if (param === "1") sessionStorage.setItem(PREVIEW_FLAG, "1");
    if (param === "0") sessionStorage.removeItem(PREVIEW_FLAG);
    return sessionStorage.getItem(PREVIEW_FLAG) === "1" && !!localStorage.getItem("token");
  } catch {
    return false;
  }
}

// Published bootstrap with draft settings/menus/page list laid over it.
async function fetchPreviewBootstrap() {
  const [base, settings, main, footer, pageList] = await Promise.all([
    fetchBootstrap(),
    fetchPreview("settings", "global"),
    fetchPreview("menu", "main"),
    fetchPreview("menu", "footer"),
    fetchStaffPageList(),
  ]);
  const out = { settings: null, menus: {}, pages: [], ...(base || {}) };
  out.menus = { ...out.menus };
  if (settings?.data) out.settings = settings.data;
  if (main?.data) out.menus.main = main.data.items || [];
  if (footer?.data) out.menus.footer = footer.data.items || [];
  if (pageList?.docs) {
    out.pages = pageList.docs.map((d) => ({ key: d.key, path: d.path, title: d.title }));
  }
  return out;
}

function PreviewBanner() {
  const exit = () => {
    try {
      sessionStorage.removeItem(PREVIEW_FLAG);
    } catch {
      /* ignore */
    }
    window.location.href = window.location.pathname;
  };
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 rounded-full bg-black/90 text-white text-sm pl-5 pr-2 py-2 shadow-2xl border border-white/10">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      <span>Preview — showing saved drafts, not the live site</span>
      <button
        type="button"
        onClick={exit}
        className="rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-xs font-medium cursor-pointer"
      >
        Exit preview
      </button>
    </div>
  );
}

export function ContentProvider({ children }) {
  const [preview] = useState(detectPreview);
  const [bootstrap, setBootstrap] = useState(() => (preview ? null : readCache("bootstrap") ?? null));
  // True once the server has answered (or failed) — not just "cache present",
  // so a brand-new page isn't reported as a 404 from a stale cached list.
  const [bootstrapReady, setBootstrapReady] = useState(false);
  // pages[key] = { data: page|null, status: "loading" | "ready" }
  const [pages, setPages] = useState({});
  const inflight = useRef(new Map());

  const loadPage = useCallback(
    (key) => {
      if (inflight.current.has(key)) return inflight.current.get(key);
      const cached = preview ? undefined : readCache(`page:${key}`);
      setPages((p) => ({
        ...p,
        [key]: { data: cached ?? null, status: cached ? "ready" : "loading" },
      }));
      const request = preview
        ? fetchPreview("page", key).then((d) => d ?? fetchPage(key))
        : fetchPage(key);
      const promise = request.then((data) => {
        // `null` = not published / API down. Only forget the cache on a real
        // answer, so an outage keeps showing the last known content.
        if (data && !preview) writeCache(`page:${key}`, data);
        setPages((p) => ({ ...p, [key]: { data: data ?? cached ?? null, status: "ready" } }));
        return data;
      });
      inflight.current.set(key, promise);
      return promise;
    },
    [preview],
  );

  useEffect(() => {
    let cancelled = false;
    (preview ? fetchPreviewBootstrap() : fetchBootstrap()).then((data) => {
      if (cancelled) return;
      if (data) {
        if (!preview) writeCache("bootstrap", data);
        setBootstrap(data);
      }
      setBootstrapReady(true);
    });
    // Prefetch the page being visited in parallel with its JS chunk.
    const key = PAGE_KEY_BY_PATH[window.location.pathname.replace(/\/+$/, "") || "/"];
    if (key) loadPage(key);
    return () => {
      cancelled = true;
    };
  }, [loadPage, preview]);

  return (
    <ContentContext.Provider value={{ bootstrap, bootstrapReady, pages, loadPage, preview }}>
      {children}
      {preview && <PreviewBanner />}
    </ContentContext.Provider>
  );
}
