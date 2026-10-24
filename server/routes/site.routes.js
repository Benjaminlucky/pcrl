// routes/site.routes.js
// Public website content (published only, cached). Used by the Netlify site.
import express from "express";
import {
  bootstrap,
  getPublishedPage,
  getPublishedMenu,
} from "../controllers/cms/sitePublic.controller.js";

const router = express.Router();

router.get("/bootstrap", bootstrap);
router.get("/pages/:key", getPublishedPage);
router.get("/menus/:key", getPublishedMenu);

export default router;
