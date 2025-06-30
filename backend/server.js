import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import useragent from "express-useragent"; // ✅ Tambahkan ini

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import viewRoutes from "./routes/viewsRoutes.js"; // ⬅️ Tambahkan ini

// DB config
import db from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS
app.use(cors());
// app.use(cors({ origin: "http://yourfrontend.com" }));
app.options("*", cors());

// Logging setiap request (kecuali beberapa route)
app.use((req, res, next) => {
  const skipLoggingPaths = ["/api/auth/login", "/api/news", "/api/stats", "/api/logs"];
  if (req.method !== "OPTIONS" && !skipLoggingPaths.some(p => req.url.startsWith(p))) {
    console.log(`[${req.method}] ${req.url}`);
  }
  next();
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express()); // ✅ Ini untuk deteksi device (mobile/tablet/desktop)

// Cek koneksi DB
db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// Static files (uploads)
app.use("/uploads", express.static(path.resolve("public/uploads")));

// === ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/views", viewRoutes); // ⬅️ Tambahkan ini di bagian bawah routes

// Error handler global
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
