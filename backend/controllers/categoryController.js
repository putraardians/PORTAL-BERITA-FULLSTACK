import db from "../config/db.js";

export const getCategories = (req, res) => {
  const sql = `SELECT id, name FROM categories ORDER BY name`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil kategori:", err);
      return res.status(500).json({ message: "Gagal ambil kategori" });
    }
    res.json(results);
  });
};

export const updateCategory = (req, res) => {
  const categoryId = req.params.id; // ID kategori yang akan diperbarui
  const { name } = req.body; // Nama kategori baru dari body request

  // Validasi jika nama kategori kosong
  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Nama kategori tidak boleh kosong." });
  }

  // Pastikan categoryId adalah angka (jika ID kategori berupa angka)
  if (isNaN(categoryId)) {
    return res.status(400).json({ message: "ID kategori tidak valid." });
  }

  // Query untuk memperbarui kategori
  const sql = `UPDATE categories SET name = ? WHERE id = ?`;

  db.query(sql, [name, categoryId], (err, result) => {
    if (err) {
      console.error("❌ Gagal memperbarui kategori:", err);
      return res.status(500).json({ message: "Terjadi kesalahan saat memperbarui kategori." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan." });
    }

    return res.json({ message: "Kategori berhasil diperbarui.", success: true });
  });
};
