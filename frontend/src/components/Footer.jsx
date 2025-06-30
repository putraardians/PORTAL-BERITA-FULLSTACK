import React, { useEffect, useState } from "react";
import { FaInstagram, FaGithub, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo-footer.png";
import "../styles/Footer.css";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        const categoryNames = data.map((cat) => cat.name.toLowerCase());
        setCategories(["all", ...categoryNames]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategorySelect = (category) => {
    if (category === "all") {
      navigate("/home");
    } else {
      navigate(`${isLoggedIn ? "/home" : "/"}?category=${category}`);
    }
  };

  // Jangan return null, render footer selalu

  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Logo & Social Media (sama untuk desktop & mobile) */}
        <div className="footer-section logo-section">
          <img src={Logo} alt="News Logo" className="footer-logo" />
          <p className="footer-connect">Connect With Us</p>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/putraardianss/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://github.com/putraardians"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google"
            >
              <FaGoogle size={24} />
            </a>
          </div>
        </div>

        {/* Category */}
        <div className="footer-section">
          <h4>Category</h4>
          <ul>
            {categories.length === 0 ? (
              <li>Loading categories...</li>
            ) : (
              categories.map((category, index) => (
                <li key={index}>
                  <button
                    className="footer-link-button"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Navigation: tampil berbeda desktop & mobile */}
        {isMobile ? (
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="footer-section news-portal">
            <h4>News Portal</h4>
            <p>
              News Portal delivers accurate and in-depth news across business,
              technology, entertainment, sports, science, and health. We keep
              you informed on the latest developments in Indonesia and worldwide.
            </p>
          </div>
        )}
      </div>

      <p className="copyright">
        Powered by Putra Ardiansyah © {new Date().getFullYear()} reserved to PT Winnicode Garuda Teknologi
      </p>
    </footer>
  );
};

export default Footer;
