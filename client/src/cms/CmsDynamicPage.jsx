// src/cms/CmsDynamicPage.jsx
// Catch-all route: renders pages created in the dashboard (e.g. /careers).
// Unknown paths — or any CMS failure — show the normal 404 page.
import React from "react";
import { useLocation } from "react-router-dom";
import NotFound from "../components/NotFound";
import CmsPageSEO from "./CmsPageSEO";
import PageSections from "./PageSections";
import { useCmsPageForPath, usePage } from "./hooks";

const SITE_URL = "https://pcrginitiative.com";

function Spinner() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );
}

function CmsPage({ pageKey, title, path }) {
  const { page, status } = usePage(pageKey);
  if (status === "loading") return <Spinner />;
  if (!page) return <NotFound />;
  return (
    <>
      <CmsPageSEO pageKey={pageKey} title={title} description={title} canonical={`${SITE_URL}${path}`} />
      <PageSections pageKey={pageKey} components={{}} />
    </>
  );
}

export default function CmsDynamicPage() {
  const { pathname } = useLocation();
  const { key, title, ready } = useCmsPageForPath(pathname);
  if (!key) return ready ? <NotFound /> : <Spinner />;
  return <CmsPage key={key} pageKey={key} title={title} path={pathname} />;
}
