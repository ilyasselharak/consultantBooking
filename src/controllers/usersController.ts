import User from "../models/UserModel";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";
import Consultant from "../models/ConsultantModel";
import Availability from "../models/AvailabilityModel";
import AvailabilityDays from "../models/AvailabilityDaysModel";
import AvailabilityTimes from "../models/AvailabilityTimesModel";

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private
const createUser = createOne(User);

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
const getUsers = getMany(User, "-password -verified -token");

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
