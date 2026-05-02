import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { upload } from "../middleware/upload.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, isAdmin, upload.single("image"), createCategory);
router.put("/:id", protect, isAdmin, upload.single("image"), updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;