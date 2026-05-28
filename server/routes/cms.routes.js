// routes/cms.routes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  requireStaff,
  canEdit,
  canPublish,
  canDelete,
} from "../middlewares/cms.middleware.js";
import {
  blog,
  events,
  pages,
  team,
  testimonials,
} from "../controllers/cms/index.js";

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
mountCollection("/pages", pages);

export default router;
