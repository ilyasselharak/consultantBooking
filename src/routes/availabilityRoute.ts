import express, { Router, Request } from "express";

import {
  createAvailabilityValidation,
  getAvailabilityByIdValidation,
  updateAvailabilityValidation,
  deleteAvailabilityByIdValidation,
  deleteAvailabilitiesValidation,
} from "../../utils/validation/availabilityValidation";
import {
  createAvailability,
  updateAvailability,
  deleteAvailability,
  deleteManyAvailabilities,
  getAvailabilities,
  getAvailabilityById,
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

  router.route("/consultantId").get()

export default router;
