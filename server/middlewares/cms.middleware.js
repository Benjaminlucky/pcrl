// middlewares/cms.middleware.js
// CMS access is permission-based (see config/permissions.js). Every CMS
// route checks a specific permission via `requirePermission`.
export { requirePermission as can } from "./authMiddleware.js";

// Any authenticated staff member (must be in the Admin collection).
export const requireStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Staff access required." });
  }
  next();
};
