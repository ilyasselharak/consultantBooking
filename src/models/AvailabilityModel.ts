import { model, ObjectId, Schema } from "mongoose";
import availabilityTimes from "./AvailabilityTimesModel";

const AvailabilitySchema = new Schema(
  {
    consultantId: {
      type: Schema.Types.ObjectId,
      ref: "Consultant",
      required: true,
      unique: true,
    },
    availabilityDays: [
      {
        // إضافة الحقل هنا
        type: Schema.Types.ObjectId,
        ref: "AvailabilityDays",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Availability = model("Availability", AvailabilitySchema);

export default Availability;
