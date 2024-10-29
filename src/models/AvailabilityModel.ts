import { model, ObjectId, Schema } from 'mongoose';

const AvailabilitySchema = new Schema(
  {
    consultantId: {
      type: Schema.Types.ObjectId,
      ref: 'Consultant',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

AvailabilitySchema.virtual('availabilityDays', {
  ref: 'AvailabilityDays', // Model to populate
  localField: '_id', // Field in AvailSchema
  foreignField: 'availabilityId', // Field in AvailDays
});

const Availability = model('Availability', AvailabilitySchema);

export default Availability;
