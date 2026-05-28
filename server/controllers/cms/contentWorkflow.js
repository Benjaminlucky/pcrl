// utils/cms/contentWorkflow.js

// URL-safe slug from a title.
export function slugify(input = "") {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

// Ensures a slug is unique within a collection, appending -2, -3, … if needed.
// `excludeId` lets an update keep its own slug.
export async function uniqueSlug(Model, base, excludeId = null) {
  let slug = slugify(base) || "item";
  let candidate = slug;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return candidate;
    candidate = `${slug}-${n}`;
    n += 1;
  }
}

// Mongo filter for content that should be PUBLICLY visible right now.
// - published items whose publishedAt has passed
// - scheduled items whose scheduledFor has passed (covers the gap before the
//   scheduler cron flips them — so scheduling is correct even without it)
export function publicMatch({ hasScheduling = true } = {}) {
  const now = new Date();
  if (!hasScheduling) {
    return { status: "published" };
  }
  return {
    $or: [
      { status: "published", publishedAt: { $lte: now } },
      { status: "scheduled", scheduledFor: { $lte: now } },
    ],
  };
}

// Normalizes a value to a Date or null.
export function toDateOrNull(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
