import mongoose, { Schema } from "mongoose";


const walletSchema = new mongoose.Schema({
    consultantId: {
        type: Schema.Types.ObjectId,
        ref: "Consultant",
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    
}, {
    timestamps: true
});


const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet