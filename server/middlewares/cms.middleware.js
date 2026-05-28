// middlewares/cms.middleware.js
// Editorial roles for CMS access. All staff live in the Admin collection with
// a `role`: "admin" | "publisher" | "editor".
//
//   editor    → create/edit drafts, list, read
//   publisher → all of the above + publish/unpublish/schedule
//   admin     → everything, including delete
//
// "admin" is implicitly allowed everywhere.

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

// Role gate. Admins always pass. Usage: requireRole("publisher")
export const requireRole =
  (...allowed) =>
  (req, res, next) => {
    if (!req.user || req.user.userType !== "admin") {
      return res.status(403).json({ message: "Staff access required." });
    }
    const role = req.user.role || "admin";
    if (role === "admin" || allowed.includes(role)) {
      return next();
    }
    return res.status(403).json({
      message: `Insufficient permissions. Requires: ${allowed.join(" or ")}.`,
    });
  };

// Convenience chains
export const canEdit = [requireStaff, requireRole("editor", "publisher")];
export const canPublish = [requireStaff, requireRole("publisher")];
export const canDelete = [requireStaff, requireRole()]; // admin only
