import express from "express";
import {
  recordView,
  getTrafficOverview,
  getPopularCategories,
  getAnalyticsSummary,
  getTopArticles,
  getDeviceDistribution,
  getTrafficSources,
} from "../controllers/viewsController.js";

const router = express.Router();

router.post("/", recordView);
router.get("/traffic-overview", getTrafficOverview);
router.get("/popular-categories", getPopularCategories);
router.get("/summary", getAnalyticsSummary);
router.get("/top-articles", getTopArticles);
router.get("/device-distribution", getDeviceDistribution);
router.get("/traffic-sources", getTrafficSources);


export default router;
