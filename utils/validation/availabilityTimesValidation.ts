import { body, param } from 'express-validator';

import validatorMiddleware from '../../src/middlewares/validationMiddleware';
import { compareTime } from '../timeHelper';
import AvailabilityDays from '../../src/models/AvailabilityDaysModel';
import AvailabilityTimes from '../../src/models/AvailabilityTimesModel';
import { validateExists, timeRegex } from './commonValidation';

const createAvailabilityTimeValidation = [
  body('availabilityDayId')
    .exists()
    .notEmpty()
    .withMessage('Availability days ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(AvailabilityDays, value)))
    .withMessage('Invalid availability days ID'),
  body('startTime')
    .exists()
    .notEmpty()
    .withMessage('Start time is required')
    .matches(timeRegex)
    .withMessage('Invalid start time format'),
  body('endTime')
    .exists()
    .notEmpty()
    .withMessage('End time is required')
    .matches(timeRegex)
    .withMessage('Invalid end time format'),
  body().custom(async value => {
    const { startTime, endTime, availabilityDaysId } = value;
    if (!compareTime(startTime, endTime)) throw new Error('Invalid start and end time combination');
    const overlapped = await AvailabilityTimes.exists({
      availabilityDaysId,
      $or: [
        { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }] },
        // case of existing timeSlots
        { startTime, endTime },
      ],
    });
    console.log(' Overlapping ', overlapped);
    if (overlapped) throw new Error('Overlapped availability time');
    return true;
  }),
  validatorMiddleware,
];

const updateAvailabilityTimeValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Availability time ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(AvailabilityTimes, value)))
    .withMessage('Invalid availability time ID'),
  body('availabilityDaysId')
    .exists()
    .notEmpty()
    .withMessage('Availabilitys days ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(AvailabilityDays, value)))
    .withMessage('Invalid availability days ID'),
  body('startTime')
    .exists()
    .notEmpty()
    .withMessage('Start time is required')
    .matches(timeRegex)
    .withMessage('Invalid start time format'),
  body('endTime')
    .exists()
    .notEmpty()
    .withMessage('End time is required')
    .matches(timeRegex)
    .withMessage('Invalid end time format'),
  body()
    .custom(async (value, { req }) => {
      const { startTime, endTime, availabilityDaysId } = value;
      const overlapped = await AvailabilityTimes.exists({
        _id: { $ne: req.params?.id },
        availabilityDaysId,
        $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }],
      });
      return !overlapped && compareTime(startTime, endTime);
    })
    .withMessage('Invalid start and end time combination'),
  validatorMiddleware,
];

const getAvailabilityTimeByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Availability time ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(AvailabilityTimes, value)))
    .withMessage('Invalid availability time ID'),
  validatorMiddleware,
];

const deleteAvailabilityTimeByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Availability time ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(AvailabilityTimes, value)))
    .withMessage('Invalid availability time ID'),
  validatorMiddleware,
];

export {
  createAvailabilityTimeValidation,
  updateAvailabilityTimeValidation,
  getAvailabilityTimeByIdValidation,
  deleteAvailabilityTimeByIdValidation,
};
