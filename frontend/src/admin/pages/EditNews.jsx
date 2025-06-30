import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { ToastContainer, toast } from "react-toastify";
import {
  FaHeading,
  FaEdit,
  FaListAlt,
  FaToggleOn,
  FaImage,
  FaSave,
  FaPen,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/EditNews.css";

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({
    title: "",
    content: "",
    category_id: "",
    status: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/news/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data); // Debugging
        setNews({
          ...data,
          category_id: String(data.category_id),
          image: null, // reset image agar tidak konflik dengan file baru
        });

        // ✅ Gunakan field `image` jika ada
        if (data.image) {
          setPreview(`http://localhost:5000${data.image}`);
        }

        return fetch("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌", err);
        toast.error("Gagal memuat data berita atau kategori.");
        setLoading(false);
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNews((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditorChange = (content) => {
    setNews((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", news.title);
    formData.append("content", news.content);
    formData.append("category_id", news.category_id);
    formData.append("status", news.status);
    if (news.image) {
      formData.append("image", news.image);
    }

    fetch(`http://localhost:5000/api/news/${id}/update`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success || data.message?.toLowerCase().includes("berhasil")) {
          toast.success("Berita berhasil diperbarui!", {
            autoClose: 1500,
            onClose: () => navigate("/admin/news/all"),
          });
        } else {
          toast.error(`❌ Gagal: ${data.message || "Gagal memperbarui berita."}`);
        }
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        toast.error("Terjadi kesalahan saat memperbarui berita.");
      });
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div className="edit-news">
      <main className="edit-news-main">
        <div className="edit-news-container">
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaPen /> Edit Berita
          </h2>
          <form onSubmit={handleSubmit} className="edit-news-form">
            <div className="edit-news-group">
              <label htmlFor="title">
                <FaHeading style={{ marginRight: "6px" }} />
                Judul
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={news.title}
                onChange={handleChange}
                required
                className="edit-news-input"
              />
            </div>

            <div className="edit-news-group">
              <label htmlFor="content">
                <FaEdit style={{ marginRight: "6px" }} />
                Konten
              </label>
              <Editor
                apiKey="4jqq81vgaqixkmgyv9e1krf7qwpynakfoxboz8q6hz5yfbjs"
                value={news.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap preview anchor",
                    "searchreplace wordcount autoresize",
                  ],
                  toolbar:
                    "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | fullscreen",
                  content_style: "body { text-align: justify; }",
                }}
              />
            </div>

            <div className="edit-news-group">
              <label htmlFor="category_id">
                <FaListAlt style={{ marginRight: "6px" }} />
                Kategori
              </label>
              <select
                id="category_id"
                name="category_id"
                value={news.category_id}
                onChange={handleChange}
                required
                className="edit-news-input"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-news-group">
              <label htmlFor="status">
                <FaToggleOn style={{ marginRight: "6px" }} />
                Status
              </label>
              <select
                id="status"
                name="status"
                value={news.status}
                onChange={handleChange}
                required
                className="edit-news-input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="edit-news-group">
              <label htmlFor="image">
                <FaImage style={{ marginRight: "6px" }} />
                Gambar
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="edit-news-input"
              />
              {preview && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={preview}
                    alt="Thumbnail Preview"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "6px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              )}
            </div>

            <button type="submit" className="edit-news-button">
              <FaSave style={{ marginRight: "8px" }} />
              Simpan Perubahan
            </button>
          </form>
      <ToastContainer
        toastClassName="custom-toast-editnews"
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
        </div>
      </main>
    </div>
  );
}

export default EditNews;
