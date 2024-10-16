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
exports.deleteWallet = exports.updateWallet = exports.getWalletById = exports.getWallets = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const WalletModel_1 = __importDefault(require("../models/WalletModel"));
const redis_1 = __importDefault(require("../../utils/redis"));
const getWallets = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch wallets from the database
        console.log("Fetching wallets...");
        const walletsRedis = JSON.parse((yield redis_1.default.get("wallets")) || "[]");
        // if (walletsRedis.length > 0) {
        //   console.log("Wallets from Redis:", walletsRedis);
        //   res.status(200).json(walletsRedis);
        //   return;
        // }
        const wallets = yield WalletModel_1.default.find({});
        console.log("Wallets fetched:", wallets);
        redis_1.default.set("wallets", JSON.stringify(wallets));
        console.log("Wallets from Redis:", walletsRedis);
        res.status(200).json(wallets);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.getWallets = getWallets;
const getWalletById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield WalletModel_1.default.findById(req.params.id);
        res.status(200).json(wallet);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.getWalletById = getWalletById;
const updateWallet = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield WalletModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(wallet);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.updateWallet = updateWallet;
const deleteWallet = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield WalletModel_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Wallet deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.deleteWallet = deleteWallet;
