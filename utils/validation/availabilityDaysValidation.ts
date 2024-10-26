import { body, param } from "express-validator";
import validatorMiddleware from "./../../src/middlewares/validationMiddleware";
import { Types } from "mongoose";


const createAvailabilityDaysValidation = [
  body("availabilityId")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .withMessage("Invalid availability ID"),
  body("date")
    .exists()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("availabilityTimes")
    .optional()
    .isArray()
    .withMessage("Availability times must be an array")
    .custom((value) =>
      value.every((id: string) => Types.ObjectId.isValid(id))
        ? true
        : "Invalid availability time ID"
    )
    .withMessage("Invalid availability time ID"),
  validatorMiddleware,
];

const updateAvailabilityDaysValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability day ID is required")
    .isMongoId()
    .withMessage("Invalid availability day ID"),
  body("date")
    .exists()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("availabilityTimes")
    .optional()
    .isArray()
    .withMessage("Availability times must be an array")
    .custom((value) =>
      value.every((id: string) => Types.ObjectId.isValid(id))
        ? true
        : "Invalid availability time ID"
    )
    .withMessage("Invalid availability time ID"),
  validatorMiddleware,
];
const getAvailabilityDayByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability day ID is required")
    .isMongoId()
    .withMessage("Invalid availability day ID"),
  validatorMiddleware,
];

const deleteAvailabilityDaysValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability day ID is required")
    .isMongoId()
    .withMessage("Invalid availability day ID"),
  validatorMiddleware,
];

export {
  createAvailabilityDaysValidation,
  updateAvailabilityDaysValidation,
  getAvailabilityDayByIdValidation,
  deleteAvailabilityDaysValidation,
};
