import express from "express";
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
  .post(createTransaction)
  .get(getTransactions)
  .delete(deleteManyTransactions);
router
  .route("/:id")
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
