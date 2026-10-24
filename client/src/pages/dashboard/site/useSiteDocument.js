// Loads one CMS document (page/menu/settings) and manages local edits,
// saving, publishing and history. Edits stay local until save(), which sends
// the whole draft with the loaded `version` (409 if someone else saved).
import { useCallback, useEffect, useState } from "react";
import { cmsRequest } from "./cmsApi";

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

export default function useSiteDocument(kind, key) {
  const [doc, setDoc] = useState(null);
  const [data, setData] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(""); // "", "saving", "publishing", …
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);

  const path = `/site/documents/${kind}/${key}`;

  const accept = useCallback((next) => {
    setDoc(next);
    setData(clone(next.draft));
    setDirty(false);
    setConflict(false);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      accept(await cmsRequest("GET", path));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [path, accept]);

  useEffect(() => {
    load();
  }, [load]);

  // Warn before closing/reloading the tab with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // update(nextData) or update(prev => nextData)
  const update = useCallback((next) => {
    setData((prev) => (typeof next === "function" ? next(clone(prev)) : next));
    setDirty(true);
  }, []);

  const run = useCallback(
    async (label, fn) => {
      setBusy(label);
      setError("");
      try {
        return await fn();
      } catch (e) {
        if (e.status === 409) setConflict(true);
        setError(e.message);
        throw e;
      } finally {
        setBusy("");
      }
    },
    [],
  );

  const save = useCallback(
    (extra = {}) =>
      run("saving", async () => {
        const res = await cmsRequest("PUT", path, { version: doc.version, data, ...extra });
        accept(res.doc);
        return res.doc;
      }),
    [run, path, doc, data, accept],
  );

  const saveMeta = useCallback(
    (meta) =>
      run("saving", async () => {
        const res = await cmsRequest("PUT", path, { version: doc.version, ...meta });
        setDoc(res.doc); // keep local unsaved content edits
        return res.doc;
      }),
    [run, path, doc],
  );

  const publish = useCallback(
    () =>
      run("publishing", async () => {
        let current = doc;
        if (dirty) {
          const res = await cmsRequest("PUT", path, { version: doc.version, data });
          current = res.doc;
        }
        const res = await cmsRequest("POST", `${path}/publish`, { version: current.version });
        accept(res.doc);
        return res.doc;
      }),
    [run, path, doc, data, dirty, accept],
  );

  const unpublish = useCallback(
    () =>
      run("unpublishing", async () => {
        const res = await cmsRequest("POST", `${path}/unpublish`, {});
        setDoc(res.doc);
        return res.doc;
      }),
    [run, path],
  );

  const discard = useCallback(
    () =>
      run("discarding", async () => {
        const res = await cmsRequest("POST", `${path}/discard`, { version: doc.version });
        accept(res.doc);
        return res.doc;
      }),
    [run, path, doc, accept],
  );

  const restore = useCallback(
    (revisionId) =>
      run("restoring", async () => {
        const res = await cmsRequest("POST", `/site/revisions/${revisionId}/restore`, {
          version: doc.version,
        });
        accept(res.doc);
        return res.doc;
      }),
    [run, doc, accept],
  );

  return {
    doc,
    data,
    dirty,
    loading,
    busy,
    error,
    conflict,
    path,
    update,
    reload: load,
    save,
    saveMeta,
    publish,
    unpublish,
    discard,
    restore,
    clearError: () => setError(""),
  };
}
