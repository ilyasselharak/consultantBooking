import { model, Schema } from "mongoose";

const walletSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    }
  },
  {
    timestamps: true,
  }
);

const Wallet = model("Wallet", walletSchema);

export default Wallet;


