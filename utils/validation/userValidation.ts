import { body, param } from "express-validator";
import validatorMiddleware from "./../../src/middlewares/validationMiddleware";
import { Types } from "mongoose";
import User from "../../src/models/UserModel";
import bcrypt from "bcryptjs";

const createUserValidation = [
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
  body("image")
    .optional()
    .custom((value) => {
      if (
        typeof value !== "object" ||
        (value.url !== null && typeof value.url !== "string") ||
        (value.public_id !== null && typeof value.public_id !== "string") ||
        (value.url !== null && value.public_id === null) ||
        (value.url !== null && value.public_id === null)
      ) {
        throw new Error("Invalid image format");
      }
      return true;
    }),
  validatorMiddleware,
];

const updateUserValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  body("fullName")
    .optional()
    .custom(async (value, { req }) => {
      if (!value) {
        return true;
      }

      const user = await User.findOne({ _id: req?.params?.id });

      if (!user) {
        throw new Error("User not found");
      }
      const isMatchPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isMatchPassword) {
        throw new Error("Invalid password");
      }
      return true;
    }),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("newPassword").optional().isLength({ min: 8, max: 20 }),
    body("confirmPassword")
      .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage("Confirm password must be between 8 and 20 characters")
    .custom(async (value, { req }) => {
      if (!req.body.newPassword) return true;
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }

      const hashPassword = bcrypt.hashSync(req.body.newPassword, 12);

      await User.findByIdAndUpdate(req?.params?.id, { password: hashPassword });
      return true;
    }),
  body("image")
    .optional()
    .custom((value) => {
      if (
        typeof value !== "object" ||
        (value.url !== null && typeof value.url !== "string") ||
        (value.public_id !== null && typeof value.public_id !== "string") ||
        (value.url !== null && value.public_id === null) ||
        (value.url !== null && value.public_id === null)
      ) {
        throw new Error("Invalid image format");
      }
      return true;
    }),
  validatorMiddleware,
];

const getUserByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  validatorMiddleware,
];

const deleteUserByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  validatorMiddleware,
];

const deleteUsersValidation = [
  body("ids")
    .exists()
    .notEmpty()
    .withMessage("User IDs are required")
    .isArray()
    .withMessage("User IDs must be an array")
    .custom((value, { req }) => {
      if (!Array.isArray(value)) {
        throw new Error("User IDs must be an array");
      }
      for (const id of value) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error("Invalid user ID");
        }
      }
      return true;
    }),
  validatorMiddleware,
];
export {
  createUserValidation,
  updateUserValidation,
  getUserByIdValidation,
  deleteUserByIdValidation,
  deleteUsersValidation,
};
