import express from "express";

import {
  createAvailabilityValidation,
  updateAvailabilityValidation,
  getAvailabilityByIdValidation,
  deleteAvailabilityByIdValidation,
  deleteAvailabilitiesValidation,
} from "../../utils/validation/availabilityValidation";
import {
  createAvailability,
  deleteAvailability,
  deleteManyAvailabilities,
  getAvailabilities,
  getAvailabilityById,
  updateAvailability,
} from "../controllers/availabilityController";

const router = express.Router();

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

export default router;
