import express from "express";
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  verifiedUserValidation,
} from "./../../utils/validation/authValidation";
import {
  forgotPassword,
  resetPassword,
  register,
  login,
  verifyUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", loginValidation, login);

router.post("/register", registerValidation, register);

router.post("/verify/:id", verifiedUserValidation, verifyUser);

router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

router.post(
  "/reset-password/:id/:token",
  resetPasswordValidation,
  resetPassword
);

export default router;
