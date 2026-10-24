// models/cms/siteDocument.model.js
// One editable piece of the public website. Every page, menu and the global
// settings live here as a document identified by (kind, key):
//
//   kind "page"     key "home"      → sections, SEO for the "/" route
//   kind "menu"     key "main"      → navbar links
//   kind "settings" key "global"    → logo, contact info, footer text, …
//
// Editors always work on `draft`. Publishing copies `draft` → `published`,
// which is the only thing the public API ever serves. If `published` is null
// the frontend keeps rendering its built-in (hardcoded) content, so an empty
// or half-finished CMS can never blank out the live site.
import mongoose from "mongoose";

export const SITE_DOCUMENT_KINDS = ["page", "menu", "settings"];

const StampSchema = new mongoose.Schema(
  {
    id: { type: String, default: null },
    name: { type: String, default: "" },
  },
  { _id: false },
);

const SiteDocumentSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: SITE_DOCUMENT_KINDS, required: true },
    key: { type: String, required: true, trim: true, lowercase: true },

    // Human label shown in the admin UI ("Home page", "Main navigation").
    title: { type: String, default: "", trim: true },
    // Route on the public site (pages only), e.g. "/for-realtors".
    path: { type: String, default: "" },

    draft: { type: mongoose.Schema.Types.Mixed, default: {} },
    published: { type: mongoose.Schema.Types.Mixed, default: null },

    // Incremented on every draft save. Clients send the version they loaded;
    // a mismatch means someone else saved first (HTTP 409) — no silent
    // overwrites between two editors.
    version: { type: Number, default: 1 },
    // The draft version that is currently live (null = never published).
    publishedVersion: { type: Number, default: null },
    publishedAt: { type: Date, default: null },

    updatedBy: { type: StampSchema, default: () => ({}) },
    publishedBy: { type: StampSchema, default: () => ({}) },
  },
  { timestamps: true, minimize: false },
);

SiteDocumentSchema.index({ kind: 1, key: 1 }, { unique: true });

SiteDocumentSchema.virtual("hasUnpublishedChanges").get(function () {
  return this.publishedVersion !== this.version;
});

SiteDocumentSchema.set("toJSON", { virtuals: true, versionKey: false });
SiteDocumentSchema.set("toObject", { virtuals: true, versionKey: false });

export default mongoose.models.SiteDocument ||
  mongoose.model("SiteDocument", SiteDocumentSchema);
