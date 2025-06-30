import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaIdCard, FaEnvelope, FaUserShield, FaSave, FaEdit } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/EditUser.css";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }

  console.log("📥 [FETCH USER] Mengambil data pengguna ID:", id);

  fetch(`http://localhost:5000/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(`Gagal mengambil data pengguna: ${res.status} - ${text}`);
        });
      }
      return res.json();
    })
    .then((data) => {
      console.log("✅ [FETCH USER] Data berhasil diambil:", data);
      setUser(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("❌ [FETCH USER] Gagal:", err.message);
      setError("Terjadi kesalahan saat mengambil data pengguna.");
      setLoading(false);
    });
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

const handleSubmit = (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");

  console.log("📤 [SUBMIT] Mengirim data update untuk ID:", id);
  console.log("📦 [DATA] Data yang dikirim:", user);

  fetch(`http://localhost:5000/api/users/${id}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && (data.message?.toLowerCase().includes("berhasil") || data.success)) {
        console.log("✅ [UPDATE] Pengguna berhasil diperbarui:", data);

        toast.success("Data pengguna berhasil diperbarui!");

        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser && loggedInUser.id === parseInt(id)) {
          localStorage.setItem("user", JSON.stringify(user));
          console.log("🔄 [SESSION] Data pengguna yang sedang login ikut diperbarui.");
        }

        setTimeout(() => navigate("/admin/users/all"), 2000);
      } else {
        console.error("❌ [UPDATE] Gagal update:", data.message || data);
        toast.error(` ${data.message || "Gagal memperbarui data pengguna"}`);
      }
    })
    .catch((error) => {
      console.error("❌ [ERROR] Saat update user:", error);
      toast.error("Terjadi kesalahan saat memperbarui data pengguna.");
    });
};

  if (loading || error) {
    return (
      <div className="admin-layout">
        <SidebarAdmin />
        <main className="admin-edit-form">
          <div className="edit-form-container">
            {loading && <p className="status-message">Loading...</p>}
            {error && <p className="status-message error">{error}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <SidebarAdmin />
      <main className="admin-edit-form">
        <div className="edit-form-container">
          <h2><FaEdit /> Edit Pengguna</h2>
          <form onSubmit={handleSubmit} className="user-form">
            {[
              { field: "username", label: "Username", icon: <FaUser /> },
              { field: "first_name", label: "Nama Depan", icon: <FaIdCard /> },
              { field: "last_name", label: "Nama Belakang", icon: <FaIdCard /> },
              { field: "email", label: "Email", icon: <FaEnvelope /> },
            ].map(({ field, label, icon }) => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{icon} {label}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={user[field]}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            ))}

            <div className="form-group">
              <label htmlFor="role"><FaUserShield /> Role</label>
              <select
                id="role"
                name="role"
                value={user.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <FaSave /> Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </main>
      <ToastContainer
        toastClassName="custom-toast-edituser"
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
}

export default EditUser;
