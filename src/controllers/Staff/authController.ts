import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Staff from "../../models/StaffModel";
import { ApiError } from "../../../utils/APIError";
import bcrypt from "bcryptjs";
import { signToken } from './../../../utils/jwt';

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const staff = await Staff.findOne({ email });

      if (!staff) {
        return next(new ApiError("Invalid credentials", 400));
      }

      const isMatch = await bcrypt.compare(password, staff.password);

      if (!isMatch) {
        return next(new ApiError("Invalid credentials", 400));
      }

      if (!staff.verified) {
        return next(new ApiError("Account not verified", 400));
      }

      const accessToken = signToken({
        id: staff._id.toString(),
        role: staff.role,
      });
      res.status(200).json({
        message: "Login successful",
        email: staff.email,
        fullName: staff.fullName,
        accessToken,
      });
    } catch (error) {}
  }
);
