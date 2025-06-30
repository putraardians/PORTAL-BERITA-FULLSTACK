import axios from "axios";

const API_URL = "http://localhost:5000/api/news";

export const getNews = async (category, searchKeyword) => {
  try {
    // Buat objek params untuk query string
    const params = {};

    if (category && category !== "all") {
      params.category = category;
    }
    if (searchKeyword && searchKeyword.trim() !== "") {
      params.search = searchKeyword.trim();
    }

    const response = await axios.get(API_URL, { params });
    return response.data.articles; // Sesuaikan dengan respons backend
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
