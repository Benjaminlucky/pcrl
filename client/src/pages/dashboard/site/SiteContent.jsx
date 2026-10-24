// Dashboard page: /dashboard/site — overview of everything editable.
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFileAlt, FaBars, FaCog, FaPlus, FaExternalLinkAlt, FaTrash } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { PAGE_SECTIONS } from "../../../cms/registry";
import { cmsRequest, staffPermissions } from "./cmsApi";
import { BUILT_IN_PATHS } from "./constants";
import { timeAgo } from "./format";
import { Alert, Btn, Field, Loading, Modal, PageHeader, Panel, StatusBadge, TextInput } from "./ui";

const RESERVED_PATHS = [...BUILT_IN_PATHS, "/dashboard", "/admin", "/forgot-password", "/reset-password"];

function DocRow({ doc, to, icon, onDelete }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition">
      <span className="text-gray-500">{icon}</span>
      <Link to={to} className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-gray-100 truncate">{doc.title || doc.key}</span>
        <span className="block text-xs text-gray-500 truncate">
          {doc.path || doc.key} · edited {timeAgo(doc.updatedAt)}
          {doc.updatedBy?.name ? ` by ${doc.updatedBy.name}` : ""}
        </span>
      </Link>
      <StatusBadge doc={doc} />
      {doc.path && doc.isPublished && (
        <a href={doc.path} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white p-1" title="Open live page">
          <FaExternalLinkAlt className="text-xs" />
        </a>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} className="text-gray-500 hover:text-red-300 p-1 cursor-pointer" title="Delete page">
          <FaTrash className="text-xs" />
        </button>
      )}
      <Link
        to={to}
        className="px-2.5 py-1.5 text-xs rounded-lg font-medium bg-white/10 hover:bg-white/15 text-gray-100 transition"
      >
        Edit
      </Link>
    </div>
  );
}

export default function SiteContent() {
  const { user } = useAuth();
  const perms = staffPermissions(user);
  const navigate = useNavigate();
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await cmsRequest("GET", "/site/documents");
      setDocs(res.docs);
    } catch (e) {
      setError(e.message);
      setDocs([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removePage = async (doc) => {
    if (!window.confirm(`Delete the page "${doc.title}" (${doc.path}) and its history? This can't be undone.`)) return;
    try {
      await cmsRequest("DELETE", `/site/documents/page/${doc.key}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!docs) return <Loading />;

  const pages = docs.filter((d) => d.kind === "page");
  const menus = docs.filter((d) => d.kind === "menu");
  const settings = docs.filter((d) => d.kind === "settings");
  const builtInOrder = Object.keys(PAGE_SECTIONS);
  pages.sort((a, b) => {
    const ia = builtInOrder.indexOf(a.key);
    const ib = builtInOrder.indexOf(b.key);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.title.localeCompare(b.title);
  });

  return (
    <div className="pb-16 space-y-6">
      <PageHeader
        title="Website"
        subtitle="Edit pages, navigation and site-wide settings. Changes are saved as drafts and go live when published."
        actions={
          <Btn variant="primary" onClick={() => setCreating(true)}>
            <FaPlus /> New page
          </Btn>
        }
      />

      {error && <Alert>{error}</Alert>}
      {!error && docs.length === 0 && (
        <Alert color="amber">
          The website content hasn&apos;t been set up on the server yet. Ask your developer to run{" "}
          <code className="px-1 bg-black/40 rounded">npm run seed:site</code> on the API server.
        </Alert>
      )}

      {pages.length > 0 && (
        <Panel className="overflow-hidden">
          <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-300">Pages</h3>
          <div className="divide-y divide-white/5">
            {pages.map((d) => (
              <DocRow
                key={d._id}
                doc={d}
                icon={<FaFileAlt />}
                to={`/dashboard/site/page/${d.key}`}
                onDelete={perms.canDelete && !PAGE_SECTIONS[d.key] ? () => removePage(d) : null}
              />
            ))}
          </div>
        </Panel>
      )}

      {(menus.length > 0 || settings.length > 0) && (
        <Panel className="overflow-hidden">
          <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-300">Navigation & settings</h3>
          <div className="divide-y divide-white/5">
            {menus.map((d) => (
              <DocRow key={d._id} doc={d} icon={<FaBars />} to={`/dashboard/site/menu/${d.key}`} />
            ))}
            {settings.map((d) => (
              <DocRow key={d._id} doc={d} icon={<FaCog />} to="/dashboard/site/settings" />
            ))}
          </div>
        </Panel>
      )}

      <NewPageModal
        open={creating}
        onClose={() => setCreating(false)}
        existing={pages}
        onCreated={(doc) => navigate(`/dashboard/site/page/${doc.key}`)}
      />
    </div>
  );
}

function NewPageModal({ open, onClose, existing, onCreated }) {
  const [title, setTitle] = useState("");
  const [path, setPath] = useState("");
  const [pathTouched, setPathTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const slug = (s) =>
    s
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

  const effectivePath = pathTouched ? path : title ? `/${slug(title)}` : "";

  const problem = (() => {
    if (!title.trim()) return "Enter a page title.";
    if (!/^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(effectivePath)) return 'Address must look like "/careers" (lowercase letters, numbers, dashes).';
    if (RESERVED_PATHS.some((p) => effectivePath === p || (p !== "/" && effectivePath.startsWith(`${p}/`))))
      return "That address is already used by the website.";
    if (existing.some((d) => d.path === effectivePath)) return "Another page already uses that address.";
    return "";
  })();

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      let key = slug(effectivePath.slice(1).replace(/\//g, "-")) || "page";
      if (existing.some((d) => d.key === key)) key = `${key}-${Date.now().toString(36)}`;
      const res = await cmsRequest("POST", "/site/documents", {
        kind: "page",
        key,
        title: title.trim(),
        path: effectivePath,
        data: {
          seo: { title: title.trim() },
          sections: [
            {
              id: "intro",
              type: "RichText",
              label: "Intro",
              visible: true,
              content: { heading: title.trim(), body: "Write your text here.", align: "left", buttons: [] },
              style: {},
            },
          ],
        },
      });
      setTitle("");
      setPath("");
      setPathTouched(false);
      onClose();
      onCreated(res.doc);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New page"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" disabled={!!problem || busy} onClick={create}>
            {busy ? "Creating…" : "Create page"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Page title">
          <TextInput autoFocus value={title} placeholder="e.g. Careers" onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Address" hint={`The page will be at pcrginitiative.com${effectivePath || "/…"}`}>
          <TextInput
            value={effectivePath}
            placeholder="/careers"
            onChange={(e) => {
              setPathTouched(true);
              setPath(e.target.value.toLowerCase());
            }}
          />
        </Field>
        {title && problem && <p className="text-xs text-amber-300">{problem}</p>}
        {error && <Alert>{error}</Alert>}
        <p className="text-xs text-gray-500">
          The page starts as a draft with one text section. Add sections, publish it, then add it to the navigation
          menu if you want a link to it.
        </p>
      </div>
    </Modal>
  );
}
