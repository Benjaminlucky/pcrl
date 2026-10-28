// File: server/routes/mailingList.routes.js

import express from "express";

import { protect, requirePermission } from "../middlewares/authMiddleware.js";
import {
  deleteSubscriber,
  getAllSubscribers,
  subscribe,
} from "../controllers/mailingList.controller.js";

const router = express.Router();

// Public — subscribe
router.post("/subscribe", subscribe);

// Staff with mailing-list permissions
router.get("/subscribers", protect, requirePermission("mailing.view"), getAllSubscribers);
router.delete("/subscribers/:id", protect, requirePermission("mailing.delete"), deleteSubscriber);

export default router;
