import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware untuk autentikasi
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token tidak ditemukan" });
  }
  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware untuk cek role admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User belum login" });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Akses ditolak: Bukan admin" });
  }
  next();
};

// Ekspor keduanya
export { authMiddleware, isAdmin };
