import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Wallet from "../models/WalletModel";
import { sendEmail } from "./../../utils/sendEmail";

const register = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    // TODO: Implement authentication logic here
    const { fullName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
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
        <p>Please click on the following link to verify your email:</p>
        <a href="${link}">verify</a>
        </body>
        </html>
        `;
    sendEmail(verifyEmailHtml, "verify your email", email);

    await newUser.save();

    await Wallet.create({ userId: newUser._id });

    res.json({ message: "User signed in successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (!user.verified) {
      res.status(400).json({ message: "User not verified" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    console.log(req.params);

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const corecteToken = token === user.token;

    if (user.verified) {
      res.status(400).json({ message: "User already verified" });
      return;
    }

    if (
      !corecteToken ||
      user.expireDate !== null &&
      user.expireDate.getMinutes() <
        new Date(Date.now() - 1 * 60 * 1000).getMinutes()
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
        <p>Please click on the following link to verify your email:</p>
        <a href="${link}">verify</a>
        </body>
        </html>
        `;

      sendEmail(verifyEmailHtml, "verify your email", user.email);
      await user.save();
      res.status(400).json({ message: "Token expired" });
      return;
    }
    user.verified = true;
    user.token = null;

    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
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

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (user.token !== token) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    if (
      user.expireDate &&
      user.expireDate?.getMinutes() <
        new Date(Date.now() - 1 * 60 * 1000).getMinutes()
    ) {
      res.status(400).json({ message: "Token expired" });
      return;
    }
    user.password = await bcrypt.hash(password, 12);
    user.token = null;
    user.expireDate = null;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { register, login, verifyUser, forgotPassword, resetPassword };
