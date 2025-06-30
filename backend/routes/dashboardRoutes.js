import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";  // pastikan menggunakan curly braces
import { getDashboardStats } from "../controllers/dashboardController.js";
import { getAdminDashboard } from "../controllers/userController.js";
import db from "../config/db.js";

const router = express.Router();

// Admin Dashboard
// Endpoint: GET /api/admin/dashboard
router.get(
  "/admin/dashboard",
  authMiddleware,
  isAdmin,
  getAdminDashboard
);

// Statistik (Hanya admin)
// Endpoint: GET /api/stats
router.get(
  "/stats",
  authMiddleware,
  isAdmin,
  getDashboardStats
);

// Log Aktivitas (ambil dari tabel users)
// Endpoint: GET /api/logs
router.get(
  "/logs",
  authMiddleware,
  isAdmin,
  (req, res) => {
    const sql = "SELECT username, role, created_at FROM users ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ MySQL Error [getLogs]:", err.message);
        return res.status(500).json({ success: false, message: "Gagal mengambil data log." });
      }

      const logs = results.map((user) => {
        const tanggal = new Date(user.created_at);

        // Format: Kam, 17 Apr 2025
        const formattedDate = tanggal
          .toLocaleDateString("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/\./g, "");

        // Format: 12.45.24 (jam)
        const formattedTime = tanggal
          .toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(/:/g, ".");

        return {
          message: `${user.username} telah terdaftar sebagai ${user.role} pada ${formattedDate} pukul ${formattedTime}`,
          createdAt: user.created_at,
        };
      });

      return res.status(200).json(logs);
    });
  }
);

export default router;