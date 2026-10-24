// routes/cms.routes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  requireStaff,
  canEdit,
  canPublish,
  canDelete,
} from "../middlewares/cms.middleware.js";
import { uploadMediaFile } from "../middlewares/upload.middleware.js";
import {
  blog,
  events,
  team,
  testimonials,
} from "../controllers/cms/index.js";
import * as site from "../controllers/cms/site.controller.js";
import * as media from "../controllers/cms/media.controller.js";
import { previewDraft } from "../controllers/cms/sitePublic.controller.js";

const router = express.Router();

// All CMS routes require a logged-in staff member.
router.use(protect, requireStaff);

// Helper to wire a standard collection (with workflow) under a base path.
function mountCollection(base, ctrl, { scheduling = true } = {}) {
  // Read
  router.get(`${base}`, ...canEdit, ctrl.adminList);
  router.get(`${base}/:id`, ...canEdit, ctrl.adminGet);
  // Write (editors+)
  router.post(`${base}`, ...canEdit, ctrl.create);
  router.put(`${base}/:id`, ...canEdit, ctrl.update);
  // Workflow (publishers+)
  router.post(`${base}/:id/publish`, ...canPublish, ctrl.publish);
  router.post(`${base}/:id/unpublish`, ...canPublish, ctrl.unpublish);
  if (scheduling) {
    router.post(`${base}/:id/schedule`, ...canPublish, ctrl.schedule);
  }
  // Delete (admin only)
  router.delete(`${base}/:id`, ...canDelete, ctrl.remove);
}

mountCollection("/blog", blog);
mountCollection("/events", events);
mountCollection("/team", team, { scheduling: false });
mountCollection("/testimonials", testimonials, { scheduling: false });

// ---------------------------------------------------------------------------
// Website builder — pages, menus, global settings
// ---------------------------------------------------------------------------
const doc = "/site/documents/:kind/:key";

router.get("/site/documents", ...canEdit, site.listDocuments);
router.post("/site/documents", ...canEdit, site.createDocument);
router.get(doc, ...canEdit, site.getDocument);
router.put(doc, ...canEdit, site.saveDraft);
router.post(`${doc}/discard`, ...canEdit, site.discardDraft);
router.post(`${doc}/publish`, ...canPublish, site.publishDocument);
router.post(`${doc}/unpublish`, ...canPublish, site.unpublishDocument);
router.delete(doc, ...canDelete, site.deleteDocument);

// History
router.get(`${doc}/revisions`, ...canEdit, site.listRevisions);
router.get("/site/revisions/:revisionId", ...canEdit, site.getRevision);
router.post("/site/revisions/:revisionId/restore", ...canEdit, site.restoreRevision);

// Page sections (draft edits). "reorder" is registered before ":sectionId".
const sections = "/site/pages/:key/sections";
router.post(sections, ...canEdit, site.addSection);
router.post(`${sections}/reorder`, ...canEdit, site.reorderSections);
router.put(`${sections}/:sectionId`, ...canEdit, site.updateSection);
router.delete(`${sections}/:sectionId`, ...canEdit, site.removeSection);
router.post(`${sections}/:sectionId/duplicate`, ...canEdit, site.duplicateSection);

// Draft preview of a page/menu/settings as the public site would get it
router.get("/site/preview/:kind/:key", ...canEdit, previewDraft);

// ---------------------------------------------------------------------------
// Media library (Cloudinary)
// ---------------------------------------------------------------------------
router.get("/media", ...canEdit, media.listMedia);
router.post(
  "/media",
  ...canEdit,
  (req, res, next) =>
    uploadMediaFile(req, res, (err) => {
      if (err) {
        const message =
          err.code === "LIMIT_FILE_SIZE" ? "File too large (max 100MB)." : err.message || "Upload error";
        return res.status(400).json({ message });
      }
      return next();
    }),
  media.uploadMedia,
);
router.patch("/media/:id", ...canEdit, media.updateMedia);
router.delete("/media/:id", ...canPublish, media.deleteMedia);

export default router;
