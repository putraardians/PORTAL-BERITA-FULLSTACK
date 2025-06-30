import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/NewsAdmin.css"; // Pakai style NewsAdmin agar konsisten

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(10);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Tidak dapat mengambil profil");
        const data = await res.json();
        if (data.role !== "admin") {
          navigate(data.role === "user" ? "/profile" : "/login");
        } else {
          return fetch("http://localhost:5000/api/comments/all", {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
        }
      })
      .then(async (res) => {
        if (!res) return;
        if (!res.ok) throw new Error("Gagal mengambil komentar");
        const body = await res.json();
        setComments(body.comments);
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

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
              Apakah Anda yakin ingin menghapus komentar ini?
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
      const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        toast.success("Komentar berhasil dihapus!");
      } else {
        toast.error(`Gagal menghapus: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menghapus komentar.");
    }
  };

  const filtered = comments
    .filter((c) => filter === "all" || c.news_source === filter)
    .filter((c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.news_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="news-admin-container">
      <div className="news-container">
        <div className="news-header">
          <h2>Daftar Komentar</h2>
        </div>

        <div className="news-tabs">
          {["all", "internal", "external"].map((key) => (
            <button
              key={key}
              className={filter === key ? "active-tab" : ""}
              onClick={() => setFilter(key)}
            >
              {key === "all"
                ? `Semua (${comments.length})`
                : key === "internal"
                ? `Internal (${comments.filter((c) => c.news_source === "internal").length})`
                : `Eksternal (${comments.filter((c) => c.news_source === "external").length})`}
            </button>
          ))}
        </div>

        <div className="filter-bar">
          <label>
            Show&nbsp;
            <select value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            &nbsp;entries
          </label>

          <div>
            Search:<br />
            <input
              type="text"
              className="search-box"
              placeholder="Cari username, Judul berita, atau Komentar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="news-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Username</th>
                <th>Judul Berita</th>
                <th>Sumber</th>
                <th>URL</th>
                <th>Komentar</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {[...filtered]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, entries)
                .map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.username}</td>
                    <td>{c.news_title}</td>
                    <td>{c.news_source}</td>
                    <td>
                      {c.news_external_url ? (
                        <a href={c.news_external_url} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{c.comment}</td>
                    <td>
                      {new Date(c.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="aksi">
                      {/* Kalau ada fitur edit komentar nanti bisa aktifkan ini */}
                      {/* <button className="edit-button"><FaEdit /> Edit</button> */}
                      <button className="delete-button" onClick={() => handleDelete(c.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Tidak ada komentar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

export default CommentSection;
