import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Sesuaikan dengan backend Anda

const handleError = (error) => {
  console.error("❌ API Error:", error?.message || error);

  const status = error.response?.status;
  console.log("🔴 Status Code:", status);

  const message =
    error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi!";

  return { success: false, message };
};

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    console.log("📤 Mengirim request registrasi ke backend:", userData);

    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Response dari backend (register):", response.data);

    if (response.data.success) {
      return response.data;
    } else {
      return {
        success: false,
        message: response.data.message || "Registrasi gagal!",
      };
    }

  } catch (error) {
    return handleError(error); // Konsisten dengan fungsi lainnya
  }
};


// ✅ Login User
export const loginUser = async (userData) => {
  try {
    console.log("📤 Mengirim request login ke backend:", userData);
    
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Response dari backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ✅ Request OTP (Forgot Password)
export const requestOTP = async (email) => {
  try {
    console.log("🔍 Requesting OTP:", { email });

    const response = await axios.post(`${API_URL}/request-otp`, { email });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    console.log("🔍 Verifying OTP:", { email, otp });

    const response = await axios.post(`${API_URL}/verify-otp`, {
      email,
      otp_code: otp,
    });

    if (response.data.success && response.data.resetToken) {
      localStorage.setItem("resetToken", response.data.resetToken);
    }

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ Reset Password
export const resetPassword = async (resetToken, newPassword) => {
  try {
    if (!resetToken) {
      console.error("❌ Token reset tidak ditemukan!");
      return { success: false, message: "Token reset tidak ditemukan!" };
    }

    console.log("📩 Sending reset password request:", { resetToken, newPassword });

    const response = await axios.post(`${API_URL}/reset-password`, {
      resetToken,
      new_password: newPassword,
    });

    if (response.data.success) {
      console.log("✅ Password berhasil diubah, menyimpan token baru...");
      localStorage.setItem("token", response.data.token);
      localStorage.removeItem("resetToken");
      localStorage.removeItem("email");
    }

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
