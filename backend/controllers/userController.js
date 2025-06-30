import db from '../config/db.js';
import bcrypt from "bcrypt";

// Middleware sederhana untuk cek auth
const checkAuth = (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
};

// =================== DASHBOARD ADMIN ===================
export const getAdminDashboard = (req, res) => {
  res.status(200).json({ message: `Halo admin ${req.user.username}` });
};

// =================== PROFIL USER ===================
export const getUserProfile = (req, res) => {
  if (!checkAuth(req, res)) return;

  const userId = req.user.id;
  const query = `
    SELECT id, username, email, first_name, last_name, role, created_at
    FROM users
    WHERE id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ MySQL Error [getUserProfile]:", err.message);
      return res.status(500).json({ message: "Gagal mengambil profil pengguna" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json(results[0]);
  });
};

export const updateUserProfile = (req, res) => {
  if (!checkAuth(req, res)) return;

  const userId = req.user.id;
  let { username, first_name, last_name, email } = req.body;

  // Validasi format email jika dikirim
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Format email tidak valid." });
  }

  // Fungsi untuk melakukan update setelah pengecekan
  const checkAndUpdate = () => {
    const fieldsToUpdate = [];
    const values = [];

    if (username !== undefined) {
      username = username.trim();
      fieldsToUpdate.push("username = ?");
      values.push(username);
    }
    if (first_name !== undefined) {
      first_name = first_name.trim();
      fieldsToUpdate.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      last_name = last_name.trim();
      fieldsToUpdate.push("last_name = ?");
      values.push(last_name);
    }
    if (email !== undefined) {
      email = email.trim();
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "Tidak ada data yang diperbarui." });
    }

    const updateQuery = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    values.push(userId);

    db.query(updateQuery, values, (err) => {
      if (err) {
        console.error("❌ MySQL Error [updateUserProfile]:", err.message);
        return res.status(500).json({ message: "Gagal memperbarui profil pengguna." });
      }

      // Perbarui session data
      req.user = {
        ...req.user,
        ...(username !== undefined && { username }),
        ...(first_name !== undefined && { first_name }),
        ...(last_name !== undefined && { last_name }),
        ...(email !== undefined && { email }),
      };

      res.status(200).json({ message: "Profil berhasil diperbarui." });
    });
  };

  // Mengecek apakah username dan email sudah ada di database
  const checkUsernameAndEmail = () => {
    const checkQuery = "SELECT id, username, email FROM users WHERE id != ?";
    db.query(checkQuery, [userId], (err, result) => {
      if (err) {
        console.error("❌ MySQL Error [checkUsernameAndEmail]:", err.message);
        return res.status(500).json({ message: "Gagal memeriksa data pengguna." });
      }

      // Cek jika username sudah digunakan
      if (result.length > 0) {
        const existingUser = result.find(user => user.username === username || user.email === email);
        
        if (existingUser) {
          if (existingUser.username === username) {
            return res.status(409).json({ message: "Username sudah digunakan, silakan pilih yang lain." });
          }
          if (existingUser.email === email) {
            return res.status(409).json({ message: "Email sudah terdaftar, gunakan email lain." });
          }
        }
      }

      // Lanjutkan ke proses update jika username dan email aman
      checkAndUpdate();
    });
  };

  // Jika username dikirim, periksa apakah username sudah digunakan
  if (username !== undefined) {
    checkUsernameAndEmail();
  } else {
    // Jika username tidak dikirim, lanjutkan pengecekan untuk email dan update data
    checkUsernameAndEmail();
  }
};


// =================== ADMIN: KELOLA USERS ===================
export const getAllUsers = (req, res) => {
  const query = `
    SELECT id, username, first_name, last_name, email, role, created_at
    FROM users
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ MySQL Error [getAllUsers]:", err.message);
      return res.status(500).json({ message: "Gagal mengambil data pengguna" });
    }

    res.status(200).json(results);
  });
};

