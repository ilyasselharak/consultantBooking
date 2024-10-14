import express from "express";
import { deleteUser, getUserById, getUsers, updateUser } from "../controllers/usersController";

const router = express.Router();

router
  .get("/", getUsers)
  .get("/:id", getUserById)
  .put("/:id", updateUser)
  .delete("/:id", deleteUser);

export default router;
