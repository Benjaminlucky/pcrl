// Dashboard page: /dashboard/media
import React from "react";
import MediaBrowser from "./MediaBrowser";
import { PageHeader } from "./ui";

export default function MediaLibrary() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Media library"
        subtitle="Images up to 15MB (JPG, PNG, WebP, GIF, AVIF, SVG) and videos up to 100MB (MP4, WebM)."
      />
      <MediaBrowser mode="manage" />
    </div>
  );
}
