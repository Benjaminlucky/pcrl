// routes/realtor.routes.js (or wherever your router file lives)
import express from "express";
import { signup } from "../controllers/realtor.controller.js";
import { login } from "../controllers/auth.controller.js";
import { getDashboard } from "../controllers/realtorDashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { updateAvatar } from "../controllers/realtor.controller.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

// NEW import
import { getRealtors } from "../controllers/realtor.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", protect, getDashboard);

// GET /api/realtors?page=1&limit=10 (protected)
router.get("/", protect, getRealtors);

// NEW: update avatar (protected). Accepts form-data with key 'avatar'
router.put(
  "/avatar",
  protect,
  (req, res, next) =>
    uploadSingleImage(req, res, (err) => {
      if (err) {
        // multer error handling
        return res.status(400).json({ message: err.message || "Upload error" });
      }
      return next();
    }),
  updateAvatar
);

export default router;
