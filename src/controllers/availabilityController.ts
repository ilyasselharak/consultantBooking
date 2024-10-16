import Availability from "../models/AvailabilityModel";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";

const createAvailability = createOne(Availability);

// @desc    Get availabilities
// @route   GET /api/v1/availabilities
// @access  Private
const getAvailabilities = getMany(Availability);

// @desc    Get availability
// @route   GET /api/v1/availabilities/:id
// @access  Private
const getAvailabilityById = getById(Availability);

// @desc    Update availability
// @route   PUT /api/v1/availabilities/:id
// @access  Private
const updateAvailability = update(Availability);

// @desc    Delete availability
// @route   DELETE /api/v1/availabilities/:id
// @access  Private

const deleteAvailability = deleteOne(Availability);



// @desc    Delete many availabilities
// @route   DELETE /api/v1/availabilities
// @access  Private
const deleteManyAvailabilities = deleteMany(Availability);

export {
  createAvailability,
  getAvailabilities,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
  deleteManyAvailabilities,
};
