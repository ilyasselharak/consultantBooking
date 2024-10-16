import { body, param } from "express-validator";
import validatorMiddleware from "../../src/middlewares/validationMiddleware";

const createBookingValidation = [
  param("consultantId")
    .exists()
    .notEmpty()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .withMessage("Invalid consultant ID"),
  body("date")
    .exists()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date"),
  body("times")
    .exists()
    .notEmpty()
    .withMessage("Times is required")
    .isArray()
    .withMessage("Times must be an array"),
  body("times.*.startTime")
    .exists()
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Invalid start time"),
  body("times.*.endTime")
    .exists()
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("Invalid end time"),
  validatorMiddleware,
];



const updateBookingValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Invalid booking ID"),
  body("date")
    .exists()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date"),
  body("times")
    .exists()
    .notEmpty()
    .withMessage("Times is required")
    .isArray()
    .withMessage("Times must be an array"),
    body("times.*.startTime")
    .exists()
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Invalid start time"),
  body("times.*.endTime")
    .exists()
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("Invalid end time"),
  validatorMiddleware,
];

const getBookingByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Invalid booking ID"),
  validatorMiddleware,
];

const deleteBookingByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Invalid booking ID"),
  validatorMiddleware,
];

const deleteBookingsValidation = [
  body("ids")
    .exists()
    .notEmpty()
    .withMessage("Booking IDs are required")
    .isArray()
    .withMessage("Booking IDs must be an array"),
  validatorMiddleware,
];


export {
  createBookingValidation,
  updateBookingValidation,
  getBookingByIdValidation,
  deleteBookingByIdValidation,
  deleteBookingsValidation,
}