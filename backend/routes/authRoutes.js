import express from "express";
import {
  registerUser,
  loginUser,
  requestOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
