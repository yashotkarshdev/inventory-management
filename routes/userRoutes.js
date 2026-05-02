import express from "express";
import {
  createUser,
  getUsers,
  deleteUser
} from "../controllers/userController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 ADMIN ONLY
router.get("/", protect, isAdmin, getUsers);
router.post("/", protect, isAdmin, createUser);
router.delete("/:id", protect, isAdmin, deleteUser);

export default router;