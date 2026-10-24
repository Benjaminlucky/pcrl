// utils/cms/siteValidation.js
// Validation + sanitizing for SiteDocument payloads. Section `content` is
// free-form JSON (text, images, lists, buttons …) so the frontend can grow
// without migrations. That freedom is why everything is cleaned here first:
//   - keys starting with "$" or containing "." (Mongo operator injection)
//   - prototype-pollution keys
//   - script-capable URL schemes in any string ("javascript:", …)
//   - runaway nesting / array sizes / total payload size

export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
    this.details = details;
  }
}

const MAX_DEPTH = 20;
const MAX_ARRAY = 500;
const MAX_STRING = 50_000;
export const MAX_DOCUMENT_BYTES = 1_000_000; // ~1MB of JSON per document

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const DANGEROUS_URL = /^\s*(?:javascript|vbscript)\s*:|^\s*data\s*:\s*text\/html/i;

export const KEY_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const SECTION_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;
const SECTION_TYPE_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
const MENU_VARIANTS = ["link", "primary", "outline"];

const isPlainObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

// Deep-clones `value` keeping only JSON-safe, sanitized data.
export function sanitizeJson(value, path = "data", depth = 0) {
  if (depth > MAX_DEPTH) {
    throw new ValidationError(`${path} is nested too deeply.`);
  }
  if (value === null || value === undefined) return null;

  switch (typeof value) {
    case "string":
      if (value.length > MAX_STRING) {
        throw new ValidationError(`${path} is too long.`);
      }
      if (DANGEROUS_URL.test(value)) {
        throw new ValidationError(`${path} contains a disallowed URL scheme.`);
      }
      return value;
    case "number":
      return Number.isFinite(value) ? value : null;
    case "boolean":
      return value;
    case "object":
      break;
    default:
      return null; // functions, symbols, bigint → dropped
  }

  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY) {
      throw new ValidationError(`${path} has too many items.`);
    }
    return value.map((v, i) => sanitizeJson(v, `${path}[${i}]`, depth + 1));
  }

  if (value instanceof Date) return value.toISOString();

  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(k) || k.startsWith("$") || k.includes(".")) {
      throw new ValidationError(`${path} contains an invalid key "${k}".`);
    }
    if (v === undefined) continue;
    out[k] = sanitizeJson(v, `${path}.${k}`, depth + 1);
  }
  return out;
}

