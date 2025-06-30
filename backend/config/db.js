import mysql from "mysql2"; // Menggunakan mysql2 biasa, bukan mysql2/promise
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "portal_berita",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal terhubung ke database:", err.message);
  } else {
    console.log("✅ Berhasil terhubung ke database!");
  }
});

export default db;
