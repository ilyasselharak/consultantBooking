import { body, param } from "express-validator";
import validatorMiddleware from "../../src/middlewares/validationMiddleware";
import Consultant from "../../src/models/ConsultantModel";
import {
  isDateInFuture,
  isTimeInFuture,
  timeRegex,
  validateExists,
} from "./commonValidation";
import User from "../../src/models/UserModel";
import { compareTime } from "../timeHelper";
import Booking from "../../src/models/BookingModel";
import { Types } from "mongoose";
import moment from "moment";
import Availability from "./../../src/models/AvailabilityModel";

const createBookingValidation = [
  body("customerId")
    .exists()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(User, value)))
    .withMessage("Invalid user ID"),
  body("consultantId")
    .exists()
    .notEmpty()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Consultant, value)))
    .withMessage("Invalid consultant ID"),
  body("date")
    .exists()
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Invalid date")
    .custom(isDateInFuture)
    .withMessage("Date is in the past"),

  body("startTime")
    .exists()
    .notEmpty()
    .withMessage("Start time is required")
    .matches(timeRegex)
    .withMessage("Invalid start time format")
    .custom(isTimeInFuture)
    .withMessage("Start time is in the past"),

  body("endTime")
    .exists()
    .notEmpty()
    .withMessage("End time is required")
    .matches(timeRegex)
    .withMessage("Invalid end time format")
    .custom(isTimeInFuture)
    .withMessage("Start time is in the past"),
  body("price").custom(async (value, { req }) => {
    const { consultantId, customerId, startTime, endTime, date } = req.body;

    // Fetch the consultant's rate per hour
    const consultant = await Consultant.findById(consultantId);
    if (!consultant) {
      throw new Error("Consultant not found");
    }

    // Check if the user is trying to book their own appointment
    if (consultant.userId.toString() === customerId) {
      throw new Error("Cannot book your own appointment");
    }

    // Calculate expected price
    const durationInHours =
      moment(endTime, "HH:mm").diff(moment(startTime, "HH:mm")) /
      (1000 * 60 * consultant.timeUnit);
    const expectedAmount = durationInHours * consultant.price;

    // Check if the expected amount matches the provided price
    if (expectedAmount !== value) {
      throw new Error(`Expected price is ${expectedAmount}, but got ${value}`);
    }

    // Check if the time slot overlaps with any existing booking
    const overlapped = await Booking.exists({
      consultantId,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
          ],
        },
        { startTime, endTime },
      ],
    });

    if (overlapped) {
      throw new Error("Time slot is already booked");
    }

    // Fetch the consultant's availability
    const availability = await Availability.findOne({
      consultantId: consultantId,
      schedule: {
        $elemMatch: {
          day: moment(date).format("YYYY-MM-DD"),
          times: {
            $elemMatch: {
              startTime: { $lte: startTime },
              endTime: { $gte: endTime },
            },
          },
        },
      },
    });

    console.log("availability", availability);
    if (!availability) {
      throw new Error("Availability not found");
    }
    // Check if the consultant is available on the specified date

    return true;
  }),

  // TODO : check if the consultant available on the fixed time

  validatorMiddleware,
];

const updateBookingValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Booking, value)))
    .withMessage("Invalid booking ID"),
  body("date")
    .exists()
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Invalid date")
    .custom(isDateInFuture)
    .withMessage("Date is in the past"),

  body("startTime")
    .exists()
    .notEmpty()
    .withMessage("Start time is required")
    .matches(timeRegex)
    .withMessage("Invalid start time format")
    .custom(isTimeInFuture)
    .withMessage("Start time is in the past"),

  body("endTime")
    .exists()
    .notEmpty()
    .withMessage("End time is required")
    .matches(timeRegex)
    .withMessage("Invalid end time format")
    .custom(isTimeInFuture)
    .withMessage("Start time is in the past")
    .custom(async (value) => {
      const { _id, consultantId, userId, startTime, endTime } = value;
      const overlapped = await Booking.exists({
        _id: { $ne: _id },
        consultantId,
        $or: [
          {
            $and: [
              { startTime: { $lt: endTime } },
              { endTime: { $gt: startTime } },
            ],
          },
          // case of existing timeSlots
          { startTime, endTime },
        ],
      });
      return !overlapped && compareTime(startTime, endTime);
    })
    .withMessage("Time already booked"),
  body,

  // TODO : check if the consultant available on the fixed time

  validatorMiddleware,
];

const getBookingByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Booking, value)))
    .withMessage("Invalid booking ID"),
  validatorMiddleware,
];

const deleteBookingByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Booking, value)))
    .withMessage("Invalid booking ID"),
  validatorMiddleware,
];

const deleteBookingsValidation = [
  body("ids")
    .exists()
    .notEmpty()
    .withMessage("Booking IDs are required")
    .isArray()
    .withMessage("Booking IDs must be an array")
    .custom((value) => value.every((id: string) => Types.ObjectId.isValid(id)))
    .custom((value) =>
      value.every(async (id: string) => !!(await validateExists(Booking, id)))
    )
    .withMessage("Booking IDs should all exists"),
  validatorMiddleware,
];

export {
  createBookingValidation,
  updateBookingValidation,
  getBookingByIdValidation,
  deleteBookingByIdValidation,
  deleteBookingsValidation,
};
