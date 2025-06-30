import React, { useState } from "react";
import { requestOTP } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      console.log("Mengirim OTP ke:", email); // ✅ Debugging

      const response = await requestOTP(email);

      if (response.success) {
        console.log("OTP sent successfully. Redirecting to VerifyOTP...");
        setMessage("A verification code has been sent to your email.");
        setTimeout(() => {
          navigate("/verify-otp", { state: { email } }); // ✅ Gunakan huruf kecil untuk path
        }, 2000);
      } else {
        throw new Error(response.message || "An error occurred. Please try again later.");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
      console.error("Error sending OTP:", err); // ✅ Debugging error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a verification code.</p>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="forgot-password-btn" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="sign-in-text">
          Remember your password? <Link to="/login" className="sign-in-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
