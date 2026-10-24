// controllers/cms/site.controller.js
// Admin (staff) API for the website builder: pages, menus and global settings.
//
// Workflow:   edit draft  ──publish──▶  live          (publish = publisher+)
//                  ▲                      │
//                  └──── discard ─────────┘           (back to live copy)
//
// Every write that touches a draft requires the `version` the editor loaded.
// If someone else saved in between, the write is rejected with 409 instead of
// silently overwriting their work.
import SiteDocument, {
  SITE_DOCUMENT_KINDS,
} from "../../models/cms/siteDocument.model.js";
import SiteRevision from "../../models/cms/siteRevision.model.js";
import {
  ValidationError,
  KEY_PATTERN,
  normalizeDocumentData,
  normalizeSection,
  normalizePath,
} from "../../utils/cms/siteValidation.js";
import { clearSiteCache } from "../../utils/cms/siteCache.js";

const REVISIONS_KEPT = 100;

class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

function stamp(req) {
  const name =
    [req.user?.firstName, req.user?.lastName].filter(Boolean).join(" ") ||
    req.user?.email ||
    "Staff";
  return { id: String(req.user?.id || ""), name };
}

function handleError(res, err, label) {
  if (err instanceof ValidationError || err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ message: err.message, ...(err.extra || {}), details: err.details });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: "That kind/key already exists." });
  }
  console.error(`[site] ${label} error:`, err);
  return res.status(500).json({ message: `Failed to ${label}.` });
}

function parseKindKey(req) {
  const kind = String(req.params.kind || "").toLowerCase();
  const key = String(req.params.key || "").toLowerCase();
  if (!SITE_DOCUMENT_KINDS.includes(kind)) {
    throw new HttpError(400, `kind must be one of: ${SITE_DOCUMENT_KINDS.join(", ")}.`);
  }
  if (!KEY_PATTERN.test(key)) throw new HttpError(400, "Invalid key.");
  return { kind, key };
}

function requireVersion(body) {
  const v = Number(body?.version);
  if (!Number.isInteger(v) || v < 1) {
    throw new HttpError(
      400,
      "version is required — send the version you loaded so concurrent edits are detected.",
    );
  }
  return v;
}

function serialize(doc) {
  const o = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  o.hasUnpublishedChanges = o.publishedVersion !== o.version;
  o.isPublished = o.published !== null && o.published !== undefined;
  delete o.__v;
  return o;
}

async function assertPathFree(path, exceptKey = null) {
  if (!path) return;
  const filter = { kind: "page", path };
  if (exceptKey) filter.key = { $ne: exceptKey };
  if (await SiteDocument.exists(filter)) {
    throw new HttpError(409, `Another page already uses the address "${path}".`);
  }
}

async function findOr404(kind, key) {
  const doc = await SiteDocument.findOne({ kind, key });
  if (!doc) throw new HttpError(404, `${kind} "${key}" not found.`);
  return doc;
}

async function recordRevision(doc, action, req, data, note = "") {
  try {
    await SiteRevision.create({
      document: doc._id,
      kind: doc.kind,
      key: doc.key,
      version: doc.version,
      action,
      data,
      note,
      by: stamp(req),
    });
    // Prune old history (keep the newest REVISIONS_KEPT).
    const old = await SiteRevision.find({ document: doc._id })
      .sort({ createdAt: -1 })
      .skip(REVISIONS_KEPT)
      .select("_id")
      .lean();
    if (old.length) {
      await SiteRevision.deleteMany({ _id: { $in: old.map((r) => r._id) } });
    }
  } catch (err) {
    // History is best-effort; never fail the editor's save because of it.
    console.error("[site] revision write failed:", err?.message || err);
  }
}

// Atomically replace the draft iff the stored version still matches.
async function writeDraft(kind, key, expectedVersion, set, req) {
  const updated = await SiteDocument.findOneAndUpdate(
    { kind, key, version: expectedVersion },
    { $set: { ...set, updatedBy: stamp(req) }, $inc: { version: 1 } },
    { new: true },
  );
  if (updated) return updated;

  const current = await SiteDocument.findOne({ kind, key }).select("version").lean();
  if (!current) throw new HttpError(404, `${kind} "${key}" not found.`);
  throw new HttpError(
    409,
    "This content was changed by someone else since you loaded it. Reload to get the latest version.",
    { currentVersion: current.version },
  );
}

// ===========================================================================
// Documents
// ===========================================================================

