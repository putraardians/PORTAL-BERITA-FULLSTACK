// src/components/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Log untuk memastikan perubahan route terdeteksi
    console.log("Route changed:", location.pathname);
    
    // Scroll ke atas setelah route berubah
    window.scrollTo(0, 0);
    
    // Log untuk memastikan scroll berjalan
    console.log("Scrolled to top");
  }, [location]); // Dependensi pada location memastikan scroll dipanggil setiap kali route berubah

  return null; // Komponen ini tidak perlu render apapun
}

export default ScrollToTop;
