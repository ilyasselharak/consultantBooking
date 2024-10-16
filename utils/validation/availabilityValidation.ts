import { body, param } from "express-validator";
import validatorMiddleware from "./../../src/middlewares/validationMiddleware";
import { Types } from "mongoose";

const createAvailabilityValidation = [
  body("consultantId")
    .exists()
    .notEmpty()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .withMessage("Invalid consultant ID"),
  body("availabilityTimes")
    .exists()
    .notEmpty()
    .withMessage("Availability times is required")
    .isArray()
    .withMessage("Availability times must be an array"),
  body("availabilityTimes.*.date")
    .exists()
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Invalid date"),
  body("availabilityTimes.*.times")
    .exists()
    .notEmpty()
    .withMessage("Times is required")
    .isArray()
    .withMessage("Times must be an array"),
  body("availabilityTimes.*.times.*.startTime")
    .exists()
    .notEmpty()
    .withMessage("Start time is required")
    .isDate()
    .withMessage("Invalid start time"),
  body("availabilityTimes.*.times.*.endTime")
    .exists()
    .notEmpty()
    .withMessage("End time is required")
    .isDate()
    .withMessage("Invalid end time"),
  validatorMiddleware,
];

const updateAvailabilityValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .withMessage("Invalid availability ID"),
  body("availabilityTimes")
    .exists()
    .notEmpty()
    .withMessage("Availability times is required")
    .isArray()
    .withMessage("Availability times must be an array"),
  body("availabilityTimes.*.date").isDate().withMessage("Invalid date"),
  body("availabilityTimes.*.times")
    .isArray()
    .withMessage("Times must be an array"),
  body("availabilityTimes.*.times.*.startTime")
    .isDate()
    .withMessage("Invalid start time"),
  body("availabilityTimes.*.times.*.endTime")
    .isDate()
    .withMessage("Invalid end time"),
  validatorMiddleware,
];

const getAvailabilityByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .withMessage("Invalid availability ID"),
  validatorMiddleware,
];

const deleteAvailabilityByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .withMessage("Invalid availability ID"),
  validatorMiddleware,
];

const deleteAvailabilitiesValidation = [
  body("ids")
    .exists()
    .notEmpty()
    .withMessage("Availability IDs are required")
    .isArray()
    .withMessage("Availability IDs must be an array")
    .custom((value, { req }) => {
      if (!Array.isArray(value)) {
        throw new Error("Availability IDs must be an array");
      }
      for (const id of value) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error("Invalid availability ID");
        }
      }
      return true;
    }),
  validatorMiddleware,
];

export {
  createAvailabilityValidation,
  updateAvailabilityValidation,
  getAvailabilityByIdValidation,
  deleteAvailabilityByIdValidation,
  deleteAvailabilitiesValidation,
};
