import express from "express";
import {
  createConsultantValidation,
  updateConsultantValidation,
  deleteConsultantValidation,
  getConsultantByIdValidation,
  deleteConsultantsValidation,
} from "../../utils/validation/consultantValidation";
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
  .post(createConsultantValidation, createConsultant)
  .get(getConsultants)
  .delete(deleteConsultantsValidation, deleteManyConsultants);
router
  .route("/:id")
  .get(getConsultantByIdValidation, getConsultantById)
  .put(updateConsultantValidation, updateConsultant)
  .delete(deleteConsultantValidation, deleteConsultant);

export default router;
