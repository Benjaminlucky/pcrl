import multer from "multer";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"), false);
  } else {
    cb(null, true);
  }
};

// 25MB limit (adjust as needed)
export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
}).single("avatar");

// ---------------------------------------------------------------------------
// CMS media library uploads. Streamed to a temp file (not RAM) because shared
// hosting has tight memory limits and videos can be large; the controller
// removes the temp file after pushing it to Cloudinary.
// ---------------------------------------------------------------------------
const MEDIA_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
]);

export const MEDIA_MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MEDIA_MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export const uploadMediaFile = multer({
  storage: multer.diskStorage({}), // OS temp dir, random filename
  fileFilter: (req, file, cb) => {
    if (!MEDIA_TYPES.has(file.mimetype)) {
      cb(new Error("Unsupported file type. Use JPG, PNG, WebP, GIF, AVIF, SVG, MP4 or WebM."), false);
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: MEDIA_MAX_VIDEO_BYTES, files: 1 },
}).single("file");
