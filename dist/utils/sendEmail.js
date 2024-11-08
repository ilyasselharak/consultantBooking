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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (htmlTemplate, subject, email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({
        htmlTemplate,
        subject,
        email
    });
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_EMAIL_ADDRESS,
                pass: process.env.APP_EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.APP_EMAIL_ADDRESS,
            to: email,
            subject,
            html: htmlTemplate,
        };
        const result = yield transporter.sendMail(mailOptions);
        console.log(result);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.sendEmail = sendEmail;
