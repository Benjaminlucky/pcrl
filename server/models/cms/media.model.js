// models/cms/media.model.js
// Media library entry. Files themselves live on Cloudinary (shared hosting
// disks are small and not backed up), this is the searchable index.
import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true },
    resourceType: { type: String, default: "image" }, // image | video | raw
    url: { type: String, required: true }, // https URL to use on the site
    format: { type: String, default: "" },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    bytes: { type: Number, default: 0 },
    originalName: { type: String, default: "" },
    alt: { type: String, default: "" },
    folder: { type: String, default: "" },
    tags: { type: [String], default: [] },
    uploadedBy: {
      id: { type: String, default: null },
      name: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ originalName: "text", alt: "text", tags: "text" });

export default mongoose.models.Media || mongoose.model("Media", MediaSchema);
