import express from "express";
import {
  createBooking,
  deleteBooking,
  deleteManyBookings,
  getBookingById,
  getBookings,
  updateBooking,
} from "../controllers/bookingsController";

const router = express.Router();

router
  .route("/")
  .post(createBooking)
  .get(getBookings)
  .delete(deleteManyBookings);
router
  .route("/:id")
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;