// GET /api/cms/site/documents?kind=page
export async function listDocuments(req, res) {
  try {
    const filter = {};
    if (req.query.kind) filter.kind = String(req.query.kind);
    const docs = await SiteDocument.find(filter)
      .select("-draft -published")
      .sort({ kind: 1, key: 1 })
      .lean();
    return res.json({
      docs: docs.map((d) => ({
        ...d,
        hasUnpublishedChanges: d.publishedVersion !== d.version,
        isPublished: d.publishedVersion !== null,
      })),
      total: docs.length,
    });
  } catch (err) {
    return handleError(res, err, "load site documents");
  }
}

// GET /api/cms/site/documents/:kind/:key
export async function getDocument(req, res) {
  try {
    const { kind, key } = parseKindKey(req);
    const doc = await findOr404(kind, key);
    return res.json(serialize(doc));
  } catch (err) {
    return handleError(res, err, "load document");
  }
}

// POST /api/cms/site/documents  { kind, key, title, path, data }
export async function createDocument(req, res) {
  try {
    const kind = String(req.body?.kind || "").toLowerCase();
    const key = String(req.body?.key || "").trim().toLowerCase();
    if (!SITE_DOCUMENT_KINDS.includes(kind)) {
      throw new HttpError(400, `kind must be one of: ${SITE_DOCUMENT_KINDS.join(", ")}.`);
    }
    if (!KEY_PATTERN.test(key)) {
      throw new HttpError(400, 'key must be lowercase letters, numbers, "-" or "_" (e.g. "about-us").');
    }
    const draft = normalizeDocumentData(kind, req.body?.data ?? {});
    const path = kind === "page" ? normalizePath(req.body?.path) : "";
    await assertPathFree(path);

    const doc = await SiteDocument.create({
      kind,
      key,
      title: String(req.body?.title || key).slice(0, 200),
      path,
      draft,
      published: null,
      version: 1,
      publishedVersion: null,
      updatedBy: stamp(req),
    });
    await recordRevision(doc, "create", req, draft);
    return res.status(201).json({ message: `${kind} created`, doc: serialize(doc) });
  } catch (err) {
    return handleError(res, err, "create document");
  }
}

// PUT /api/cms/site/documents/:kind/:key  { version, data?, title?, path? }
export async function saveDraft(req, res) {
  try {
    const { kind, key } = parseKindKey(req);
    const version = requireVersion(req.body);
    const set = {};
    if (req.body.data !== undefined) set.draft = normalizeDocumentData(kind, req.body.data);
    if (req.body.title !== undefined) set.title = String(req.body.title).slice(0, 200);
    if (req.body.path !== undefined && kind === "page") {
      set.path = normalizePath(req.body.path);
      await assertPathFree(set.path, key);
    }
    if (!Object.keys(set).length) throw new HttpError(400, "Nothing to update.");

    const doc = await writeDraft(kind, key, version, set, req);
    if (set.draft) await recordRevision(doc, "save", req, doc.draft, req.body.note);
    // Title/path are not versioned content but they are public metadata.
    if (doc.published && (set.title || set.path !== undefined)) clearSiteCache();
    return res.json({ message: "Draft saved", doc: serialize(doc) });
  } catch (err) {
    return handleError(res, err, "save draft");
  }
}

// POST /api/cms/site/documents/:kind/:key/publish  { version? }
export async function publishDocument(req, res) {
  try {
    const { kind, key } = parseKindKey(req);
    const doc = await findOr404(kind, key);
    if (req.body?.version !== undefined && Number(req.body.version) !== doc.version) {
      throw new HttpError(
        409,
        "The draft changed since you reviewed it. Reload before publishing.",
        { currentVersion: doc.version },
      );
    }
    // Re-validate: rules may have tightened since the draft was saved.
    const data = normalizeDocumentData(kind, doc.draft ?? {});

    const updated = await SiteDocument.findOneAndUpdate(
      { _id: doc._id, version: doc.version },
      {
        $set: {
          published: data,
          publishedVersion: doc.version,
          publishedAt: new Date(),
          publishedBy: stamp(req),
        },
      },
      { new: true },
    );
    if (!updated) {
      throw new HttpError(409, "The draft changed while publishing. Please try again.");
    }
    clearSiteCache();
    await recordRevision(updated, "publish", req, data, req.body?.note);
    return res.json({ message: `${kind} published`, doc: serialize(updated) });
  } catch (err) {
    return handleError(res, err, "publish");
  }
}