export const getUserById = (req, res) => {
  const userId = req.params.id;

  // Periksa apakah userId valid
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "ID pengguna tidak valid." });
  }

  // Mengonversi userId ke integer setelah memastikan validitasnya
  const parsedUserId = parseInt(userId);

  const sql = `
    SELECT id, username, first_name, last_name, email, role
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [parsedUserId], (err, result) => {
    if (err) {
      console.error("❌ MySQL Error [getUserById]:", err.message);
      return res.status(500).json({ message: "Gagal mengambil data user" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(result[0]);
  });
};


export const deleteUserById = (req, res) => {
  const userIdToDelete = parseInt(req.params.id);
  const currentUserId = req.user.id;

  if (userIdToDelete === currentUserId) {
    return res.status(400).json({ success: false, message: "Admin tidak bisa menghapus dirinya sendiri." });
  }

  // Ambil data user dulu untuk keperluan log
  const getUserSql = "SELECT username, email FROM users WHERE id = ?";
  db.query(getUserSql, [userIdToDelete], (err, users) => {
    if (err) {
      console.error("❌ MySQL Error [getUser]:", err.message);
      return res.status(500).json({ success: false, message: "Gagal mengambil data pengguna" });
    }

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan" });
    }

    const deletedUser = users[0];

    db.beginTransaction(err => {
      if (err) {
        console.error("❌ MySQL Error [beginTransaction]:", err.message);
        return res.status(500).json({ success: false, message: "Gagal memulai transaksi" });
      }

      const deleteCommentsSql = "DELETE FROM comments WHERE user_id = ?";
      db.query(deleteCommentsSql, [userIdToDelete], (err) => {
        if (err) {
          console.error("❌ MySQL Error [deleteComments]:", err.message);
          return db.rollback(() =>
            res.status(500).json({ success: false, message: "Gagal menghapus komentar terkait" })
          );
        }

        const deleteUserSql = "DELETE FROM users WHERE id = ?";
        db.query(deleteUserSql, [userIdToDelete], (err, result) => {
          if (err) {
            console.error("❌ MySQL Error [deleteUser]:", err.message);
            return db.rollback(() =>
              res.status(500).json({ success: false, message: "Gagal menghapus pengguna" })
            );
          }

          if (result.affectedRows === 0) {
            return db.rollback(() =>
              res.status(404).json({ success: false, message: "Pengguna tidak ditemukan" })
            );
          }

          db.commit(err => {
            if (err) {
              console.error("❌ MySQL Error [commit]:", err.message);
              return db.rollback(() =>
                res.status(500).json({ success: false, message: "Gagal menyelesaikan transaksi" })
              );
            }

            // ✅ Log user yang dihapus
            console.log(`✅ Pengguna berhasil dihapus - ID: ${userIdToDelete}, Username: ${deletedUser.username}, Email: ${deletedUser.email}`);

            res.status(200).json({ success: true, message: "Pengguna dan komentar berhasil dihapus" });
          });
        });
      });
    });
  });
};


export const updateUserById = (req, res) => {
  const userIdToUpdate = parseInt(req.params.id);
  const { first_name, last_name, username, email, role } = req.body;

  // Pastikan hanya admin atau pengguna yang bersangkutan yang bisa mengubah data
  if (req.user.id !== userIdToUpdate && req.user.role !== 'admin') {
    return res.status(403).json({ message: "Anda tidak memiliki izin untuk memperbarui pengguna ini" });
  }

  // Pastikan semua field yang diperlukan ada
  if (!username || !email || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  // Cek apakah username atau email sudah digunakan oleh user lain
  const checkSql = "SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?";
  db.query(checkSql, [username, email, userIdToUpdate], (err, result) => {
    if (err) {
      console.error("❌ Error saat mengecek user:", err.message);
      return res.status(500).json({ message: "Terjadi kesalahan saat memeriksa user" });
    }

    if (result.length > 0) {
      const existingUser = result[0];
      if (existingUser.username === username) {
        return res.status(409).json({ message: "Username sudah digunakan, silakan pilih yang lain." });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ message: "Email sudah terdaftar, gunakan email lain." });
      }
    }

    // Update data pengguna
    const updateSql = `
      UPDATE users SET first_name = ?, last_name = ?, username = ?, email = ?, role = ?
      WHERE id = ?
    `;
    const values = [first_name, last_name, username, email, role, userIdToUpdate];

    db.query(updateSql, values, (err, result) => {
      if (err) {
        console.error("❌ MySQL Error [updateUser]:", err.message);
        return res.status(500).json({ message: "Gagal mengupdate pengguna" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }

      // Log tambahan
      console.log(`✅ Pengguna berhasil diperbarui - ID: ${userIdToUpdate}, Username: ${username}`);

      res.status(200).json({ message: "Pengguna berhasil diperbarui" });
    });
  });
};

// =================== ADMIN: TAMBAH USER ===================
export const createUser = async (req, res) => {
  const { first_name, last_name, username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    const checkSql = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(checkSql, [username, email], async (err, result) => {
      if (err) {
        console.error("❌ Error saat mengecek user:", err.message);
        return res.status(500).json({ message: "Terjadi kesalahan saat memeriksa user" });
      }

      if (result.length > 0) {
        const existingUser = result[0];
        if (existingUser.username === username) {
          return res.status(409).json({ message: "Username sudah digunakan, silakan pilih yang lain." });
        }
        if (existingUser.email === email) {
          return res.status(409).json({ message: "Email sudah terdaftar, gunakan email lain." });
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const insertSql = `INSERT INTO users (first_name, last_name, username, email, password, role)
                         VALUES (?, ?, ?, ?, ?, ?)`;

      const values = [
        first_name || "",
        last_name || "",
        username,
        email,
        hashedPassword,
        role,
      ];

      db.query(insertSql, values, (err, result) => {
        if (err) {
          console.error("❌ MySQL Error [createUser]:", err.message);
          return res.status(500).json({ message: "Gagal membuat pengguna" });
        }

        // ✅ Tambahkan log user yang berhasil dibuat
        console.log(`✅ Pengguna berhasil dibuat - ID: ${result.insertId}, Username: ${username}, Email: ${email}`);

        res.status(201).json({ message: "Pengguna berhasil ditambahkan", userId: result.insertId });
      });
    });
  } catch (error) {
    console.error("❌ Error [createUser]:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan user" });
  }
};
