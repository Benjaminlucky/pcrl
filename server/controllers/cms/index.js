// controllers/cms/index.js
import BlogPost from "../../models/cms/blogPost.model.js";
import Event from "../../models/cms/event.model.js";
import TeamMember from "../../models/cms/teamMember.model.js";
import Testimonial from "../../models/cms/testimonial.model.js";
import { createContentController } from "./contentController.factory.js";

export const blog = createContentController(BlogPost, {
  resourceName: "blog post",
  hasSlug: true,
  hasScheduling: true,
  searchFields: ["title", "excerpt", "tags"],
  publicSort: "-publishedAt",
  editableFields: ["title", "excerpt", "body", "coverImage", "tags", "seo"],
  urlFields: ["coverImage.url", "seo.ogImage", "seo.canonical"],
  // ?tag=news → only posts with that tag
  publicFilter: (req) =>
    req.query.tag ? { filter: { tags: String(req.query.tag) } } : null,
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
  urlFields: ["coverImage.url", "registrationLink", "seo.ogImage", "seo.canonical"],
  // ?when=upcoming (soonest first) | ?when=past (most recent first)
  publicFilter: (req) => {
    const now = new Date();
    if (req.query.when === "upcoming") {
      return {
        filter: {
          $or: [
            { endAt: { $gte: now } },
            { endAt: null, startAt: { $gte: now } },
          ],
        },
        sort: "startAt",
      };
    }
    if (req.query.when === "past") {
      return {
        filter: {
          $or: [
            { endAt: { $lt: now } },
            { endAt: null, startAt: { $lt: now } },
          ],
        },
        sort: "-startAt",
      };
    }
    return null;
  },
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
