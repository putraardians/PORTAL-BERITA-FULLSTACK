import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

// ✅ Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ REGISTER USER
export const registerUser = (req, res) => {
  let { username, email, password, role } = req.body;

  // Pastikan email dan username bertipe string sebelum trim()
  username = typeof username === "string" ? username.trim() : "";
  email = typeof email === "string" ? email.trim().toLowerCase() : "";
  password = typeof password === "string" ? password.trim() : "";

  // Validasi input
  if (!username || !email || !password) {
    console.log("❌ Validasi gagal, kolom kosong:", { username, email, password });
    return res.status(400).json({ success: false, message: "Semua kolom harus diisi!" });
  }

  // Cek apakah email sudah terdaftar
  const checkEmail = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmail, [email], (err, emailResult) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }

    if (emailResult.length > 0) {
      return res.status(400).json({ success: false, message: "Email sudah terdaftar!" });
    }

    // Cek apakah username sudah terdaftar
    const checkUsername = "SELECT * FROM users WHERE username = ?";
    db.query(checkUsername, [username], (err, usernameResult) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
      }

      if (usernameResult.length > 0) {
        return res.status(400).json({ success: false, message: "Username sudah terdaftar!" });
      }

      // Hash password untuk penyimpanan yang aman
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("❌ Error saat hashing password:", err);
          return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
        }

        // Menambahkan pengguna ke database dengan role default 'user'
        const sql = "INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())";
        db.query(sql, [username, email, hashedPassword, role || 'user'], (err, results) => {
          if (err) {
            console.error("❌ Gagal menyimpan ke database:", err);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menyimpan data" });
          }

          // Menampilkan log di server console menggunakan created_at dari tabel users
          const logMessage = `${username} telah terdaftar sebagai ${role || 'user'}`;
          console.log(`✅ Registrasi berhasil: ${logMessage} pada ${new Date()}`);

          // Mengembalikan response keberhasilan registrasi
          res.status(201).json({ success: true, message: "Registrasi berhasil!", username, email });
        });
      });
    });
  });
};


export const loginUser = async (req, res) => {
  let { email, password } = req.body;

  email = typeof email === "string" ? email.trim().toLowerCase() : "";
  password = typeof password === "string" ? password.trim() : "";

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email dan password wajib diisi!" });
  }

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [users] = await db.promise().query(sql, [email]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Email tidak ditemukan!" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Password salah!" });
    }

    // ✅ Tambahkan role ke dalam token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role, // penting!
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role, // tambahkan juga ke response
      },
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ REQUEST OTP
export const requestOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email harus diisi!" });

  try {
    const normalizedEmail = email.toLowerCase(); // Normalisasi email agar tidak case-sensitive

    // Cek apakah email ada di database
    const sqlSelect = "SELECT * FROM users WHERE email = ?";
    const [users] = await db.promise().query(sqlSelect, [normalizedEmail]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate OTP 6 digit
    const otpExpired = new Date(Date.now() + 15 * 60 * 1000); // OTP berlaku 15 menit

    const updateSql = "UPDATE users SET otp_code = ?, otp_expired = ? WHERE email = ?";
    await db.promise().query(updateSql, [otpCode, otpExpired, normalizedEmail]);

    // Kirim email OTP
    const mailOptions = {
      from: `"NEWS PORTAL" <putraardi431@gmail.com>`,
      to: normalizedEmail,
      subject: "Kode OTP Reset Password",
      html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Kode OTP Reset Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 20px;">
                  <table width="450" style="background: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                    <tr>
                      <td align="center">
                        <h2 style="color: #333; margin-bottom: 10px;">🔑 Reset Password</h2>
                        <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
                          Gunakan kode OTP berikut untuk mengatur ulang password Anda:
                        </p>
                        <div style="font-size: 28px; font-weight: bold; background: #3498db; color: white; padding: 15px 25px; display: inline-block; border-radius: 8px; letter-spacing: 3px;">
                          ${otpCode}
                        </div>
                        <p style="font-size: 14px; color: #777; margin-top: 15px;">
                          Kode ini berlaku selama <strong>15 menit</strong>.
                        </p>
                        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #888;">
                          Jika Anda tidak meminta reset password, abaikan email ini.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
          `,
        };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ message: "Gagal mengirim email" });
      }
      res.json({ success: true, message: "Kode OTP telah dikirim ke email!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

// ✅ VERIFIKASI OTP
export const verifyOTP = async (req, res) => {
  const { email, otp_code } = req.body;
  if (!email || !otp_code) {
    return res.status(400).json({ message: "Email dan OTP wajib diisi!" });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const sqlSelect = "SELECT * FROM users WHERE email = ?";
    const [users] = await db.promise().query(sqlSelect, [normalizedEmail]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const user = users[0];

    // Validasi OTP harus angka
    if (!Number.isInteger(parseInt(otp_code))) {
      return res.status(400).json({ message: "OTP tidak valid!" });
    }

    // Pastikan OTP cocok
    if (String(user.otp_code) !== String(otp_code)) {
      return res.status(400).json({ message: "OTP salah!" });
    }

    // Periksa apakah OTP telah kedaluwarsa
    if (new Date(user.otp_expired) < new Date()) {
      return res.status(400).json({ message: "OTP telah kedaluwarsa" });
    }

    // **Hapus OTP setelah diverifikasi**
    const sqlUpdate = "UPDATE users SET otp_code = NULL WHERE email = ?";
    await db.promise().query(sqlUpdate, [normalizedEmail]);

    // **Buat token sementara** untuk reset password (berlaku 10 menit)
    const resetToken = jwt.sign({ email: normalizedEmail }, SECRET_KEY, { expiresIn: "10m" });

    res.json({ success: true, message: "OTP valid!", resetToken });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { resetToken, new_password } = req.body;

  if (!resetToken || !new_password) {
    return res.status(400).json({ message: "Token dan password baru wajib diisi!" });
  }

  try {
    const decoded = jwt.verify(resetToken, SECRET_KEY);
    const email = decoded.email.trim().toLowerCase();

    // Cek apakah email ada di database
    const sqlSelect = "SELECT password FROM users WHERE email = ?";
    const [users] = await db.promise().query(sqlSelect, [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan!" });
    }

    const user = users[0];

    // Cek apakah password baru sama dengan yang lama
    const isSamePassword = await bcrypt.compare(new_password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "Password baru tidak boleh sama dengan yang lama!" });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password di database
    const updateSql = "UPDATE users SET password = ? WHERE email = ?";
    await db.promise().query(updateSql, [hashedPassword, email]);

    // **Buat token baru setelah reset password**
    const newToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

    console.log("✅ Token baru setelah reset password:", newToken); // DEBUGGING LOG

    res.json({
      success: true,
      message: "Password berhasil diperbarui! Silakan login kembali.",
      token: newToken, // ✅ Kirim token baru ke frontend
    });

  } catch (error) {
    console.error("❌ Error saat reset password:", error);
    return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa!" });
  }
};
