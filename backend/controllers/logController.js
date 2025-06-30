import db from "../config/db.js";

export const getLogs = (req, res) => {
  const sql = `
    SELECT name, role, created_at 
    FROM users 
    WHERE created_at >= NOW() - INTERVAL 7 DAY  -- mengambil log dalam 7 hari terakhir
    ORDER BY created_at DESC 
    LIMIT 10
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal ambil log:", err);
      return res.status(500).json({ message: "Gagal ambil log" });
    }

    const logs = results.map(user => {
      const hoursAgo = Math.floor((new Date() - new Date(user.created_at)) / 3600000); // menghitung jam lalu
      return `${user.name} Telah terdaftar sebagai ${user.role} - ${hoursAgo} jam lalu`;
    });

    res.json(logs);
  });
};
