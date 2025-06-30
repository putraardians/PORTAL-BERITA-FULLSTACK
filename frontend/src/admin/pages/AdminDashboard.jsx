import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaFileAlt,
  FaFileUpload,
  FaComment,
  FaUser,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import "../styles/DashboardAdmin.css";
import { FaArrowRight } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    draft: 0,
    published: 0,
    comments: 0,
    users: 0,
  });
  const [newsList, setNewsList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!token || !user || user.role !== "admin") {
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/login");
        return;
      }

      setIsLoggedIn(true);
      setIsAdmin(true);

      const headers = { Authorization: `Bearer ${token}` };

      axios
        .get("http://localhost:5000/api/stats", { headers })
        .then((res) => setStats(res.data))
        .catch((err) => console.error("Gagal ambil statistik:", err));

      axios
        .get("http://localhost:5000/api/news/latest", { headers })
        .then((res) => setNewsList(res.data))
        .catch((err) => console.error("Gagal ambil berita:", err));

      axios
        .get("http://localhost:5000/api/logs", { headers })
        .then((res) => setLogs(res.data))
        .catch((err) => console.error("Gagal ambil log aktivitas:", err));
    } catch (error) {
      console.error("Error saat parsing user/token:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    if (statusParam) setStatusFilter(statusParam);
    else setStatusFilter("all");
  }, [location.search]);

  const filteredNews = newsList.filter((news) => {
    const titleMatch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch =
      statusFilter === "all" || news.status.toLowerCase() === statusFilter.toLowerCase();
    return titleMatch && statusMatch;
  });

  if (!isLoggedIn || !isAdmin) return null;

  return (
    <div className="dashboard">
      <div className="header-dashboard">
        <h1>Selamat Datang</h1>
        <p>NEWS PORTAL Seputar Teknologi</p>
      </div>

      <div className="stats-container">
        <StatCard
          icon={<FaFileAlt />}
          title="NEWS (DRAFT)"
          value={stats.draft}
          color="blue"
          onClick={() => navigate("/admin/news/all?status=draft")}
          moreText="Kelola Draft"
        />
        <StatCard
          icon={<FaFileUpload />}
          title="NEWS (PUBLISHED)"
          value={stats.published}
          color="orange"
          onClick={() => navigate("/admin/news/all?status=published")}
          moreText="Lihat Berita"
        />
        <StatCard
          icon={<FaComment />}
          title="COMMENT"
          value={stats.comments}
          color="green"
          onClick={() => navigate("/admin/news/comments")}
          moreText="Kelola Komentar"
        />
        <StatCard
          icon={<FaUser />}
          title="USER"
          value={stats.users}
          color="red"
          onClick={() => navigate("/admin/users/all")}
          moreText="Manajemen Pengguna"
        />
      </div>

      <div className="content-container">
        <div className="news-section">
          <h2>Daftar Berita Terbaru</h2>
          <div className="search-bar">
            <div className="admin-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="news-table-wrapper">
            <div className="news-table-scroll">
              <table className="news-table">
                <thead>
                  <tr>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNews.map((news) => (
                    <tr key={news.id}>
                      <td>{news.title}</td>
                      <td>{news.status}</td>
                      <td>
                        {new Date(news.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="activity-log">
          <h2>Log Aktivitas</h2>
          <ul>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <li key={index}>
                  <FaClock /> {log.message}
                </li>
              ))
            ) : (
              <li>Belum ada aktivitas tercatat.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
const StatCard = ({ icon, title, value, color, onClick, moreText, moreIcon }) => (
  <div className={`stat-card modern ${color}`} onClick={onClick}>
    <div className="info">
      <h3>{title}</h3>
      <p>{value}</p>
      <span className="more-link">
        {moreText} {moreIcon || <FaArrowRight className="arrow-icon" />}
      </span>
    </div>
    <div className="stat-icon">{icon}</div>
  </div>
);

export default AdminDashboard;