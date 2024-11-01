import express from "express";
// import {
//   createPaymentValidation,
//   getPaymentByIdValidation,
//   deletePaymentValidation,
// } from "../../utils/validation/paymentValidation";
import {
  createPayment,
  getPaymentById,
  deletePayment,
  deletePayments,
} from "../controllers/paymentsController";

const router = express.Router();

router.route("/").post(createPayment).delete(deletePayments);
router.route("/:id").get(getPaymentById).delete(deletePayment);

export default router;
