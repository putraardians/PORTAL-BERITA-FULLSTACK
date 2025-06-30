import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password) {
        toast.error("Email dan password harus diisi!", {
          position: "top-center",
          autoClose: 1000,
        });
        return;
      }

      const data = await loginUser(formData);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success(`Login berhasil! Selamat datang, ${data.user.username}`, {
          position: "top-center",
          autoClose: 1200,
          onClose: () => {
            const urlParams = new URLSearchParams(location.search);
            const category = urlParams.get("category") || "all";
            localStorage.setItem("category", category);

            if (data.user.role === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate(`/Home?category=${category}`);
            }
          },
        });
      } else {
        toast.error("Login gagal: Token tidak ditemukan", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat login!",
        {
          position: "top-center",
          autoClose: 1000,
        }
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign in to your News Portal account</h2>
        <p className="signup-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>

          <button type="submit" className="login-btn">
            Sign in
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <p className="terms">
          By signing up or signing in, you agree to our{" "}
          <Link to="#">Terms of Use</Link> and have read our{" "}
          <Link to="#">Privacy Policy</Link>.
        </p>
      </div>

      {/* 🔔 Toast container */}
      <ToastContainer
        className="custom-toast-login"
        toastClassName="custom-toast-body-login"
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
};

export default Login;
