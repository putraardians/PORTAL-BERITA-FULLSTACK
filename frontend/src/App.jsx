// src/App.js
import React, { useState, useEffect, useCallback, createContext } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminHeader from "./admin/components/AdminHeader";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import NewsList from "./components/NewsList";
import NewsDetail from "./components/NewsDetail";
import Profile from "./pages/Profile";
import AdminApp from "./admin/AdminApp";
import NotAuthorized from "./admin/pages/NotAuthorized";
import ScrollToTop from "./components/ScrollToTop"; // Import ScrollToTop
import "./styles/App.css";

export const AuthContext = createContext();

function App() {
  const location = useLocation(); // Ensure useLocation is being used here for routing
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [checkLoginStatus]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryFromUrl = urlParams.get("category") || "all";
    const searchFromUrl = urlParams.get("search") || "";

    if (categoryFromUrl !== selectedCategory) setSelectedCategory(categoryFromUrl);
    if (searchFromUrl !== searchKeyword) setSearchKeyword(searchFromUrl);
  }, [location.search, selectedCategory, searchKeyword]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchKeyword("");
    const basePath = isLoggedIn ? "/Home" : "/";
    navigate(`${basePath}?category=${category}`);
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    const basePath = isLoggedIn ? "/Home" : "/";
    const url = new URL(window.location.origin + basePath);
    url.searchParams.set("category", selectedCategory);
    url.searchParams.set("search", keyword);
    navigate(url.pathname + url.search);
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    navigate("/Home");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <div className="app-container">
        <ScrollToTop /> {/* This should trigger scroll to top on route change */}

        {!isAdminRoute && (
          <Navbar
            onCategorySelect={handleCategorySelect}
            onSearch={handleSearch}
          />
        )}

        {isAdminRoute && <AdminHeader />}

        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <NewsList
                  key={`${selectedCategory}-${searchKeyword}`}
                  selectedCategory={selectedCategory}
                  searchKeyword={searchKeyword}
                />
              }
            />
            <Route
              path="/Home"
              element={
                <NewsList
                  key={`${selectedCategory}-${searchKeyword}`}
                  selectedCategory={selectedCategory}
                  searchKeyword={searchKeyword}
                />
              }
            />
            <Route path="/newsDetail/:slug" element={<NewsDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
          </Routes>
        </div>

        {!isAdminRoute && <Footer />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
