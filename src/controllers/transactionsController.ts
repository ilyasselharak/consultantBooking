
import Transaction from "../models/TransactionModel";
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
const createTransaction = createOne(Transaction);


// @desc    Get transactions
// @route   GET /api/v1/transactions
// @access  Private
const getTransactions = getMany(Transaction);

// @desc    Get transaction
// @route   GET /api/v1/transactions/:id
// @access  Private
const getTransactionById = getById(Transaction,);


// @desc    Update transaction
// @route   PUT /api/v1/transactions/:id
// @access  Private
const updateTransaction = update(Transaction);


// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
const deleteTransaction = deleteOne(Transaction);


// @desc    Delete transactions
// @route   DELETE /api/v1/transactions
// @access  Private
const deleteManyTransactions = deleteMany(Transaction);


export {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  deleteManyTransactions,
};
