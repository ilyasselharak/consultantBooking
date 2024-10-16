import { body, param } from "express-validator";
import validatorMiddleware from "../../src/middlewares/validationMiddleware";
import { Types } from "mongoose";

const createTicketValidation = [
  body("userId")
    .exists()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("relationId").exists().notEmpty().withMessage("Relation ID is required"),
  body("relationType")
    .exists()
    .notEmpty()
    .withMessage("Relation type is required")
    .isIn([
      "Consultant",
      "User",
      "Transaction",
      "Wallet",
      "DailyBooking",
      "Availability",
      "Appointment",
    ])
    .withMessage("Invalid relation type"),
  body("priority")
    .exists()
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority"),
  validatorMiddleware,
];

const updateTicketValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Ticket ID is required")
    .isMongoId()
    .withMessage("Invalid ticket ID"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority"),
  body("status")
    .optional()
    .isIn(["Pending", "Accepted", "Rejected", "Completed"])
    .withMessage("Invalid status"),
  validatorMiddleware,
];

const getTicketByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Ticket ID is required")
    .isMongoId()
    .withMessage("Invalid ticket ID"),
  validatorMiddleware,
];

const deleteTicketByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Ticket ID is required")
    .isMongoId()
    .withMessage("Invalid ticket ID"),
  validatorMiddleware,
];

const deleteTicketsValidation = [
  body("ids")
    .exists()
    .notEmpty()
    .withMessage("Ticket IDs are required")
    .isArray()
    .withMessage("Ticket IDs must be an array")
    .custom((value, { req }) => {
      if (!Array.isArray(value)) {
        throw new Error("Ticket IDs must be an array");
      }
      for (const id of value) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error("Invalid ticket ID");
        }
      }
      return true;
    }),
  validatorMiddleware,
];

export {
  createTicketValidation,
  updateTicketValidation,
  getTicketByIdValidation,
  deleteTicketByIdValidation,
  deleteTicketsValidation,
};
