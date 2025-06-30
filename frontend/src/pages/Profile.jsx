import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak ditemukan. Harap login kembali.");
        }
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
          throw new Error("Data pengguna tidak ditemukan.");
        }
        setUser(userData);
        setFormData(userData);
      } catch (err) {
        setError(err.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
    if (!user || !user.id) {
      toast.error("User ID tidak ditemukan. Harap login ulang.");
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
        const updatedUser = {
          ...user,
          [field]: formData[field],
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditableFields((prev) => ({ ...prev, [field]: false }));

        toast.success(`${field.replace(/_/g, " ")} berhasil diperbarui!`, {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        if (data.message?.toLowerCase().includes("username")) {
          toast.error("Username sudah digunakan oleh pengguna lain.");
        } else {
          toast.error(data.message || `Gagal memperbarui ${field}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat menyimpan.");
    }
  };

const getInitials = () => {
  if (!user || !user.username) return "";

  const words = user.username.trim().split(" ");
  const initials = words.map(word => word[0]).join("").slice(0, 2);

  return initials.toUpperCase();
};

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-container">
          <div className="initial-avatar">{getInitials()}</div>
        </div>
        <h2 className="profile-title">Your Account</h2>
      </div>

      <div className="profile-info">
        <h3 className="info-title">Basic Info</h3>
        <p className="info-subtitle">Manage your personal information</p>
        <div className="info-section">
          {["username", "email", "first_name", "last_name"].map((field) => (
            <div className="info-row" key={field}>
              <div className="info-label">{field.replace(/_/g, " ")}</div>
              <div className="info-content">
                {field === "email" ? (
                  <span className="info-value">{user[field]}</span>
                ) : editableFields[field] ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="info-input"
                  />
                ) : (
                  <span className="info-value">{user[field]}</span>
                )}
                {field !== "email" && (
                  <button
                    className="edit-btn"
                    onClick={() =>
                      editableFields[field]
                        ? handleSave(field)
                        : toggleEdit(field)
                    }
                  >
                    {editableFields[field] ? "Save" : "Edit"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer
        className="custom-toast"
        toastClassName="custom-toast-body"
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
};

export default Profile;
