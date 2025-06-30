// FILE: NewsAdmin.js

import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/NewsAdmin.css";

const NewsAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [entries, setEntries] = useState(10);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const statusFromQuery = queryParams.get("status");
    if (statusFromQuery) {
      const formatted = statusFromQuery.charAt(0).toUpperCase() + statusFromQuery.slice(1);
      setSelectedStatus(formatted);
    }
  }, [location.search]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.role !== "admin") {
          navigate("/profile");
        } else {
          fetchNews(token);
        }
      })
      .catch((err) => {
        console.error("Gagal autentikasi:", err);
        navigate("/login");
      });
  }, [navigate]);

  const fetchNews = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/news/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNewsList(sortedData);
      } else {
        toast.error(`Gagal ambil berita: ${data.message}`);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat fetch berita:", error);
      toast.error("Terjadi kesalahan saat mengambil berita.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            position: "relative",
            padding: "5px 10px 10px 10px",
            maxWidth: "320px",
          }}
        >
          <FaExclamationTriangle size={25} color="#f4b400" style={{ flexShrink: 0, marginTop: 4 }} />
          <div style={{ flex: 1, paddingRight: "26px" }}>
            <button
              onClick={closeToast}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                border: "none",
                background: "transparent",
                fontSize: "16px",
                cursor: "pointer",
                color: "#555",
              }}
              aria-label="Tutup"
            >
              <FaTimes />
            </button>
            <p style={{ fontWeight: "bold", margin: "0 0 12px 0" }}>
              Yakin ingin menghapus berita ini?
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  deleteConfirmed(id);
                  closeToast();
                }}
                style={{
                  backgroundColor: "#e53935",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaTrash /> Ya
              </button>
              <button
                onClick={closeToast}
                style={{
                  backgroundColor: "#9e9e9e",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      ),
      {
        closeOnClick: false,
        closeButton: false,
        autoClose: false,
        position: "top-center",
        className: "custom-toast-wrapper",
      }
    );
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNewsList((prev) => prev.filter((n) => n.id !== id));
        toast.success("Berita berhasil dihapus!");
      } else {
        toast.error(`Gagal menghapus: ${data.message}`);
      }
    } catch (error) {
      console.error("Gagal menghapus berita:", error);
      toast.error("Terjadi kesalahan saat menghapus berita.");
    }
  };

  const filteredNews = newsList.filter((news) => {
    const q = searchTerm.toLowerCase();
    const statusMatch =
      selectedStatus === "Semua" || news.status?.toLowerCase() === selectedStatus.toLowerCase();
    const searchMatch =
      news.title.toLowerCase().includes(q) ||
      news.category_name?.toLowerCase().includes(q) ||
      news.author_name?.toLowerCase().includes(q) ||
      news.status?.toLowerCase().includes(q);
    return statusMatch && searchMatch;
  });

  if (loading) {
    return <div className="news-admin-container"><p>Loading berita...</p></div>;
  }

  return (
    <div className="news-admin-container">
      <div className="news-container">
        <div className="news-header">
          <h2>Daftar Berita (Admin)</h2>
          <Link to="/admin/news/add" className="add-button">+ Tambah Berita</Link>
        </div>

        <div className="news-tabs">
          {["Semua", "Published", "Draft"].map((status) => {
            const count = newsList.filter(
              (n) => status === "Semua" || n.status?.toLowerCase() === status.toLowerCase()
            ).length;
            return (
              <button
                key={status}
                className={selectedStatus === status ? "active-tab" : ""}
                onClick={() => setSelectedStatus(status)}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        <div className="filter-bar">
          <div className="entries-control">
            Show
            <select value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            entries
          </div>
          <div>
            Search:
            <input
              type="text"
              className="search-box"
              placeholder="Cari judul, kategori, penulis, atau status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <p>Tidak ada berita yang ditemukan.</p>
        ) : (
          <div className="table-wrapper">
            <table className="news-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Penulis</th>
                  <th>Status</th>
                  <th>Konten</th>
                  <th>Gambar</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.slice(0, entries).map((news, index) => (
                  <tr key={news.id}>
                    <td>{index + 1}</td>
                    <td>{news.title}</td>
                    <td>{news.category_name || "-"}</td>
                    <td>{news.author_name || "-"}</td>
                    <td>{news.status}</td>
                    <td>
                      <div
                        className="news-content-preview"
                        dangerouslySetInnerHTML={{
                          __html: news.content
                            ? news.content.length > 200
                              ? news.content.slice(0, 200) + "..."
                              : news.content
                            : "<em>-</em>",
                        }}
                      />
                    </td>
                    <td>
                      {news.image ? (
                        <img
                          src={`http://localhost:5000${news.image}`}
                          alt="thumbnail"
                          width="80"
                          style={{ borderRadius: "4px" }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{new Date(news.date).toLocaleString("id-ID")}</td>
                    <td className="aksi">
                      <Link to={`/admin/news/edit/${news.id}`} className="edit-button">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(news.id)} className="delete-button">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer
        className="custom-toast-allnews"
        toastClassName="custom-toast-allnews"
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
};

export default NewsAdmin;