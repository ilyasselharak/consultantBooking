import asyncHandler from "express-async-handler";
import User from "../models/UserModel";
import Wallet from "../models/WalletModel";

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    console.log("Users fetched:", users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const wallet = await Wallet.findOne({ userId: req.params.id });

    if (wallet) {
      await Wallet.findByIdAndDelete({ _id: wallet._id });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { getUsers, getUserById, updateUser, deleteUser };
