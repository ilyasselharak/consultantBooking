
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";
import AvailabilityTimes from "../models/AvailabilityTimesModel";

const createAvailabilityTimes = createOne(AvailabilityTimes);

// @desc    Get availabilities
// @route   GET /api/v1/availabilities
// @access  Private
const getAvailabilitiesTimes = getMany(AvailabilityTimes, {
  path: "availabilityDaysId",
  model: "AvailabilityDays",
});

// @desc    Get AvailabilityTimes
// @route   GET /api/v1/availabilities/:id
// @access  Private
const getAvailabilityTimesById = getById(AvailabilityTimes);

// @desc    Update AvailabilityTimes
// @route   PUT /api/v1/availabilities/:id
// @access  Private
const updateAvailabilityTimes = update(AvailabilityTimes);

// @desc    Delete AvailabilityTimes
// @route   DELETE /api/v1/availabilities/:id
// @access  Private

const deleteAvailabilityTimes = deleteOne(AvailabilityTimes);

// @desc    Delete many availabilities
// @route   DELETE /api/v1/availabilities
// @access  Private
const deleteManyAvailabilitiesTimes = deleteMany(AvailabilityTimes);

export {
  createAvailabilityTimes,
  getAvailabilitiesTimes,
  getAvailabilityTimesById,
  updateAvailabilityTimes,
  deleteAvailabilityTimes,
  deleteManyAvailabilitiesTimes,
};
