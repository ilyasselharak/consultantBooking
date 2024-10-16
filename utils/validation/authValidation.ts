import { body, param } from "express-validator";
import validatorMiddleware from "../../src/middlewares/validationMiddleware";

const registerValidation = [
  body("fullName")
    .exists()
    .notEmpty()
    .withMessage("Full name is required")
    .notEmpty(),
  body("email")
    .exists()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .exists()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  body("image").custom((value) => {
    if (
      typeof value !== "object" ||
      typeof value.url !== "string" ||
      typeof value.public_id !== "string"
    ) {
      throw new Error("Invalid image format");
    }
    return true;
  }),
  validatorMiddleware,
];

const loginValidation = [
  body("email")
    .exists()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .exists()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  validatorMiddleware,
];

const verifiedUserValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("token").exists().notEmpty().withMessage("Token is required"),
  validatorMiddleware,
];

const forgotPasswordValidation = [
  body("email")
    .exists()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  validatorMiddleware,
];

const resetPasswordValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  param("token").exists().notEmpty().withMessage("Token is required"),
  body("password")
    .exists()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  body("confirmPassword")
    .exists()
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Confirm password must be between 8 and 20 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  validatorMiddleware,
];
export {
  registerValidation,
  loginValidation,
  verifiedUserValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
