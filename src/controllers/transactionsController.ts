import Wallet from "../models/WalletModel";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";

// @desc    Create transaction
// @route   POST /api/v1/transactions
// @access  Private
const createTransaction = createOne(Wallet);


// @desc    Get transactions
// @route   GET /api/v1/transactions
// @access  Private
const getTransactions = getMany(Wallet, {});

// @desc    Get transaction
// @route   GET /api/v1/transactions/:id
// @access  Private
const getTransactionById = getById(Wallet,);


// @desc    Update transaction
// @route   PUT /api/v1/transactions/:id
// @access  Private
const updateTransaction = update(Wallet);


// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
const deleteTransaction = deleteOne(Wallet);


// @desc    Delete transactions
// @route   DELETE /api/v1/transactions
// @access  Private
const deleteManyTransactions = deleteMany(Wallet);


export {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  deleteManyTransactions,
};
