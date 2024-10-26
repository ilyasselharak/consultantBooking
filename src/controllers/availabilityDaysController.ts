
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";
import AvailabilityDays from "../models/AvailabilityDaysModel";

const createAvailabilityDays = createOne(AvailabilityDays);

// @desc    Get availabilities
// @route   GET /api/v1/availabilities
// @access  Private
const getAvailabilitiesDays = getMany(AvailabilityDays, {});

// @desc    Get AvailabilityDays
// @route   GET /api/v1/availabilities/:id
// @access  Private
const getAvailabilityDaysById = getById(AvailabilityDays);

// @desc    Update AvailabilityDays
// @route   PUT /api/v1/availabilities/:id
// @access  Private
const updateAvailabilityDays = update(AvailabilityDays);


// @desc    Delete AvailabilityDays
// @route   DELETE /api/v1/availabilities/:id
// @access  Private

const deleteAvailabilityDays = deleteOne(AvailabilityDays);

// @desc    Delete many availabilities
// @route   DELETE /api/v1/availabilities
// @access  Private
const deleteManyAvailabilitiesDays = deleteMany(AvailabilityDays);

export {
  createAvailabilityDays,
  getAvailabilitiesDays,
  getAvailabilityDaysById,
  updateAvailabilityDays,
  deleteAvailabilityDays,
  deleteManyAvailabilitiesDays,
};
