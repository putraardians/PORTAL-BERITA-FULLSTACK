const express = require("express");
const router = express.Router();
const db = require("../config/db"); // ✅ Pastikan path ini benar
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// GET all users (hanya untuk admin)
router.get("/", authMiddleware, isAdmin, (req, res) => {
  const sql = `
    SELECT id, username, first_name, last_name, email, role, DATE(created_at) AS created_at 
    FROM users
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    res.json(results);
  });
});

// PUT update user profile (oleh user sendiri)
router.put("/update", authMiddleware, (req, res) => {
  const userId = req.user.id; // Didapat dari authMiddleware
  const { username, firstName, lastName } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID tidak ditemukan" });
  }

  const query = `
    UPDATE users 
    SET username = ?, first_name = ?, last_name = ? 
    WHERE id = ?
  `;
  const values = [username, firstName, lastName, userId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error updating user:", err);
      return res.status(500).json({ success: false, message: "Gagal memperbarui data" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    res.json({ success: true, message: "Profil berhasil diperbarui" });
  });
});

// GET profile user berdasarkan token (authenticated user)
router.get("/me", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT id, username, first_name, last_name, email, role, DATE(created_at) AS created_at 
    FROM users 
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user profile:", err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
