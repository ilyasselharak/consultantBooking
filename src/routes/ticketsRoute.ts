import express from "express";
import {
  createTicket,
  deleteManyTickets,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from "../controllers/ticketsController";

const router = express.Router();

router.route("/").post(createTicket).get(getTickets).delete(deleteManyTickets);
router.route("/:id").get(getTicketById).put(updateTicket).delete(deleteTicket);

export default router;
