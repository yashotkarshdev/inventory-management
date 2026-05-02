import express from "express";
import {
  createStock,
  getStock,
  deleteStock,
  getStockSummary,
} from "../controllers/stockController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 STOCK HISTORY
router.get("/", protect, isAdmin, getStock);

// 🔥 ADD STOCK (IN / OUT)
router.post("/", protect, isAdmin, createStock);

// 🔥 DELETE (reverse effect)
router.delete("/:id", protect, isAdmin, deleteStock);

router.get("/summary", protect, isAdmin, getStockSummary);

export default router;