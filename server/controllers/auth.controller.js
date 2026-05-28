import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Realtor from "../models/realtor.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find realtor by email
    const realtor = await Realtor.findOne({ email });
    if (!realtor) {
      return res.status(404).json({ message: "Realtor not found." });
    }

    // Compare password using bcrypt directly
    const isMatch = await bcrypt.compare(password, realtor.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: realtor._id, role: realtor.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      realtor: {
        id: realtor._id,
        firstName: realtor.firstName,
        lastName: realtor.lastName,
        email: realtor.email,
        role: realtor.role,
        avatar: realtor.avatar,
        referralCode: realtor.referralCode,
        referralLink: realtor.referralLink,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------------------------------------------
// GET /api/auth/me  (protected)
// Verifies the JWT (via the `protect` middleware that runs before this) and
// returns the sanitized current user. This is the single source of truth the
// client uses to confirm a session is still valid — never trust localStorage.
// Works for both realtor and admin tokens (protect sets req.user + role).
// ---------------------------------------------------------------------------
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Admin: protect() already hydrated req.user from the Admin collection
    if (req.user.role === "admin") {
      return res.json({
        user: {
          id: req.user._id,
          email: req.user.email,
          firstName: req.user.firstName || null,
          lastName: req.user.lastName || null,
          role: "admin",
        },
      });
    }

    // Realtor: re-fetch fresh, sanitized data (never expose passwordHash)
    const realtor = await Realtor.findById(req.user._id)
      .select("-passwordHash")
      .populate("recruitedBy", "firstName lastName referralCode");

    if (!realtor) {
      return res.status(404).json({ message: "User not found" });
    }

    const r = realtor.toObject({ virtuals: true });

    return res.json({
      user: {
        id: r._id,
        firstName: r.firstName,
        lastName: r.lastName,
        name: `${r.firstName} ${r.lastName}`,
        email: r.email,
        role: r.role,
        avatar: r.avatar || null,
        referralCode: r.referralCode,
        referralLink: r.referralLink,
        recruitedBy: r.recruitedBy
          ? `${r.recruitedBy.firstName} ${r.recruitedBy.lastName}`
          : null,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
