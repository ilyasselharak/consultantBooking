import express from "express";

import {
  createTransactionValidation,
  updateTransactionValidation,
  getTransactionByIdValidation,
  deleteTransactionByIdValidation,
  deleteTransactionsValidation,
} from "../../utils/validation/transactionValidation";
import {
  createTransaction,
  deleteManyTransactions,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../controllers/transactionsController";

const router = express.Router();

router
  .route("/")
  .post(createTransactionValidation, createTransaction)
  .get(getTransactions)
  .delete(deleteTransactionsValidation, deleteManyTransactions);
router
  .route("/:id")
  .get(getTransactionByIdValidation, getTransactionById)
  .put(updateTransactionValidation, updateTransaction)
  .delete(deleteTransactionByIdValidation, deleteTransaction);

export default router;
