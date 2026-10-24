// models/cms/blogPost.model.js
import mongoose from "mongoose";
import {
  imageField,
  seoField,
  authorField,
  CONTENT_STATUSES,
} from "../../utils/cms/fields.js";

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" }, // rich text / markdown / HTML
    coverImage: imageField,
    tags: { type: [String], default: [] },

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
  { timestamps: true },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", BlogPostSchema);
