import { body, param } from "express-validator";
import validatorMiddleware from "../../src/middlewares/validationMiddleware";
import { Types } from "mongoose";



const createTransactionValidation = [
    body("userId")
        .exists()
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user ID"),
    body("amount")
        .exists()
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Invalid amount"),
    body("type")
        .exists()
        .notEmpty()
        .withMessage("Type is required")
        .isIn(["credit", "debit"])
        .withMessage("Invalid type"),
    validatorMiddleware
]


const updateTransactionValidation = [
    param("id")
        .exists()
        .notEmpty()
        .withMessage("Transaction ID is required")
        .isMongoId()
        .withMessage("Invalid transaction ID"),
    body("amount")
        .optional()
        .isNumeric()
        .withMessage("Invalid amount"),
    body("type")
        .optional()
        .isIn(["credit", "debit"])
        .withMessage("Invalid type"),
    validatorMiddleware
]



const getTransactionByIdValidation = [
    param("id")
        .exists()
        .notEmpty()
        .withMessage("Transaction ID is required")
        .isMongoId()
        .withMessage("Invalid transaction ID"),
    validatorMiddleware
]


const deleteTransactionByIdValidation = [
    param("id")
        .exists()
        .notEmpty()
        .withMessage("Transaction ID is required")
        .isMongoId()
        .withMessage("Invalid transaction ID"),
    validatorMiddleware
]


const deleteTransactionsValidation = [
    body("ids")
        .exists()
        .notEmpty()
        .withMessage("Transaction IDs are required")
        .isArray()
        .withMessage("Transaction IDs must be an array")
        .custom((value, { req }) => {
            if (!Array.isArray(value)) {
                throw new Error("Transaction IDs must be an array");
            }
            for (const id of value) {
                if (!Types.ObjectId.isValid(id)) {
                    throw new Error("Invalid transaction ID");
                }
            }
            return true;
        }),
    validatorMiddleware
]



export {
    createTransactionValidation,
    updateTransactionValidation,
    getTransactionByIdValidation,
    deleteTransactionByIdValidation,
    deleteTransactionsValidation
}