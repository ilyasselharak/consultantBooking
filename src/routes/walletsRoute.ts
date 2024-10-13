import express from "express";
import {
    deleteWallet,
  getWalletById,
  getWallets,
  updateWallet,
} from "../controllers/walletController";
const router = express.Router();

router
  .get("/", getWallets)
  .get("/:id", getWalletById)
  .put("/:id", updateWallet)
  .delete("/:id", deleteWallet);


  export default router