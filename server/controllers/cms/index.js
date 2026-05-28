// controllers/cms/index.js
import BlogPost from "../../models/cms/blogPost.model.js";
import Event from "../../models/cms/event.model.js";
import TeamMember from "../../models/cms/teamMember.model.js";
import Testimonial from "../../models/cms/testimonial.model.js";
import Page from "../../models/cms/page.model.js";
import { createContentController } from "./contentController.factory.js";
import { publicMatch, toDateOrNull } from "../../utils/cms/contentWorkflow.js";
import { triggerRevalidation } from "../../utils/cms/revalidate.js";

export const blog = createContentController(BlogPost, {
  resourceName: "blog post",
  hasSlug: true,
  hasScheduling: true,
  searchFields: ["title", "excerpt", "tags"],
  publicSort: "-publishedAt",
  editableFields: ["title", "excerpt", "body", "coverImage", "tags", "seo"],
  revalidatePaths: (doc) => ["/blog", `/blog/${doc.slug}`],
});

export const events = createContentController(Event, {
  resourceName: "event",
  hasSlug: true,
  hasScheduling: true,
  searchFields: ["title", "description", "venue"],
  publicSort: "startAt",
  editableFields: [
    "title",
    "description",
    "body",
    "coverImage",
    "startAt",
    "endAt",
    "venue",
    "registrationLink",
    "seo",
  ],
  revalidatePaths: (doc) => ["/events", `/events/${doc.slug}`],
});

export const team = createContentController(TeamMember, {
  resourceName: "team member",
  hasSlug: false,
  hasScheduling: false,
  searchFields: ["name", "role"],
  adminSort: "order",
  publicSort: "order",
  editableFields: ["name", "role", "photo", "bio", "order"],
  revalidatePaths: () => ["/about-us"],
});

export const testimonials = createContentController(Testimonial, {
  resourceName: "testimonial",
  hasSlug: false,
  hasScheduling: false,
  searchFields: ["name", "role", "quote"],
  adminSort: "order",
  publicSort: "order",
  editableFields: ["name", "role", "quote", "photo", "rating", "order"],
  revalidatePaths: () => ["/", "/for-realtors"],
});

// ---------------------------------------------------------------------------
// PAGES — keyed singletons with flexible section blocks. Handled explicitly
// because they're fetched by `key`, not a generated slug.
// ---------------------------------------------------------------------------
const pageRevalidate = (page) => {
  const path = page.key === "home" ? "/" : `/${page.key}`;
  triggerRevalidation([path]);
};

export const pages = {
  async adminList(req, res) {
    try {
      const docs = await Page.find({}).sort("key").lean();
      return res.json({ docs, total: docs.length });
    } catch (err) {
      console.error("pages adminList error:", err);
      return res.status(500).json({ message: "Failed to load pages" });
    }
  },

  async adminGet(req, res) {
    try {
      const doc = await Page.findById(req.params.id).lean();
      if (!doc) return res.status(404).json({ message: "Page not found" });
      return res.json(doc);
    } catch (err) {
      console.error("pages adminGet error:", err);
      return res.status(500).json({ message: "Failed to load page" });
    }
  },

  async create(req, res) {
    try {
      const { key, title, sections, seo } = req.body;
      if (!key || !title) {
        return res.status(400).json({ message: "key and title are required." });
      }
      const doc = await Page.create({
        key: String(key).trim().toLowerCase(),
        title,
        sections: Array.isArray(sections) ? sections : [],
        seo: seo || {},
        status: "draft",
        author: {
          id: String(req.user?.id || ""),
          name:
            [req.user?.firstName, req.user?.lastName]
              .filter(Boolean)
              .join(" ") ||
            req.user?.email ||
            "Staff",
        },
      });
      return res.status(201).json({ message: "Page created", doc });
    } catch (err) {
      if (err?.code === 11000) {
        return res
          .status(409)
          .json({ message: "A page with that key already exists." });
      }
      console.error("pages create error:", err);
      return res.status(500).json({ message: "Failed to create page" });
    }
  },

  async update(req, res) {
    try {
      const doc = await Page.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Page not found" });

      const { title, sections, seo } = req.body;
      if (title !== undefined) doc.title = title;
      if (sections !== undefined)
        doc.sections = Array.isArray(sections) ? sections : doc.sections;
      if (seo !== undefined) doc.seo = seo;

      await doc.save();
      if (doc.status === "published") pageRevalidate(doc);
      return res.json({ message: "Page updated", doc });
    } catch (err) {
      console.error("pages update error:", err);
      return res.status(500).json({ message: "Failed to update page" });
    }
  },

  async publish(req, res) {
    try {
      const doc = await Page.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Page not found" });
      doc.status = "published";
      if (!doc.publishedAt) doc.publishedAt = new Date();
      doc.scheduledFor = null;
      await doc.save();
      pageRevalidate(doc);
      return res.json({ message: "Page published", doc });
    } catch (err) {
      console.error("pages publish error:", err);
      return res.status(500).json({ message: "Failed to publish page" });
    }
  },

  async unpublish(req, res) {
    try {
      const doc = await Page.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Page not found" });
      const wasLive = doc.status === "published";
      doc.status = "draft";
      await doc.save();
      if (wasLive) pageRevalidate(doc);
      return res.json({ message: "Page unpublished", doc });
    } catch (err) {
      console.error("pages unpublish error:", err);
      return res.status(500).json({ message: "Failed to unpublish page" });
    }
  },

  async schedule(req, res) {
    try {
      const when = toDateOrNull(req.body.scheduledFor);
      if (!when || when.getTime() <= Date.now()) {
        return res
          .status(400)
          .json({ message: "scheduledFor must be a valid future date." });
      }
      const doc = await Page.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Page not found" });
      doc.status = "scheduled";
      doc.scheduledFor = when;
      await doc.save();
      return res.json({ message: "Page scheduled", doc });
    } catch (err) {
      console.error("pages schedule error:", err);
      return res.status(500).json({ message: "Failed to schedule page" });
    }
  },

  async remove(req, res) {
    try {
      const doc = await Page.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Page not found" });
      if (doc.status === "published") pageRevalidate(doc);
      return res.json({ message: "Page deleted", id: req.params.id });
    } catch (err) {
      console.error("pages remove error:", err);
      return res.status(500).json({ message: "Failed to delete page" });
    }
  },

  // PUBLIC: fetch a live page by its key
  async publicGetByKey(req, res) {
    try {
      const filter = {
        key: String(req.params.key).toLowerCase(),
        ...publicMatch({ hasScheduling: true }),
      };
      const doc = await Page.findOne(filter).select("-__v").lean();
      if (!doc) return res.status(404).json({ message: "Page not found" });
      return res.json(doc);
    } catch (err) {
      console.error("pages publicGetByKey error:", err);
      return res.status(500).json({ message: "Failed to load page" });
    }
  },
};
