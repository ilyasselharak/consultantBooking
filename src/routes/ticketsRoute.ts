import express from "express";
import {
  createTicketValidation,
  updateTicketValidation,
  getTicketByIdValidation,
  deleteTicketByIdValidation,
  deleteTicketsValidation,
} from "../../utils/validation/ticketValidation";
import {
  createTicket,
  deleteManyTickets,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from "../controllers/ticketsController";

const router = express.Router();

router
  .route("/")
  .post(createTicketValidation, createTicket)
  .get(getTickets)
  .delete(deleteTicketsValidation, deleteManyTickets);
router
  .route("/:id")
  .get(getTicketByIdValidation, getTicketById)
  .put(updateTicketValidation, updateTicket)
  .delete(deleteTicketByIdValidation, deleteTicket);

export default router;
