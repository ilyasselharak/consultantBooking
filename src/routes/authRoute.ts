import express from "express";
import { regesterValidation } from './../../utils/validation/authValidation';
import {
  forgotPassword,
  resetPassword,
  register,
  login,
  verifyUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login);

router.post("/register" , register);

router.post("/verify/:id", verifyUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:id/:token", resetPassword);

export default router;
