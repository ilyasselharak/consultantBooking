import { model, Schema } from "mongoose";

const availabilityDaysSchema = new Schema(
  {
    availabilityId: {
      type: Schema.Types.ObjectId,
      ref: "Availability",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    availabilityTimes: [
      {
        // إضافة الحقل هنا
        type: Schema.Types.ObjectId,
            ref: "AvailabilityTimes",
        
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AvailabilityDays = model("AvailabilityDays", availabilityDaysSchema);

export default AvailabilityDays;
