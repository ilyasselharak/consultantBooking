import { body, param } from 'express-validator';
import validatorMiddleware from '../../src/middlewares/validationMiddleware';
import Consultant from '../../src/models/ConsultantModel';
import { isDateInFuture, isTimeInFuture, timeRegex, validateExists } from './commonValidation';
import User from '../../src/models/UserModel';
import { compareTime } from '../timeHelper';
import Booking from '../../src/models/BookingModel';
import { Types } from 'mongoose';

const createBookingValidation = [
  body('userId')
    .exists()
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(User, value)))
    .withMessage('Invalid user ID'),
  body('consultantId')
    .exists()
    .notEmpty()
    .withMessage('Consultant ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Consultant, value)))
    .withMessage('Invalid consultant ID'),
  body('date')
    .exists()
    .notEmpty()
    .withMessage('Date is required')
    .isDate()
    .withMessage('Invalid date')
    .custom(isDateInFuture)
    .withMessage('Date is in the past'),

  body('startTime')
    .exists()
    .notEmpty()
    .withMessage('Start time is required')
    .matches(timeRegex)
    .withMessage('Invalid start time format')
    .custom(isTimeInFuture)
    .withMessage('Start time is in the past'),

  body('endTime')
    .exists()
    .notEmpty()
    .withMessage('End time is required')
    .matches(timeRegex)
    .withMessage('Invalid end time format')
    .custom(isTimeInFuture)
    .withMessage('Start time is in the past'),

  body()
    .custom(async value => {
      const { _id, consultantId, userId, startTime, endTime } = value;
      const overlapped = await Booking.exists({
        consultantId,
        $or: [
          { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }] },
          // case of existing timeSlots
          { startTime, endTime },
        ],
      });
      return !overlapped && compareTime(startTime, endTime);
    })
    .withMessage('Time already booked'),

  // TODO : check if the consultant available on the fixed time

  validatorMiddleware,
];

const updateBookingValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Booking, value)))
    .withMessage('Invalid booking ID'),
  body('date')
    .exists()
    .notEmpty()
    .withMessage('Date is required')
    .isDate()
    .withMessage('Invalid date')
    .custom(isDateInFuture)
    .withMessage('Date is in the past'),

  body('startTime')
    .exists()
    .notEmpty()
    .withMessage('Start time is required')
    .matches(timeRegex)
    .withMessage('Invalid start time format')
    .custom(isTimeInFuture)
    .withMessage('Start time is in the past'),

  body('endTime')
    .exists()
    .notEmpty()
    .withMessage('End time is required')
    .matches(timeRegex)
    .withMessage('Invalid end time format')
    .custom(isTimeInFuture)
    .withMessage('Start time is in the past'),

  body()
    .custom(async value => {
      const { _id, consultantId, userId, startTime, endTime } = value;
      const overlapped = await Booking.exists({
        _id: { $ne: _id },
        consultantId,
        $or: [
          { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }] },
          // case of existing timeSlots
          { startTime, endTime },
        ],
      });
      return !overlapped && compareTime(startTime, endTime);
    })
    .withMessage('Time already booked'),

  // TODO : check if the consultant available on the fixed time

  validatorMiddleware,
];

const getBookingByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Booking, value)))
    .withMessage('Invalid booking ID'),
  validatorMiddleware,
];

const deleteBookingByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Booking, value)))
    .withMessage('Invalid booking ID'),
  validatorMiddleware,
];

const deleteBookingsValidation = [
  body('ids')
    .exists()
    .notEmpty()
    .withMessage('Booking IDs are required')
    .isArray()
    .withMessage('Booking IDs must be an array')
    .custom(value => value.every((id: string) => Types.ObjectId.isValid(id)))
    .custom(value => value.every(async (id: string) => !!(await validateExists(Booking, id))))
    .withMessage('Booking IDs should all exists'),
  validatorMiddleware,
];

export {
  createBookingValidation,
  updateBookingValidation,
  getBookingByIdValidation,
  deleteBookingByIdValidation,
  deleteBookingsValidation,
};
