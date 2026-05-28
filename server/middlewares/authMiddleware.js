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

    // Staff (Admin collection) first.
    const admin = await Admin.findById(decoded.id).select(
      "_id email firstName lastName role",
    );
    if (admin) {
      const obj = admin.toObject();
      req.user = {
        ...obj,
        id: obj._id,
        role: obj.role || "admin", // legacy admins without a role => "admin"
        userType: "admin",
      };
      return next();
    }

    // Otherwise a Realtor.
    const realtor = await Realtor.findById(decoded.id).select(
      "_id email role firstName lastName",
    );
    if (!realtor) {
      return res.status(401).json({ message: "User not found" });
    }
    const robj = realtor.toObject();
    req.user = {
      ...robj,
      id: robj._id,
      role: robj.role || "realtor",
      userType: "realtor",
    };
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Strict admin gate (role === "admin"). Editors/publishers do NOT pass here,
// so realtor PII / birthday routes stay admin-only.
export const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.user.userType !== "admin" || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

export const protectAdmin = [protect, isAdmin];
