import { body, param } from 'express-validator';
import validatorMiddleware from '../../src/middlewares/validationMiddleware';
import { Types } from 'mongoose';
import { validateExists } from './commonValidation';
import Consultant from '../../src/models/ConsultantModel';

const createWalletValidation = [
  body('consultantId')
    .exists()
    .notEmpty()
    .withMessage('Consultant ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Consultant, value)))
    .withMessage('Invalid consultant ID'),
  body('balance')
    .optional()
    .default(0)
    .customSanitizer(() => 0),
  validatorMiddleware,
];

const updateWalletValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Wallet ID is required')
    .isMongoId()
    .withMessage('Invalid wallet ID'),
  body('balance').optional().isNumeric().withMessage('Balance must be a number'),
  validatorMiddleware,
];

const getWalletByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Wallet ID is required')
    .isMongoId()
    .withMessage('Invalid wallet ID'),
  validatorMiddleware,
];

const deleteWalletByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Wallet ID is required')
    .isMongoId()
    .withMessage('Invalid wallet ID'),
  validatorMiddleware,
];

const deleteWalletsValidation = [
  body('ids')
    .exists()
    .notEmpty()
    .withMessage('Wallet IDs are required')
    .isArray()
    .withMessage('Wallet IDs must be an array')
    .custom((value, { req }) => {
      if (!Array.isArray(value)) {
        throw new Error('Wallet IDs must be an array');
      }
      for (const id of value) {
        if (!Types.ObjectId.isValid(id)) {
          throw new Error('Invalid wallet ID');
        }
      }
      return true;
    }),
  validatorMiddleware,
];

export {
  createWalletValidation,
  updateWalletValidation,
  getWalletByIdValidation,
  deleteWalletByIdValidation,
  deleteWalletsValidation,
};
