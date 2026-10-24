// controllers/cms/sitePublic.controller.js
// Public, read-only website content. Serves ONLY published data, cached in
// memory and via HTTP caching headers. A 404 here is normal: it tells the
// frontend "nothing published, keep your built-in content".
import SiteDocument from "../../models/cms/siteDocument.model.js";
import { KEY_PATTERN } from "../../utils/cms/siteValidation.js";
import { cacheGet, cacheSet } from "../../utils/cms/siteCache.js";

// Browsers/CDNs may reuse a response for 60s and serve it stale for a further
// 5 minutes while revalidating. Published edits appear within ~1 minute.
const PUBLIC_CACHE_HEADER = "public, max-age=60, stale-while-revalidate=300";

function sendPublic(res, body) {
  res.set("Cache-Control", PUBLIC_CACHE_HEADER);
  return res.json(body);
}

function shapePage(doc, data) {
  return {
    key: doc.key,
    path: doc.path,
    title: doc.title,
    seo: data?.seo || {},
    sections: Array.isArray(data?.sections) ? data.sections : [],
    version: doc.publishedVersion,
    updatedAt: doc.publishedAt,
  };
}

// GET /api/site/bootstrap
// Everything the site shell needs in one request: settings, all menus and
// the list of CMS-managed pages.
export async function bootstrap(req, res) {
  try {
    const cached = cacheGet("bootstrap");
    if (cached) return sendPublic(res, cached);

    const docs = await SiteDocument.find({ published: { $ne: null } })
      .select("kind key path title published publishedVersion publishedAt")
      .lean();

    const body = { settings: null, menus: {}, pages: [] };
    for (const d of docs) {
      if (d.kind === "settings" && d.key === "global") body.settings = d.published;
      else if (d.kind === "menu") body.menus[d.key] = d.published?.items || [];
      else if (d.kind === "page") {
        body.pages.push({ key: d.key, path: d.path, title: d.title, version: d.publishedVersion });
      }
    }
    return sendPublic(res, cacheSet("bootstrap", body));
  } catch (err) {
    console.error("[site] bootstrap error:", err);
    return res.status(500).json({ message: "Failed to load site content" });
  }
}

// GET /api/site/pages/:key
export async function getPublishedPage(req, res) {
  try {
    const key = String(req.params.key || "").toLowerCase();
    if (!KEY_PATTERN.test(key)) return res.status(404).json({ message: "Page not found" });

    const cacheKey = `page:${key}`;
    const cached = cacheGet(cacheKey);
    if (cached !== undefined) {
      return cached
        ? sendPublic(res, cached)
        : res.status(404).json({ message: "Page not found" });
    }

    const doc = await SiteDocument.findOne({ kind: "page", key, published: { $ne: null } })
      .select("key path title published publishedVersion publishedAt")
      .lean();
    if (!doc) {
      cacheSet(cacheKey, null); // cache the miss too
      return res.status(404).json({ message: "Page not found" });
    }
    return sendPublic(res, cacheSet(cacheKey, shapePage(doc, doc.published)));
  } catch (err) {
    console.error("[site] page error:", err);
    return res.status(500).json({ message: "Failed to load page" });
  }
}

// GET /api/site/menus/:key
export async function getPublishedMenu(req, res) {
  try {
    const key = String(req.params.key || "").toLowerCase();
    if (!KEY_PATTERN.test(key)) return res.status(404).json({ message: "Menu not found" });
    const doc = await SiteDocument.findOne({ kind: "menu", key, published: { $ne: null } })
      .select("published")
      .lean();
    if (!doc) return res.status(404).json({ message: "Menu not found" });
    return sendPublic(res, { key, items: doc.published?.items || [] });
  } catch (err) {
    console.error("[site] menu error:", err);
    return res.status(500).json({ message: "Failed to load menu" });
  }
}

// GET /api/site/preview/:kind/:key   (staff only — mounted behind auth)
// Returns the DRAFT so editors can see unpublished changes on the real site.
export async function previewDraft(req, res) {
  try {
    const kind = String(req.params.kind || "").toLowerCase();
    const key = String(req.params.key || "").toLowerCase();
    const doc = await SiteDocument.findOne({ kind, key }).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.set("Cache-Control", "no-store");
    if (kind === "page") {
      return res.json({ ...shapePage(doc, doc.draft), version: doc.version, preview: true });
    }
    return res.json({ key, kind, data: doc.draft, version: doc.version, preview: true });
  } catch (err) {
    console.error("[site] preview error:", err);
    return res.status(500).json({ message: "Failed to load preview" });
  }
}
