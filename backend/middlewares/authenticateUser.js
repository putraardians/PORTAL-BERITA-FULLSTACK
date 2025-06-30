// middlewares/authenticateUser.js
import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak, token tidak ditemukan" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Simpan data user yang terverifikasi ke dalam req.user

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid", error: err.message });
  }
};

export { authenticateUser };
