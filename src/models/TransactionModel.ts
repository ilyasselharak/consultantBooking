

import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
}, {
    timestamps: false
});


const Transaction = model("Transaction", transactionSchema);

export default Transaction