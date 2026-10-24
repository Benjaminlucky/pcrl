// Media library browser: upload, search, edit alt text, delete, and (in
// picker mode) choose a file. Used by the Media page and the MediaPicker.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaSearch, FaPlay, FaCopy, FaTrash } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { cmsRequest, uploadMediaFile, staffPermissions } from "./cmsApi";
import { Alert, Btn, Field, Panel, Select, Spinner, TextInput } from "./ui";

const ACCEPT = {
  image: "image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml",
  video: "video/mp4,video/webm",
};

const formatBytes = (b) =>
  b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

function Thumb({ media }) {
  if (media.resourceType === "video") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-gray-400">
        <FaPlay />
      </div>
    );
  }
  return <img src={media.url} alt={media.alt} loading="lazy" className="w-full h-full object-cover" />;
}

export default function MediaBrowser({ mode = "manage", accept, onPick }) {
  const { user } = useAuth();
  const { canPublish } = staffPermissions(user);
  const fileInput = useRef(null);

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState(accept || "");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ docs: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [uploads, setUploads] = useState([]); // [{id, name, progress, error}]
  const [dragging, setDragging] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "40" });
      if (query) qs.set("search", query);
      if (type) qs.set("type", type);
      setResult(await cmsRequest("GET", `/media?${qs}`));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, query, type]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (files) => {
    for (const file of Array.from(files)) {
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      setUploads((u) => [...u, { id, name: file.name, progress: 0 }]);
      try {
        const media = await uploadMediaFile(file, {}, (progress) =>
          setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress } : x))),
        );
        setUploads((u) => u.filter((x) => x.id !== id));
        setResult((r) => ({ ...r, docs: [media, ...r.docs], total: r.total + 1 }));
        setSelected(media);
      } catch (e) {
        setUploads((u) => u.map((x) => (x.id === id ? { ...x, error: e.message } : x)));
      }
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
  };

  const replaceDoc = (media) => {
    setResult((r) => ({ ...r, docs: r.docs.map((d) => (d._id === media._id ? media : d)) }));
    setSelected(media);
  };

  const removeDoc = (id) => {
    setResult((r) => ({ ...r, docs: r.docs.filter((d) => d._id !== id), total: r.total - 1 }));
    setSelected(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center">
          <form
            className="flex-1 min-w-[180px] relative"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(search.trim());
            }}
          >
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <TextInput
              className="pl-8"
              placeholder="Search by file name, alt text or tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          {!accept && (
            <Select
              className="!w-auto"
              value={type}
              onChange={(e) => {
                setPage(1);
                setType(e.target.value);
              }}
              options={[
                { value: "", label: "All files" },
                { value: "image", label: "Images" },
                { value: "video", label: "Videos" },
              ]}
            />
          )}
          <Btn variant="primary" onClick={() => fileInput.current?.click()}>
            <FaCloudUploadAlt /> Upload
          </Btn>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            accept={accept ? ACCEPT[accept] : `${ACCEPT.image},${ACCEPT.video}`}
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {uploads.length > 0 && (
          <div className="space-y-2">
            {uploads.map((u) => (
              <div key={u.id} className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2">
                <div className="flex justify-between gap-2">
                  <span className="truncate">{u.name}</span>
                  {u.error ? (
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={() => setUploads((x) => x.filter((y) => y.id !== u.id))}
                    >
                      dismiss
                    </button>
                  ) : (
                    <span>{u.progress}%</span>
                  )}
                </div>
                {u.error ? (
                  <p className="text-red-300 mt-1">{u.error}</p>
                ) : (
                  <div className="h-1 bg-white/10 rounded mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary-500 transition-all" style={{ width: `${u.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {error && <Alert>{error}</Alert>}

        {/* Grid / drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`rounded-xl border-2 border-dashed p-3 transition min-h-[240px] ${
            dragging ? "border-primary-500 bg-primary-500/5" : "border-white/10"
          }`}
        >
          {loading ? (
            <div className="py-16 flex justify-center">
              <Spinner />
            </div>
          ) : result.docs.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              <FaCloudUploadAlt className="mx-auto text-3xl mb-2" />
              {query ? "No files match your search." : "No files yet. Drag & drop files here or click Upload."}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {result.docs.map((m) => (
                <button
                  key={m._id}
                  type="button"
                  onClick={() => setSelected(m)}
                  onDoubleClick={() => mode === "pick" && onPick?.(m)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                    selected?._id === m._id ? "border-primary-500" : "border-transparent hover:border-white/30"
                  }`}
                  title={m.originalName}
                >
                  <Thumb media={m} />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-gray-200 px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition">
                    {m.originalName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {result.pages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Page {page} of {result.pages} · {result.total} files
            </span>
            <div className="flex gap-2">
              <Btn size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Btn>
              <Btn size="sm" disabled={page >= result.pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Btn>
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <MediaDetails
        key={selected?._id || "none"}
        media={selected}
        mode={mode}
        canDelete={canPublish}
        onPick={onPick}
        onUpdated={replaceDoc}
        onDeleted={removeDoc}
      />
    </div>
  );
}

function MediaDetails({ media, mode, canDelete, onPick, onUpdated, onDeleted }) {
  const [alt, setAlt] = useState(media?.alt || "");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState(null); // {color, text, usedIn?}

  if (!media) {
    return (
      <Panel className="p-5 text-sm text-gray-500 h-fit">
        Select a file to see its details{mode === "pick" ? " and use it" : ""}.
      </Panel>
    );
  }

  const saveAlt = async () => {
    setBusy("alt");
    setMsg(null);
    try {
      const res = await cmsRequest("PATCH", `/media/${media._id}`, { alt });
      onUpdated(res.media);
      setMsg({ color: "blue", text: "Alt text saved." });
    } catch (e) {
      setMsg({ color: "red", text: e.message });
    } finally {
      setBusy("");
    }
  };

  const remove = async (force = false) => {
    if (!force && !window.confirm("Delete this file permanently?")) return;
    setBusy("delete");
    setMsg(null);
    try {
      await cmsRequest("DELETE", `/media/${media._id}${force ? "?force=true" : ""}`);
      onDeleted(media._id);
    } catch (e) {
      const usedIn = e.body?.usedIn;
      setMsg(
        usedIn
          ? {
              color: "amber",
              text: "This file is still used on the website. Replace it there first — deleting it now would leave a broken image.",
              usedIn: usedIn.map((u) => u.replace(/^(page|menu|settings):/, "").replace(/-/g, " ")),
            }
          : { color: "red", text: e.message },
      );
    } finally {
      setBusy("");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(media.url);
      setMsg({ color: "blue", text: "URL copied." });
    } catch {
      setMsg({ color: "red", text: "Couldn't copy — select the URL and copy manually." });
    }
  };

  return (
    <Panel className="p-4 space-y-4 h-fit lg:sticky lg:top-4">
      <div className="rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
        {media.resourceType === "video" ? (
          <video src={media.url} controls className="max-h-full" />
        ) : (
          <img src={media.url} alt={media.alt} className="max-h-full object-contain" />
        )}
      </div>
      <div className="text-xs text-gray-400 space-y-0.5">
        <p className="text-gray-200 text-sm break-all">{media.originalName}</p>
        <p>
          {media.format?.toUpperCase()} · {formatBytes(media.bytes)}
          {media.width ? ` · ${media.width}×${media.height}` : ""}
        </p>
      </div>

      {mode === "pick" && (
        <Btn variant="primary" className="w-full" onClick={() => onPick?.(media)}>
          Use this {media.resourceType === "video" ? "video" : "image"}
        </Btn>
      )}

      {media.resourceType !== "video" && (
        <Field label="Alt text" hint="Describe the image for screen readers and Google.">
          <TextInput value={alt} onChange={(e) => setAlt(e.target.value)} />
          <Btn size="sm" className="mt-2" disabled={busy || alt === media.alt} onClick={saveAlt}>
            {busy === "alt" ? "Saving…" : "Save alt text"}
          </Btn>
        </Field>
      )}

      <Field label="URL">
        <div className="flex gap-2">
          <TextInput readOnly value={media.url} onFocus={(e) => e.target.select()} />
          <Btn size="sm" onClick={copy} title="Copy URL">
            <FaCopy />
          </Btn>
        </div>
      </Field>

      {msg && (
        <Alert
          color={msg.color}
          action={
            msg.usedIn && canDelete ? (
              <Btn size="sm" variant="danger" onClick={() => remove(true)}>
                Delete anyway
              </Btn>
            ) : null
          }
        >
          {msg.text}
          {msg.usedIn && <span className="block mt-1 text-xs">Used in: {msg.usedIn.join(", ")}</span>}
        </Alert>
      )}

      {canDelete && mode === "manage" && (
        <Btn variant="danger" size="sm" disabled={!!busy} onClick={() => remove(false)}>
          <FaTrash /> {busy === "delete" ? "Deleting…" : "Delete file"}
        </Btn>
      )}
    </Panel>
  );
}