// POST /api/cms/site/documents/:kind/:key/unpublish
// The public site falls back to its built-in content for this document.
export async function unpublishDocument(req, res) {
  try {
    const { kind, key } = parseKindKey(req);
    const doc = await findOr404(kind, key);
    const wasLive = doc.published;
    doc.published = null;
    doc.publishedVersion = null;
    doc.markModified("published");
    await doc.save();
    clearSiteCache();
    await recordRevision(doc, "unpublish", req, wasLive ?? {});
    return res.json({ message: `${kind} unpublished`, doc: serialize(doc) });
  } catch (err) {
    return handleError(res, err, "unpublish");
  }
}

// POST /api/cms/site/documents/:kind/:key/discard  { version }
// Throws away draft edits and goes back to what is live.
export async function discardDraft(req, res) {
  try {
    const { kind, key } = parseKindKey(req);
    const version = requireVersion(req.body);
    const existing = await findOr404(kind, key);
    if (!existing.published) {
      throw new HttpError(400, "Nothing is published yet, so there is nothing to revert to.");
    }
    const doc = await writeDraft(kind, key, version, { draft: existing.published }, req);
    // Draft now equals live again.
    doc.publishedVersion = doc.version;
    await doc.save();
    await recordRevision(doc, "discard", req, doc.draft);
    return res.json({ message: "Draft reverted to the published version", doc: serialize(doc) });
  } catch (err) {
    return handleError(res, err, "discard draft");
  }
}

// DELETE /api/cms/site/documents/:kind/:key   (admin only)
export async function deleteDocument(req, res) {
  try {
    const { kind, key } = parseKindKey(req);
    const doc = await SiteDocument.findOneAndDelete({ kind, key });
    if (!doc) throw new HttpError(404, `${kind} "${key}" not found.`);
    await SiteRevision.deleteMany({ document: doc._id });
    clearSiteCache();
    return res.json({ message: `${kind} deleted`, kind, key });
  } catch (err) {
    return handleError(res, err, "delete document");
  }
}

// ===========================================================================
// Revisions
// ===========================================================================

// GET /api/cms/site/documents/:kind/:key/revisions
export async function listRevisions(req, res) {
  try {
    const { kind, key } = parseKindKey(req);
    const doc = await findOr404(kind, key);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), REVISIONS_KEPT);
    const revisions = await SiteRevision.find({ document: doc._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-data")
      .lean();
    return res.json({ revisions });
  } catch (err) {
    return handleError(res, err, "load revisions");
  }
}

// GET /api/cms/site/revisions/:revisionId
export async function getRevision(req, res) {
  try {
    const rev = await SiteRevision.findById(req.params.revisionId).lean();
    if (!rev) throw new HttpError(404, "Revision not found.");
    return res.json(rev);
  } catch (err) {
    if (err?.name === "CastError") return res.status(404).json({ message: "Revision not found." });
    return handleError(res, err, "load revision");
  }
}

// POST /api/cms/site/revisions/:revisionId/restore  { version }
// Copies an old snapshot into the draft. Nothing goes live until published.
export async function restoreRevision(req, res) {
  try {
    const version = requireVersion(req.body);
    const rev = await SiteRevision.findById(req.params.revisionId).lean();
    if (!rev) throw new HttpError(404, "Revision not found.");
    const data = normalizeDocumentData(rev.kind, rev.data ?? {});
    const doc = await writeDraft(rev.kind, rev.key, version, { draft: data }, req);
    await recordRevision(doc, "restore", req, data, `Restored from v${rev.version}`);
    return res.json({ message: `Restored v${rev.version} into the draft`, doc: serialize(doc) });
  } catch (err) {
    if (err?.name === "CastError") return res.status(404).json({ message: "Revision not found." });
    return handleError(res, err, "restore revision");
  }
}

// ===========================================================================
// Page sections — convenience operations on a page draft. Each one is a full
// versioned draft save, so they get the same conflict protection + history.
// ===========================================================================

