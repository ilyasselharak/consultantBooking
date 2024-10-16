import express from "express";
import {
  createBooking,
  deleteBooking,
  deleteManyBookings,
  getBookingById,
  getBookings,
  updateBooking,
} from "../controllers/bookingsController";
import {
  createBookingValidation,
  updateBookingValidation,
  getBookingByIdValidation,
  deleteBookingByIdValidation,
  deleteBookingsValidation,
} from "../../utils/validation/bookingValidation";

const router = express.Router();

router
  .route("/")
  .post(createBookingValidation, createBooking)
  .get(getBookings)
  .delete(deleteBookingsValidation, deleteManyBookings);
router
  .route("/:id")
  .get(getBookingByIdValidation, getBookingById)
  .put(updateBookingValidation,updateBooking)
  .delete(deleteBookingByIdValidation,deleteBooking);

export default router;
