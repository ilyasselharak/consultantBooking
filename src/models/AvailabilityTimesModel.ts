import { model, Schema } from "mongoose";
import AvailabilityDays from './AvailabilityDaysModel';



const availabilityTimesSchema = new Schema(
    {
        availabilityDaysId: {
            type: Schema.Types.ObjectId,
            ref: 'AvailabilityDays',
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const availabilityTimes = model('AvailabilityTimes', availabilityTimesSchema);

export default availabilityTimes