import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getDashboard);

export default router;