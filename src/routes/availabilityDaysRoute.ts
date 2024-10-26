import express, { Router, Request } from "express";
import {
  createAvailabilityDays,
  deleteAvailabilityDays,
  deleteManyAvailabilitiesDays,
  getAvailabilitiesDays,
  getAvailabilityDaysById,
  updateAvailabilityDays,
} from "../controllers/availabilityDaysController";
import {
  createAvailabilityDaysValidation,
  updateAvailabilityDaysValidation,
  getAvailabilityDayByIdValidation,
  deleteAvailabilityDaysValidation,
} from "../../utils/validation/availabilityDaysValidation";
const router = express.Router();

router
  .route("/")
  .post(createAvailabilityDaysValidation, createAvailabilityDays)
  .get(getAvailabilitiesDays)
  .delete(deleteManyAvailabilitiesDays);
router
  .route("/:id")
  .get(getAvailabilityDayByIdValidation, getAvailabilitiesDays)
  .put(updateAvailabilityDaysValidation, updateAvailabilityDays)
  .delete(deleteAvailabilityDaysValidation, deleteAvailabilityDays);

export default router;
