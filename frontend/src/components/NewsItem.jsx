import React from "react";
import "../styles/NewsItem.css";

const NewsItem = ({
  title,
  description,
  name,          // Nama user dari DB (bukan author)
  publishedAt,
  source,
  image,
  small,
  large,
  category,
  titleSize,
  readMoreLink,
  onReadMore,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return isNaN(date) ? "Unknown Date" : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className={`news-item ${small ? "small" : large ? "large" : "normal"}`}>
      <img
        src={image || "https://via.placeholder.com/800x400"}
        alt={title}
        className="news-image"
      />
      <div className="news-content">
        <span className={`news-category ${category?.toLowerCase() || "general"}`}>
          {category || "General"}
        </span>

        <h2 style={{ fontSize: titleSize || "20px", textAlign: "justify" }}>
          {title}
        </h2>

        {!small && (
          <p style={{ textAlign: "justify" }}>
            {description || "No description available"}
          </p>
        )}

        <p className="news-meta">
          {/* Tampilkan nama user, kalau gak ada baru tampilkan source */}
          {name || source || "Unknown Source"} - {formatDate(publishedAt)}
        </p>

        {(onReadMore || readMoreLink) && (
          onReadMore ? (
            <button className="read-more-btn" onClick={onReadMore}>
              Read More
            </button>
          ) : (
            <a href={readMoreLink} className="read-more-btn">
              Read More
            </a>
          )
        )}
      </div>
    </div>
  );
};

export default NewsItem;
