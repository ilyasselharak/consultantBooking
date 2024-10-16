import express from "express";
import {
  createConsultant,
  getConsultants,
  getConsultantById,
  updateConsultant,
  deleteConsultant,
  deleteManyConsultants,
} from "../controllers/consultantsController";

const router = express.Router();

router
  .route("/")
  .post(createConsultant)
  .get(getConsultants)
  .delete(deleteManyConsultants);
router
  .route("/:id")
  .get(getConsultantById)
  .put(updateConsultant)
  .delete(deleteConsultant);

export default router;
