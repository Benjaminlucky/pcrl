// src/cms/CmsPageSEO.jsx
// <PageSEO> with per-page overrides (title, description, canonical, ogImage)
// editable from the CMS. Props passed here are the built-in defaults.
import React from "react";
import PageSEO from "../components/PageSEO";
import { usePage } from "./hooks";

const FIELDS = ["title", "description", "canonical", "ogImage"];

export default function CmsPageSEO({ pageKey, ...defaults }) {
  const { page } = usePage(pageKey);
  const props = { ...defaults };
  for (const f of FIELDS) {
    const v = page?.seo?.[f];
    if (typeof v === "string" && v.trim()) props[f] = v;
  }
  return <PageSEO {...props} />;
}
