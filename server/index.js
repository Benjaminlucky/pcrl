// Load .env before any other module reads process.env (ESM imports are
// hoisted, so this must be an import, not a dotenv.config() call below).
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import realtorRoutes from "./routes/realtor.routes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";
import mailingListRoutes from "./routes/mailingList.routes.js";
import cmsRoutes from "./routes/cms.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import { ensureSystemRoles } from "./utils/rbac.js";
import contentRoutes from "./routes/content.routes.js";
import siteRoutes from "./routes/site.routes.js";
import { sitemap, robots } from "./controllers/cms/sitemap.controller.js";
import cloudinary from "./utils/cloudinary.config.js";
import "./jobs/birthdayJob.js";
import "./jobs/cmsScheduler.js";
import authRoutes from "./routes/Auth.routes.js";

const app = express();

// Behind DirectAdmin/LiteSpeed/Apache (or Railway) proxy: trust the first hop
// so req.ip / req.protocol reflect the real client.
app.set("trust proxy", 1);
app.disable("x-powered-by");

// CORS: CORS_ORIGINS="https://pcrginitiative.com,https://www.pcrginitiative.com"
// When unset, any origin is allowed (previous behaviour).
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(
  cors(
    allowedOrigins.length
      ? {
          origin(origin, cb) {
            // No Origin header = server-to-server / curl / same-origin.
            if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
            return cb(null, false);
          },
        }
      : undefined,
  ),
);
// Page documents with many sections can exceed express' 100kb default.
app.use(express.json({ limit: "2mb" }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDb");
    // Built-in roles (admin / publisher / editor). Safe to run every start.
    return ensureSystemRoles().catch((err) =>
      console.error("Failed to ensure system roles:", err?.message || err),
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Root health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "PCRG API is running",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/realtors", realtorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", staffRoutes); // team, roles, activity log
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/mailing-list", mailingListRoutes);
app.use("/api/auth", authRoutes);

// CMS
app.use("/api/site", siteRoutes); // public website content (published only)
app.use("/api/content", contentRoutes); // public blog/events/team/testimonials
app.use("/api/cms", cmsRoutes); // staff-only editing
app.get("/sitemap.xml", sitemap);
app.get("/robots.txt", robots);

// Malformed JSON bodies → 400 instead of an HTML error page.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body." });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body too large." });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Server error" });
});

// Cloudinary connectivity check — informational only, must never stop the
// API from starting.
cloudinary.api
  .ping()
  .then((result) => console.log("Cloudinary:", result?.status || result))
  .catch((err) => console.error("Cloudinary ping failed:", err?.message || err));

app.listen(process.env.PORT || 3000, () => console.log("Server is running"));
