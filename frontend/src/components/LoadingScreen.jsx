import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Pindah ke halaman setelah selesai
          return 100;
        }
        return oldProgress + 5;
      });
    }, 50); // Kecepatan loading

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="progress-bar-container">
        <motion.div
          className="progress-bar"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
