import express from "express";
import { getLogs } from "../controllers/logController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import isAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, getLogs);

export default router;
