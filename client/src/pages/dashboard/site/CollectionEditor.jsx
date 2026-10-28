// Dashboard pages: /dashboard/blog/:id and /dashboard/events/:id ("new" to create)
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaGlobeAfrica, FaClock, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { cmsRequest } from "./cmsApi";
import { can } from "../../../context/permissions";
import { COLLECTIONS, STATUS_META } from "./collections";
import { timeAgo } from "./format";
import FieldInput from "./FieldInput";
import { Alert, Badge, Btn, Field, Loading, Modal, PageHeader, Panel, TextInput } from "./ui";

const clone = (v) => JSON.parse(JSON.stringify(v));

// Only the editable fields of a loaded document, filled with defaults.
function editableFrom(doc, empty) {
  const out = clone(empty);
  for (const key of Object.keys(empty)) {
    if (doc?.[key] !== undefined && doc[key] !== null) {
      out[key] =
        typeof empty[key] === "object" && empty[key] && !Array.isArray(empty[key])
          ? { ...empty[key], ...doc[key] }
          : doc[key];
    }
  }
  return out;
}

export default function CollectionEditor({ collection }) {
  const config = COLLECTIONS[collection];
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const perms = {
    canPublish: can(user, `${collection}.publish`),
    canDelete: can(user, `${collection}.delete`),
  };

  const [doc, setDoc] = useState(null);
  const [data, setData] = useState(() => clone(config.empty));
  const [slug, setSlug] = useState("");
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [notice, setNotice] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const base = `/${collection}`;

  const accept = useCallback(
    (d) => {
      setDoc(d);
      setData(editableFrom(d, config.empty));
      setSlug(d.slug || "");
      setDirty(false);
      setConflict(false);
    },
    [config.empty],
  );

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    setError("");
    try {
      accept(await cmsRequest("GET", `${base}/${id}`));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isNew, base, id, accept]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const setField = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    setDirty(true);
  };

  const run = async (label, fn) => {
    setBusy(label);
    setError("");
    try {
      return await fn();
    } catch (e) {
      if (e.status === 409 && e.body?.currentUpdatedAt) setConflict(true);
      setError(e.message);
      throw e;
    } finally {
      setBusy("");
    }
  };

  const validate = () => {
    if (!data.title?.trim()) throw new Error("Please add a title first.");
  };

  // Saves and returns the latest document.
  const save = () =>
    run("saving", async () => {
      validate();
      if (isNew) {
        const res = await cmsRequest("POST", base, data);
        setDirty(false);
        navigate(`/dashboard/${collection}/${res.doc._id}`, { replace: true });
        return res.doc;
      }
      const body = { ...data, expectedUpdatedAt: doc.updatedAt };
      if (slug && slug !== doc.slug) body.slug = slug;
      const res = await cmsRequest("PUT", `${base}/${id}`, body);
      accept(res.doc);
      return res.doc;
    });

  const safely = (fn) => async () => {
    try {
      await fn();
    } catch (e) {
      if (!e.status) setError(e.message);
    }
  };

  const onSave = safely(async () => {
    await save();
    setNotice("Saved.");
  });

  const onPublish = safely(async () => {
    if (collection === "events" && !data.startAt) throw new Error("Add a start date before publishing an event.");
    if (!window.confirm(`Publish this ${config.singular} on the website now?`)) return;
    const current = dirty || isNew ? await save() : doc;
    if (isNew) return; // navigated to the saved doc; publish from there
    await run("publishing", async () => {
      const res = await cmsRequest("POST", `${base}/${current._id}/publish`, {});
      accept(res.doc);
    });
    setNotice("Published — it's live now.");
  });

  const onUnpublish = safely(async () => {
    const msg =
      doc.status === "scheduled"
        ? "Cancel the scheduled publish and keep this as a draft?"
        : `Take this ${config.singular} off the website? It stays here as a draft.`;
    if (!window.confirm(msg)) return;
    await run("unpublishing", async () => {
      const res = await cmsRequest("POST", `${base}/${id}/unpublish`, {});
      accept(res.doc);
    });
    setNotice(doc.status === "scheduled" ? "Schedule cancelled." : "Unpublished.");
  });

  const onSchedule = async (when) => {
    try {
      if (collection === "events" && !data.startAt) throw new Error("Add a start date before scheduling an event.");
      if (dirty) await save();
      await run("scheduling", async () => {
        const res = await cmsRequest("POST", `${base}/${id}/schedule`, { scheduledFor: when });
        accept(res.doc);
      });
      setScheduling(false);
      setNotice(`Scheduled for ${new Date(when).toLocaleString()}.`);
    } catch (e) {
      if (!e.status) setError(e.message);
    }
  };

  const onDelete = safely(async () => {
    if (!window.confirm(`Delete “${doc.title}” permanently? This can't be undone.`)) return;
    await run("deleting", () => cmsRequest("DELETE", `${base}/${id}`));
    setDirty(false);
    navigate(`/dashboard/${collection}`, { replace: true });
  });

  if (loading) return <Loading />;
  if (!isNew && !doc) {
    return (
      <div className="pt-8 space-y-4">
        <Link to={`/dashboard/${collection}`} className="text-sm text-gray-400 hover:text-white">
          ← {config.label}
        </Link>
        <Alert>{error || "Not found."}</Alert>
      </div>
    );
  }

  const meta = STATUS_META[doc?.status] || STATUS_META.draft;
  const live = doc?.status === "published";

  return (
    <div className="pb-24">
      <PageHeader
        back={
          <Link
            to={`/dashboard/${collection}`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-2"
          >
            <FaArrowLeft className="text-xs" /> {config.label}
          </Link>
        }
        title={data.title || (isNew ? config.newLabel : "(untitled)")}
      />

      {/* Action bar */}
      <div className="sticky top-0 z-20 -mx-6 sm:-mx-8 px-6 sm:px-8 py-3 bg-black/90 backdrop-blur border-b border-white/10 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-auto text-xs text-gray-400 min-w-0">
          {dirty ? <Badge color="amber">Unsaved changes</Badge> : <Badge color={meta.color}>{isNew ? "New" : meta.label}</Badge>}
          {doc?.status === "scheduled" && doc.scheduledFor && (
            <span>goes live {new Date(doc.scheduledFor).toLocaleString()}</span>
          )}
          {doc && !dirty && <span className="hidden sm:inline">edited {timeAgo(doc.updatedAt)}</span>}
          {notice && <Badge color="blue">{notice}</Badge>}
        </div>
        {live && (
          <a
            href={config.publicPath(doc)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-gray-300 hover:bg-white/10"
          >
            <FaExternalLinkAlt /> View
          </a>
        )}
        {perms.canDelete && doc && (
          <Btn size="sm" variant="ghost" disabled={!!busy} onClick={onDelete}>
            <FaTrash /> Delete
          </Btn>
        )}
        <Btn size="sm" disabled={(!dirty && !isNew) || !!busy} onClick={onSave}>
          <FaSave /> {busy === "saving" ? "Saving…" : isNew ? "Save draft" : "Save"}
        </Btn>
        {perms.canPublish && doc && (
          <>
            {(live || doc.status === "scheduled") && (
              <Btn size="sm" variant="ghost" disabled={!!busy} onClick={onUnpublish}>
                {doc.status === "scheduled" ? "Cancel schedule" : "Unpublish"}
              </Btn>
            )}
            {!live && (
              <Btn size="sm" disabled={!!busy} onClick={() => setScheduling(true)}>
                <FaClock /> Schedule
              </Btn>
            )}
            {(!live || dirty) && (
              <Btn size="sm" variant="primary" disabled={!!busy} onClick={live ? onSave : onPublish}>
                <FaGlobeAfrica /> {live ? "Update live" : dirty ? "Save & publish" : "Publish"}
              </Btn>
            )}
          </>
        )}
        {!perms.canPublish && <span className="text-xs text-gray-500">Someone with publishing rights must publish this.</span>}
      </div>

      <div className="mt-4 space-y-3">
        {conflict && (
          <Alert
            color="amber"
            action={
              <Btn size="sm" onClick={load}>
                Reload latest
              </Btn>
            }
          >
            Someone else changed this since you opened it. Reload to get their version — copy anything you need first.
          </Alert>
        )}
        {error && !conflict && <Alert>{error}</Alert>}
        {live && dirty && (
          <Alert color="blue">This {config.singular} is live — saving updates the website immediately.</Alert>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] mt-4">
        <Panel className="p-5 sm:p-6 space-y-6 min-w-0">
          {config.fields.map((f) => (
            <Field key={f.name} label={f.label} hint={f.hint}>
              <FieldInput field={f} value={data[f.name]} onChange={(v) => setField(f.name, v)} />
            </Field>
          ))}
        </Panel>

        <div className="space-y-4">
          <Panel className="p-5 space-y-3 h-fit">
            <h3 className="text-sm font-semibold text-white">Web address</h3>
            {isNew ? (
              <p className="text-xs text-gray-400">Created from the title when you first save.</p>
            ) : (
              <>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>/{collection}/</span>
                  <TextInput
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                      setDirty(true);
                    }}
                    className="!py-1 !text-xs"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {live
                    ? "Changing this breaks links people have already shared."
                    : "Stays the same when you edit the title."}
                </p>
              </>
            )}
          </Panel>
          {doc && (
            <Panel className="p-5 text-xs text-gray-400 space-y-1 h-fit">
              <p>Created {new Date(doc.createdAt).toLocaleString()}</p>
              {doc.publishedAt && <p>First published {new Date(doc.publishedAt).toLocaleString()}</p>}
              {doc.author?.name && <p>By {doc.author.name}</p>}
            </Panel>
          )}
        </div>
      </div>

      <ScheduleModal open={scheduling} onClose={() => setScheduling(false)} onSchedule={onSchedule} busy={busy === "scheduling"} />
    </div>
  );
}

function ScheduleModal({ open, onClose, onSchedule, busy }) {
  const [when, setWhen] = useState(null);
  const valid = when && new Date(when).getTime() > Date.now();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule publishing"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" disabled={!valid || busy} onClick={() => onSchedule(when)}>
            {busy ? "Scheduling…" : "Schedule"}
          </Btn>
        </>
      }
    >
      <Field label="Go live on" hint="Your local time. It appears on the website automatically at that moment.">
        <FieldInput field={{ kind: "datetime" }} value={when} onChange={setWhen} />
      </Field>
      {when && !valid && <p className="text-xs text-amber-300 mt-2">Pick a time in the future.</p>}
    </Modal>
  );
}
