import React, { useState, useEffect } from "react";
import "../styles/Contact.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hook: Lock scroll saat toast aktif
const useBodyScrollLock = (shouldLock) => {
  useEffect(() => {
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldLock]);
};

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useBodyScrollLock(isToastVisible); // ⛔️ kunci scroll jika toast muncul

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { email, subject, message } = formData;

    if (!email || !subject || !message) {
      toast.error("Semua field wajib diisi!", {
        position: "top-center",
        autoClose: 2000,
        onOpen: () => setIsToastVisible(true),
        onClose: () => setIsToastVisible(false),
      });
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Email tidak valid!", {
        position: "top-center",
        autoClose: 2000,
        onOpen: () => setIsToastVisible(true),
        onClose: () => setIsToastVisible(false),
      });
      return;
    }

    setIsSending(true);

    const payload = new FormData();
    payload.append("access_key", "2c3d64ac-761b-42c3-a0ed-9ed6ae419562");
    payload.append("email", email);
    payload.append("subject", `News Portal Message: ${subject}`);
    payload.append("message", message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Pesan berhasil dikirim!", {
          position: "top-center",
          autoClose: 2000,
          onOpen: () => setIsToastVisible(true),
          onClose: () => setIsToastVisible(false),
        });
        setFormData({ email: "", subject: "", message: "" });
      } else {
        toast.error("Gagal mengirim pesan!", {
          position: "top-center",
          autoClose: 2000,
          onOpen: () => setIsToastVisible(true),
          onClose: () => setIsToastVisible(false),
        });
        console.error("Submission Error:", data);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan!", {
        position: "top-center",
        autoClose: 2000,
        onOpen: () => setIsToastVisible(true),
        onClose: () => setIsToastVisible(false),
      });
      console.error("Network Error:", error);
    }

    setIsSending(false);
  };

  return (
    <div className="contact-container">
      <div className="contact-box">
        <h2>Can we help you?</h2>
        <form onSubmit={onSubmit}>
          <label>Submit Request</label>
          <input
            type="email"
            name="email"
            placeholder="Your email..."
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Write us a message..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" disabled={isSending}>
            {isSending ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>

      {/* ToastContainer DI LUAR FORM */}
        <ToastContainer
          className="custom-toast-contact"       // Ganti dari "news-toast"
          toastClassName="custom-toast-contact"  // Pastikan ini juga pakai class yang sama
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
        />
    </div>
  );
};

export default Contact;
