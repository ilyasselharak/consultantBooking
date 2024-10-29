import { body, param } from 'express-validator';
import validatorMiddleware from './../../src/middlewares/validationMiddleware';
import { Types } from 'mongoose';
import Availability from '../../src/models/AvailabilityModel';
import { validateExists } from './commonValidation';
import AvailabilityDays from '../../src/models/AvailabilityDaysModel';

const createAvailabilityDaysValidation = [
  body('availabilityId')
    .exists()
    .notEmpty()
    .withMessage('Availability ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Availability, value)))
    .withMessage('Invalid availability ID'),
  body('date')
    .exists()
    .notEmpty()
    .withMessage('Date is required')
    .isDate()
    .withMessage('Invalid date format'),
  validatorMiddleware,
];

const updateAvailabilityDaysValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Availability day ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Availability, value)))
    .withMessage('Invalid availability day ID'),
  body('date')
    .exists()
    .notEmpty()
    .withMessage('Date is required')
    .isDate()
    .withMessage('Invalid date format'),
  validatorMiddleware,
];

const getAvailabilityDayByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Availability day ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(AvailabilityDays, value)))
    .withMessage('Invalid availability day ID'),
  validatorMiddleware,
];

const deleteAvailabilityDaysValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Availability day ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(AvailabilityDays, value)))
    .withMessage('Invalid availability day ID'),
  validatorMiddleware,
];

export {
  createAvailabilityDaysValidation,
  updateAvailabilityDaysValidation,
  getAvailabilityDayByIdValidation,
  deleteAvailabilityDaysValidation,
};
