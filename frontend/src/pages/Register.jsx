import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await registerUser(formData);

      if (result.success) {
        toast.success(result.message || "Registrasi berhasil! Silakan login.", {
          position: "top-center",
          autoClose: 1000,
          onClose: () => navigate("/login"),
        });
      } else {
        toast.error(result.message || "Registrasi gagal. Coba lagi!", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("❌ Error saat registrasi:", error);
      toast.error("Terjadi kesalahan saat registrasi.", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="register-container"
    >
      <div className="register-card">
        <h2 className="register-title">Create your News Portal account</h2>
        <p className="login-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Enter username" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Email address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Email address" 
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
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="register-btn">Sign up</button>
        </form>
      </div>

      {/* Toast container */}
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      pauseOnHover={false}
      draggable
      toastClassName="custom-toast-body-register"
      bodyClassName="custom-toast-body-register"
      className="custom-toast-register"
    />
    </motion.div>
  );
};

export default Register;
