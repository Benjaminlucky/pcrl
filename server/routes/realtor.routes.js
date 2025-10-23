import express from "express";
import { signup } from "../controllers/realtor.controller.js";
import { login } from "../controllers/auth.controller.js";
import { getDashboard } from "../controllers/realtorDashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", protect, getDashboard);

export default router;
