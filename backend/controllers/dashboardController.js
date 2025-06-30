import db from "../config/db.js";

export const getDashboardStats = (req, res) => {
  db.query("SELECT COUNT(*) AS count FROM news WHERE status = 'Draft'", (err, draftRes) => {
    if (err) return res.status(500).json({ message: "Gagal ambil statistik draft" });

    db.query("SELECT COUNT(*) AS count FROM news WHERE status = 'Published'", (err, pubRes) => {
      if (err) return res.status(500).json({ message: "Gagal ambil statistik publish" });

      db.query("SELECT COUNT(*) AS count FROM comments", (err, commentRes) => {
        if (err) return res.status(500).json({ message: "Gagal ambil komentar" });

        db.query("SELECT COUNT(*) AS count FROM users", (err, userRes) => {
          if (err) return res.status(500).json({ message: "Gagal ambil user" });

          res.json({
            draft: draftRes[0].count,
            published: pubRes[0].count,
            comments: commentRes[0].count,
            users: userRes[0].count,
          });
        });
      });
    });
  });
};
