// Modal wrapper around MediaBrowser for choosing an image/video in a form.
import React from "react";
import MediaBrowser from "./MediaBrowser";
import { Modal } from "./ui";

export default function MediaPicker({ open, onClose, onPick, accept = "image" }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={accept === "video" ? "Choose a video" : "Choose an image"}
    >
      {open && (
        <MediaBrowser
          mode="pick"
          accept={accept}
          onPick={(media) => {
            onPick(media);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}
