import { body, param } from "express-validator";
import validatorMiddleware from "../../src/middlewares/validationMiddleware";

 const createAvailabilityTimeValidation = [
    body("availabilityDaysId")
        .exists()
        .notEmpty()
        .withMessage("Availability days ID is required")
        .isMongoId()
        .withMessage("Invalid availability days ID"),
    body("startTime")
        .exists()
        .notEmpty()
        .withMessage("Start time is required")
        .isString()
        .withMessage("Invalid start time format"),
    body("endTime")
        .exists()
        .notEmpty()
        .withMessage("End time is required")
        .isString()
        .withMessage("Invalid end time format"),
    validatorMiddleware,
];



const updateAvailabilityTimeValidation = [
    param("id")
        .exists()
        .notEmpty()
        .withMessage("Availability time ID is required")
        .isMongoId()
        .withMessage("Invalid availability time ID"),
    body("availabilityDaysId")
        .exists()
        .notEmpty()
        .withMessage("Availability days ID is required")
        .isMongoId()
        .withMessage("Invalid availability days ID"),
    body("startTime")
        .exists()
        .notEmpty()
        .withMessage("Start time is required")
        .isString()
        .withMessage("Invalid start time format"),
    body("endTime")
        .exists()
        .notEmpty()
        .withMessage("End time is required")
        .isString()
        .withMessage("Invalid end time format"),
    validatorMiddleware
]



const getAvailabilityTimeByIdValidation = [
    param("id")
        .exists()
        .notEmpty()
        .withMessage("Availability time ID is required")
        .isMongoId()
        .withMessage("Invalid availability time ID"),
    validatorMiddleware
]


const deleteAvailabilityTimeByIdValidation = [
    param("id")
        .exists()
        .notEmpty()
        .withMessage("Availability time ID is required")
        .isMongoId()
        .withMessage("Invalid availability time ID"),
    validatorMiddleware
]


export {
    createAvailabilityTimeValidation,
    updateAvailabilityTimeValidation,
    getAvailabilityTimeByIdValidation,
    deleteAvailabilityTimeByIdValidation
}