// models/cms/event.model.js
import mongoose from "mongoose";
import {
  imageField,
  seoField,
  authorField,
  CONTENT_STATUSES,
} from "../../utils/cms/fields.js";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    body: { type: String, default: "" },
    coverImage: imageField,

    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
    venue: { type: String, default: "" },
    registrationLink: { type: String, default: "" },

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

EventSchema.index({ status: 1, startAt: 1 });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
