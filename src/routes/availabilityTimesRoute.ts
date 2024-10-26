import express, { Router, Request } from "express";
import {
  createAvailabilityTimes,
  deleteAvailabilityTimes,
  deleteManyAvailabilitiesTimes,
  getAvailabilitiesTimes,
  getAvailabilityTimesById,
  updateAvailabilityTimes,
} from "../controllers/availabilityTimesController";
import {
    createAvailabilityTimeValidation,
    updateAvailabilityTimeValidation,
    getAvailabilityTimeByIdValidation,
    deleteAvailabilityTimeByIdValidation} from "../../utils/validation/availabilityTimesValidation";
const router = express.Router();

router
  .route("/")
  .post(createAvailabilityTimeValidation, createAvailabilityTimes)
  .get(getAvailabilitiesTimes)
  .delete(deleteManyAvailabilitiesTimes);
router
  .route("/:id")
  .get(getAvailabilityTimeByIdValidation, getAvailabilityTimesById)
  .put(updateAvailabilityTimeValidation, updateAvailabilityTimes)
  .delete(deleteAvailabilityTimeByIdValidation, deleteAvailabilityTimes);

export default router;
