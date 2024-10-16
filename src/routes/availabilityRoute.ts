import express from "express";
import {
  createAvailability,
  deleteAvailability,
  deleteManyAvailabilities,
  getAvailabilities,
  getAvailabilityById,
  updateAvailability,
} from "../controllers/availabilityController";

const router = express.Router();

router.route("/").post(createAvailability).get(getAvailabilities).delete(deleteManyAvailabilities);
router
  .route("/:id")
  .get(getAvailabilityById)
  .put(updateAvailability)
  .delete(deleteAvailability);

export default router;
