import { model, Schema, ObjectId } from "mongoose";



interface IBooking {
  userId: ObjectId;
  consultantId: ObjectId;
  bookingTime: {
    date: Date;
    startTime: Date;
    endTime: Date;
  };
  price: number;
  status: string;
}

const bookingSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    consultantId: {
      type: String,
      required: true,
    },
    bookingTime: {
      date: {
        type: Date,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
    },
    price: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


const Booking = model('Booking', bookingSchema);

export default Booking