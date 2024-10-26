import Ticket from "../models/TicketModel";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";


// @desc    Create ticket
// @route   POST /api/v1/tickets
// @access  Public
const createTicket = createOne(Ticket);

// @desc    Get tickets
// @route   GET /api/v1/tickets
// @access  Private
const getTickets = getMany(Ticket, {});

// @desc    Get ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
const getTicketById = getById(Ticket);

// @desc    Update ticket
// @route   PUT /api/v1/tickets/:id
// @access  Private
const updateTicket = update(Ticket);

// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private
const deleteTicket = deleteOne(Ticket);

// @desc    Delete tickets
// @route   DELETE /api/v1/tickets
// @access  Private
const deleteManyTickets = deleteMany(Ticket);

export {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  deleteManyTickets,
};
