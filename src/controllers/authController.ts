import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "./../../utils/sendEmail";
import { ApiError } from "../../utils/APIError";
import jwt from "jsonwebtoken";
import Consultant from "../models/ConsultantModel";
import { template } from "./../../utils/template";
import moment from "moment";
import Availability from "../models/AvailabilityModel";
import Transaction from "../models/TransactionModel";
import Wallet from "../models/WalletModel";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
      // TODO: Implement authentication logic here
      const { fullName, email, password, role } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        return next(new ApiError("Invalid credentials", 400));
      }

      const token = Math.floor(100000 + Math.random() * 900000);
      const time = new Date(Date.now() + 1000 * 60);

      const newUser = new User({
        fullName,
        email,
        password: await bcrypt.hash(password, 12),
        token,
        role,
        expireDate: time,
      });

      const verifyEmailHtml = template(token, moment(1000 * 60).fromNow(), "");
      sendEmail(verifyEmailHtml, "verify your email", email);

      await newUser.save();

      
      await Wallet.create({
        user: newUser._id,
      });
      res
        .status(201)
        .json({ message: "User signed in successfully", userId: newUser._id });
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
        if (user.role !== "Customer" && user.role !== "Consultant") {
          return next(new ApiError("Invalid credentials", 400));
        }
        const token = Math.floor(100000 + Math.random() * 900000);
        user.token = `${token}`;
        user.expireDate = new Date(Date.now() + 1000 * 60);

        const verifyEmailHtml = template(
          token,
          moment(1000 * 60).fromNow(),
          "Thank you for registering with our website."
        );

        sendEmail(verifyEmailHtml, "Verify your email", email);
        await user.save();
        return next(
          new ApiError(
            "User not verified, we sent a new code to your email, please check your email",
            400
          )
        );
      }
      if (user.role === "Consultant") {
        const notExist = await Consultant.findOne({ userId: user._id });
        if (!notExist) {
          res
            .status(200)
            .json({
              message: "Consultant is not exist yet, please create it",
              userId: user._id,
            });
          return;
        }
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "User logged in successfully",
        token,
      });
    } catch (error) {
      return next(new ApiError(`Error logging in user: ${error}`, 500));
    }
  }
);

// @desc    get Account
// @route   GET /api/v1/auth/account
// @access  Private
const getAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req?.user?.id || !req?.user?.role) {
        return next(new ApiError("Not authorized, token is required", 401));
      }
      let consultant;

      if (req.user.role === "Consultant") {
        const notExist = await Consultant.findOne({ userId: req.user.id });
        const availability = await Availability.findOne({
          userId: req.user.id,
        })

        const transaction = await Transaction.find({
          $or: [
            {
              $and: [
                { "consultant.userId": req.user.id },
                { "consultant.isDeleted": false },
              ],
            },
            {
              $and: [
                { "customer.userId": req.user.id },
                { "customer.isDeleted": false },
              ],
            },
          ],
        });

        if (!availability) {
          res.status(200).json({
            message: "Availability is not exist yet, please create it",
            userId: req.user.id,
          });
          return;
        }

        if (!notExist) {
          res.status(200).json({
            message: "Consultant is not exist yet, please create it",
            userId: req.user.id,
          });
          return;
        }
        consultant = {...notExist, availability};
      }


      const user = await User.findById(req.user.id).select("-password");
      const data = { ...user, ...{ consultant: !!consultant } };

      res.status(200).json({ data });
    } catch (error) {
      return next(new ApiError(`Error getting user: ${error}`, 500));
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
        const time = new Date(Date.now() + 1000 * 60);
        user.token = `${token}`;
        user.expireDate = time;
        const verifyEmailHtml = template(
          token,
          moment(1000 * 60).fromNow(),
          "Thank you for registering with our website."
        );
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
      const time = new Date(Date.now() + 1000 * 60);
      user.token = token;
      user.expireDate = time;
      await user.save();

      const temp = template(
        token,
        moment(1000 * 60).format("mm:ss"),
        "Thank you for requesting a password reset."
      );
      sendEmail(temp, "Reset your password", email);

      res.status(200).json({
        message: "Password reset link sent successfully",
        id: user.id,
      });
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
      const user = await User.findById(id);
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

export {
  register,
  login,
  verifyUser,
  forgotPassword,
  resetPassword,
  getAccount,
};
