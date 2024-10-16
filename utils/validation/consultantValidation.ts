import { body, param } from "express-validator";
import validatorMiddleware from "../../src/middlewares/validationMiddleware";
import { Types } from "mongoose";

const createConsultantValidation = [
  body("userId")
    .exists()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("expertise") 
    .exists()
    .notEmpty()
    .withMessage("Expertise is required")
    .isString()
    .withMessage("Invalid expertise"),
  body("ICE")
    .exists()
    .notEmpty()
    .withMessage("ICE is required")
    .isString()
    .withMessage("Invalid ICE"),
  body("professionalId")
    .exists()
    .notEmpty()
    .withMessage("Professional ID is required")
    .isString()
    .withMessage("Invalid professional ID"),
  body("taxId")
    .exists()
    .notEmpty()
    .withMessage("Tax ID is required")
    .isString()
    .withMessage("Invalid tax ID"),
  body("CIN")
    .exists()
    .notEmpty()
    .withMessage("CIN is required")
    .isString()
    .withMessage("Invalid CIN"),
  body("businessName")
    .exists()
    .notEmpty()
    .withMessage("Business name is required")
    .isString()
    .withMessage("Invalid business name"),
  body("address.city")
    .exists()
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("Invalid city"),
  body("address.street")
    .exists()
    .notEmpty()
    .withMessage("Street is required")
    .isString()
    .withMessage("Invalid street"),
  body("address.zipCode")
    .exists()
    .notEmpty()
    .withMessage("Zip code is required")
    .isString()
    .withMessage("Invalid zip code"),
  body("phoneNumber")
    .exists()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("ar-MA")
    .withMessage("Invalid phone number"),
  body("priceHour")
    .optional()
    .isNumeric()
    .withMessage("Price per hour must be a number"),
  validatorMiddleware,
];

const updateConsultantValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .withMessage("Invalid consultant ID"),
  body("expertise").optional().isString().withMessage("Invalid expertise"),
  body("ICE").optional().isString().withMessage("Invalid ICE"),
  body("professionalId")
    .optional()
    .isString()
    .withMessage("Invalid professional ID"),
  body("taxId").optional().isString().withMessage("Invalid tax ID"),
  body("CIN").optional().isString().withMessage("Invalid CIN"),
  body("businessName")
    .optional()
    .isString()
    .withMessage("Invalid business name"),
  body("address.city").optional().isString().withMessage("Invalid city"),
  body("address.street").optional().isString().withMessage("Invalid street"),
  body("address.zipCode").optional().isString().withMessage("Invalid zip code"),
  body("phoneNumber")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("Invalid phone number"),
  body("priceHour")
    .optional()
    .isNumeric()
    .withMessage("Price per hour must be a number"),
  validatorMiddleware,
];

const getConsultantByIdValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .withMessage("Invalid consultant ID"),
  validatorMiddleware,
];

const deleteConsultantValidation = [
  param("id")
    .exists()
    .notEmpty()
    .withMessage("Consultant ID is required")
    .isMongoId()
    .withMessage("Invalid consultant ID"),
  validatorMiddleware,
];

const deleteConsultantsValidation = [
  body("ids")
    .exists()
    .notEmpty()
    .withMessage("Consultant IDs are required")
    .isArray()
    .withMessage("Consultant IDs must be an array")
    .custom((value, { req }) => {
      if (!Array.isArray(value)) {
        throw new Error("Consultant IDs must be an array");
      }
      for (const id of value) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error("Invalid consultant ID");
        }
      }
      return true;
    }),
];
export {
  createConsultantValidation,
  updateConsultantValidation,
  getConsultantByIdValidation,
  deleteConsultantValidation,
  deleteConsultantsValidation,
};
