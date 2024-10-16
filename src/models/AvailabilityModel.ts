import { model, ObjectId, Schema } from "mongoose";

interface IAvailability {
  consultantId: ObjectId;
  availabilityTimes: {
    date: Date;
    times: {
      startTime: Date;
      endTime: Date;
    }[];
  }
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    consultantId: {
      type: Schema.Types.ObjectId,
      ref: "Consultant",
      required: true,
    },
    availabilityTimes: [
      {
        date: {
          type: Date,
          required: true,
        },
        times: [
          {
            startTime: {
              type: Date,
              required: true,
            },
            endTime: {
              type: Date,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Availability = model<IAvailability>("Availability", AvailabilitySchema);

export default Availability;
