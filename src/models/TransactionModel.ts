

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
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
}, {
    timestamps: true
});


const Transaction = model("Transaction", transactionSchema);

export default Transaction