// routes/content.routes.js
// Public, read-only content API. No auth. Returns only live content.
import express from "express";
import {
  blog,
  events,
  team,
  testimonials,
  pages,
} from "../controllers/cms/index.js";

const router = express.Router();

// Blog
router.get("/blog", blog.publicList);
router.get("/blog/:slug", blog.publicGetBySlug);

// Events
router.get("/events", events.publicList);
router.get("/events/:slug", events.publicGetBySlug);

// Team
router.get("/team", team.publicList);

// Testimonials
router.get("/testimonials", testimonials.publicList);

// Pages (by key)
router.get("/pages/:key", pages.publicGetByKey);

export default router;
