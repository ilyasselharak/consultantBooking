import express from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/usersController";

const router = express.Router();

router.post("/", createUser)
  .get("/", getUsers)
  .get("/:id", getUserById)
  .put("/:id", updateUser)
  .delete("/:id", deleteUser);

export default router;
