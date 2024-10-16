import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Wallet from "../models/WalletModel";
import { sendEmail } from "./../../utils/sendEmail";
import { ApiError } from "../../utils/APIError";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
      // TODO: Implement authentication logic here
      const { fullName, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        return next(new ApiError("User already exists", 400));
      }

      const token = Math.floor(100000 + Math.random() * 900000);

      const newUser = new User({
        fullName,
        email,
        password: await bcrypt.hash(password, 12),
        token,
        expireDate: new Date(Date.now() + 1000 * 60),
      });
      const link = `http://localhost:3000/verify-acount?id=${newUser._id}`;

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
        </body>
        </html>
        `;
      sendEmail(verifyEmailHtml, "verify your email", email);

      await newUser.save();

      res.status(201).json({ message: "User signed in successfully" });
    } catch (error) {
      return next(new ApiError(`Error registering user: ${error}`, 500));
    }
  }
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return next(new ApiError("Invalid credentials", 400));
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return next(new ApiError("Invalid credentials", 400));
      }

      if (!user.verified) {
        const token = Math.floor(100000 + Math.random() * 900000);
        user.token = `${token}`;
        user.expireDate = new Date(Date.now() + 1000 * 60);

        const link = `http://localhost:3000/verify-acount?id=${user._id}`;
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
        <h2>Hello,${user.fullName}</h2>
        <p>Thank you for registering with our website. Your verification code is ${token}</p>
        <a href="${link}">verify your email</a>
        </body>
        </html>`;
        return next(
          new ApiError(
            "User not verified, we sent a new code to your email, please check your email",
            400
          )
        );
      }
      res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
      return next(new ApiError(`Error logging in user: ${error}`, 500));
    }
  }
);

// @desc    Verify user
// @route   POST /api/v1/auth/verify
// @access  Public
const verifyUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ApiError("User not found", 400));
      }

      const corecteToken = token === user.token;

      if (user.verified) {
        return next(new ApiError("User already verified", 400));
      }

      if (
        !corecteToken ||
        (user.expireDate !== null &&
          user.expireDate.getMinutes() <
            new Date(Date.now() - 1 * 60 * 1000).getMinutes())
      ) {
        // message verify send again
        const token = Math.floor(100000 + Math.random() * 900000);
        user.token = `${token}`;
        user.expireDate = new Date(Date.now() + 1000 * 60);
        const link = `http://localhost:3000/verify-acount?id=${user._id}`;
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
        
        </body>
        </html>
        `;

        sendEmail(verifyEmailHtml, "verify your email", user.email);
        await user.save();
        return next(new ApiError("Token expired", 400));
      }
      user.verified = true;
      user.token = null;

      await user.save();

      res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
      return next(new ApiError(`Error verifying user: ${error}`, 500));
    }
  }
);

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new ApiError("User not found", 400));
      }

      const token = crypto.randomBytes(32).toString("hex");
      user.token = token;
      user.expireDate = new Date(Date.now() + 1000 * 60);
      await user.save();

      const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
      const verifyEmailHtml = `
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
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
        <p>Thank you for requesting a password reset. Please click on the following link to reset your password:</p>
        <a href="${link}">reset password</a>
        </body>
        </html>
        `;

      sendEmail(verifyEmailHtml, "Reset your password", email);

      res
        .status(200)
        .json({ message: "Password reset link sent successfully" });
    } catch (error) {
      return next(new ApiError(`Error resetting password: ${error}`, 500));
    }
  }
);

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:id/:token
// @access  Public
const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.params;
    const { password } = req.body;
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return next(new ApiError("User not found", 400));
      }

      if (user.token !== token) {
        return next(new ApiError("Invalid token", 400));
      }

      if (
        user.expireDate &&
        user.expireDate?.getMinutes() <
          new Date(Date.now() - 1 * 60 * 1000).getMinutes()
      ) {
        return next(new ApiError("Token expired", 400));
      }
      user.password = await bcrypt.hash(password, 12);
      user.token = null;
      user.expireDate = null;

      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      return next(new ApiError(`Error resetting password: ${error}`, 500));
    }
  }
);

export { register, login, verifyUser, forgotPassword, resetPassword };
