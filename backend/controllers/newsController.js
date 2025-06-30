import db from "../config/db.js";
import { fetchNews } from "./newsApi.js"; // Pastikan path sudah benar

// Ambil berita terbaru dari database lokal
export const getLatestNews = (req, res) => {
  const sql = `
    SELECT id, title, status, created_at AS date 
    FROM news 
    ORDER BY created_at DESC 
    LIMIT 5
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal ambil berita terbaru:", err);
      return res.status(500).json({ message: "Gagal ambil berita terbaru" });
    }
    res.json(results);
  });
};

// Ambil berita eksternal berdasarkan kategori (misal dari NewsAPI)
export const getNews = async (req, res) => {
  try {
    const category = req.query.category || "general";
    const news = await fetchNews(category);
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetch external news:", error);
    res.status(500).json({ message: "Error fetching news", error });
  }
};

export const addNews = (req, res) => {
  const { title, content, category_id, status } = req.body;
  const author_id = req.user.id;
  const file = req.file;

  // Validasi input dasar
  if (!title || !content || !category_id || !status || !file) {
    return res.status(400).json({ message: "Semua field wajib diisi termasuk thumbnail!" });
  }

  if (title.length < 5) {
    return res.status(400).json({ message: "Judul harus lebih dari 5 karakter" });
  }

  if (content.length < 20) {
    return res.status(400).json({ message: "Konten berita harus lebih dari 20 karakter" });
  }

  // Validasi status (hanya draft atau published yang diperbolehkan)
  const allowedStatus = ['draft', 'published'];
  const cleanStatus = status.toLowerCase();
  if (!allowedStatus.includes(cleanStatus)) {
    return res.status(400).json({ message: "Status hanya boleh 'draft' atau 'published'." });
  }

  const imagePath = `/uploads/${file.filename}`;

  const sql = `
    INSERT INTO news (title, content, category_id, status, image, author_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, content, category_id, cleanStatus, imagePath, author_id],
    (err, result) => {
      if (err) {
        console.error("❌ Gagal menambahkan berita:", err);
        return res.status(500).json({ message: "Terjadi kesalahan saat menambahkan berita." });
      }

      console.log(`✅ Berita berhasil ditambahkan - ID: ${result.insertId},Judul: ${title}, Status: ${cleanStatus}`);
      res.status(201).json({ message: "Berita berhasil ditambahkan!", newsId: result.insertId });
    }
  );
};


