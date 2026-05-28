// jobs/cmsScheduler.js
// Flips "scheduled" content to "published" once scheduledFor has passed, then
// fires a revalidation for affected paths. Runs every 5 minutes.
//
// Note: the public read filter already treats scheduled-and-due items as live,
// so this cron is about normalizing stored status + triggering site rebuilds,
// not about correctness of what visitors see.
import cron from "node-cron";
import BlogPost from "../controllers/cms/blogPost.model.js";
import Event from "../controllers/cms/event.model.js";
import Page from "../controllers/cms/page.model.js";
import { triggerRevalidation } from "../utils/cms/revalidate.js";

const BIRTHDAY_ZONE = "Africa/Lagos";

async function publishDue(Model, pathFor) {
  const now = new Date();
  const due = await Model.find({
    status: "scheduled",
    scheduledFor: { $lte: now },
  });

  const paths = [];
  for (const doc of due) {
    doc.status = "published";
    if (!doc.publishedAt) doc.publishedAt = now;
    doc.scheduledFor = null;
    await doc.save();
    paths.push(...pathFor(doc));
  }
  return paths;
}

export async function runScheduledPublish() {
  const paths = [];
  try {
    paths.push(
      ...(await publishDue(BlogPost, (d) => ["/blog", `/blog/${d.slug}`])),
    );
    paths.push(
      ...(await publishDue(Event, (d) => ["/events", `/events/${d.slug}`])),
    );
    paths.push(
      ...(await publishDue(Page, (d) => [
        d.key === "home" ? "/" : `/${d.key}`,
      ])),
    );

    if (paths.length) {
      console.log("[cmsScheduler] auto-published:", paths);
      triggerRevalidation(paths);
    }
  } catch (err) {
    console.error("[cmsScheduler] error:", err?.message || err);
  }
  return paths;
}

cron.schedule("*/5 * * * *", runScheduledPublish, { timezone: BIRTHDAY_ZONE });
