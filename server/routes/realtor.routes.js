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
import { getDashboard } from "../controllers/realtorDashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (No auth required)
// ==========================================
router.post("/signup", signup);
router.post("/login", login);

// ==========================================
// PROTECTED ROUTES (Auth required)
// ==========================================

// Dashboard
router.get("/dashboard", protect, getDashboard);

// Avatar upload - MUST come before /:id to avoid conflict
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
  updateAvatar
);

// List all realtors - MUST come before /:id
router.get("/list", protect, getRealtors);

// CRUD operations with ID parameter
router.get("/:id", protect, getRealtorById);
router.put("/:id", protect, updateRealtor);
router.delete("/:id", protect, deleteRealtor);

export default router;
