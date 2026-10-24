// scripts/seedSite.js
// Creates the website-builder documents (pages, menus, settings) from
// scripts/siteBlueprint.js so the CMS starts with exactly what is live today.
//
// Usage (from server/):
//   npm run seed:site                 create missing docs and publish them
//   npm run seed:site -- --no-publish create missing docs as drafts only
//   npm run seed:site -- --dry-run    show what would happen
//
// Safe to run repeatedly: existing documents are NEVER modified.
import "dotenv/config";
import mongoose from "mongoose";
import SiteDocument from "../models/cms/siteDocument.model.js";
import SiteRevision from "../models/cms/siteRevision.model.js";
import { normalizeDocumentData } from "../utils/cms/siteValidation.js";
import { blueprint } from "./siteBlueprint.js";

const args = new Set(process.argv.slice(2));
const publish = !args.has("--no-publish");
const dryRun = args.has("--dry-run");
const SEEDER = { id: null, name: "Seed script" };

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not set.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);

  let created = 0;
  for (const item of blueprint) {
    const label = `${item.kind}:${item.key}`;
    const exists = await SiteDocument.exists({ kind: item.kind, key: item.key });
    if (exists) {
      console.log(`skip    ${label} (already exists)`);
      continue;
    }
    if (dryRun) {
      console.log(`would create ${label}${publish ? " + publish" : ""}`);
      continue;
    }

    const data = normalizeDocumentData(item.kind, item.data);
    const doc = await SiteDocument.create({
      kind: item.kind,
      key: item.key,
      title: item.title,
      path: item.path || "",
      draft: data,
      published: publish ? data : null,
      version: 1,
      publishedVersion: publish ? 1 : null,
      publishedAt: publish ? new Date() : null,
      updatedBy: SEEDER,
      publishedBy: publish ? SEEDER : {},
    });
    await SiteRevision.create({
      document: doc._id,
      kind: doc.kind,
      key: doc.key,
      version: 1,
      action: publish ? "publish" : "create",
      data,
      note: "Initial seed",
      by: SEEDER,
    });
    created += 1;
    console.log(`create  ${label}${publish ? " (published)" : " (draft)"}`);
  }

  console.log(`\nDone. ${created} document(s) created.`);
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
