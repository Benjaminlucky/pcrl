// routes/cms.routes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { requireStaff, can } from "../middlewares/cms.middleware.js";
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
// `p` names the permissions: { view, edit, publish, remove }.
function mountCollection(base, ctrl, p, { scheduling = true } = {}) {
  router.get(`${base}`, can(p.view), ctrl.adminList);
  router.get(`${base}/:id`, can(p.view), ctrl.adminGet);
  router.post(`${base}`, can(p.edit), ctrl.create);
  router.put(`${base}/:id`, can(p.edit), ctrl.update);
  router.post(`${base}/:id/publish`, can(p.publish), ctrl.publish);
  router.post(`${base}/:id/unpublish`, can(p.publish), ctrl.unpublish);
  if (scheduling) {
    router.post(`${base}/:id/schedule`, can(p.publish), ctrl.schedule);
  }
  router.delete(`${base}/:id`, can(p.remove), ctrl.remove);
}

const perms = (area) => ({
  view: `${area}.edit`,
  edit: `${area}.edit`,
  publish: `${area}.publish`,
  remove: `${area}.delete`,
});
const sitePerms = { view: "site.view", edit: "site.edit", publish: "site.publish", remove: "site.delete" };

mountCollection("/blog", blog, perms("blog"));
mountCollection("/events", events, perms("events"));
mountCollection("/team", team, sitePerms, { scheduling: false });
mountCollection("/testimonials", testimonials, sitePerms, { scheduling: false });

// ---------------------------------------------------------------------------
// Website builder — pages, menus, global settings
// ---------------------------------------------------------------------------
const doc = "/site/documents/:kind/:key";

router.get("/site/documents", can("site.view"), site.listDocuments);
router.post("/site/documents", can("site.edit"), site.createDocument);
router.get(doc, can("site.view"), site.getDocument);
router.put(doc, can("site.edit"), site.saveDraft);
router.post(`${doc}/discard`, can("site.edit"), site.discardDraft);
router.post(`${doc}/publish`, can("site.publish"), site.publishDocument);
router.post(`${doc}/unpublish`, can("site.publish"), site.unpublishDocument);
router.delete(doc, can("site.delete"), site.deleteDocument);

// History
router.get(`${doc}/revisions`, can("site.view"), site.listRevisions);
router.get("/site/revisions/:revisionId", can("site.view"), site.getRevision);
router.post("/site/revisions/:revisionId/restore", can("site.edit"), site.restoreRevision);

// Page sections (draft edits). "reorder" is registered before ":sectionId".
const sections = "/site/pages/:key/sections";
router.post(sections, can("site.edit"), site.addSection);
router.post(`${sections}/reorder`, can("site.edit"), site.reorderSections);
router.put(`${sections}/:sectionId`, can("site.edit"), site.updateSection);
router.delete(`${sections}/:sectionId`, can("site.edit"), site.removeSection);
router.post(`${sections}/:sectionId/duplicate`, can("site.edit"), site.duplicateSection);

// Draft preview of a page/menu/settings as the public site would get it
router.get("/site/preview/:kind/:key", can("site.view"), previewDraft);

// ---------------------------------------------------------------------------
// Media library (Cloudinary)
// ---------------------------------------------------------------------------
router.get("/media", can("media.upload"), media.listMedia);
router.post(
  "/media",
  can("media.upload"),
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
router.patch("/media/:id", can("media.upload"), media.updateMedia);
router.delete("/media/:id", can("media.delete"), media.deleteMedia);

export default router;
