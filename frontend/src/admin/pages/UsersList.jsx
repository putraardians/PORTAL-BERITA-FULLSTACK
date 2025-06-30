import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UsersAdmin.css";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Semua");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal mengambil profil");
        return res.json();
      })
      .then((profile) => {
        if (profile.role !== "admin") {
          navigate(profile.role === "user" ? "/profile" : "/login");
        } else {
          return fetch("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      })
      .then(async (res) => {
        if (!res) return;
        if (!res.ok) throw new Error("Gagal mengambil daftar pengguna");
        const data = await res.json();
        setUsers(data);
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
                top: "8px",
                right: "8px",
                border: "none",
                background: "transparent",
                fontSize: "16px",
                cursor: "pointer",
                color: "#555",
                padding: 0,
                lineHeight: "1",
              }}
              aria-label="Tutup"
            >
              <FaTimes />
            </button>
            <p style={{ fontWeight: "bold", margin: "0 0 12px 0" }}>
              Yakin ingin menghapus pengguna ini?
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

  const deleteConfirmed = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal hapus user");
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("Pengguna berhasil dihapus!");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message || "Terjadi kesalahan saat menghapus user");
      });
  };

  const filteredUsers = users
    .filter((u) => selectedRole === "Semua" || u.role === selectedRole.toLowerCase())
    .filter((u) => {
      const q = searchTerm.toLowerCase();
      return (
        u.username.toLowerCase().includes(q) ||
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });

  const countAll = users.length;
  const countAdmin = users.filter((u) => u.role === "admin").length;
  const countUser = users.filter((u) => u.role === "user").length;

  return (
    <div className="users-list-container">
      <div className="users-list-header">
        <h2>Daftar Pengguna</h2>
        <Link to="/admin/users/add" className="users-add-button">+ Tambah Pengguna</Link>
      </div>

      <div className="users-list-tabs">
        {[
          { label: "Semua", value: "Semua", count: countAll },
          { label: "Admin", value: "Admin", count: countAdmin },
          { label: "User", value: "User", count: countUser },
        ].map(({ label, value, count }) => (
          <button
            key={value}
            className={`users-tab-button ${selectedRole === value ? "active" : ""}`}
            onClick={() => setSelectedRole(value)}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      <div className="users-list-filter" style={{ justifyContent: "flex-end" }}>
        <div className="users-search">
          Search: <input
            type="text"
            className="users-search-box"
            placeholder="Cari username, nama, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="users-list-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Username</th>
            <th>Nama Lengkap</th>
            <th>Email</th>
            <th>Role</th>
            <th>Dibuat Pada</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, idx) => (
            <tr key={user.id}>
              <td>{idx + 1}</td>
              <td>{user.username}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
              <td className="users-actions">
                <Link to={`/admin/users/edit/${user.id}`} className="users-edit-button">
                  <FaEdit />
                </Link>
                <button
                  className="users-delete-button"
                  title="Hapus User"
                  onClick={() => handleDelete(user.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>Tidak ada pengguna.</td>
            </tr>
          )}
        </tbody>
      </table>

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
}

export default UsersList;