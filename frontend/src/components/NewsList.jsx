import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewsItem from "./NewsItem";
import "../styles/NewsList.css";

const NewsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category") || "all";
  const searchKeyword = (queryParams.get("search") || "").toLowerCase();

  const [allArticles, setAllArticles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil kalimat pertama dari HTML description
  const getFirstSentenceFromHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html || "";
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const match = text.match(/[^.!?]+[.!?]/);
    return match ? match[0] : text;
  };

  // Fetch kategori dari backend
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Gagal mengambil kategori");
      const data = await response.json();
      const categoryNames = data.map((cat) => cat.name.toLowerCase());
      setCategories(["all", ...categoryNames]);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Fetch berita dari kategori eksternal
  const fetchNewsFromCategory = useCallback(async (category) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news?category=${category}`);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      return data.articles
        ? data.articles
            .filter((article) => article.urlToImage)
            .map((article) => ({ ...article, category }))
        : [];
    } catch (error) {
      console.error(`Error fetching news from ${category}:`, error);
      return [];
    }
  }, []);

  // Fetch berita internal (dari DB sendiri)
    const fetchInternalNews = useCallback(async (category) => {
      try {
        let url = "http://localhost:5000/api/news/internal";
        if (category && category !== "all") {
          url += `?category=${category}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch internal news");
        const data = await response.json();

        const filteredData = data.filter((item) => item.status === "published");

        return filteredData.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.content || "No description available",
          urlToImage: item.image ? `http://localhost:5000${item.image}` : "/fallback-image.jpg",
          publishedAt: item.date,
          author: "Admin", // ✅ ganti di sini biar semua internal pakai nama Admin
          category: item.category_name ? item.category_name.toLowerCase() : "internal",
          url: null,
          source: { name: "Internal" },
        }));
      } catch (error) {
        console.error("Error fetching internal news:", error);
        return [];
      }
    }, []);


  // Fetch semua berita sesuai kategori yg dipilih (atau semua)
  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      let allFetchedArticles = [];

      if (categoryParam === "all") {
        const internalNews = await fetchInternalNews();
        // Ambil semua kategori eksternal kecuali 'all' dan 'internal'
        const externalCategories = categories.filter((cat) => cat !== "all" && cat !== "internal");
        const externalNewsPromises = externalCategories.map((cat) => fetchNewsFromCategory(cat));
        const externalNewsResults = await Promise.all(externalNewsPromises);
        const externalNews = externalNewsResults.flat();
        allFetchedArticles = [...internalNews, ...externalNews];
      } else {
        const internalNewsAll = await fetchInternalNews();
        const internalFiltered = internalNewsAll.filter(
          (news) => news.category.toLowerCase() === categoryParam.toLowerCase()
        );
        const externalNews = await fetchNewsFromCategory(categoryParam);
        allFetchedArticles = [...internalFiltered, ...externalNews];
      }

      // Urutkan berita berdasarkan tanggal terbaru
      allFetchedArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      setAllArticles(allFetchedArticles);
      setError(null);
    } catch (error) {
      setError(error.message);
      setAllArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [categoryParam, categories, fetchInternalNews, fetchNewsFromCategory]);

  // Fetch kategori saat komponen mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch berita setelah kategori tersedia
  useEffect(() => {
    if (categories.length > 1) {
      fetchNews();
    }
  }, [categories, fetchNews]);

  // Filter dan urutkan hasil pencarian
  useEffect(() => {
    if (searchKeyword.trim() !== "") {
      const filtered = allArticles.filter((article) => {
        const title = article.title?.toLowerCase() || "";
        const desc = article.description?.toLowerCase() || "";
        return title.includes(searchKeyword) || desc.includes(searchKeyword);
      });
      filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchKeyword, allArticles]);

  // Format tanggal tampilkan
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return isNaN(date) ? "Unknown Date" : date.toLocaleDateString();
  };

  // Fungsi handle klik "Read More"
  const handleReadMore = (news) => {
    // Buat slug dari judul
    const generateSlug = (text) => {
      return encodeURIComponent(
        text?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      );
    };

    const slug = generateSlug(news.title || "no-title");
    navigate(`/newsDetail/${slug}`, { state: { ...news } });
  };

  return (
    <div className="page-wrapper">
    <div className="news-wrapper">
        {error ? (
          <p className="error-message">{error}</p>
        ) : isLoading ? (
          <div className="loading-wrapper">Loading News...</div>
        ) : (
        <>
          {/* Jika ada pencarian */}
          {searchKeyword.trim() !== "" ? (
            searchResults.length > 0 ? (
              <div className="search-results-list" style={{ gridColumn: "1 / span 2" }}>
                <h2>Search Results for "{searchKeyword}"</h2>
                {searchResults.map((news, index) => (
                  <div
                    className="news-search-item"
                    key={news.id || news.title || `search-${index}`}
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "30px",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "20px",
                    }}
                  >
                    <img
                      src={news.urlToImage || "/fallback-image.jpg"}
                      alt="News"
                      style={{ width: "300px", height: "180px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <div className="news-search-content">
                      <h3 style={{ marginBottom: "10px" }}>{news.title || "No title available"}</h3>
                      <span className={`news-category ${news.category?.toLowerCase() || "general"}`}>
                        {news.category || "Category Not Found"}
                      </span>
                      <p className="news-meta">
                        {news.author || "Unknown Author"} - {formatDate(news.publishedAt)}
                      </p>
                      <p>{getFirstSentenceFromHTML(news.description)}</p>
                      <button
                        className="read-more-btn"
                        onClick={() => handleReadMore(news)}
                        style={{ marginTop: "10px" }}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ gridColumn: "1 / span 2" }}>No results found for "{searchKeyword}"</p>
            )
          ) : (
            <>
              {/* BERITA UTAMA */}
            {allArticles.length > 0 && (
              <div
                className="news-main"
                style={{ cursor: "pointer" }}
                onClick={() => handleReadMore(allArticles[0])}
              >
                <img
                  src={allArticles[0].urlToImage || "/fallback-image.jpg"}
                  alt="News"
                  className="news-main-image"
                />
                <div className="news-main-text">
                  <span
                    className={`news-category ${allArticles[0].category?.toLowerCase() || "general"}`}
                  >
                    {allArticles[0].category || "Category Not Found"}
                  </span>
                  <h2>{allArticles[0].title || "No title available"}</h2>
                  <p>{getFirstSentenceFromHTML(allArticles[0].description)}</p>
                  <p className="news-meta">
                    {allArticles[0].author || "Unknown Author"} -{" "}
                    {formatDate(allArticles[0].publishedAt)}
                  </p>
                </div>
              </div>
            )}

              {/* SIDEBAR */}
              {allArticles.length > 1 && (
                <div className="news-sidebar">
                  <h2>Other News</h2>
                  <div className="news-list-scroll">
                    {allArticles.slice(1, 5).map((news, index) => (
                      <div
                        key={news.id || news.title || `sidebar-${index}`}
                        className="news-sidebar-item"
                      >
                        <div className="news-card">
                          <NewsItem
                            title={news.title || "No title available"}
                            description={news.description || "No description available"}
                            name={news.source?.name === "Internal" ? "Admin" : null} // ✅ Setel "Admin" jika berita internal
                            publishedAt={news.publishedAt}
                            source={news.source?.name || "Unknown Source"}
                            image={news.urlToImage || "/fallback-image.jpg"}
                            category={news.category || "Category Not Found"}
                            small={true}
                            onReadMore={() => handleReadMore(news)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* BERITA SUB */}
              {allArticles.length > 5 && (
                <div className="news-sub">
                  {allArticles.slice(5).map((news, index) => (
                    <div className="news-sub-item" key={news.id || news.title || `sub-${index}`}>
                      <img src={news.urlToImage || "/fallback-image.jpg"} alt="News" />
                      <h3>{news.title || "No title available"}</h3>
                      <span className={`news-category ${news.category?.toLowerCase() || "general"}`}>
                        {news.category || "Category Not Found"}
                      </span>
                      <p className="news-meta">
                        {news.author || "Unknown Author"} - {formatDate(news.publishedAt)}
                      </p>
                      <button
                        className="read-more-btn"
                        onClick={() => handleReadMore(news)}
                      >
                        Read More
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default NewsList;
