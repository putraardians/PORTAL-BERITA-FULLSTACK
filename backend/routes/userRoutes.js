import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'; 
import {
  getAdminDashboard,
  getUserProfile,
  updateUserProfile,
  updateUserById,
  getAllUsers,
  deleteUserById,
  createUser,
  getUserById
} from '../controllers/userController.js';

const router = express.Router();

// Admin dashboard
router.get('/admin-dashboard', authMiddleware, isAdmin, getAdminDashboard);

// Profile user (untuk melihat profil pengguna yang sedang login)
router.get('/user-profile', authMiddleware, getUserProfile);

// Route untuk mengambil informasi profil pengguna yang sedang login
router.get('/me', authMiddleware, getUserProfile);

// Update user profile
router.put('/update', authMiddleware, updateUserProfile);

// Daftar semua pengguna (hanya untuk admin)
router.get('/', authMiddleware, isAdmin, getAllUsers);

// Hapus user berdasarkan ID (hanya untuk admin)
router.delete('/:id', authMiddleware, isAdmin, deleteUserById);

// Route untuk menambahkan user baru (hanya untuk admin)
router.post("/add", authMiddleware, isAdmin, createUser);

// Route untuk memperbarui data pengguna berdasarkan ID
router.put('/:id/update', authMiddleware, isAdmin, updateUserById);  // Endpoint ini untuk update berdasarkan ID

// Tambahkan route untuk ambil data pengguna berdasarkan ID
router.get('/:id', authMiddleware, isAdmin, getUserById);  // Endpoint untuk ambil user by ID

export default router;