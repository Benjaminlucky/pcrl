// Dashboard page: /dashboard/site/settings — logos and footer text.
import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { staffPermissions } from "./cmsApi";
import useSiteDocument from "./useSiteDocument";
import FieldInput from "./FieldInput";
import { BackLink, EditorAlerts, HistoryModal, PublishBar } from "./EditorChrome";
import { Alert, Field, Loading, PageHeader, Panel } from "./ui";

const GROUPS = [
  {
    title: "Brand",
    fields: [
      { path: ["brand", "logo"], label: "Logo (navbar)", kind: "imageUrl" },
      { path: ["brand", "logoAlt"], label: "Logo alt text", kind: "text" },
      { path: ["brand", "logoWhite"], label: "White logo (footer)", kind: "imageUrl" },
      { path: ["mobileMenuFooter"], label: "Text at the bottom of the mobile menu", kind: "text" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { path: ["footer", "tagline"], label: "Tagline under the logo", kind: "textarea" },
      { path: ["footer", "quicklinksTitle"], label: "Links heading", kind: "text" },
      { path: ["footer", "copyright"], label: "Copyright line", kind: "text" },
      { path: ["footer", "creditPrefix"], label: "Credit prefix", kind: "text" },
      { path: ["footer", "creditName"], label: "Credit name", kind: "text" },
    ],
  },
];

const getIn = (obj, path) => path.reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), obj);

function setIn(obj, path, value) {
  const [head, ...rest] = path;
  const base = obj && typeof obj === "object" ? obj : {};
  return { ...base, [head]: rest.length ? setIn(base[head], rest, value) : value };
}

export default function SettingsEditor() {
  const { user } = useAuth();
  const perms = staffPermissions(user);
  const editor = useSiteDocument("settings", "global");
  const [historyOpen, setHistoryOpen] = useState(false);

  if (editor.loading) return <Loading />;
  if (!editor.doc) {
    return (
      <div className="pt-8 space-y-4">
        <BackLink />
        <Alert>{editor.error || "Settings not found."}</Alert>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader back={<BackLink />} title="Site settings" subtitle="Logos and footer text used on every page. Empty fields keep the built-in value." />
      <PublishBar editor={editor} perms={perms} previewHref="/?preview=1" onHistory={() => setHistoryOpen(true)} />
      <div className="mt-4">
        <EditorAlerts editor={editor} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2 mt-4">
        {GROUPS.map((g) => (
          <Panel key={g.title} className="p-5 sm:p-6 space-y-5 h-fit">
            <h3 className="text-lg font-semibold text-white">{g.title}</h3>
            {g.fields.map((f) => (
              <Field key={f.path.join(".")} label={f.label}>
                <FieldInput
                  field={f}
                  value={getIn(editor.data, f.path)}
                  onChange={(v) => editor.update((d) => setIn(d, f.path, v))}
                />
              </Field>
            ))}
          </Panel>
        ))}
      </div>
      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} editor={editor} />
    </div>
  );
}
