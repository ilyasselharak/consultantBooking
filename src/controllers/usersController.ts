import User from "../models/UserModel";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  getSpecificOne,
  update,
} from "./handlersFactory";


// @desc    Create user
// @route   POST /api/v1/users
// @access  Private
const createUser = createOne(User);

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
const getUsers = getMany(User);

// @desc    Get user
// @route   GET /api/v1/users/:id
// @access  Private
const getUserById = getById(User);

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
const updateUser = update(User);

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private
const deleteUser = deleteOne(User);



// @desc    Delete many users
// @route   DELETE /api/v1/users
// @access  Private
const deleteManyUsers = deleteMany(User);

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteManyUsers,
};
