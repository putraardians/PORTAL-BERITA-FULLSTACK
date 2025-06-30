import { useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import "../styles/AdminHeader.css";

export default function AdminHeader({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();

  return (
    <header className="admin-header">
      {/* Hamburger hanya muncul di mobile */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <h1 className="logo">Admin News Portal</h1>

      <div className="profile-section" onClick={() => navigate("/admin/profile")}>
        <FaUser size={24} />
      </div>
    </header>
  );
}
