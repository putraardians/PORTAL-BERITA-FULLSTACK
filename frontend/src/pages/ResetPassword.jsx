import React, { useState, useEffect } from "react";
import { resetPassword } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    const tokenFromStorage = localStorage.getItem("resetToken");

    const emailFromState = location.state?.email;
    const storedEmail = localStorage.getItem("email");

    setResetToken(tokenFromURL || tokenFromStorage || "");
    setEmail(emailFromState || storedEmail || "");

    console.log("🔍 Debugging: Token Reset yang diambil", tokenFromURL || tokenFromStorage);
    console.log("🔍 Debugging: Email yang diambil", emailFromState || storedEmail);

    if (!tokenFromURL && !tokenFromStorage) {
      setError("Token reset tidak ditemukan! Silakan coba lagi.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!password || !confirmPassword) {
      setError("Password tidak boleh kosong!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok!");
      setLoading(false);
      return;
    }

    if (!resetToken) {
      setError("Token reset tidak ditemukan! Silakan coba lagi.");
      setLoading(false);
      return;
    }

    try {
      console.log("📩 Mengirim resetPassword() dengan token:", resetToken);

      const response = await resetPassword(resetToken, password);

      if (response.success) {
        console.log("✅ Password berhasil diubah untuk:", email); // ✅ LOG tambahan

        setMessage("Password berhasil diubah! Mengalihkan ke login...");
        localStorage.setItem("token", response.token);
        localStorage.removeItem("resetToken");
        localStorage.removeItem("email");

        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error("❌ Gagal mengubah password:", err.message);
      setError(`Gagal mengubah password: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Password</h2>
        <p>Silakan masukkan password baru Anda.</p>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} disabled />
          </div>

          <div className="input-group">
            <label>Password Baru</label>
            <input
              type="password"
              placeholder="Masukkan password baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Konfirmasi Password</label>
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-password-btn" disabled={loading}>
            {loading ? "Memproses..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
