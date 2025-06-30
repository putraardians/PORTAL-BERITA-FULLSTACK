import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/NewsDetail.css";

const useBodyScrollLock = (shouldLock) => {
  useEffect(() => {
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldLock]);
};

function normalizeContent(content, isExternal) {
  if (!content) return "No description available";
  if (isExternal) {
    const escaped = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return escaped
      .split(/\n+/)
      .map((line) => `<p>${line.trim()}</p>`)
      .join("");
  }
  return content;
}

function getRelativeTime(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);
  if (seconds < 60) return "baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "kemarin";
  if (days < 7) return `${days} hari lalu`;
  return past.toLocaleDateString();
}

function detectDeviceType() {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  return "Desktop";
}

function detectTrafficSource() {
  const referrer = document.referrer;
  if (!referrer) return "Direct";
  if (referrer.includes("facebook.com") || referrer.includes("twitter.com") || referrer.includes("instagram.com")) return "Social";
  if (referrer.includes("google.") || referrer.includes("bing.com")) return "Search";
  return "Referral";
}

const NewsDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const news = useMemo(() => location.state || {}, [location.state]);

  const [comments, setComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [viewId, setViewId] = useState(null);

  useBodyScrollLock(commentsLoading || isToastVisible);

  const fetchComments = useCallback(async () => {
    if (!news?.url && !news?.id) return;
    setCommentsLoading(true);
    try {
      const query = news?.url
        ? `?url=${encodeURIComponent(news.url)}&type=external`
        : `?newsId=${news.id}&type=internal`;
      const res = await fetch(`http://localhost:5000/api/comments${query}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error("❌ Error fetching comments:", err.message);
      setComments(null);
      toast.error("Gagal memuat komentar.", {
        position: "top-center",
        onOpen: () => setIsToastVisible(true),
        onClose: () => setIsToastVisible(false),
      });
    } finally {
      setCommentsLoading(false);
    }
  }, [news?.url, news?.id]);

  const fetchCategoryId = async (name) => {
    if (!name) return null;
    try {
      const res = await fetch(
        `http://localhost:5000/api/categories/name/${encodeURIComponent(name)}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.id;
    } catch (err) {
      console.error("❌ Error fetching category ID:", err.message);
      return null;
    }
  };

  useEffect(() => {
    const recordView = async () => {
      if (!news?.id && !news?.url) return;
      let category_id = news?.category_id || null;
      if (!category_id && news?.category) {
        category_id = await fetchCategoryId(news.category);
      }

      const device_type = detectDeviceType();
      const traffic_source = detectTrafficSource();

      try {
        const payload = news?.id
          ? { news_id: news.id, source_type: "internal", device_type, traffic_source }
          : {
              external_url: news.url,
              source_type: "external",
              category_id,
              title: news?.title || null,
              category_name: news?.category || null,
              device_type,
              traffic_source,
            };

        const res = await fetch("http://localhost:5000/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data?.view_id) setViewId(data.view_id);
      } catch (error) {
        console.error("❌ Gagal mencatat view:", error);
      }
    };

    recordView();
  }, [news]);

  useEffect(() => {
    const entryTime = Date.now();

    return () => {
      const durationInSec = Math.floor((Date.now() - entryTime) / 1000);

      // 🔁 Kirim update ke view yang sudah tercatat
      if (viewId && !isNaN(durationInSec)) {
        fetch("http://localhost:5000/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            view_id: viewId,
            duration: durationInSec,
          }),
        }).catch((err) =>
          console.error("❌ Gagal update durasi view:", err)
        );
      }
    };
  }, [viewId]);

  const postCommentToBackend = async () => {
    if (!newComment.trim() || (!news?.url && !news?.id)) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Harap login terlebih dahulu.", {
        position: "top-center",
        autoClose: 1000,
        onOpen: () => setIsToastVisible(true),
        onClose: () => setIsToastVisible(false),
      });
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: newComment.trim(),
          type: news?.url ? "external" : "internal",
          newsExternalUrl: news?.url,
          newsId: news?.id,
          newsTitle: news?.title,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambahkan komentar.");
      setNewComment("");
      toast.success("Komentar berhasil ditambahkan.", {
        position: "top-center",
        autoClose: 1000,
        onOpen: () => setIsToastVisible(true),
        onClose: () => setIsToastVisible(false),
      });
      fetchComments();
    } catch (err) {
      console.error("❌ Error posting comment:", err.message);
      toast.error(err.message || "Terjadi kesalahan.", {
        position: "top-center",
        autoClose: 1000,
        onOpen: () => setIsToastVisible(true),
        onClose: () => setIsToastVisible(false),
      });
    }
  };

  useEffect(() => {
    if (news?.url || news?.id) fetchComments();
  }, [fetchComments, news]);

  const handleAddComment = () => {
    if (newComment.trim()) postCommentToBackend();
  };

  const categoryClass = news.category
    ? news.category.toLowerCase().replace(/\s+/g, "-")
    : "general";

  const imageUrl = news.image?.startsWith("http")
    ? news.image
    : news.urlToImage?.startsWith("http")
    ? news.urlToImage
    : "/fallback-image.png";

  const contentFull = normalizeContent(
    news?.content || news?.description,
    !!news?.url
  );

  return (
    <div className="news-detail-wrapper">
      {!news || Object.keys(news).length === 0 ? (
        <>
          <p className="error-message">No news details available.</p>
          <button className="back-button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </>
      ) : (
        <>
          <h1 className="news-title">{news.title || "No title available"}</h1>
          <p className="news-meta">
            <span className={`news-category ${categoryClass}`}>
              {news.category || "General"}
            </span>{" "}
            | {news.author || "Unknown Author"} |{" "}
            {news.publishedAt
              ? new Date(news.publishedAt).toLocaleDateString()
              : "Unknown Date"}
          </p>
          <img
            src={imageUrl}
            alt={news.title || "News image"}
            className="news-detail-image"
          />
          <div
            className="news-description"
            dangerouslySetInnerHTML={{ __html: contentFull }}
          />
          {news.url && (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="read-full-article"
            >
              Read Full Article
            </a>
          )}

          <div className="comments-section">
            <h3>Comments</h3>
            <div className="comment-input">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newComment.trim()) {
                    handleAddComment();
                  }
                }}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || commentsLoading}
              >
                Send
              </button>
            </div>
            {commentsLoading ? (
              <p>Loading comments...</p>
            ) : comments === null ? (
              <p className="no-comments">Gagal memuat komentar.</p>
            ) : comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first!</p>
            ) : (
              <ul className="comments-list">
                {comments
                  .slice()
                  .reverse()
                  .map((comment, index) => (
                    <li key={index} className="comment-item">
                      <div className="comment-avatar">
                        {comment.username
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="comment-content">
                        <div>
                          <span className="comment-user">{comment.username}</span>{" "}
                          <span className="comment-time">
                            {getRelativeTime(comment.created_at)}
                          </span>
                        </div>
                        <p className="comment-text">{comment.comment}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <button className="back-button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </>
      )}

      <ToastContainer
        className="news-toast-newsdetail"
        toastClassName="news-toast-body-newsdetail"
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
};

export default NewsDetail;
