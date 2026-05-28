// routes/adminRoutes.js
import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import {
  getBirthdayNotifications,
  getUpcomingBirthdays,
  loginAdmin,
  signupAdmin,
  runBirthdaysNow,
  getEmailLogs,
} from "../controllers/adminController.js";

const router = express.Router();

// Public auth
router.post("/login", loginAdmin);

// Admin signup gated behind an optional invite secret (Sprint 1).
router.post(
  "/signup",
  (req, res, next) => {
    const secret = process.env.ADMIN_SIGNUP_SECRET;
    if (secret && req.headers["x-admin-signup-secret"] !== secret) {
      return res.status(403).json({ message: "Admin signup is disabled." });
    }
    next();
  },
  signupAdmin,
);

// Admin-only (protected)
router.get("/upcoming-birthdays", protectAdmin, getUpcomingBirthdays);
router.get("/birthday-notifications", protectAdmin, getBirthdayNotifications);

// Sprint 2 — manual trigger + email audit log
router.post("/birthdays/run", protectAdmin, runBirthdaysNow);
router.get("/email-logs", protectAdmin, getEmailLogs);

export default router;
