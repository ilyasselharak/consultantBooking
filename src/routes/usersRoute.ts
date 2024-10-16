import express from "express";
import {
  createUserValidation,
  updateUserValidation,
  deleteUserByIdValidation,
  deleteUsersValidation,
  getUserByIdValidation,
} from "./../../utils/validation/userValidation";
import {
  createUser,
  deleteManyUsers,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/usersController";

const router = express.Router();

router
  .route("/")
  .get(getUsers)
  .post(createUserValidation, createUser)
  .delete(deleteUsersValidation, deleteManyUsers);
router
  .route("/:id")
  .get(getUserByIdValidation, getUserById)
  .put(updateUserValidation, updateUser)
  .delete(deleteUserByIdValidation, deleteUser);

export default router;
