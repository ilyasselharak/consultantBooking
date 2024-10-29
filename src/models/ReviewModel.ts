import { model, Schema } from "mongoose";


const reviewSchema = new Schema({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        default: null,
    },
    
}, {
    timestamps: true,
});


const Review = model('Review', reviewSchema);

export default Review;