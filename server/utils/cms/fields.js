// utils/cms/fields.js
// Reusable field definitions shared across CMS models. These are plain
// definition objects (not Schema instances), which Mongoose clones per schema,
// so sharing them is safe.

export const imageField = {
  url: { type: String, default: "" },
  alt: { type: String, default: "" }, // required for image SEO + accessibility
};

export const seoField = {
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  ogImage: { type: String, default: "" },
  canonical: { type: String, default: "" },
};

export const CONTENT_STATUSES = ["draft", "scheduled", "published", "archived"];

// Author stamp (which staff member created/edited the content).
export const authorField = {
  id: { type: String, default: null },
  name: { type: String, default: "" },
};
