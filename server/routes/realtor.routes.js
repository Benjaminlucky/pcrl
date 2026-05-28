// routes/realtor.routes.js
import express from "express";
import {
  signup,
  getRealtors,
  getRealtorById,
  updateRealtor,
  deleteRealtor,
  updateAvatar,
} from "../controllers/realtor.controller.js";
import { login } from "../controllers/auth.controller.js";
import {
  getDashboard,
  getMyDownline,
  getMyNotifications,
  markNotificationsRead,
} from "../controllers/realtorDashboardController.js";
import { protect, protectAdmin } from "../middlewares/authMiddleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post("/signup", signup);
router.post("/login", login);

// ==========================================
// PROTECTED — REALTOR SELF-SERVICE (safe data only)
// ==========================================
router.get("/dashboard", protect, getDashboard);

// Logged-in realtor's own direct downline (safe fields only — no bank data)
router.get("/me/downline", protect, getMyDownline);

// Logged-in realtor's notification feed
router.get("/me/notifications", protect, getMyNotifications);
router.patch("/me/notifications/read", protect, markNotificationsRead);

// Avatar upload — MUST come before "/:id" to avoid param conflict
router.put(
  "/avatar",
  protect,
  (req, res, next) =>
    uploadSingleImage(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || "Upload error" });
      }
      return next();
    }),
  updateAvatar,
);

// ==========================================
// PROTECTED — ADMIN ONLY (returns sensitive fields: bank, account number)
// ==========================================
// FIX (Blocker 4): the frontend admin views call "/list". Keep BOTH "/" and
// "/list" pointing at the same admin-gated handler so existing callers work
// and the canonical "/" is also available.
router.get("/", protectAdmin, getRealtors);
router.get("/list", protectAdmin, getRealtors);

// Admin CRUD by id (these expose/modify sensitive data — admin only)
router.get("/:id", protectAdmin, getRealtorById);
router.put("/:id", protectAdmin, updateRealtor);
router.delete("/:id", protectAdmin, deleteRealtor);

export default router;
