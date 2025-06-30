import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileAdmin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileAdmin = () => {
  const [user, setUser] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    if (!token) {
      if (isMounted) navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Tidak dapat mengambil profil pengguna");
        const data = await res.json();

        if (data.role !== "admin") {
          navigate(data.role === "user" ? "/profile" : "/login");
          return;
        }

        if (isMounted) {
          setUser(data);
          setFormData({
            username: data.username || "",
            email: data.email || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
          });
        }
      })
      .catch((err) => {
        setError("Terjadi kesalahan saat mengambil profil.");
        navigate("/login");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const toggleEdit = useCallback((field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSave = async (field) => {
    if (!user?.id) {
      toast.error("User ID tidak ditemukan.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          [field]: formData[field],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedRes = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedUser = await updatedRes.json();

        setUser(updatedUser);
        setFormData({
          username: updatedUser.username,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
        });

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setEditableFields((prev) => ({ ...prev, [field]: false }));
        toast.success(`${field.replace(/_/g, " ")} berhasil diperbarui!`);
      } else {
        toast.error(data.message || `Gagal memperbarui ${field}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan.");
    }
  };

  const getInitials = () => {
    if (!user || !user.username) return "";
    const words = user.username.trim().split(" ");
    return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User tidak ditemukan.</p>;

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <div className="admin-profile-avatar">
          <div className="admin-initial-avatar">{getInitials()}</div>
        </div>
        <h2>Admin Account</h2>
      </div>

      <div className="admin-profile-content">
        <h3>Basic Info</h3>
        <p>Manage your personal information</p>

        <div className="admin-profile-info">
          {["username", "email", "first_name", "last_name"].map((field) => (
            <div className="admin-profile-item" key={field}>
              <span className="admin-profile-label">{field.replace(/_/g, " ")}</span>
              <div className="admin-profile-value">
                {editableFields[field] ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="admin-profile-input"
                  />
                ) : (
                  <span>{formData[field]}</span>
                )}
              </div>
              <button
                className="admin-profile-edit-button"
                onClick={() =>
                  editableFields[field] ? handleSave(field) : toggleEdit(field)
                }
              >
                {editableFields[field] ? "Save" : "Edit"}
              </button>
            </div>
          ))}

          <div className="admin-profile-item">
            <span className="admin-profile-label">Role</span>
            <div className="admin-profile-value">
              <span className="admin-profile-role">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        toastClassName="custom-toast-profileadmin"
        position="top-center"
        autoClose={1500}
      />
    </div>
  );
};

export default ProfileAdmin;
