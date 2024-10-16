"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regesterValidation = void 0;
const express_validator_1 = require("express-validator");
const validationMiddleware_1 = __importDefault(require("../../src/middlewares/validationMiddleware"));
exports.regesterValidation = [
    (0, express_validator_1.check)("fullName").exists().withMessage("Full name is required").notEmpty(),
    (0, express_validator_1.check)("email")
        .exists()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
    (0, express_validator_1.check)("password")
        .exists()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 and 20 characters"),
    validationMiddleware_1.default,
];
