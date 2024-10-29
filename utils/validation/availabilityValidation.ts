import { body, param } from "express-validator";
import validatorMiddleware from "./../../src/middlewares/validationMiddleware";
import { Types } from "mongoose";
import { validateExists } from "./commonValidation";
import Consultant from "../../src/models/ConsultantModel";
import Availability from "../../src/models/AvailabilityModel";

const createAvailabilityValidation = [
  body("consultantId")
    .exists()
    .notEmpty()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .custom(async (value) => await validateExists(Consultant, value))
    .withMessage("Invalid consultant ID"),
  validatorMiddleware,
];

const getAvailabilityByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Availability, value)))
    .withMessage("Invalid availability ID"),
  validatorMiddleware,
];

const updateAvailabilityValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Availability, value)))
    .withMessage("Invalid availability ID"),
  validatorMiddleware,
];

const deleteAvailabilityByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Availability ID is required")
    .isMongoId()
    .custom(async (value) => !!(await validateExists(Availability, value)))
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
    .custom(
      (value) => !!value.every((id: string) => Types.ObjectId.isValid(id))
    )
    .withMessage("Invalid availabilities IDs"),
  validatorMiddleware,
];

export {
  createAvailabilityValidation,
  getAvailabilityByIdValidation,
  updateAvailabilityValidation,
  deleteAvailabilityByIdValidation,
  deleteAvailabilitiesValidation,
};
