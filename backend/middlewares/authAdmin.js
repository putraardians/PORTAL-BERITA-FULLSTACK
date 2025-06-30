const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User belum login" });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Akses ditolak: Bukan admin" });
  }
  next();
};

export default isAdmin;
