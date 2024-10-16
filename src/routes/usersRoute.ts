import express from "express";
import {
  createUser,
  deleteManyUsers,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/usersController";

const router = express.Router();

router.route("/").get(getUsers).post(createUser).delete(deleteManyUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default router;
