// src/context/permissions.js
// Permission checks for the dashboard UI. The server is the real gatekeeper
// (every API route checks a permission); these only decide what to show.
//
// The signed-in user's `permissions` come from the server (/api/auth/me and
// staff login). Sessions saved before RBAC existed only have a `role`, so
// those fall back to what that role could do until /me refreshes them.

const LEGACY_ROLE_PERMISSIONS = {
  admin: ["*"],
  publisher: [
    "site.view",
    "site.edit",
    "site.publish",
    "media.upload",
    "media.delete",
    "blog.edit",
    "blog.publish",
    "events.edit",
    "events.publish",
  ],
  editor: ["site.view", "site.edit", "media.upload", "blog.edit", "events.edit"],
};

export function isStaff(user) {
  return user?.userType === "admin" || ["admin", "publisher", "editor"].includes(user?.role);
}

export function permissionsOf(user) {
  if (!isStaff(user)) return [];
  if (Array.isArray(user.permissions)) return user.permissions;
  return LEGACY_ROLE_PERMISSIONS[user.role] || [];
}

// True if the user holds ANY of the given permissions.
export function can(user, ...perms) {
  const mine = permissionsOf(user);
  if (mine.includes("*")) return true;
  return perms.some((p) => mine.includes(p));
}

// Where a staff member should land after signing in.
export function staffHome(user) {
  if (can(user, "realtors.view")) return "/dashboard";
  if (can(user, "site.view")) return "/dashboard/site";
  if (can(user, "blog.edit")) return "/dashboard/blog";
  if (can(user, "events.edit")) return "/dashboard/events";
  if (can(user, "media.upload")) return "/dashboard/media";
  if (can(user, "mailing.view")) return "/dashboard/mailing-list";
  if (can(user, "staff.view")) return "/dashboard/team";
  return null;
}
