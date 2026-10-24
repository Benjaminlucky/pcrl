// models/cms/testimonial.model.js
import mongoose from "mongoose";
import {
  imageField,
  authorField,
  CONTENT_STATUSES,
} from "../../utils/cms/fields.js";

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" }, // e.g. "Realtor", "Investor"
    quote: { type: String, required: true },
    photo: imageField,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    order: { type: Number, default: 0 },

    status: {
      type: String,
      enum: CONTENT_STATUSES,
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, default: null },

    author: authorField,
  },
  { timestamps: true },
);

TestimonialSchema.index({ status: 1, order: 1 });

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
