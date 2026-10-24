// src/cms/merge.js
// Overlay CMS overrides on a component's built-in content.
//   - objects are merged key by key
//   - arrays (lists of cards, links, images) are replaced as a whole
//   - null/undefined in the override keeps the built-in value
export function mergeContent(defaults, overrides) {
  if (overrides === undefined || overrides === null) return defaults;
  if (
    typeof overrides !== "object" ||
    Array.isArray(overrides) ||
    typeof defaults !== "object" ||
    defaults === null ||
    Array.isArray(defaults)
  ) {
    return overrides;
  }
  const out = { ...defaults };
  for (const [k, v] of Object.entries(overrides)) {
    out[k] = mergeContent(defaults[k], v);
  }
  return out;
}
