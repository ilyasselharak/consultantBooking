import { body, param } from "express-validator";
import validatorMiddleware from './../../src/middlewares/validationMiddleware';
import { Types } from 'mongoose';

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
    validatorMiddleware
]


const updateUserValidation = [
    body("fullName")
    .optional(),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email"),
    body("password")
        .optional()
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 and 20 characters"),
    body("confirmPassword")
        .isLength({ min: 8, max: 20 })
        .withMessage("Confirm password must be between 8 and 20 characters")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    validatorMiddleware
]

const getUserByIdValidation = [
    param("id")
        .exists()
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user ID"),
    validatorMiddleware
]

const deleteUserByIdValidation = [
    param("id")
        .exists()
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user ID"),
    validatorMiddleware
]


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
    deleteUsersValidation
}