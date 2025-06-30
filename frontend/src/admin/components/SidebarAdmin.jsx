import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Dashboard,
  Article,
  People,
  BarChart,
  ExitToApp,
  ExpandMore,
  ExpandLess,
  Person,
} from "@mui/icons-material";
import "../styles/SidebarAdmin.css";

function SidebarAdmin({ menuOpen, setMenuOpen }) {
  const [openMenus, setOpenMenus] = useState({
    news: false,
    users: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  };

  return (
    <div className={`sidebar-admin ${menuOpen ? "open" : ""}`}>
      <ul className="sidebar-admin-menu">
        {/* Dashboard */}
        <li
          className={`sidebar-admin-item ${
            currentPath === "/admin/dashboard" ? "active" : ""
          }`}
          onClick={handleLinkClick}
        >
          <Link to="/admin/dashboard" className="sidebar-admin-menu-item">
            <span className="sidebar-admin-menu-text">
              <Dashboard fontSize="small" /> Dashboard
            </span>
          </Link>
        </li>

        {/* Analytics */}
        <li
          className={`sidebar-admin-item ${
            currentPath === "/admin/analytics" ? "active" : ""
          }`}
          onClick={handleLinkClick}
        >
          <Link to="/admin/analytics" className="sidebar-admin-menu-item">
            <span className="sidebar-admin-menu-text">
              <BarChart fontSize="small" /> Analytics
            </span>
          </Link>
        </li>

        {/* Manage News */}
        <li
          className={`sidebar-admin-dropdown ${
            currentPath.startsWith("/admin/news") ? "active" : ""
          }`}
          onClick={() => toggleMenu("news")}
        >
          <span className="sidebar-admin-menu-item">
            <span className="sidebar-admin-menu-text">
              <Article fontSize="small" /> Manage News
            </span>
            <span className="sidebar-admin-dropdown-icon">
              {openMenus.news ? <ExpandLess /> : <ExpandMore />}
            </span>
          </span>
        </li>
        {openMenus.news && (
          <ul className="sidebar-admin-submenu open">
            <li
              className={currentPath === "/admin/news/all" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <Link to="/admin/news/all" className="sidebar-admin-submenu-item">
                Semua Berita
              </Link>
            </li>
            <li
              className={currentPath === "/admin/news/add" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <Link to="/admin/news/add" className="sidebar-admin-submenu-item">
                Tambah Baru
              </Link>
            </li>
            <li
              className={currentPath === "/admin/news/comments" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <Link to="/admin/news/comments" className="sidebar-admin-submenu-item">
                Komentar Berita
              </Link>
            </li>
          </ul>
        )}

        {/* Manage Users */}
        <li
          className={`sidebar-admin-dropdown ${
            currentPath.startsWith("/admin/users") ? "active" : ""
          }`}
          onClick={() => toggleMenu("users")}
        >
          <span className="sidebar-admin-menu-item">
            <span className="sidebar-admin-menu-text">
              <People fontSize="small" /> Manage Users
            </span>
            <span className="sidebar-admin-dropdown-icon">
              {openMenus.users ? <ExpandLess /> : <ExpandMore />}
            </span>
          </span>
        </li>
        {openMenus.users && (
          <ul className="sidebar-admin-submenu open">
            <li
              className={currentPath === "/admin/users/all" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <Link to="/admin/users/all" className="sidebar-admin-submenu-item">
                Semua Pengguna
              </Link>
            </li>
            <li
              className={currentPath === "/admin/users/add" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <Link to="/admin/users/add" className="sidebar-admin-submenu-item">
                Tambah Pengguna
              </Link>
            </li>
          </ul>
        )}

        {/* Profile Admin (dikeluarkan dari Manage Users) */}
        <li
          className={`sidebar-admin-item ${
            currentPath === "/admin/profile" ? "active" : ""
          }`}
          onClick={handleLinkClick}
        >
          <Link to="/admin/profile" className="sidebar-admin-menu-item">
            <span className="sidebar-admin-menu-text">
              <Person fontSize="small" /> Profile Admin
            </span>
          </Link>
        </li>
      </ul>

      {/* Logout */}
      <button onClick={handleLogout} className="sidebar-admin-menu-item logout-admin">
        <span className="sidebar-admin-menu-text">
          <ExitToApp fontSize="small" /> Logout
        </span>
      </button>
    </div>
  );
}

export default SidebarAdmin;
