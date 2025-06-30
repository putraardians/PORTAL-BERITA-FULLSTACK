import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = ({ onCategorySelect, onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
      // Redirect ke "/" jika belum login tapi mengakses /home?category=...
      const params = new URLSearchParams(location.search);
      const category = params.get("category");

      if (!isLoggedIn && location.pathname.toLowerCase() === "/home" && category) {
        navigate(`/?category=${category}`, { replace: true });
      }
    }, [isLoggedIn, location, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
    if (category === "all") {
      navigate("/Home");
    } else {
      if (isLoggedIn) {
        navigate(`/Home?category=${category}`);
      } else {
        navigate(`/?category=${category}`);
      }
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === "") return;

    if (onSearch) onSearch(trimmedQuery);
    setMenuOpen(false);
  };

const isHomePage =
  ["/", "/home"].includes(location.pathname.toLowerCase());

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <h1 className="logo">News Portal</h1>

        <ul className="nav-links">
          <li><Link to={isLoggedIn ? "/Home?category=all" : "/"}>Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li>
            <form className="search-container" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search news..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-icon" aria-label="Search">
                <FaSearch />
              </button>
            </form>
          </li>
        </ul>

        <div className="auth-menu">
          <Link to={isLoggedIn ? "/profile" : "/login"} className="user-icon">
            <FaUser title={isLoggedIn ? "Profile" : "Login"} />
          </Link>

          {isLoggedIn && (
            <FaSignOutAlt
              className="logout-icon"
              onClick={handleLogout}
              title="Logout"
            />
          )}

          <div className="menu-toggle-umum" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>

      {/* Mobile nav menu */}
      <ul className={`mobile-nav ${menuOpen ? "active" : ""}`}>
        <li><Link to={isLoggedIn ? "/Home?category=all" : "/"} onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
      </ul>

      {/* Mobile search only on Home */}
      {isHomePage && (
        <div className="mobile-search-wrapper">
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search"><FaSearch /></button>
          </form>
        </div>
      )}

      {/* Desktop categories on Home */}
      {isHomePage && (
        <div className="category-container desktop-categories">
          <button key="all" className="category-button" onClick={() => handleCategorySelect("all")}>All</button>
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                className="category-button"
                onClick={() => handleCategorySelect(category.name)}
              >
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </button>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>
      )}

      {/* Mobile categories only when menu is closed */}
      {isHomePage && !menuOpen && (
        <div className="category-container mobile-categories">
          <button key="all" className="category-button" onClick={() => handleCategorySelect("all")}>All</button>
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                className="category-button"
                onClick={() => handleCategorySelect(category.name)}
              >
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </button>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