// Mengambil semua berita dari database
export const getAllNews = (req, res) => {
  const sql = `
    SELECT 
      n.id,
      n.title,
      n.content,
      n.image,
      n.category_id,
      c.name AS category_name,
      u.username AS author_name,
      n.status,
      n.created_at AS date
    FROM news n
    LEFT JOIN categories c ON n.category_id = c.id
    LEFT JOIN users u ON n.author_id = u.id
    ORDER BY n.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal ambil semua berita:", err);
      return res.status(500).json({ message: "Gagal ambil semua berita" });
    }
    res.json(results);
  });
};

export const getCombinedNews = async (req, res) => {
  const category = req.query.category || "general";
  const category_id = mapCategoryNameToId(category);

  try {
    // ✅ Internal news dari DB
    const sqlInternal = `
      SELECT 
        n.id,
        n.title,
        n.content,
        n.image,
        n.category_id,
        c.name AS category_name,
        u.username AS author_name,
        n.status,
        n.created_at AS date
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.author_id = u.id
      WHERE c.name = ? AND n.status = 'published'
      ORDER BY n.created_at DESC
      LIMIT 10
    `;

    const internalNews = await new Promise((resolve, reject) => {
      db.query(sqlInternal, [category], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const formattedInternal = internalNews.map((news) => ({
      id: news.id,
      title: news.title,
      content: news.content,
      urlToImage: news.image || null,
      category: news.category_name,
      category_id: news.category_id,
      author: news.author_name,
      publishedAt: news.date,
      url: `/newsDetail/${news.id}`,
      source_type: "internal",
    }));

    // ✅ External news dari API
    const externalNews = await fetchNews(category);

    const formattedExternal = (externalNews.articles || []).map((article) => ({
      id: null,
      title: article.title,
      content: article.content || article.description || "",
      urlToImage: article.urlToImage || null,
      category: category,
      category_id: category_id, // ← ✅ penting agar bisa dicatat ke news_views
      author: article.author || "Unknown Author",
      publishedAt: article.publishedAt || new Date().toISOString(),
      url: article.url,
      source_type: "external",
    }));

    const combinedNews = [...formattedInternal, ...formattedExternal];

    // Urutkan berdasarkan tanggal terbaru
    combinedNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.json({ articles: combinedNews });
  } catch (error) {
    console.error("❌ Error fetching combined news:", error);
    res.status(500).json({ message: "Failed to fetch combined news", error });
  }
};


// Menghapus berita berdasarkan ID
export const deleteNews = (req, res) => {
  const newsId = req.params.id;

  if (!newsId) {
    return res.status(400).json({ message: "ID berita tidak ditemukan." });
  }

  // Ambil dulu judul berita sebelum dihapus
  const selectSql = `SELECT title FROM news WHERE id = ?`;
  db.query(selectSql, [newsId], (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Gagal mengambil berita:", selectErr);
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil berita." });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan." });
    }

    const newsTitle = selectResult[0].title;

    // Setelah dapat judul, lakukan delete
    const deleteSql = `DELETE FROM news WHERE id = ?`;
    db.query(deleteSql, [newsId], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Gagal menghapus berita:", deleteErr);
        return res.status(500).json({ message: "Terjadi kesalahan saat menghapus berita." });
      }

      if (deleteResult.affectedRows > 0) {
        console.log(`✅ Berita berhasil dihapus dengan ID: ${newsId}, Judul: ${newsTitle}`);
        return res.status(200).json({ message: "Berita berhasil dihapus." });
      } else {
        return res.status(404).json({ message: "Berita tidak ditemukan." });
      }
    });
  });
};


// Mengambil berita berdasarkan ID
export const getNewsById = (req, res) => {
  const newsId = req.params.id;

  const sql = `
    SELECT n.id, n.title, n.content, n.image, c.name AS category_name, 
    u.username AS author_name, n.status, n.created_at AS date,
    n.category_id
    FROM news n
    LEFT JOIN categories c ON n.category_id = c.id
    LEFT JOIN users u ON n.author_id = u.id
    WHERE n.id = ?
  `;

  db.query(sql, [newsId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil berita." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan." });
    }

    const news = results[0];
    // 👇 Tambahkan image_url untuk preview
    news.image_url = news.image; // contoh: /uploads/berita1.jpg

    res.json(news);
  });
};



// Mengedit berita berdasarkan ID
export const updateNews = (req, res) => {
  const newsId = req.params.id;
  const { title, content, category_id, status } = req.body;
  const file = req.file;

  // Validasi input
  if (!title || !content || !category_id || !status) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  if (title.length < 5) {
    return res.status(400).json({ message: "Judul harus lebih dari 5 karakter." });
  }

  if (content.length < 20) {
    return res.status(400).json({ message: "Konten berita harus lebih dari 20 karakter." });
  }

  // Validasi nilai status
  const allowedStatus = ['draft', 'published'];
  if (!allowedStatus.includes(status.toLowerCase())) {
    return res.status(400).json({ message: "Status harus 'draft' atau 'published'." });
  }

  let sql = `
    UPDATE news 
    SET title = ?, content = ?, category_id = ?, status = ?
  `;
  const params = [title, content, category_id, status.toLowerCase()];

  if (file) {
    const imagePath = `/uploads/${file.filename}`;
    sql += `, image = ?`;
    params.push(imagePath);
  }

  sql += ` WHERE id = ?`;
  params.push(newsId);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("❌ Gagal memperbarui berita:", err);
      return res.status(500).json({ message: "Terjadi kesalahan saat memperbarui berita." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan." });
    }

    // ✅ Log berhasil update termasuk status
    console.log(`✅ Berita berhasil diperbarui - ID: ${newsId}, Judul: ${title}, Status: ${status}`);

    return res.json({ message: "Berita berhasil diperbarui.", success: true });
  });
};

