// scripts/seedCmsRoles.js
// One-off helper to set editorial roles or create CMS staff accounts.
//
// Usage (from server/):
//   node scripts/seedCmsRoles.js set <email> <admin|publisher|editor>
//   node scripts/seedCmsRoles.js create <email> <password> <admin|publisher|editor>
//
// Requires MONGODB_URI in the environment (same as the app).
import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../models/admin.js";

const [, , cmd, email, arg3, arg4] = process.argv;

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not set.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);

  if (cmd === "set") {
    const role = arg3;
    if (!email || !["admin", "publisher", "editor"].includes(role)) {
      console.error("Usage: set <email> <admin|publisher|editor>");
      process.exit(1);
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.error("No staff account with that email.");
      process.exit(1);
    }
    admin.role = role;
    await admin.save(); // password not modified -> hook skipped, hash preserved
    console.log(`Set ${email} role to ${role}.`);
  } else if (cmd === "create") {
    const password = arg3;
    const role = arg4 || "editor";
    if (
      !email ||
      !password ||
      !["admin", "publisher", "editor"].includes(role)
    ) {
      console.error(
        "Usage: create <email> <password> <admin|publisher|editor>",
      );
      process.exit(1);
    }
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.error("Staff account already exists.");
      process.exit(1);
    }
    await Admin.create({ email, password, role }); // hook hashes password
    console.log(`Created ${role} account for ${email}.`);
  } else {
    console.log(
      "Commands:\n  set <email> <role>\n  create <email> <password> <role>",
    );
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
