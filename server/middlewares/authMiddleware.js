// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import Realtor from "../models/realtor.model.js";
import Admin from "../models/admin.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized. No token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // First try to find in Admins
    let user = await Admin.findById(decoded.id).select(
      "_id email firstName lastName",
    );

    if (user) {
      // ✅ Hardcode role — Admin model has no role field
      req.user = { ...user.toObject(), role: "admin" };
      return next();
    }

    // If not an admin, check Realtors
    user = await Realtor.findById(decoded.id).select(
      "_id email role firstName lastName",
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ message: "Authorization error" });
  }
};

export const protectAdmin = [protect, isAdmin];
