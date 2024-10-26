import Wallet from "../models/WalletModel";
import redisClient from "../../utils/redis";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";


// @desc    Create wallet
// @route   POST /api/v1/wallets
// @access  Private
const createWallet = createOne(Wallet);


// @desc    Get wallets
// @route   GET /api/v1/wallets
// @access  Private
const getWallets = getMany(Wallet, {});


// @desc    Get wallet
// @route   GET /api/v1/wallets/:id
// @access  Private
const getWalletById = getById(Wallet);


// @desc    Update wallet
// @route   PUT /api/v1/wallets/:id
// @access  Private
const updateWallet = update(Wallet);


// @desc    Delete wallet
// @route   DELETE /api/v1/wallets/:id
// @access  Private
const deleteWallet = deleteOne(Wallet);


// @desc    Delete many wallets
// @route   DELETE /api/v1/wallets
// @access  Private
const deleteManyWallets = deleteMany(Wallet);

export {
  createWallet,
  getWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
  deleteManyWallets,
};
