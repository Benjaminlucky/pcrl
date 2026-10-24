// models/cms/siteRevision.model.js
// Snapshot history for SiteDocuments. A revision is written on every save,
// publish and restore so any earlier state can be brought back as a draft.
import mongoose from "mongoose";

export const REVISION_ACTIONS = [
  "create",
  "save",
  "publish",
  "unpublish",
  "restore",
  "discard",
];

const SiteRevisionSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteDocument",
      required: true,
      index: true,
    },
    kind: { type: String, required: true },
    key: { type: String, required: true },
    version: { type: Number, required: true },
    action: { type: String, enum: REVISION_ACTIONS, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    note: { type: String, default: "" },
    by: {
      id: { type: String, default: null },
      name: { type: String, default: "" },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, minimize: false },
);

SiteRevisionSchema.index({ document: 1, createdAt: -1 });

export default mongoose.models.SiteRevision ||
  mongoose.model("SiteRevision", SiteRevisionSchema);
