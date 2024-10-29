import { model, Schema, ObjectId } from 'mongoose';

interface IBooking {
  userId: ObjectId;
  consultantId: ObjectId;
  date: Date;
  startTime: Date;
  endTime: Date;
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
      // required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    // TODO: add new fields {statusUpdate, numberUpdate, howUpdate}
  },
  {
    timestamps: true,
  },
);

const Booking = model('Booking', bookingSchema);

export default Booking;
