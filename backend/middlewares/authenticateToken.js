import jwt from "jsonwebtoken";

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Ambil token dari header Authorization

  if (!token) {
    return res.status(403).json({ message: "Token diperlukan" });
  }

  try {
    // Verifikasi token dan decode user
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Simpan user yang sudah ter-decode ke dalam request
    next(); // Lanjutkan ke handler berikutnya
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid", error: err.message });
  }
};

export default authenticateToken;
