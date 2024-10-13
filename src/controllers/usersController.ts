import asyncHandler from "express-async-handler";
import User from "../models/UserModel";

const getUsers = asyncHandler(async (req, res) => {
  try {
      const users = await User.find();
      console.log("Users fetched:", users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


export { getUsers }