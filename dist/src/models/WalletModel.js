"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});
const Wallet = mongoose_1.default.model('Wallet', walletSchema);
exports.default = Wallet;
