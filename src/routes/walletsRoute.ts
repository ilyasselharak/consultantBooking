import express from "express";
import {
  createWallet,
  deleteManyWallets,
  deleteWallet,
  getWalletById,
  getWallets,
  updateWallet,
} from "../controllers/walletController";
const router = express.Router();

router.route("/").get(getWallets).post(createWallet).delete(deleteManyWallets);
router.route("/:id").get(getWalletById).put(updateWallet).delete(deleteWallet);

export default router;
