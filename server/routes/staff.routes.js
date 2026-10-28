// routes/staff.routes.js
// Team, roles and activity log (mounted under /api/admin).
import express from "express";
import { protect, requirePermission } from "../middlewares/authMiddleware.js";
import * as staff from "../controllers/staff.controller.js";

const router = express.Router();

router.get("/permissions", protect, requirePermission("staff.view", "roles.manage"), staff.listPermissions);

router.get("/roles", protect, requirePermission("staff.view", "roles.manage"), staff.listRoles);
router.post("/roles", protect, requirePermission("roles.manage"), staff.createRole);
router.put("/roles/:key", protect, requirePermission("roles.manage"), staff.updateRole);
router.delete("/roles/:key", protect, requirePermission("roles.manage"), staff.deleteRole);

router.get("/staff", protect, requirePermission("staff.view"), staff.listStaff);
router.post("/staff", protect, requirePermission("staff.manage"), staff.createStaff);
router.put("/staff/:id", protect, requirePermission("staff.manage"), staff.updateStaff);
router.post("/staff/:id/password", protect, requirePermission("staff.manage"), staff.resetStaffPassword);
router.delete("/staff/:id", protect, requirePermission("staff.manage"), staff.deleteStaff);

router.get("/audit", protect, requirePermission("audit.view"), staff.listAudit);

export default router;
