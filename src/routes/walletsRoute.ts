import express from "express";
import {
  createWalletValidation,
  updateWalletValidation,
  getWalletByIdValidation,
  deleteWalletByIdValidation,
  deleteWalletsValidation,
} from "../../utils/validation/walletValidation";
import {
  createWallet,
  deleteManyWallets,
  deleteWallet,
  getWalletById,
  getWallets,
  updateWallet,
} from "../controllers/walletController";
const router = express.Router();

router
  .route("/")
  .get(getWallets)
  .post(createWalletValidation, createWallet)
  .delete(deleteWalletsValidation, deleteManyWallets);
router
  .route("/:id")
  .get(getWalletByIdValidation, getWalletById)
  .put(updateWalletValidation, updateWallet)
  .delete(deleteWalletByIdValidation, deleteWallet);

export default router;
