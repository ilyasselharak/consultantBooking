import Booking from "../models/BookingModel";
import {
  createOne,
  deleteMany,
  deleteOne,
  getById,
  getMany,
  update,
} from "./handlersFactory";

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
const createBooking = createOne(Booking);

// @desc    Get bookings
// @route   GET /api/v1/bookings
// @access  Private
const getBookings = getMany(Booking, {});

// @desc    Get booking
// @route   GET /api/v1/bookings/:id
// @access  Private
const getBookingById = getById(Booking);

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
const updateBooking = update(Booking);

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
const deleteBooking = deleteOne(Booking);

// @desc    Delete many bookings
// @route   DELETE /api/v1/bookings
// @access  Private
const deleteManyBookings = deleteMany(Booking);

export {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  deleteManyBookings,
};
