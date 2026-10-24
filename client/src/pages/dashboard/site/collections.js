// Blog & Events collections managed from the dashboard (server:
// /api/cms/blog, /api/cms/events). Field kinds as in src/cms/schemas.js.

const seoGroup = {
  name: "seo",
  label: "Search & sharing (optional)",
  kind: "group",
  fields: [
    { name: "title", label: "Search title (defaults to the title)", kind: "text" },
    { name: "description", label: "Search description (defaults to the summary)", kind: "textarea", rows: 2 },
    { name: "ogImage", label: "Share image (defaults to the cover image)", kind: "imageUrl" },
  ],
};

export const COLLECTIONS = {
  blog: {
    key: "blog",
    label: "Blog",
    singular: "post",
    newLabel: "New post",
    publicPath: (doc) => `/blog/${doc.slug}`,
    dateLabel: "Published",
    dateOf: (doc) => doc.publishedAt,
    empty: {
      title: "",
      excerpt: "",
      body: "",
      coverImage: { url: "", alt: "" },
      tags: [],
      seo: { title: "", description: "", ogImage: "" },
    },
    fields: [
      { name: "title", label: "Title", kind: "text" },
      { name: "excerpt", label: "Summary", kind: "textarea", rows: 3, hint: "Shown on post cards and in Google results." },
      { name: "coverImage", label: "Cover image", kind: "image" },
      { name: "body", label: "Article", kind: "richBody" },
      { name: "tags", label: "Tags", kind: "tags", hint: "Separate with commas. Visitors can browse posts by tag." },
      seoGroup,
    ],
  },
  events: {
    key: "events",
    label: "Events",
    singular: "event",
    newLabel: "New event",
    publicPath: (doc) => `/events/${doc.slug}`,
    dateLabel: "Starts",
    dateOf: (doc) => doc.startAt,
    empty: {
      title: "",
      description: "",
      body: "",
      startAt: null,
      endAt: null,
      venue: "",
      registrationLink: "",
      coverImage: { url: "", alt: "" },
      seo: { title: "", description: "", ogImage: "" },
    },
    fields: [
      { name: "title", label: "Event name", kind: "text" },
      { name: "startAt", label: "Starts", kind: "datetime" },
      { name: "endAt", label: "Ends (optional)", kind: "datetime" },
      { name: "venue", label: "Venue / location", kind: "text", hint: 'e.g. "Eko Hotel, Victoria Island, Lagos" or "Online (Zoom)".' },
      { name: "registrationLink", label: "Registration link (optional)", kind: "link", hint: "Adds a Register button while the event is upcoming." },
      { name: "description", label: "Short description", kind: "textarea", rows: 3, hint: "Shown on event cards." },
      { name: "coverImage", label: "Cover image", kind: "image" },
      { name: "body", label: "Full details (optional)", kind: "richBody", rows: 12 },
      seoGroup,
    ],
  },
};

export const STATUS_META = {
  draft: { label: "Draft", color: "gray" },
  scheduled: { label: "Scheduled", color: "blue" },
  published: { label: "Live", color: "green" },
  archived: { label: "Archived", color: "amber" },
};
