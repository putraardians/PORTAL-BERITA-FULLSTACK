import React, { useEffect } from "react";
import "../styles/NotAuthorized.css"; // Pastikan path-nya sesuai

const NotAuthorized = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❌ Akses ditolak: Tidak ada token (belum login).");
    } else {
      const role = localStorage.getItem("role");
      if (role === "user") {
        console.warn("🚫 Akses ditolak: Role 'user' tidak memiliki izin ke halaman ini.");
      } else {
        console.warn("⚠️ Akses ditolak: Role tidak dikenali atau tidak punya hak akses.");
      }
    }
  }, []);

  return (
    <div className="not-authorized-container">
      <h1>403 - Akses Ditolak</h1>
      <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
    </div>
  );
};

export default NotAuthorized;
