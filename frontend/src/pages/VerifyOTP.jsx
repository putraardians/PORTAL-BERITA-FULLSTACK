import React, { useState, useEffect } from "react";
import { verifyOTP } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/VerifyOTP.css";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Email tidak ditemukan. Silakan ulangi proses reset password.");
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!otp) {
      toast.error("OTP wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOTP(email, otp);

      if (response.success) {
        toast.success("OTP berhasil diverifikasi! Mengalihkan ke reset password...");
        setTimeout(() => {
          navigate("/reset-password", {
            state: { email, otp, resetToken: response.resetToken },
          });
        }, 2000);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        className="custom-toast-verifyotp"
        toastClassName="custom-toast-body-verifyotp"
      />

      <div className="verify-otp-card">
        <h2>Verifikasi OTP</h2>
        <p>Masukkan kode OTP yang telah dikirim ke email Anda.</p>

        <form onSubmit={handleSubmit} className="verify-otp-form">
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} disabled />
          </div>

          <div className="input-group">
            <label>Kode OTP</label>
            <input
              type="text"
              placeholder="Masukkan kode OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <button type="submit" className="verify-otp-btn" disabled={loading}>
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
