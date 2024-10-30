import express, { Router, Request } from "express";

import {
  createAvailabilityValidation,
  getAvailabilityByIdValidation,
  updateAvailabilityValidation,
  deleteAvailabilityByIdValidation,
  deleteAvailabilitiesValidation,
  addDayOrTimesValidation,
  deleteScheduleValidation,
} from "../../utils/validation/availabilityValidation";
import {
  createAvailability,
  updateAvailability,
  deleteAvailability,
  deleteManyAvailabilities,
  getAvailabilities,
  getAvailabilityById,
  getSpecificAvailability,
  addDayOrTimes,
  deleteSchedule,
} from "../controllers/availabilityController";

const router = express.Router();

// get the availability of a specific consultant
// Add days or times of the availability of a specific consultant
router
  .route("/consultant/:consultantId")
  .get(getSpecificAvailability)
  .post(addDayOrTimesValidation, addDayOrTimes)
  .delete(deleteScheduleValidation, deleteSchedule)

router
  .route("/")
  .post(createAvailabilityValidation, createAvailability)
  .get(getAvailabilities)
  .delete(deleteAvailabilitiesValidation, deleteManyAvailabilities);
router
  .route("/:id")
  .get(getAvailabilityByIdValidation, getAvailabilityById)
  .put(updateAvailabilityValidation, updateAvailability)
  .delete(deleteAvailabilityByIdValidation, deleteAvailability);

router.route("/consultantId").get();

export default router;
