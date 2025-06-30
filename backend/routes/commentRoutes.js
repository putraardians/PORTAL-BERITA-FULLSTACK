// routes/commentRoutes.js
import express from 'express';
import {
  addComment,
  getComments,
  getAllComments,
  deleteComment
} from '../controllers/commentController.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import isAdmin from '../middlewares/authAdmin.js';

const router = express.Router();

// Publik: komentar per berita
router.get('/', getComments);

// Login: tambah komentar
router.post('/', authenticateToken, addComment);

// Admin: ambil semua komentar
router.get('/all', authenticateToken, isAdmin, getAllComments);

// Admin: hapus komentar
router.delete('/:id', authenticateToken, isAdmin, deleteComment);

export default router;
