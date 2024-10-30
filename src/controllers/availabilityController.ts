import Availability from "../models/AvailabilityModel";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";

import  { Model as MongooseModel } from "mongoose";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  getSpecificOne,
  update,
} from "./handlersFactory";
import { ApiError } from "../../utils/APIError";
import { deleteFromSchedule } from "../middlewares/relationHandler";



// get the availability of a specific consultant
const getSpecificAvailability = getSpecificOne(Availability);


interface IScheduleUpdate {
  dayId: string;
  timeId?: string;
}

const deleteSchedule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { scheduleUpdates }: { scheduleUpdates: IScheduleUpdate[] } =
      req.body;
    
    const { consultantId } = req.params;
    // const document = await Availability.f();

    // if (!document) {
    //   res.status(404).json({ message: "Document not found" });
    //   return;
    // }
    let document;

  for (const update of scheduleUpdates) {
    if (update.dayId && !update.timeId) {
      // حذف اليوم بالكامل بناءً على معرف اليوم
      const updatedDocument = await Availability.findOneAndUpdate(
        { consultantId: consultantId },
        { $pull: { schedule: { _id: update.dayId } } },
        { new: true }
      );

      if (!updatedDocument) {
        throw new ApiError(
          `No schedule found for the day with ID: ${update.dayId}`,
          404
        );
      }

      document = updatedDocument
      await document.save();
    } else if (update.dayId && update.timeId) {
      // حذف وقت معين من داخل اليوم بناءً على معرف اليوم ومعرف الوقت
      const updatedDocument = await Availability.findOneAndUpdate(
        { consultantId: consultantId, "schedule._id": update.dayId },
        { $pull: { "schedule.$.times": { _id: update.timeId } } },
        { new: true }
      );

      if (!updatedDocument) {
        throw new ApiError(
          `No schedule found for the day with ID: ${update.dayId}`,
          404
        );
      }
      document = updatedDocument
      await document.save();
    } else {
      throw new ApiError("Both dayId and/or timeId must be provided.", 400);
    }
  }
    res
      .status(200)
      .json({ message: "Schedule updated successfully", document });
  }
);


//  add days or times of the specific availability
const addDayOrTimes = asyncHandler(async (req: Request, res: Response) => {
  try {
    const consultantId = req.params.consultantId;
    const availability = await Availability.findOne({ consultantId });
    if (!availability) {
      res.status(404).json({ message: "Availability not found" });
      return;
    }

    console.log(req.body);



    await Availability.findOneAndUpdate(
      { _id: availability._id }, {
        $push: { schedule: req.body.schedule },
      }
    )


    res.status(200).json({ message: "Availability updated successfully" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const createAvailability = createOne(Availability);

// @desc    Get availabilities
// @route   GET /api/v1/availabilities
// @access  Private
const getAvailabilities = getMany(Availability, {
  path: "consultantId",
  model: "Consultant",});

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
  getSpecificAvailability,
  deleteSchedule,
  addDayOrTimes,
  getAvailabilities,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
  deleteManyAvailabilities,
};
