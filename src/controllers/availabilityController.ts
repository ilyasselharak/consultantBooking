import Availability from "../models/AvailabilityModel";
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from "express";
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
const getAvailabilities = async (req: Request, res: Response) => {
  try {
    const availabilities = await Availability.find().populate({
      path: "availabilityDays",
      populate: {
        path: "availabilityTimes",
      },
    });

    res.status(200).json({
      status: "success",
      data: availabilities,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


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
