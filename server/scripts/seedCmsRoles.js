// scripts/seedCmsRoles.js
// Command-line helper to set a staff member's role or create an account.
// (Day-to-day this is done from the dashboard Team page.)
//
// Usage (from server/):
//   node scripts/seedCmsRoles.js set <email> <role-key>
//   node scripts/seedCmsRoles.js create <email> <password> <role-key>
//   node scripts/seedCmsRoles.js roles            # list role keys
//
// Built-in role keys: admin, publisher, editor (plus any created in the
// dashboard).
//
// Requires MONGODB_URI in the environment (same as the app).
import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../models/admin.js";
import Role from "../models/role.model.js";
import { ensureSystemRoles } from "../utils/rbac.js";

const [, , cmd, email, arg3, arg4] = process.argv;

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not set.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  await ensureSystemRoles();
  const roleExists = async (key) => !!key && !!(await Role.exists({ key: String(key).toLowerCase() }));

  if (cmd === "set") {
    const role = arg3;
    if (!email || !(await roleExists(role))) {
      console.error("Usage: set <email> <role-key>  (see: roles)");
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
    if (!email || !password || !(await roleExists(role))) {
      console.error("Usage: create <email> <password> <role-key>  (see: roles)");
      process.exit(1);
    }
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.error("Staff account already exists.");
      process.exit(1);
    }
    await Admin.create({ email, password, role }); // hook hashes password
    console.log(`Created ${role} account for ${email}.`);
  } else if (cmd === "roles") {
    for (const r of await Role.find({}).sort({ key: 1 }).lean()) {
      console.log(`${r.key.padEnd(16)} ${r.name}`);
    }
  } else {
    console.log(
      "Commands:\n  set <email> <role>\n  create <email> <password> <role>\n  roles",
    );
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
