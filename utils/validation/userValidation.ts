import { body, param } from "express-validator";
import validatorMiddleware from "./../../src/middlewares/validationMiddleware";
import { Types } from "mongoose";
import User from "../../src/models/UserModel";
import bcrypt from "bcryptjs";
import { sendEmail } from "../sendEmail";

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

  body("currentPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters")
    .custom(async (value, { req }) => {
      if (!value) return true;
      const user = await User.findOne({ _id: req?.params?.id });
      if (!user) {
        throw new Error("User not found");
      }
      const isMatchPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isMatchPassword) {
        throw new Error("Invalid password");
      }
      return true;
    }),
    body("fullName").optional().isString().withMessage("Invalid full name"),
  
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value, { req }) => {
      if (!value) return true;
      const exitUser = await User.findById({ email: value });
      if (exitUser) {
        throw new Error("Email already exists");
      }

        const user = await User.findOne({ _id: req?.params?.id });
        if (!user) {
          throw new Error("User not found");
        }


      const token = Math.floor(100000 + Math.random() * 900000);

      const link = `http://localhost:3000/verify-acount?id=${user?._id}`;

      const verifyEmailHtml = `
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
        <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          padding: 0;
        }
        h2 {
          margin-top: 0;
        }
        a {
          display: block;
          margin-top: 1rem;
          margin: auto;
          padding: 1rem 4rem;
          width: fit-content;
          background-color: #4caf50;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        </style>
        </head>
        <body>
        <h2>Hello,</h2>
        <p>Thank you for registering with our website. Your verification code is ${token}</p>
        <a href="${link}">verify email</a>
        </body>
        </html>
        `;
        sendEmail(verifyEmailHtml, "verify your email", value);
        
        user.token = `${token}`;
        user.expireDate = new Date(Date.now() + 1000 * 60);
        user.save();
      return true;
    }),
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

      console.log(req.body.newPassword);
      console.log(value);
      console.log(req.body.password);
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
