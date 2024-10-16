import { check } from "express-validator";
import validatorMiddleware from "../../src/middlewares/validationMiddleware";

export const registerValidation = [
  check("fullName").exists().withMessage("Full name is required").notEmpty(),
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  check("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  validatorMiddleware,
];
