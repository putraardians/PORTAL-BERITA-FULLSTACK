import express from "express";
import { getCategories, updateCategory } from "../controllers/categoryController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

// Route untuk mengambil semua kategori - bisa diakses oleh semua pengguna
router.get("/", getCategories);

// Route untuk mengupdate kategori - hanya bisa diakses oleh admin
router.put("/:id", authenticateToken, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
}, updateCategory);

export default router;
