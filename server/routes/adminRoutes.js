// routes/adminRoutes.js
import express from "express";
import { protect, requirePermission } from "../middlewares/authMiddleware.js";
import Admin from "../models/admin.js";
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

// Public admin signup is only for creating the very first account (or with
// the ADMIN_SIGNUP_SECRET header). Everyone else is added from the dashboard
// Team screen, which assigns a role. Previously, with no secret configured,
// anyone could create a full admin account here.
router.post(
  "/signup",
  async (req, res, next) => {
    try {
      const secret = process.env.ADMIN_SIGNUP_SECRET;
      if (secret && req.headers["x-admin-signup-secret"] === secret) return next();
      if (!(await Admin.exists({}))) return next(); // bootstrap first account
      return res.status(403).json({
        message: "Admin signup is closed. Ask an administrator to add you from the Team page.",
      });
    } catch (err) {
      return next(err);
    }
  },
  signupAdmin,
);

// Admin-only (protected)
router.get("/upcoming-birthdays", protect, requirePermission("birthdays.view"), getUpcomingBirthdays);
router.get("/birthday-notifications", protect, requirePermission("birthdays.view"), getBirthdayNotifications);

// Sprint 2 — manual trigger + email audit log
router.post("/birthdays/run", protect, requirePermission("birthdays.run"), runBirthdaysNow);
router.get("/email-logs", protect, requirePermission("emailLogs.view"), getEmailLogs);

export default router;
