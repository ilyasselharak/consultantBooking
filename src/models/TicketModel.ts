import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
  title: string;
  description: string;
  price: number;
  userId: string;
}

const ticketSchema = new Schema(
    {
      
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);

export default Ticket;
