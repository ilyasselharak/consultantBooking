import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import Wallet from "../models/WalletModel";

const regester = asyncHandler(async (req: Request, res: Response) => {
  try {
    // TODO: Implement authentication logic here
    console.log(req.body);
    const { fullName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = new User({
      fullName,
      email,
      password: await bcrypt.hash(password, 10),
    });

    await newUser.save();

    await Wallet.create({ userId: newUser._id });

    res.json({ message: "User signed in successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const signup = asyncHandler(async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { regester, signup, verifyUser, forgotPassword, resetPassword };
