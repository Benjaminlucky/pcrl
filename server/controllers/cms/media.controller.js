// controllers/cms/media.controller.js
// Media library: upload images/videos to Cloudinary and keep a searchable
// index so editors can reuse them across pages.
import fs from "fs/promises";
import cloudinary from "../../utils/cloudinary.config.js";
import Media from "../../models/cms/media.model.js";
import SiteDocument from "../../models/cms/siteDocument.model.js";
import {
  MEDIA_MAX_IMAGE_BYTES,
  MEDIA_MAX_VIDEO_BYTES,
} from "../../middlewares/upload.middleware.js";

const FOLDER = process.env.CLOUDINARY_MEDIA_FOLDER || "pcrg/site";

function stamp(req) {
  const name =
    [req.user?.firstName, req.user?.lastName].filter(Boolean).join(" ") ||
    req.user?.email ||
    "Staff";
  return { id: String(req.user?.id || ""), name };
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/cms/media?search=&type=image|video&page=&limit=
export async function listMedia(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 40, 1), 100);
    const filter = {};
    if (req.query.type) filter.resourceType = String(req.query.type);
    const search = String(req.query.search || "").trim();
    if (search) {
      const rx = { $regex: escapeRegex(search), $options: "i" };
      filter.$or = [{ originalName: rx }, { alt: rx }, { tags: rx }];
    }
    const [total, docs] = await Promise.all([
      Media.countDocuments(filter),
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);
    return res.json({ docs, total, page, pages: Math.max(Math.ceil(total / limit), 1), limit });
  } catch (err) {
    console.error("[media] list error:", err);
    return res.status(500).json({ message: "Failed to load media" });
  }
}

// POST /api/cms/media   multipart: file, alt?, tags? (comma separated)
export async function uploadMedia(req, res) {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file received (field name must be "file").' });

  try {
    const isVideo = file.mimetype.startsWith("video/");
    const max = isVideo ? MEDIA_MAX_VIDEO_BYTES : MEDIA_MAX_IMAGE_BYTES;
    if (file.size > max) {
      return res
        .status(400)
        .json({ message: `File too large. Max ${Math.round(max / 1024 / 1024)}MB for ${isVideo ? "videos" : "images"}.` });
    }

    const options = {
      folder: FOLDER,
      resource_type: isVideo ? "video" : "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };
    // upload_large chunks big videos so a slow link doesn't time out.
    const result =
      isVideo && file.size > 20 * 1024 * 1024
        ? await new Promise((resolve, reject) =>
            cloudinary.uploader.upload_large(
              file.path,
              { ...options, chunk_size: 6_000_000 },
              (err, out) => (err ? reject(err) : resolve(out)),
            ),
          )
        : await cloudinary.uploader.upload(file.path, options);

    const tags = String(req.body?.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20);

    const doc = await Media.create({
      publicId: result.public_id,
      resourceType: result.resource_type,
      url: result.secure_url,
      format: result.format || "",
      width: result.width ?? null,
      height: result.height ?? null,
      bytes: result.bytes ?? file.size,
      originalName: file.originalname.slice(0, 200),
      alt: String(req.body?.alt || "").slice(0, 300),
      folder: FOLDER,
      tags,
      uploadedBy: stamp(req),
    });
    return res.status(201).json({ message: "Uploaded", media: doc });
  } catch (err) {
    console.error("[media] upload error:", err);
    return res.status(502).json({ message: "Upload to media storage failed. Please try again." });
  } finally {
    fs.unlink(file.path).catch(() => {});
  }
}

// PATCH /api/cms/media/:id   { alt?, tags? }
export async function updateMedia(req, res) {
  try {
    const set = {};
    if (req.body?.alt !== undefined) set.alt = String(req.body.alt).slice(0, 300);
    if (Array.isArray(req.body?.tags)) {
      set.tags = req.body.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 20);
    }
    const doc = await Media.findByIdAndUpdate(req.params.id, { $set: set }, { new: true });
    if (!doc) return res.status(404).json({ message: "Media not found" });
    return res.json({ message: "Media updated", media: doc });
  } catch (err) {
    if (err?.name === "CastError") return res.status(404).json({ message: "Media not found" });
    console.error("[media] update error:", err);
    return res.status(500).json({ message: "Failed to update media" });
  }
}

// DELETE /api/cms/media/:id[?force=true]
// Refuses to delete a file that live or draft content still points to, so a
// cleanup in the media library can't leave broken images on the site.
export async function deleteMedia(req, res) {
  try {
    const doc = await Media.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Media not found" });

    if (req.query.force !== "true") {
      const docs = await SiteDocument.find({}).select("kind key draft published").lean();
      const usedIn = docs
        .filter((d) => JSON.stringify([d.draft, d.published]).includes(doc.url))
        .map((d) => `${d.kind}:${d.key}`);
      if (usedIn.length) {
        return res.status(409).json({
          message: "This file is still used on the site. Remove it from these first, or delete with ?force=true.",
          usedIn,
        });
      }
    }

    try {
      await cloudinary.uploader.destroy(doc.publicId, { resource_type: doc.resourceType });
    } catch (err) {
      console.error("[media] cloudinary destroy failed:", err?.message || err);
      return res.status(502).json({ message: "Could not delete the file from media storage." });
    }
    await doc.deleteOne();
    return res.json({ message: "Media deleted", id: req.params.id });
  } catch (err) {
    if (err?.name === "CastError") return res.status(404).json({ message: "Media not found" });
    console.error("[media] delete error:", err);
    return res.status(500).json({ message: "Failed to delete media" });
  }
}
