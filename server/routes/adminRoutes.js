// routes/adminRoutes.js
import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import {
  getBirthdayNotifications,
  getUpcomingBirthdays,
  loginAdmin,
  signupAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);

// FRONTEND BIRTHDAY LIST (FULL DETAILS)
router.get("/upcoming-birthdays", getUpcomingBirthdays);

// COUNT + FULL NOTIFICATIONS
router.get("/birthday-notifications", getBirthdayNotifications);

export default router;
