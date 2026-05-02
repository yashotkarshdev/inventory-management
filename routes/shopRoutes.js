import express from "express";
import {
  createShop,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
} from "../controllers/shopController.js";

const router = express.Router();

router.get("/", getShops);
router.get("/:id", getShopById);
router.post("/", createShop);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);

export default router;