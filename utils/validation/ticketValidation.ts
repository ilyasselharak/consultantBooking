import { body, param } from 'express-validator';
import validatorMiddleware from '../../src/middlewares/validationMiddleware';
import { Types } from 'mongoose';
import { validateExists } from './commonValidation';
import User from '../../src/models/UserModel';
import Ticket from '../../src/models/TicketModel';

const createTicketValidation = [
  body('userId')
    .exists()
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(User, value)))
    .withMessage('Invalid user ID'),
  body('relationId').exists().notEmpty().withMessage('Relation ID is required'),
  body('relationType')
    .exists()
    .notEmpty()
    .withMessage('Relation type is required')
    .isIn([
      'Consultant',
      'User',
      'Transaction',
      'Wallet',
      'DailyBooking',
      'Availability',
      'Appointment',
    ])
    .not()
    .withMessage('Invalid relation type'),
  body('priority')
    .exists()
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High'])
    .not()
    .withMessage('Invalid priority'),
  validatorMiddleware,
];

const updateTicketValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Ticket ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Ticket, value)))
    .withMessage('Invalid ticket ID'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['Pending', 'Accepted', 'Rejected', 'Completed'])
    .not()
    .withMessage('Invalid status'),
  validatorMiddleware,
];

const getTicketByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Ticket ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Ticket, value)))
    .withMessage('Invalid ticket ID'),
  validatorMiddleware,
];

const deleteTicketByIdValidation = [
  param('id')
    .exists()
    .notEmpty()
    .withMessage('Ticket ID is required')
    .isMongoId()
    .custom(async value => !!(await validateExists(Ticket, value)))
    .withMessage('Invalid ticket ID'),
  validatorMiddleware,
];

const deleteTicketsValidation = [
  body('ids')
    .exists()
    .notEmpty()
    .withMessage('Ticket IDs are required')
    .isArray()
    .withMessage('Ticket IDs must be an array')
    .custom(value => value.every((id: string) => Types.ObjectId.isValid(id)))
    .custom(value => value.every(async (id: string) => !!(await validateExists(Ticket, id))))
    .withMessage('One or more Ticket IDs not valid'),
  validatorMiddleware,
];

export {
  createTicketValidation,
  updateTicketValidation,
  getTicketByIdValidation,
  deleteTicketByIdValidation,
  deleteTicketsValidation,
};
