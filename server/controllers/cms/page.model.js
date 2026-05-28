// models/cms/page.model.js
import mongoose from "mongoose";
import {
  seoField,
  authorField,
  CONTENT_STATUSES,
} from "../../utils/cms/fields.js";

// A flexible content block. `type` drives how the frontend renders it; `data`
// holds arbitrary block content. Kept schema-less (Mixed) on purpose so editors
// can add new block types without a migration.
const SectionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g. "hero", "richText", "cta"
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const PageSchema = new mongoose.Schema(
  {
    // Stable identifier used to fetch the page (e.g. "home", "about", "academy")
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    sections: { type: [SectionSchema], default: [] },

    status: {
      type: String,
      enum: CONTENT_STATUSES,
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, default: null },
    scheduledFor: { type: Date, default: null },

    seo: seoField,
    author: authorField,
  },
  { timestamps: true, minimize: false },
);

export default mongoose.models.Page || mongoose.model("Page", PageSchema);
