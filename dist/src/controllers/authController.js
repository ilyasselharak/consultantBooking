"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.verifyUser = exports.login = exports.register = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const WalletModel_1 = __importDefault(require("../models/WalletModel"));
const sendEmail_1 = require("./../../utils/sendEmail");
const register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        // TODO: Implement authentication logic here
        const { fullName, email, password } = req.body;
        const user = yield UserModel_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const token = Math.floor(100000 + Math.random() * 900000);
        const newUser = new UserModel_1.default({
            fullName,
            email,
            password: yield bcryptjs_1.default.hash(password, 12),
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
        (0, sendEmail_1.sendEmail)(verifyEmailHtml, "verify your email", email);
        yield newUser.save();
        yield WalletModel_1.default.create({ userId: newUser._id });
        res.json({ message: "User signed in successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.register = register;
const login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        if (!user.verified) {
            res.status(400).json({ message: "User not verified" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        res.status(200).json({ message: "User logged in successfully", user });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.login = login;
const verifyUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        console.log(req.params);
        const user = yield UserModel_1.default.findById(req.params.id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const corecteToken = token === user.token;
        if (user.verified) {
            res.status(400).json({ message: "User already verified" });
            return;
        }
        if (!corecteToken ||
            user.expireDate !== null &&
                user.expireDate.getMinutes() <
                    new Date(Date.now() - 1 * 60 * 1000).getMinutes()) {
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
            (0, sendEmail_1.sendEmail)(verifyEmailHtml, "verify your email", user.email);
            yield user.save();
            res.status(400).json({ message: "Token expired" });
            return;
        }
        user.verified = true;
        user.token = null;
        yield user.save();
        res.status(200).json({ message: "User verified successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.verifyUser = verifyUser;
const forgotPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { email } = req.body;
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        user.token = token;
        user.expireDate = new Date(Date.now() + 1000 * 60);
        yield user.save();
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
        (0, sendEmail_1.sendEmail)(verifyEmailHtml, "Reset your password", email);
        res.status(200).json({ message: "Password reset link sent successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.forgotPassword = forgotPassword;
const resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, token } = req.params;
    const { password } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({ _id: id });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        if (user.token !== token) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        if (user.expireDate &&
            ((_a = user.expireDate) === null || _a === void 0 ? void 0 : _a.getMinutes()) <
                new Date(Date.now() - 1 * 60 * 1000).getMinutes()) {
            res.status(400).json({ message: "Token expired" });
            return;
        }
        user.password = yield bcryptjs_1.default.hash(password, 12);
        user.token = null;
        user.expireDate = null;
        yield user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.resetPassword = resetPassword;
