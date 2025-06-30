import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.NEWS_API_KEY || "";
const BASE_URL = "https://newsapi.org/v2/top-headlines";

export const fetchNews = async (category = "general", pageSize = 20, page = 1) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                category: category,
                country: "us", // Bisa diganti sesuai kebutuhan
                apiKey: API_KEY,
                pageSize: pageSize, // Maksimum 100 berita per request
                page: page, // Untuk pagination
            }
        });

        return response.data || { articles: [] };
    } catch (error) {
        console.error("❌ Error fetching news from API:", error.response?.data || error.message);
        return { articles: [] };
    }
};