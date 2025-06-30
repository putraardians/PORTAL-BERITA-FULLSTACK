import React from "react";
import "../styles/FooterAdmin.css";

const FooterAdmin = () => {
  return (
    <footer className="admin-footer">
      <div className="admin-footer-content">
        <p>
          Powered by <strong>Putra Ardiansyah</strong> © {new Date().getFullYear()} — All rights reserved | PT Winnicode Garuda Teknologi
        </p>
      </div>
    </footer>
  );
};

export default FooterAdmin;
