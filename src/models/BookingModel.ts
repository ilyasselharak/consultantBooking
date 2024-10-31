import mongoose, { model, Schema, ObjectId } from "mongoose";

interface IBooking {
  customerId: ObjectId;
  consultantId: ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  price: number;
  amount: number;
  status: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
      required: true,
    },
    // 2024-10-24
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    
    
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "notPaid"],
      default: "notPaid",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = model("Booking", bookingSchema);

export default Booking;
