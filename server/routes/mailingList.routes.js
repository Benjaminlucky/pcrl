// File: server/routes/mailingList.routes.js

import express from "express";

import { protectAdmin } from "../middlewares/authMiddleware.js";
import {
  deleteSubscriber,
  getAllSubscribers,
  subscribe,
} from "../controllers/mailingList.controller.js";

const router = express.Router();

// Public — subscribe
router.post("/subscribe", subscribe);

// Admin only
router.get("/subscribers", protectAdmin, getAllSubscribers);
router.delete("/subscribers/:id", protectAdmin, deleteSubscriber);

export default router;
