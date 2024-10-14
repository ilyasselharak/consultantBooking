import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Wallet from "../models/WalletModel";
import redisClient from "../../utils/redis";

const getWallets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch wallets from the database
    console.log("Fetching wallets...");
    const walletsRedis = JSON.parse((await redisClient.get("wallets")) || "[]");

    // if (walletsRedis.length > 0) {
    //   console.log("Wallets from Redis:", walletsRedis);
    //   res.status(200).json(walletsRedis);
    //   return;
    // }
    const wallets = await Wallet.find({});
    console.log("Wallets fetched:", wallets);
    redisClient.set("wallets", JSON.stringify(wallets));
    console.log("Wallets from Redis:", walletsRedis);
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const getWalletById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const wallet = await Wallet.findById(req.params.id);
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const updateWallet = asyncHandler(async (req: Request, res: Response) => {
  try {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const deleteWallet = asyncHandler(async (req: Request, res: Response) => {
  try {
    await Wallet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Wallet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { getWallets, getWalletById, updateWallet, deleteWallet };
