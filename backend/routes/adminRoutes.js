import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/authAdmin.js';
import {
  getAllUsers,
  addUser,
  deleteUser,
  updateUser  // Import fungsi updateUser
} from '../controllers/userController.js'; // Pastikan path benar

const router = express.Router();

// ========================================================
// ✅ [1] Ambil semua user (admin only)
// ========================================================
router.get('/users', authMiddleware, isAdmin, getAllUsers);

// ========================================================
// ✅ [2] Tambah user baru (admin only / bisa juga dipakai public registrasi)
// ========================================================
router.post('/users', authMiddleware, isAdmin, addUser); 
// NOTE: Jika ingin public (tanpa login), hapus authMiddleware & isAdmin

// ========================================================
// ✅ [3] Hapus user berdasarkan ID (admin only)
// ========================================================
router.delete('/users/:id', authMiddleware, isAdmin, deleteUser);

// ========================================================
// ✅ [4] Edit user berdasarkan ID (admin only)
// ========================================================
router.put('/users/:id', authMiddleware, isAdmin, updateUser); // Endpoint untuk update user


export default router;
