// Shared pieces for the page / menu / settings editors.
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaHistory, FaEye, FaSave, FaGlobeAfrica, FaUndo } from "react-icons/fa";
import { cmsRequest } from "./cmsApi";
import { timeAgo } from "./format";
import { BUILT_IN_PATHS } from "./constants";
import { Alert, Badge, Btn, Loading, Modal, StatusBadge } from "./ui";

// <datalist> powering URL suggestions in link/button fields.
export function SitePathsDatalist({ extra = [] }) {
  const paths = [...new Set([...BUILT_IN_PATHS, ...extra.filter(Boolean)])];
  return (
    <datalist id="cms-site-paths">
      {paths.map((p) => (
        <option key={p} value={p} />
      ))}
    </datalist>
  );
}

export function BackLink() {
  return (
    <Link to="/dashboard/site" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-2">
      <FaArrowLeft className="text-xs" /> Website
    </Link>
  );
}

// Sticky action bar: status + save / preview / publish / discard / history.
export function PublishBar({ editor, perms, previewHref, onHistory }) {
  const { doc, dirty, busy } = editor;
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const act = async (fn, msg) => {
    try {
      await fn();
      if (msg) setNotice(msg);
    } catch {
      /* error shown by the editor */
    }
  };

  const publish = () => {
    if (!window.confirm("Publish these changes to the live website now?")) return;
    act(editor.publish, "Published — it's live now.");
  };

  const discard = () => {
    const msg = dirty
      ? "Throw away your unsaved changes and all draft edits, and go back to what is live?"
      : "Throw away all draft edits and go back to what is live?";
    if (!window.confirm(msg)) return;
    act(editor.discard, "Draft reset to the live version.");
  };

  const unpublish = () => {
    if (
      !window.confirm(
        "Take this off the live site? The website will fall back to its original built-in content.",
      )
    )
      return;
    act(editor.unpublish, "Unpublished — the site now shows its original content.");
  };

  const preview = async () => {
    try {
      if (dirty) await editor.save();
      window.open(previewHref, "_blank", "noopener");
    } catch {
      /* error shown by the editor */
    }
  };

  const hasLive = doc?.publishedVersion != null;
  const canDiscard = hasLive && (dirty || doc?.hasUnpublishedChanges);

  return (
    <div className="sticky top-0 z-20 -mx-6 sm:-mx-8 px-6 sm:px-8 py-3 bg-black/90 backdrop-blur border-b border-white/10 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 mr-auto text-xs text-gray-400 min-w-0">
        <StatusBadge doc={doc} dirty={dirty} />
        {doc?.updatedAt && !dirty && (
          <span className="hidden sm:inline truncate">
            Saved {timeAgo(doc.updatedAt)}
            {doc.updatedBy?.name ? ` by ${doc.updatedBy.name}` : ""}
          </span>
        )}
        {notice && <Badge color="blue">{notice}</Badge>}
      </div>
      <Btn size="sm" variant="ghost" onClick={onHistory}>
        <FaHistory /> History
      </Btn>
      {canDiscard && (
        <Btn size="sm" variant="ghost" disabled={!!busy} onClick={discard}>
          <FaUndo /> Discard changes
        </Btn>
      )}
      {previewHref && (
        <Btn size="sm" disabled={!!busy} onClick={preview}>
          <FaEye /> Preview
        </Btn>
      )}
      <Btn size="sm" disabled={!dirty || !!busy} onClick={() => act(() => editor.save(), "Draft saved.")}>
        <FaSave /> {busy === "saving" ? "Saving…" : "Save draft"}
      </Btn>
      {perms.canPublish ? (
        <>
          {hasLive && !dirty && !doc?.hasUnpublishedChanges && (
            <Btn size="sm" variant="ghost" disabled={!!busy} onClick={unpublish}>
              Unpublish
            </Btn>
          )}
          <Btn
            size="sm"
            variant="primary"
            disabled={!!busy || (!dirty && !doc?.hasUnpublishedChanges)}
            onClick={publish}
          >
            <FaGlobeAfrica /> {busy === "publishing" ? "Publishing…" : dirty ? "Save & publish" : "Publish"}
          </Btn>
        </>
      ) : (
        <span className="text-xs text-gray-500">A publisher must publish your draft.</span>
      )}
    </div>
  );
}

export function EditorAlerts({ editor }) {
  if (editor.conflict) {
    return (
      <Alert
        color="amber"
        action={
          <Btn size="sm" onClick={editor.reload}>
            Reload latest
          </Btn>
        }
      >
        Someone else saved this while you were editing. Reload to get their version — your unsaved changes here will be lost, so copy anything you need first.
      </Alert>
    );
  }
  if (editor.error) {
    return (
      <Alert
        action={
          <Btn size="sm" variant="ghost" onClick={editor.clearError}>
            Dismiss
          </Btn>
        }
      >
        {editor.error}
      </Alert>
    );
  }
  return null;
}

const ACTION_LABEL = {
  create: "Created",
  save: "Saved",
  publish: "Published",
  unpublish: "Unpublished",
  restore: "Restored",
  discard: "Discarded draft",
};
const ACTION_COLOR = { publish: "green", unpublish: "red", restore: "blue", discard: "amber" };

export function HistoryModal({ open, onClose, editor }) {
  const [revisions, setRevisions] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setRevisions(null);
    setError("");
    cmsRequest("GET", `${editor.path}/revisions?limit=50`)
      .then((r) => setRevisions(r.revisions))
      .catch((e) => setError(e.message));
  }, [open, editor.path]);

  const restore = async (rev) => {
    const warn = editor.dirty ? "\n\nYour unsaved changes will be replaced." : "";
    if (!window.confirm(`Load version ${rev.version} (${new Date(rev.createdAt).toLocaleString()}) into the draft?${warn}\n\nNothing changes on the live site until you publish.`))
      return;
    try {
      await editor.restore(rev._id);
      onClose();
    } catch {
      /* error shown in editor */
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="History">
      {error && <Alert>{error}</Alert>}
      {!revisions && !error && <Loading />}
      {revisions && revisions.length === 0 && <p className="text-sm text-gray-400">No history yet.</p>}
      {revisions && revisions.length > 0 && (
        <ul className="divide-y divide-white/5">
          {revisions.map((rev) => (
            <li key={rev._id} className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge color={ACTION_COLOR[rev.action] || "gray"}>{ACTION_LABEL[rev.action] || rev.action}</Badge>
                  <span className="text-xs text-gray-500">v{rev.version}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {new Date(rev.createdAt).toLocaleString()} · {rev.by?.name || "Unknown"}
                  {rev.note ? ` · ${rev.note}` : ""}
                </p>
              </div>
              {rev.action !== "unpublish" && (
                <Btn size="sm" onClick={() => restore(rev)} disabled={!!editor.busy}>
                  Restore
                </Btn>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
