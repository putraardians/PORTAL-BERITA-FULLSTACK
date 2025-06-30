import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../config/db.js'; // Import koneksi database

const router = express.Router();

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join('public', 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log("Folder 'uploads' berhasil dibuat");
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, `thumb-${unique}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { title, content } = req.body;
  const filename = req.file.filename;
  const imagePath = `uploads/${filename}`; // Path relatif

  // Masukkan ke tabel news
  const sql = 'INSERT INTO news (title, content, image) VALUES (?, ?, ?)';
  db.query(sql, [title, content, imagePath], (err, result) => {
    if (err) {
      console.error('❌ Gagal simpan ke database:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json({
      message: '✅ Berita berhasil diunggah',
      data: {
        id: result.insertId,
        title,
        content,
        image: imagePath,
      }
    });
  });
});

// Error Handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  }
  console.error("Error:", err.message);
  return res.status(500).json({ message: err.message || 'Server error' });
});

export default router;
