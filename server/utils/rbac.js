// utils/rbac.js
// Role → permission resolution, plus helpers shared by the middleware and
// the team/role management API.
import Role from "../models/role.model.js";
import Admin from "../models/admin.js";
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  WILDCARD,
  isKnownPermission,
} from "../config/permissions.js";

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map(); // roleKey -> { perms: string[], role, expires }

export function clearRoleCache() {
  cache.clear();
}

// Expands "*" and drops unknown keys.
export function expandPermissions(perms = []) {
  if (perms.includes(WILDCARD)) return [...ALL_PERMISSIONS];
  return [...new Set(perms.filter(isKnownPermission))];
}

// → { perms: string[], role: { key, name } | null }
// Built-in roles always resolve, even before they exist in the database, so
// existing accounts keep working the moment this code is deployed.
export async function resolveRole(roleKey) {
  const key = String(roleKey || "admin").toLowerCase();
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit;

  let doc = null;
  try {
    doc = await Role.findOne({ key }).lean();
  } catch (err) {
    console.error("[rbac] role lookup failed:", err?.message || err);
  }
  const fallback = SYSTEM_ROLES[key];
  let entry;
  if (doc) {
    entry = {
      perms: expandPermissions(doc.locked ? fallback?.permissions || doc.permissions : doc.permissions),
      role: { key: doc.key, name: doc.name },
    };
  } else if (fallback) {
    entry = { perms: expandPermissions(fallback.permissions), role: { key, name: fallback.name } };
  } else {
    entry = { perms: [], role: null }; // unknown/deleted role → no access
  }
  entry.expires = Date.now() + CACHE_TTL_MS;
  cache.set(key, entry);
  return entry;
}

export const hasPermission = (user, perm) =>
  Array.isArray(user?.permissions) && user.permissions.includes(perm);

// True when `perms` contains every permission (i.e. an administrator).
export const isFullAccess = (perms = []) => ALL_PERMISSIONS.every((p) => perms.includes(p));

// Creates the built-in roles if missing. Never overwrites edits made to
// publisher/editor; keeps the locked admin role at full access.
// Several app processes can start at once (e.g. Passenger), so this relies on
// the unique index on `key` plus atomic upserts rather than find-then-create.
export async function ensureSystemRoles() {
  await Role.init(); // make sure the unique index exists before inserting
  for (const [key, def] of Object.entries(SYSTEM_ROLES)) {
    const update = def.locked
      ? {
          $set: { permissions: def.permissions, system: true, locked: true },
          $setOnInsert: { name: def.name, description: def.description },
        }
      : { $setOnInsert: { ...def, system: true } };
    try {
      await Role.updateOne({ key }, update, { upsert: true });
    } catch (err) {
      if (err?.code !== 11000) throw err; // another process created it first
    }
  }
  clearRoleCache();
}

// Number of active accounts that would still have full access, excluding
// `exceptId` (used to stop the last administrator being removed/demoted).
export async function countOtherActiveAdmins(exceptId) {
  const staff = await Admin.find({ _id: { $ne: exceptId }, isActive: { $ne: false } })
    .select("role")
    .lean();
  let count = 0;
  for (const s of staff) {
    const { perms } = await resolveRole(s.role || "admin");
    if (isFullAccess(perms)) count += 1;
  }
  return count;
}
