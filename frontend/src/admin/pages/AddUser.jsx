import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaUserPlus,
  FaUserEdit, 
  FaUserCheck,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AddUser.css";

const AddUser = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login.");
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
        if (!res.ok) throw new Error("Gagal mengambil profil");

        const data = await res.json();

        if (data.role === "user") {
          toast.warning("Akses ditolak. Anda bukan admin.");
          navigate("/profile");
        } else if (data.role !== "admin") {
          toast.error("Role tidak dikenali.");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("❌ Error mengambil profil pengguna:", err);
        toast.error("Terjadi kesalahan saat autentikasi.");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      toast.error("Harap isi semua field yang wajib.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login. Token tidak ditemukan.");
      return;
    }

    const userData = {
      username: name.trim(),
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      email: email.trim(),
      password,
      role,
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Pengguna berhasil ditambahkan!");
        setName("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRole("");
        setTimeout(() => navigate("/admin/users/all"), 1200);
      } else {
        toast.error(`Gagal menambahkan pengguna: ${result.message || "Terjadi kesalahan."}`);
      }
    } catch (error) {
      console.error("Gagal mengirim data ke server:", error);
      toast.error("Terjadi kesalahan jaringan atau server.");
    }
  };

  if (loading) {
    return <div className="admin-add-user"><p>Loading...</p></div>;
  }

  return (
    <div className="admin-add-user">
      <div className="add-user-container">
        <h2><FaUserPlus style={{ marginRight: "8px" }} />Tambah Pengguna</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <label><FaUser style={{ marginRight: "6px" }} />Username</label>
          <input
            type="text"
            className="input-field"
            placeholder="Username..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>
            <FaUserEdit style={{ marginRight: "6px" }} />
            First Name <span style={{ fontWeight: "normal", fontStyle: "italic" }}>(opsional)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="First Name..."
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label>
            <FaUserEdit style={{ marginRight: "6px" }} />
            Last Name <span style={{ fontWeight: "normal", fontStyle: "italic" }}>(opsional)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Last Name..."
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label><FaEnvelope style={{ marginRight: "6px" }} />Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="Masukkan Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label><FaLock style={{ marginRight: "6px" }} />Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="Masukkan Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label><FaUserShield style={{ marginRight: "6px" }} />Role</label>
          <select
            className="input-field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Pilih Role...</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <button type="submit" className="submit-btn">
            <FaUserCheck style={{ marginRight: "6px" }} />
            Simpan Pengguna
          </button>
        </form>
      </div>
      <ToastContainer
        toastClassName="custom-toast-adduser"
        position="top-center"
        autoClose={1500}
      />
    </div>
  );
};

export default AddUser;
