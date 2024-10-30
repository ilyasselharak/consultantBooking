import mongoose, { Schema, Document } from "mongoose";

interface IAvailability extends Document {
  consultantId: mongoose.Types.ObjectId;
  schedule: {
    day: string; // مثل "Monday"
    times: { startTime: string; endTime: string }[]; // قائمة الأوقات
  }[];
  isAvailable: boolean;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    consultantId: {
      type: Schema.Types.ObjectId,
      ref: "Consultant",
      unique: true,
      required: true,
    },
    schedule: [
      {
        day: { type: String },
        times: [
          {
            startTime: { type: String },
            endTime: { type: String },
          },
        ],
      },
    ],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Availability = mongoose.model<IAvailability>(
  "Availability",
  AvailabilitySchema
);

export default Availability;
