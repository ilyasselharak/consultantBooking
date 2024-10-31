import { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
