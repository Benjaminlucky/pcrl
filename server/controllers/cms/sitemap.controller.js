// controllers/cms/sitemap.controller.js
import BlogPost from "./blogPost.model.js";
import Event from "./event.model.js";
import Page from "./page.model.js";
import { publicMatch } from "../../utils/cms/contentWorkflow.js";

const SITE_URL = (
  process.env.SITE_URL ||
  process.env.FRONTEND_URL ||
  "https://pcrginitiative.com"
).replace(/\/$/, "");

// Static routes that always exist on the marketing site.
const STATIC_PATHS = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/for-realtors", priority: "0.8", changefreq: "monthly" },
  { path: "/for-developers", priority: "0.8", changefreq: "monthly" },
  { path: "/pcrg-training-academy", priority: "0.8", changefreq: "monthly" },
  { path: "/blog-and-events", priority: "0.7", changefreq: "weekly" },
  { path: "/about-us", priority: "0.6", changefreq: "monthly" },
];

function xmlEscape(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority ? `    <priority>${priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

// GET /sitemap.xml — regenerated on every request from live content.
export const sitemap = async (req, res) => {
  try {
    const [posts, evts, pages] = await Promise.all([
      BlogPost.find(publicMatch({ hasScheduling: true }))
        .select("slug updatedAt publishedAt")
        .lean(),
      Event.find(publicMatch({ hasScheduling: true }))
        .select("slug updatedAt publishedAt")
        .lean(),
      Page.find(publicMatch({ hasScheduling: true }))
        .select("key updatedAt publishedAt")
        .lean(),
    ]);

    const entries = [];

    for (const s of STATIC_PATHS) {
      entries.push(
        urlEntry({
          loc: `${SITE_URL}${s.path}`,
          changefreq: s.changefreq,
          priority: s.priority,
        }),
      );
    }

    for (const p of posts) {
      entries.push(
        urlEntry({
          loc: `${SITE_URL}/blog/${p.slug}`,
          lastmod: p.updatedAt || p.publishedAt,
          changefreq: "monthly",
          priority: "0.7",
        }),
      );
    }

    for (const e of evts) {
      entries.push(
        urlEntry({
          loc: `${SITE_URL}/events/${e.slug}`,
          lastmod: e.updatedAt || e.publishedAt,
          changefreq: "monthly",
          priority: "0.6",
        }),
      );
    }

    for (const pg of pages) {
      // Skip "home" (already covered by "/")
      if (pg.key === "home") continue;
      entries.push(
        urlEntry({
          loc: `${SITE_URL}/${pg.key}`,
          lastmod: pg.updatedAt || pg.publishedAt,
          changefreq: "monthly",
          priority: "0.5",
        }),
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600");
    return res.send(xml);
  } catch (err) {
    console.error("sitemap error:", err);
    return res.status(500).send("Failed to generate sitemap");
  }
};

// GET /robots.txt
export const robots = async (req, res) => {
  const body = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`;
  res.set("Content-Type", "text/plain");
  return res.send(body);
};
