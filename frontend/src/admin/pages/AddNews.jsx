import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { ToastContainer, toast } from "react-toastify";
import {
  FaHeading,
  FaEdit,
  FaListAlt,
  FaSave,
  FaUpload,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AddNews.css";

const AddNews = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
        else if (data.categories && Array.isArray(data.categories))
          setCategories(data.categories);
        else console.error("❌ Format data kategori tidak valid:", data);
      } catch (err) {
        console.error("❌ Gagal fetch kategori:", err);
      }
    };
    fetchCategories();
  }, []);

  const sanitizeHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith("data-")) el.removeAttribute(attr.name);
      });
    });
    return doc.body.innerHTML;
  };

  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Judul tidak boleh kosong.";
    if (!content.trim()) newErrors.content = "Isi berita tidak boleh kosong.";
    if (!category) newErrors.category = "Kategori wajib dipilih.";
    if (!thumbnail) newErrors.thumbnail = "Thumbnail wajib diunggah.";
    return newErrors;
  };

  const handleEditorChange = (newContent) => setContent(newContent);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

const handleSubmit = async (e, selectedStatus) => {
  e.preventDefault();
  console.log("🟡 [SUBMIT] Tombol klik - Status:", selectedStatus); // ✅ log klik tombol

  const validationErrors = validateFields();
  if (Object.keys(validationErrors).length > 0) {
    console.warn("⚠️ [VALIDASI] Gagal - Field kosong:", validationErrors);
    setErrors(validationErrors);
    toast.error("Harap isi semua bidang yang diperlukan!", {
      position: "top-center",
      autoClose: 1500,
    });
    return;
  }

  setErrors({});
  const sanitizedContent = sanitizeHTML(content);
  console.log("📦 [FORM DATA] Siap dikirim:", {
    title,
    category,
    status: selectedStatus,
    thumbnailName: thumbnail?.name,
  });

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", sanitizedContent);
  formData.append("category_id", category);
  formData.append("status", selectedStatus);
  formData.append("image", thumbnail);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/news/add", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      console.log("✅ [SUCCESS] Berita berhasil dikirim:", result);

      const statusText =
        selectedStatus === "draft"
          ? "disimpan sebagai draft"
          : "dipublikasikan";

      toast.success(`Berita berhasil ${statusText}!`, {
        position: "top-center",
        autoClose: 1500,
        onClose: () => navigate("/admin/news/all"),
      });

      setTitle("");
      setContent("");
      setCategory("");
      setThumbnail(null);
      setPreview(null);
    } else {
      console.error("❌ [GAGAL] Server menolak data:", result.message);
      toast.error("Gagal menambahkan berita: " + result.message);
    }
  } catch (err) {
    console.error("❌ [ERROR] Terjadi kesalahan saat kirim:", err);
    toast.error("Terjadi kesalahan saat mengirim berita.");
  }
};


  return (
    <div className="admin-add-news">
      <div className="add-news-container">
        <h2>Tambah Berita</h2>
        <form className="news-form">
          <div className="edit-news-group-addnews">
            <label>
              <FaHeading style={{ marginRight: "6px" }} />
              Judul Berita
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Tambahkan Judul Berita..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <small className="error-text">{errors.title}</small>}
          </div>

          <div className="edit-news-group-addnews">
            <label>
              <FaEdit style={{ marginRight: "6px" }} />
              Isi Berita
            </label>
            <Editor
              apiKey="4jqq81vgaqixkmgyv9e1krf7qwpynakfoxboz8q6hz5yfbjs"
              value={content}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | link image | fullscreen",
              }}
              onEditorChange={handleEditorChange}
            />
            {errors.content && <small className="error-text">{errors.content}</small>}
          </div>

          <div className="edit-news-group-addnews">
            <label>
              <FaListAlt style={{ marginRight: "6px" }} />
              Kategori
            </label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Pilih Kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <small className="error-text">{errors.category}</small>}
          </div>

          <div className="edit-news-group-addnews">
            <label>
              <FaUpload style={{ marginRight: "6px" }} />
              Upload Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              className="input-field"
              onChange={handleThumbnailChange}
            />
            {errors.thumbnail && (
              <small className="error-text">{errors.thumbnail}</small>
            )}
            {preview && (
              <div style={{ width: "100%", marginTop: "10px" }}>
                <img
                  src={preview}
                  alt="Thumbnail Preview"
                  className="thumbnail-preview-img"
                />
              </div>
            )}
          </div>

          <div className="button-container">
            <button
              type="button"
              className="draft-btn"
              onClick={(e) => handleSubmit(e, "draft")}
            >
              <FaSave style={{ marginRight: "6px" }} />
              Simpan sebagai Draft
            </button>
            <button
              type="button"
              className="publish-btn"
              onClick={(e) => handleSubmit(e, "published")}
            >
              <FaSave style={{ marginRight: "6px" }} />
              Simpan sebagai Published
            </button>
          </div>
        </form>
        <ToastContainer
            toastClassName="custom-toast-addnews"
            position="top-center"
            autoClose={1500}
          />
      </div>
    </div>
  );
};

export default AddNews;
