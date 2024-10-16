import { Document, Schema, ObjectId, model } from "mongoose";

export interface ITicket extends Document {
  userId: ObjectId;
  relationId: ObjectId;
  relationType: string;
  priority: string;
  status: string;
  response: string;
}

const ticketSchema = new Schema<ITicket>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relationId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    relationType: {
      type: String,
      enum: [
        "Consultant",
        "User",
        "Transaction",
        "Wallet",
        "DailyBooking",
        "Availability",
        "Appointment",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending",
      required: true,
    },
    response: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Ticket = model("Ticket", ticketSchema);

export default Ticket;