function assertSize(data) {
  const bytes = Buffer.byteLength(JSON.stringify(data), "utf8");
  if (bytes > MAX_DOCUMENT_BYTES) {
    throw new ValidationError(
      `Document is too large (${Math.round(bytes / 1024)}KB). ` +
        `Limit is ${Math.round(MAX_DOCUMENT_BYTES / 1024)}KB — use the media ` +
        `library for images instead of embedding them.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
export function normalizeSection(raw, path = "section") {
  if (!isPlainObject(raw)) {
    throw new ValidationError(`${path} must be an object.`);
  }
  const id = String(raw.id ?? "").trim();
  if (!SECTION_ID_PATTERN.test(id)) {
    throw new ValidationError(
      `${path}.id must be 1-64 letters, numbers, "-" or "_".`,
    );
  }
  const type = String(raw.type ?? "").trim();
  if (!SECTION_TYPE_PATTERN.test(type)) {
    throw new ValidationError(`${path}.type is required (e.g. "Hero").`);
  }
  if (raw.content !== undefined && raw.content !== null && !isPlainObject(raw.content)) {
    throw new ValidationError(`${path}.content must be an object.`);
  }
  if (raw.style !== undefined && raw.style !== null && !isPlainObject(raw.style)) {
    throw new ValidationError(`${path}.style must be an object.`);
  }

  return {
    id,
    type,
    label: typeof raw.label === "string" ? raw.label.slice(0, 200) : "",
    visible: raw.visible !== false,
    content: sanitizeJson(raw.content ?? {}, `${path}.content`) || {},
    style: sanitizeJson(raw.style ?? {}, `${path}.style`) || {},
  };
}

function normalizeSeo(raw) {
  if (raw === undefined || raw === null) return {};
  if (!isPlainObject(raw)) throw new ValidationError("seo must be an object.");
  return sanitizeJson(raw, "seo");
}

export function normalizePageData(raw) {
  if (!isPlainObject(raw)) throw new ValidationError("data must be an object.");
  const sections = raw.sections ?? [];
  if (!Array.isArray(sections)) {
    throw new ValidationError("data.sections must be an array.");
  }
  if (sections.length > 100) {
    throw new ValidationError("A page can have at most 100 sections.");
  }

  const seen = new Set();
  const normalized = sections.map((s, i) => {
    const section = normalizeSection(s, `sections[${i}]`);
    if (seen.has(section.id)) {
      throw new ValidationError(`Duplicate section id "${section.id}".`);
    }
    seen.add(section.id);
    return section;
  });

  return { seo: normalizeSeo(raw.seo), sections: normalized };
}

// ---------------------------------------------------------------------------
// Menus
// ---------------------------------------------------------------------------
const SAFE_LINK = /^(\/|#|https?:\/\/|mailto:|tel:)/i;

function normalizeMenuItem(raw, path, depth) {
  if (!isPlainObject(raw)) throw new ValidationError(`${path} must be an object.`);
  const label = String(raw.label ?? "").trim();
  const url = String(raw.url ?? "").trim();
  if (!label) throw new ValidationError(`${path}.label is required.`);
  if (!url || !SAFE_LINK.test(url)) {
    throw new ValidationError(
      `${path}.url must start with "/", "#", "http(s)://", "mailto:" or "tel:".`,
    );
  }
  const variant = raw.variant ?? "link";
  if (!MENU_VARIANTS.includes(variant)) {
    throw new ValidationError(
      `${path}.variant must be one of: ${MENU_VARIANTS.join(", ")}.`,
    );
  }

  const children = raw.children ?? [];
  if (!Array.isArray(children)) {
    throw new ValidationError(`${path}.children must be an array.`);
  }
  if (children.length && depth >= 1) {
    throw new ValidationError(`${path}: menus support one level of nesting.`);
  }

  return {
    id: String(raw.id ?? "").trim() || label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: label.slice(0, 120),
    url,
    variant,
    visible: raw.visible !== false,
    external: raw.external === true || /^https?:\/\//i.test(url),
    children: children.map((c, i) =>
      normalizeMenuItem(c, `${path}.children[${i}]`, depth + 1),
    ),
  };
}

export function normalizeMenuData(raw) {
  if (!isPlainObject(raw)) throw new ValidationError("data must be an object.");
  const items = raw.items ?? [];
  if (!Array.isArray(items)) throw new ValidationError("data.items must be an array.");
  if (items.length > 50) throw new ValidationError("A menu can have at most 50 items.");
  return { items: items.map((it, i) => normalizeMenuItem(it, `items[${i}]`, 0)) };
}

// ---------------------------------------------------------------------------
// Settings — free-form but sanitized.
// ---------------------------------------------------------------------------
export function normalizeSettingsData(raw) {
  if (!isPlainObject(raw)) throw new ValidationError("data must be an object.");
  return sanitizeJson(raw, "data");
}

export function normalizeDocumentData(kind, raw) {
  let data;
  if (kind === "page") data = normalizePageData(raw);
  else if (kind === "menu") data = normalizeMenuData(raw);
  else if (kind === "settings") data = normalizeSettingsData(raw);
  else throw new ValidationError(`Unknown kind "${kind}".`);
  assertSize(data);
  return data;
}

export function normalizePath(path) {
  if (path === undefined || path === null || path === "") return "";
  const p = String(path).trim();
  if (!/^\/[a-zA-Z0-9/_-]*$/.test(p)) {
    throw new ValidationError('path must look like "/about-us".');
  }
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}
