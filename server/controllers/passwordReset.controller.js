// controllers/passwordReset.controller.js
import crypto from "crypto";
import bcrypt from "bcrypt"; // realtor hashing (matches signup: 12 rounds)
import Realtor from "../models/realtor.model.js";
import Admin from "../models/admin.js";
import { sendPasswordResetEmail } from "../utils/passwordResetEmail.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://pcrginitiative.com";
const TOKEN_TTL_MINUTES = 60; // 1 hour, single-use
const GENERIC_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

// Only these two user types are valid. Default to realtor.
function normalizeType(type) {
  return type === "admin" ? "admin" : "realtor";
}

// Raw token goes in the email link; only its SHA-256 hash is stored in the DB.
function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// ---------------------------------------------------------------------------
// POST /api/auth/forgot-password
// Body: { email, type? }  type ∈ {"realtor","admin"} (default "realtor")
// Always responds 200 with a generic message (prevents account enumeration).
// ---------------------------------------------------------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const type = normalizeType(req.body.type);

    if (!email || typeof email !== "string") {
      // Even for a bad request we keep the message generic.
      return res.status(200).json({ message: GENERIC_MESSAGE });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Look up the right collection. Admin emails may not be lowercased on
    // record, so match case-insensitively for admins.
    let account = null;
    if (type === "realtor") {
      account = await Realtor.findOne({ email: normalizedEmail });
    } else {
      account = await Admin.findOne({
        email: { $regex: `^${escapeRegex(email.trim())}$`, $options: "i" },
      });
    }

    if (account) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      account.resetPasswordToken = hashToken(rawToken);
      account.resetPasswordExpires = new Date(
        Date.now() + TOKEN_TTL_MINUTES * 60 * 1000,
      );
      // Saving does NOT modify the password, so the admin pre-save hook is
      // skipped and the existing hash is preserved.
      await account.save();

      const resetUrl = `${FRONTEND_URL}/reset-password?token=${rawToken}&type=${type}`;

      // Fire-and-forget; never reveal success/failure of delivery to caller.
      sendPasswordResetEmail(
        { email: account.email, firstName: account.firstName },
        { resetUrl, expiresMinutes: TOKEN_TTL_MINUTES },
      ).catch((e) => console.error("Reset email error:", e?.message || e));
    }

    return res.status(200).json({ message: GENERIC_MESSAGE });
  } catch (err) {
    console.error("forgotPassword error:", err);
    // Still generic — don't leak internal state.
    return res.status(200).json({ message: GENERIC_MESSAGE });
  }
};

// ---------------------------------------------------------------------------
// GET /api/auth/reset-password/verify?token=...&type=...
// Lets the reset page show a friendly "expired/invalid" state on load.
// ---------------------------------------------------------------------------
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;
    const type = normalizeType(req.query.type);
    if (!token) return res.status(400).json({ valid: false });

    const Model = type === "admin" ? Admin : Realtor;
    const account = await Model.findOne({
      resetPasswordToken: hashToken(String(token)),
      resetPasswordExpires: { $gt: new Date() },
    }).select("_id");

    return res.json({ valid: !!account });
  } catch (err) {
    console.error("verifyResetToken error:", err);
    return res.status(400).json({ valid: false });
  }
};

// ---------------------------------------------------------------------------
// POST /api/auth/reset-password
// Body: { token, password, type? }
// ---------------------------------------------------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const type = normalizeType(req.body.type);

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and new password are required." });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
        field: "password",
      });
    }

    const Model = type === "admin" ? Admin : Realtor;

    // Must explicitly select the hidden reset fields.
    const account = await Model.findOne({
      resetPasswordToken: hashToken(String(token)),
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!account) {
      return res.status(400).json({
        message:
          "This reset link is invalid or has expired. Please request a new one.",
        code: "INVALID_TOKEN",
      });
    }

    if (type === "admin") {
      // Setting plain password triggers the model's pre-save hook (bcryptjs).
      account.password = password;
    } else {
      // Realtor has no hook — hash here exactly as signup does (bcrypt, 12).
      account.passwordHash = await bcrypt.hash(password, 12);
    }

    // Invalidate the token (single-use).
    account.resetPasswordToken = null;
    account.resetPasswordExpires = null;
    await account.save();

    return res.json({
      message:
        "Your password has been reset. You can now log in with your new password.",
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// Escapes user input before using it in a RegExp (admin email lookup).
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
