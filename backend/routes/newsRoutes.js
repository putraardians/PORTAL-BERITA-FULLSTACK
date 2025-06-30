import express from "express";
import { 
  getNews, getLatestNews, addNews, getAllNews, getNewsById, deleteNews, updateNews, getCombinedNews 
} from "../controllers/newsController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import isAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multerUpload.js";

const router = express.Router();

router.get("/", getNews); // berita eksternal
router.get("/internal", getAllNews); // berita internal
router.get("/combined", getCombinedNews); // berita gabungan (baru)

router.post("/add", authenticateToken, isAdmin, upload.single("image"), addNews);
router.get("/latest", authenticateToken, isAdmin, getLatestNews);
router.get("/all", authenticateToken, isAdmin, getAllNews);
router.get("/:id", authenticateToken, isAdmin, getNewsById);
router.delete("/:id", authenticateToken, isAdmin, deleteNews);
router.put("/:id/update", authenticateToken, isAdmin, upload.single("image"), updateNews);

export default router;
