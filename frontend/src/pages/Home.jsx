import { useEffect, useState } from "react";
import { getNews } from "../services/newsService";
import NewsList from "../components/NewsList";
import Footer from "../components/Footer"; // pastikan path benar

function Home({ selectedCategory, searchKeyword }) {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      const articles = await getNews(selectedCategory, searchKeyword);
      setNews(articles);
      setIsLoading(false);
    };

    fetchNews();
  }, [selectedCategory, searchKeyword]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        {isLoading ? (
          <div className="text-center text-gray-600 font-semibold mt-20">
            LOADING NEWS...
          </div>
        ) : (
          <NewsList news={news} />
        )}
      </main>

      {/* Tampilkan footer hanya jika loading selesai */}
      {!isLoading && <Footer />}
    </div>
  );
}

export default Home;
