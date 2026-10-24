// src/cms/PageSections.jsx
// Renders a page's sections in the order/visibility set in the CMS, with
// each section's content overrides available through useSection().
//
// Safety rules (the live site must never break because of the CMS):
//   - no CMS data / API down        → built-in sections in built-in order
//   - built-in section missing in CMS → still rendered (to remove one, hide it)
//   - unknown section type          → skipped
//   - a section crashes on CMS data → re-rendered with built-in content only
import React, { useEffect, useState } from "react";
import { SectionContext, usePage } from "./hooks";
import { PAGE_SECTIONS } from "./registry";
import { buildPlan } from "./plan";
import { GENERIC_BLOCKS } from "./genericBlocks";

const LOADING_HOLD_MS = 1200;

// Safe subset of wrapper styling editors may set per section.
const STYLE_KEYS = ["backgroundColor", "color", "paddingTop", "paddingBottom"];
function wrapperStyle(style) {
  if (!style || typeof style !== "object") return undefined;
  const out = {};
  for (const k of STYLE_KEYS) {
    if (typeof style[k] === "string" && style[k].length < 40) out[k] = style[k];
  }
  return Object.keys(out).length ? out : undefined;
}

class SectionBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error(`[cms] section "${this.props.sectionId}" failed to render:`, error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function SectionLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );
}

function renderSection(sec, Component, isGeneric, withCms) {
  const content = withCms ? sec.content : null;
  return (
    <div
      className={sec.className}
      id={sec.wrapperId}
      data-cms-section={sec.id}
      style={withCms ? wrapperStyle(sec.style) : undefined}
    >
      <SectionContext.Provider value={content}>
        {isGeneric ? <Component content={content || {}} /> : <Component />}
      </SectionContext.Provider>
    </div>
  );
}

export default function PageSections({ pageKey, components }) {
  const { page, status } = usePage(pageKey);
  const [holdExpired, setHoldExpired] = useState(false);

  // Briefly wait for first-visit content (avoids a flash of old text), but
  // never longer than LOADING_HOLD_MS.
  useEffect(() => {
    if (status !== "loading") return;
    const t = setTimeout(() => setHoldExpired(true), LOADING_HOLD_MS);
    return () => clearTimeout(t);
  }, [status]);

  if (status === "loading" && !holdExpired) return <SectionLoading />;

  const plan = buildPlan(PAGE_SECTIONS[pageKey] || [], page?.sections);

  return plan.map((sec) => {
    const Component = components[sec.type] || GENERIC_BLOCKS[sec.type];
    if (!Component) return null;
    const isGeneric = !components[sec.type];
    return (
      // Outer boundary: on a crash with CMS content, retry with built-in
      // content only; if that crashes too, drop just this section.
      <SectionBoundary
        key={sec.id}
        sectionId={sec.id}
        fallback={
          <SectionBoundary sectionId={sec.id} fallback={null}>
            {renderSection(sec, Component, isGeneric, false)}
          </SectionBoundary>
        }
      >
        {renderSection(sec, Component, isGeneric, true)}
      </SectionBoundary>
    );
  });
}
