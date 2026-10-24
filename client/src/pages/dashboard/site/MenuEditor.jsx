// Dashboard page: /dashboard/site/menu/:key — navbar / footer links.
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { staffPermissions } from "./cmsApi";
import useSiteDocument from "./useSiteDocument";
import { BackLink, EditorAlerts, HistoryModal, PublishBar, SitePathsDatalist } from "./EditorChrome";
import { Alert, Badge, IconBtn, Btn, Loading, PageHeader, Panel, Select, TextInput } from "./ui";

const VARIANTS = [
  { value: "link", label: "Normal link" },
  { value: "primary", label: "Solid red button" },
  { value: "outline", label: "Outline button" },
];

const SAFE_LINK = /^(\/|#|https?:\/\/|mailto:|tel:)/i;

export default function MenuEditor() {
  const { key } = useParams();
  const { user } = useAuth();
  const perms = staffPermissions(user);
  const editor = useSiteDocument("menu", key);
  const [historyOpen, setHistoryOpen] = useState(false);

  if (editor.loading) return <Loading />;
  if (!editor.doc) {
    return (
      <div className="pt-8 space-y-4">
        <BackLink />
        <Alert>{editor.error || "Menu not found."}</Alert>
      </div>
    );
  }

  const items = Array.isArray(editor.data?.items) ? editor.data.items : [];
  const setItems = (fn) => editor.update((d) => ({ ...d, items: fn(Array.isArray(d.items) ? d.items : []) }));
  const patch = (i, p) => setItems((list) => list.map((it, j) => (j === i ? { ...it, ...p } : it)));
  const move = (i, dir) =>
    setItems((list) => {
      const next = [...list];
      const j = i + dir;
      if (j < 0 || j >= next.length) return next;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const invalid = items.some((it) => !it.label?.trim() || !SAFE_LINK.test(it.url || ""));

  return (
    <div className="pb-24">
      <SitePathsDatalist />
      <PageHeader
        back={<BackLink />}
        title={editor.doc.title || key}
        subtitle={key === "main" ? "Links in the top navigation bar." : "Links in the website footer."}
      />
      <PublishBar editor={editor} perms={perms} previewHref="/?preview=1" onHistory={() => setHistoryOpen(true)} />

      <div className="mt-4 space-y-3">
        <EditorAlerts editor={editor} />
        {invalid && (
          <Alert color="amber">
            Every link needs a label and an address starting with /, https://, mailto: or tel: — fix the highlighted
            rows before saving.
          </Alert>
        )}
      </div>

      <Panel className="mt-4 divide-y divide-white/5">
        {items.length === 0 && <p className="p-5 text-sm text-gray-400">No links yet.</p>}
        {items.map((it, i) => {
          const bad = !it.label?.trim() || !SAFE_LINK.test(it.url || "");
          return (
            <div key={i} className={`p-4 flex flex-col md:flex-row md:items-center gap-3 ${it.visible === false ? "opacity-60" : ""}`}>
              <div className="grid gap-2 flex-1 sm:grid-cols-[1fr_1fr_180px]">
                <TextInput
                  placeholder="Label"
                  value={it.label || ""}
                  className={bad && !it.label?.trim() ? "!border-amber-500" : ""}
                  onChange={(e) => patch(i, { label: e.target.value })}
                />
                <TextInput
                  list="cms-site-paths"
                  placeholder="/page or https://…"
                  value={it.url || ""}
                  className={bad && !SAFE_LINK.test(it.url || "") ? "!border-amber-500" : ""}
                  onChange={(e) => patch(i, { url: e.target.value, external: /^https?:\/\//i.test(e.target.value) })}
                />
                <Select options={VARIANTS} value={it.variant || "link"} onChange={(e) => patch(i, { variant: e.target.value })} />
              </div>
              <div className="flex items-center gap-0.5">
                {it.visible === false && <Badge>Hidden</Badge>}
                <IconBtn title={it.visible === false ? "Show" : "Hide"} onClick={() => patch(i, { visible: it.visible === false })}>
                  {it.visible === false ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                </IconBtn>
                <IconBtn title="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                  <FaArrowUp className="text-xs" />
                </IconBtn>
                <IconBtn title="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  <FaArrowDown className="text-xs" />
                </IconBtn>
                <IconBtn
                  title="Remove"
                  className="hover:!text-red-300"
                  onClick={() => window.confirm(`Remove "${it.label || "this link"}"?`) && setItems((l) => l.filter((_, j) => j !== i))}
                >
                  <FaTrash className="text-xs" />
                </IconBtn>
              </div>
            </div>
          );
        })}
        <div className="p-4">
          <Btn
            size="sm"
            onClick={() =>
              setItems((l) => [
                ...l,
                { id: `link-${Date.now()}`, label: "New link", url: "/", variant: "link", visible: true, children: [] },
              ])
            }
          >
            <FaPlus /> Add link
          </Btn>
        </div>
      </Panel>

      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} editor={editor} />
    </div>
  );
}
