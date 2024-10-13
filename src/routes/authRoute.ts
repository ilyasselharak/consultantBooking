import express from "express";
import {
  forgotPassword,
  resetPassword,
  regester,
  signup,
  verifyUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);

router.post("/regester", regester);

router.post("/verify", verifyUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
