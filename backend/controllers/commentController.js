import db from '../config/db.js'; // Pastikan menggunakan koneksi db yang tepat

// Menambahkan komentar eksternal atau internal
export const addComment = (req, res) => {
  const { comment, type, newsExternalUrl, newsId, newsTitle } = req.body;
  const userId = req.user.id; // dari token

  if (!comment || (!newsExternalUrl && !newsId)) {
    return res.status(400).json({ message: "Komentar dan URL/ID berita diperlukan" });
  }

  let query, params;

  if (type === 'external') {
    // EXTERNAL: newsTitle sudah dikirim dari frontend
    if (!newsTitle) {
      return res.status(400).json({ message: "Judul berita diperlukan untuk komentar eksternal" });
    }

    console.log(`Menambahkan komentar eksternal: "${newsTitle}"`);

    query = `
      INSERT INTO comments (comment, user_id, news_external_url, news_source, news_title)
      VALUES (?, ?, ?, 'external', ?)
    `;
    params = [comment, userId, newsExternalUrl, newsTitle];

    insertComment(query, params, userId, res);

  } else if (type === 'internal') {
    // INTERNAL: Ambil judul dari tabel news
    const getTitleQuery = "SELECT title FROM news WHERE id = ?";
    db.query(getTitleQuery, [newsId], (err, result) => {
      if (err || result.length === 0) {
        console.error("Error ambil title internal:", err?.message || "Judul tidak ditemukan");
        return res.status(500).json({ message: "Gagal mengambil judul berita internal" });
      }

      const internalTitle = result[0].title;

      console.log(`Menambahkan komentar internal: "${internalTitle}"`);

      query = `
        INSERT INTO comments (comment, user_id, news_id, news_source, news_title)
        VALUES (?, ?, ?, 'internal', ?)
      `;
      params = [comment, userId, newsId, internalTitle];

      insertComment(query, params, userId, res);
    });

  } else {
    return res.status(400).json({ message: "Tipe komentar tidak valid" });
  }
};

// Fungsi bantu untuk insert komentar dan ambil username
const insertComment = (query, params, userId, res) => {
    db.query(query, params, (err, result) => {
        if (err) {
            console.error("Error adding comment:", err.message);
            return res.status(500).json({ message: "Terjadi kesalahan saat menambahkan komentar" });
        }

        const usernameQuery = "SELECT username FROM users WHERE id = ?"; // Ambil username berdasarkan userId
        db.query(usernameQuery, [userId], (err, result) => {
            if (err) {
                console.error("Error fetching username:", err.message);
                return res.status(500).json({ message: "Terjadi kesalahan saat mengambil username" });
            }

            const username = result[0]?.username;
            res.status(201).json({ message: "Komentar berhasil ditambahkan", username });
        });
    });
};

// Mengambil komentar berdasarkan URL eksternal atau ID internal
export const getComments = (req, res) => {
  const { url, newsId, type, title } = req.query;

  if (type === 'external' && !url && !title) {
    return res.status(400).json({ message: "URL atau title diperlukan untuk komentar eksternal" });
  }
  if (type === 'internal' && !newsId) {
    return res.status(400).json({ message: "ID berita diperlukan untuk komentar internal" });
  }

  let query, params;

  if (type === 'external') {
    if (title) {
      query = `
        SELECT comments.comment, users.username, comments.news_title, comments.created_at
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.news_title LIKE ?
      `;
      params = [`%${title}%`];
    } else {
      query = `
        SELECT comments.comment, users.username, comments.news_title, comments.created_at
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.news_external_url = ?
      `;
      params = [url];
    }
  } else if (type === 'internal') {
    query = `
      SELECT comments.comment, users.username, comments.news_title, comments.created_at
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.news_id = ?
    `;
    params = [newsId];
  } else {
    return res.status(400).json({ message: "Tipe komentar tidak valid" });
  }

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching comments:", err.message);
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil komentar" });
    }

    res.status(200).json({ comments: rows });
  });
};

// Controller untuk mengambil semua komentar
export const getAllComments = (req, res) => {
  const sql = `
    SELECT c.id, c.comment, c.user_id, u.username,
           c.news_id, c.news_title, c.news_external_url,
           c.news_source, c.created_at
    FROM comments c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
  `;
  
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal fetch semua komentar' });
    res.json({ comments: rows });
  });
};

// Controller untuk menghapus komentar
export const deleteComment = (req, res) => {
  db.query('DELETE FROM comments WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal hapus komentar' });
    if (!result.affectedRows) return res.status(404).json({ message: 'Komentar tidak ditemukan' });
    res.json({ message: 'Komentar berhasil dihapus' });
  });
};
