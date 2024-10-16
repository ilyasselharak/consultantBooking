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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const WalletModel_1 = __importDefault(require("../models/WalletModel"));
const createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.createUser = createUser;
const getUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModel_1.default.find();
        console.log("Users fetched:", users);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.getUsers = getUsers;
const getUserById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(req.params.id);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.getUserById = getUserById;
const updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.updateUser = updateUser;
const deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(req.params.id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const wallet = yield WalletModel_1.default.findOne({ userId: req.params.id });
        if (wallet) {
            yield WalletModel_1.default.findByIdAndDelete({ _id: wallet._id });
        }
        yield UserModel_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.deleteUser = deleteUser;
