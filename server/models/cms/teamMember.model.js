// models/cms/teamMember.model.js
import mongoose from "mongoose";
import {
  imageField,
  authorField,
  CONTENT_STATUSES,
} from "../../utils/cms/fields.js";

const TeamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" }, // job title
    photo: imageField,
    bio: { type: String, default: "" },
    order: { type: Number, default: 0 }, // display order (asc)

    // No scheduling for team members; published = visible.
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

TeamMemberSchema.index({ status: 1, order: 1 });

export default mongoose.models.TeamMember ||
  mongoose.model("TeamMember", TeamMemberSchema);
