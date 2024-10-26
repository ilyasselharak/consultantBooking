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
  body("availabilityDays")
    .exists()
    .notEmpty()
    .withMessage("Availability days are required")
    .isArray()
    .withMessage("Availability days must be an array")
    .custom((value, { req }) => {
      for (const id of value) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error("Invalid availability day ID");
        }
      }
      return true;
    }),
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



const updateAvailabilityValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .withMessage("Invalid availability ID"),
  body("availabilityDays")
    .exists()
    .notEmpty()
    .withMessage("Availability days are required")
    .isArray()
    .withMessage("Availability days must be an array")
    .custom((value, { req }) => {
      for (const id of value) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error("Invalid availability day ID");
        }
      }
      return true;
    }),
  validatorMiddleware
]
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
  getAvailabilityByIdValidation,
  updateAvailabilityValidation,
  deleteAvailabilityByIdValidation,
  deleteAvailabilitiesValidation,
};
