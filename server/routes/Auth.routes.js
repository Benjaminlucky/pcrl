// routes/auth.routes.js
import express from "express";
import { login, getMe } from "../controllers/auth.controller.js";
import {
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/passwordReset.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.post("/login", login);

// Password reset (public) — works for both realtors and admins via `type`.
// NOTE: add rate limiting to these in Sprint 5 (e.g. express-rate-limit) to
// prevent abuse of the email-sending endpoint.
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/verify", verifyResetToken);
router.post("/reset-password", resetPassword);

// Protected — returns the verified current user (realtor or admin)
router.get("/me", protect, getMe);

export default router;
