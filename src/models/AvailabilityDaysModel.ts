import { model, Schema } from 'mongoose';

const availabilityDaysSchema = new Schema(
  {
    availabilityId: {
      type: Schema.Types.ObjectId,
      ref: 'Availability',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

availabilityDaysSchema.virtual('availabilityTimes', {
  ref: 'AvailabilityTimes', // Model to populate
  localField: '_id', // Field in AvailSchema
  foreignField: 'availabilityDayId', // Field in AvailDays
});

const AvailabilityDays = model('AvailabilityDays', availabilityDaysSchema);

export default AvailabilityDays;
