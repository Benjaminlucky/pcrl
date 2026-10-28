// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import Realtor from "../models/realtor.model.js";
import Admin from "../models/admin.js";
import { resolveRole, isFullAccess } from "../utils/rbac.js";

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

    // Staff (Admin collection) first. Permissions are resolved on every
    // request, so role changes and deactivation take effect immediately.
    const admin = await Admin.findById(decoded.id).select(
      "_id email firstName lastName role isActive",
    );
    if (admin) {
      if (admin.isActive === false) {
        return res
          .status(401)
          .json({ message: "This account has been deactivated. Contact an administrator." });
      }
      const obj = admin.toObject();
      const roleKey = obj.role || "admin"; // legacy admins without a role => "admin"
      const { perms, role } = await resolveRole(roleKey);
      req.user = {
        ...obj,
        id: obj._id,
        role: roleKey,
        roleName: role?.name || roleKey,
        permissions: perms,
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
      permissions: [],
      userType: "realtor",
    };
    next();
  } catch (error) {
    console.error("Auth error:", error?.message || error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Staff only, and holding at least one of `perms`.
// Usage: router.get("/x", protect, requirePermission("realtors.view"), handler)
export const requirePermission =
  (...perms) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Staff access required." });
    }
    if (perms.some((p) => req.user.permissions?.includes(p))) return next();
    return res.status(403).json({
      message: "You don't have permission to do this.",
      required: perms,
    });
  };

// Full-access staff only (every permission). Kept for compatibility.
export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.userType !== "admin" || !isFullAccess(req.user.permissions)) {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
};

export const protectAdmin = [protect, isAdmin];
