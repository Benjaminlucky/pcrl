// Dashboard page: /dashboard/site/page/:key — edit a page's sections + SEO.
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaClone,
  FaTrash,
  FaPlus,
  FaSearch,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { PAGE_SECTIONS } from "../../../cms/registry";
import { SECTION_SCHEMAS, GENERIC_TYPES, STYLE_FIELDS } from "../../../cms/schemas";
import { staffPermissions } from "./cmsApi";
import useSiteDocument from "./useSiteDocument";
import SectionForm from "./SectionForm";
import FieldInput from "./FieldInput";
import { BackLink, EditorAlerts, HistoryModal, PublishBar, SitePathsDatalist } from "./EditorChrome";
import { Alert, Badge, Btn, Field, IconBtn, Loading, Modal, PageHeader, Panel, TextArea, TextInput } from "./ui";

const SEO_KEY = "__seo";

function uniqueId(base, sections) {
  const clean = base.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "section";
  let id = clean;
  let n = 2;
  while (sections.some((s) => s.id === id)) id = `${clean}-${n++}`;
  return id;
}

const hasContent = (s) => s.content && Object.keys(s.content).length > 0;

export default function PageEditor() {
  const { key } = useParams();
  const { user } = useAuth();
  const perms = staffPermissions(user);
  const editor = useSiteDocument("page", key);
  const [selected, setSelected] = useState(SEO_KEY);
  const [adding, setAdding] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showStyle, setShowStyle] = useState(false);

  const builtIn = useMemo(() => PAGE_SECTIONS[key] || [], [key]);
  const builtInIds = useMemo(() => new Set(builtIn.map((b) => b.id)), [builtIn]);

  if (editor.loading) return <Loading />;
  if (!editor.doc) {
    return (
      <div className="pt-8 space-y-4">
        <BackLink />
        <Alert>{editor.error || "Page not found."}</Alert>
      </div>
    );
  }

  const { doc, data } = editor;
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  const missingBuiltIns = builtIn.filter((b) => !sections.some((s) => s.id === b.id));
  const current = sections.find((s) => s.id === selected);

  // ---- section operations (local until saved) ----
  const setSections = (fn) =>
    editor.update((d) => ({ ...d, sections: fn(Array.isArray(d.sections) ? d.sections : []) }));

  const patchSection = (id, patch) =>
    setSections((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const moveSection = (index, dir) =>
    setSections((list) => {
      const next = [...list];
      const j = index + dir;
      if (j < 0 || j >= next.length) return next;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });

  const duplicateSection = (s) => {
    const id = uniqueId(`${s.id}-copy`, sections);
    setSections((list) => {
      const i = list.findIndex((x) => x.id === s.id);
      const copy = { ...structuredClone(s), id, label: `${s.label || s.type} (copy)` };
      return [...list.slice(0, i + 1), copy, ...list.slice(i + 1)];
    });
    setSelected(id);
  };

  const deleteSection = (s) => {
    if (!window.confirm(`Delete the section "${s.label || s.type}" from this page?`)) return;
    setSections((list) => list.filter((x) => x.id !== s.id));
    setSelected(SEO_KEY);
  };

  const addBlock = (type) => {
    const schema = SECTION_SCHEMAS[type];
    const id = uniqueId(type, sections);
    setSections((list) => {
      const i = list.findIndex((x) => x.id === selected);
      const block = {
        id,
        type,
        label: schema.title,
        visible: true,
        content: structuredClone(schema.template || {}),
        style: {},
      };
      const at = i === -1 ? list.length : i + 1;
      return [...list.slice(0, at), block, ...list.slice(at)];
    });
    setSelected(id);
    setAdding(false);
  };

  const restoreMissing = () =>
    setSections((list) => {
      const next = [...list];
      builtIn.forEach((b, i) => {
        if (next.some((s) => s.id === b.id)) return;
        const prevId = builtIn[i - 1]?.id;
        const at = prevId ? next.findIndex((s) => s.id === prevId) + 1 : 0;
        next.splice(at, 0, { id: b.id, type: b.type, label: b.id, visible: true, content: {}, style: {} });
      });
      return next;
    });

  const seo = data?.seo || {};
  const setSeo = (name, value) => editor.update((d) => ({ ...d, seo: { ...(d.seo || {}), [name]: value } }));

  return (
    <div className="pb-24">
      <SitePathsDatalist />
      <PageHeader
        back={<BackLink />}
        title={doc.title || key}
        subtitle={
          <span className="inline-flex items-center gap-2">
            {doc.path}
            {doc.path && (
              <a href={doc.path} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" title="Open live page">
                <FaExternalLinkAlt className="text-xs" />
              </a>
            )}
          </span>
        }
      />
      <PublishBar
        editor={editor}
        perms={perms}
        previewHref={doc.path ? `${doc.path}?preview=1` : null}
        onHistory={() => setHistoryOpen(true)}
      />

      <div className="mt-4 space-y-3">
        <EditorAlerts editor={editor} />
        {missingBuiltIns.length > 0 && (
          <Alert
            color="blue"
            action={
              <Btn size="sm" onClick={restoreMissing}>
                Add to list
              </Btn>
            }
          >
            {missingBuiltIns.length} built-in section(s) ({missingBuiltIns.map((b) => b.id).join(", ")}) are not in
            this list. They still appear on the site in their original position — add them to control their order or
            visibility.
          </Alert>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr] mt-4">
        {/* ---------------- Section list ---------------- */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSelected(SEO_KEY)}
            className={`w-full text-left rounded-lg border px-3 py-3 flex items-center gap-3 transition cursor-pointer ${
              selected === SEO_KEY ? "border-primary-500 bg-primary-500/10" : "border-white/10 bg-[#121212] hover:border-white/25"
            }`}
          >
            <FaSearch className="text-gray-400" />
            <span className="text-sm font-medium text-gray-100">Page details & SEO</span>
          </button>

          <p className="text-xs uppercase tracking-wide text-gray-500 pt-3 px-1">Sections (top to bottom)</p>

          {sections.map((s, i) => {
            const schema = SECTION_SCHEMAS[s.type];
            const isBuiltIn = builtInIds.has(s.id);
            const active = selected === s.id;
            return (
              <div
                key={s.id}
                className={`rounded-lg border transition ${
                  active ? "border-primary-500 bg-primary-500/10" : "border-white/10 bg-[#121212] hover:border-white/25"
                } ${s.visible === false ? "opacity-60" : ""}`}
              >
                <button type="button" onClick={() => setSelected(s.id)} className="w-full text-left px-3 pt-3 cursor-pointer">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-100 truncate">{s.label || s.type}</span>
                    {s.visible === false && <Badge>Hidden</Badge>}
                    {schema?.generic && <Badge color="blue">{schema.title}</Badge>}
                    {!schema?.generic && hasContent(s) && <Badge color="amber">Edited</Badge>}
                  </div>
                  <span className="block text-[11px] text-gray-500 mt-0.5">
                    {s.id}
                    {!schema && " · layout only"}
                  </span>
                </button>
                <div className="flex items-center gap-0.5 px-2 pb-2 pt-1">
                  <IconBtn title="Move up" disabled={i === 0} onClick={() => moveSection(i, -1)}>
                    <FaArrowUp className="text-xs" />
                  </IconBtn>
                  <IconBtn title="Move down" disabled={i === sections.length - 1} onClick={() => moveSection(i, 1)}>
                    <FaArrowDown className="text-xs" />
                  </IconBtn>
                  <IconBtn
                    title={s.visible === false ? "Show on site" : "Hide from site"}
                    onClick={() => patchSection(s.id, { visible: s.visible === false })}
                  >
                    {s.visible === false ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </IconBtn>
                  <IconBtn title="Duplicate" onClick={() => duplicateSection(s)}>
                    <FaClone className="text-xs" />
                  </IconBtn>
                  {!isBuiltIn && (
                    <IconBtn title="Delete" className="hover:!text-red-300 ml-auto" onClick={() => deleteSection(s)}>
                      <FaTrash className="text-xs" />
                    </IconBtn>
                  )}
                </div>
              </div>
            );
          })}

          <Btn className="w-full" onClick={() => setAdding(true)}>
            <FaPlus /> Add section
          </Btn>
        </div>

        {/* ---------------- Editor panel ---------------- */}
        <Panel className="p-5 sm:p-6 h-fit min-w-0">
          {selected === SEO_KEY || !current ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Page details & SEO</h3>
                <p className="text-sm text-gray-400 mt-1">
                  How this page appears in Google and when shared on WhatsApp, Facebook, X, etc. Leave a field empty to
                  keep the built-in value.
                </p>
              </div>
              <Field label="Address">
                <TextInput value={doc.path || ""} readOnly disabled />
              </Field>
              <Field label="Browser / search title" hint={`Shown as "<title> | PCRG | Platinum Cape Realtors Group".`}>
                <TextInput value={seo.title || ""} onChange={(e) => setSeo("title", e.target.value)} />
              </Field>
              <Field label="Search description" hint={`${(seo.description || "").length}/160 characters recommended.`}>
                <TextArea rows={3} value={seo.description || ""} onChange={(e) => setSeo("description", e.target.value)} />
              </Field>
              <Field label="Social share image" hint="Best size 1200×630.">
                <FieldInput field={{ kind: "imageUrl" }} value={seo.ogImage} onChange={(v) => setSeo("ogImage", v)} />
              </Field>
              <Field label="Canonical URL (advanced)" hint="Only change if this page duplicates another URL.">
                <TextInput value={seo.canonical || ""} placeholder="https://pcrginitiative.com/…" onChange={(e) => setSeo("canonical", e.target.value)} />
              </Field>
            </div>
          ) : (
            <SectionEditor
              section={current}
              isBuiltIn={builtInIds.has(current.id)}
              showStyle={showStyle}
              setShowStyle={setShowStyle}
              onPatch={(patch) => patchSection(current.id, patch)}
            />
          )}
        </Panel>
      </div>

      <AddSectionModal open={adding} onClose={() => setAdding(false)} onAdd={addBlock} />
      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} editor={editor} />
    </div>
  );
}

function SectionEditor({ section, isBuiltIn, showStyle, setShowStyle, onPatch }) {
  const schema = SECTION_SCHEMAS[section.type];
  const style = section.style || {};
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{section.label || section.type}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {schema?.generic ? schema.title : isBuiltIn ? "Built-in section" : "Copy of a built-in section"} · id:{" "}
            {section.id}
          </p>
        </div>
        {section.visible === false && <Badge>Hidden on the site</Badge>}
      </div>

      <Field label="Name in this list" hint="Only shown here in the dashboard.">
        <TextInput value={section.label || ""} onChange={(e) => onPatch({ label: e.target.value })} />
      </Field>

      <hr className="border-white/10" />

      {schema ? (
        <SectionForm schema={schema} content={section.content} onChange={(content) => onPatch({ content })} />
      ) : (
        <Alert color="blue">
          The text and images in this section are still built into the website code, so they can&apos;t be edited here
          yet. You can still move, hide or duplicate it.
        </Alert>
      )}

      <hr className="border-white/10" />

      <div>
        <button
          type="button"
          className="text-sm text-gray-300 hover:text-white cursor-pointer"
          onClick={() => setShowStyle(!showStyle)}
        >
          {showStyle ? "▾" : "▸"} Section styling (advanced)
        </button>
        {showStyle && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {STYLE_FIELDS.map((f) => (
              <Field key={f.name} label={f.label}>
                <FieldInput
                  field={f}
                  value={style[f.name]}
                  onChange={(v) => {
                    const next = { ...style };
                    if (v === "" || v == null) delete next[f.name];
                    else next[f.name] = v;
                    onPatch({ style: next });
                  }}
                />
              </Field>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AddSectionModal({ open, onClose, onAdd }) {
  return (
    <Modal open={open} onClose={onClose} title="Add a section">
      <p className="text-sm text-gray-400 mb-4">It will be added below the selected section.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {GENERIC_TYPES.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => onAdd(t.type)}
            className="text-left rounded-lg border border-white/10 hover:border-primary-500 bg-black/30 p-4 transition cursor-pointer"
          >
            <span className="block text-sm font-semibold text-white">{t.title}</span>
            <span className="block text-xs text-gray-400 mt-1">{t.description}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