async function mutateSections(req, res, label, mutate) {
  try {
    const key = String(req.params.key || "").toLowerCase();
    if (!KEY_PATTERN.test(key)) throw new HttpError(400, "Invalid key.");
    const version = requireVersion(req.body);
    const doc = await findOr404("page", key);
    if (doc.version !== version) {
      throw new HttpError(
        409,
        "This page was changed by someone else since you loaded it. Reload to get the latest version.",
        { currentVersion: doc.version },
      );
    }

    const draft = doc.draft && typeof doc.draft === "object" ? doc.draft : {};
    const sections = Array.isArray(draft.sections) ? [...draft.sections] : [];
    const result = mutate(sections) || {};
    const data = normalizeDocumentData("page", { ...draft, sections });

    const updated = await writeDraft("page", key, version, { draft: data }, req);
    await recordRevision(updated, "save", req, data, label);
    return res.json({ message: label, doc: serialize(updated), ...result });
  } catch (err) {
    return handleError(res, err, label.toLowerCase());
  }
}

const indexOfSection = (sections, id) => {
  const i = sections.findIndex((s) => s.id === id);
  if (i === -1) throw new HttpError(404, `Section "${id}" not found.`);
  return i;
};

// POST /api/cms/site/pages/:key/sections  { version, section, index? }
export const addSection = (req, res) =>
  mutateSections(req, res, "Section added", (sections) => {
    const section = normalizeSection(req.body?.section);
    if (sections.some((s) => s.id === section.id)) {
      throw new HttpError(409, `A section with id "${section.id}" already exists.`);
    }
    const idx = Number.isInteger(req.body?.index)
      ? Math.min(Math.max(req.body.index, 0), sections.length)
      : sections.length;
    sections.splice(idx, 0, section);
    return { section };
  });

// PUT /api/cms/site/pages/:key/sections/:sectionId
//   { version, label?, type?, visible?, content?, style?, mergeContent? }
// `content` replaces the section content unless mergeContent is true, in
// which case it is deep-merged (arrays are replaced, objects merged).
export const updateSection = (req, res) =>
  mutateSections(req, res, "Section updated", (sections) => {
    const i = indexOfSection(sections, req.params.sectionId);
    const current = sections[i];
    const body = req.body || {};
    const next = { ...current };
    for (const f of ["label", "type", "visible", "style"]) {
      if (body[f] !== undefined) next[f] = body[f];
    }
    if (body.content !== undefined) {
      next.content = body.mergeContent
        ? deepMerge(current.content || {}, body.content || {})
        : body.content;
    }
    sections[i] = normalizeSection(next, `sections[${i}]`);
    return { section: sections[i] };
  });

// DELETE /api/cms/site/pages/:key/sections/:sectionId   { version }
export const removeSection = (req, res) =>
  mutateSections(req, res, "Section removed", (sections) => {
    const i = indexOfSection(sections, req.params.sectionId);
    const [removed] = sections.splice(i, 1);
    return { removed: removed.id };
  });

// POST /api/cms/site/pages/:key/sections/reorder  { version, order: [ids] }
export const reorderSections = (req, res) =>
  mutateSections(req, res, "Sections reordered", (sections) => {
    const order = req.body?.order;
    if (!Array.isArray(order)) throw new HttpError(400, "order must be an array of section ids.");
    const ids = sections.map((s) => s.id);
    const same =
      order.length === ids.length &&
      new Set(order).size === order.length &&
      order.every((id) => ids.includes(id));
    if (!same) {
      throw new HttpError(400, "order must contain every existing section id exactly once.", {
        expected: ids,
      });
    }
    const byId = new Map(sections.map((s) => [s.id, s]));
    sections.splice(0, sections.length, ...order.map((id) => byId.get(id)));
    return { order };
  });

// POST /api/cms/site/pages/:key/sections/:sectionId/duplicate  { version, newId? }
export const duplicateSection = (req, res) =>
  mutateSections(req, res, "Section duplicated", (sections) => {
    const i = indexOfSection(sections, req.params.sectionId);
    const src = sections[i];
    let newId = req.body?.newId ? String(req.body.newId) : `${src.id}-copy`;
    let n = 2;
    const base = newId;
    while (sections.some((s) => s.id === newId)) newId = `${base}-${n++}`;
    const copy = normalizeSection(
      { ...structuredClone(src), id: newId, label: src.label ? `${src.label} (copy)` : "" },
      `sections[${i + 1}]`,
    );
    sections.splice(i + 1, 0, copy);
    return { section: copy };
  });

function deepMerge(base, patch) {
  if (Array.isArray(patch) || patch === null || typeof patch !== "object") return patch;
  const out = { ...(base && typeof base === "object" && !Array.isArray(base) ? base : {}) };
  for (const [k, v] of Object.entries(patch)) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    out[k] = deepMerge(out[k], v);
  }
  return out;
}
