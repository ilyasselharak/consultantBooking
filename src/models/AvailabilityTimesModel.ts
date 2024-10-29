import { model, Schema } from 'mongoose';

const availabilityTimesSchema = new Schema(
  {
    availabilityDayId: {
      type: Schema.Types.ObjectId,
      ref: 'AvailabilityDays',
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
  },
  {
    timestamps: true,
  },
);

const availabilityTimes = model('AvailabilityTimes', availabilityTimesSchema);

export default availabilityTimes;
