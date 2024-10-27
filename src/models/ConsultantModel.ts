import { Schema, model } from "mongoose";
import User from "./UserModel";
import Availability from "./AvailabilityModel";
import AvailabilityDays from "./AvailabilityDaysModel";
import AvailabilityTimes from "./AvailabilityTimesModel";
import Wallet from "./WalletModel";

const consultantSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bio: {
      type: String,
      required: true,
      maxLength: 250,
      minLength: 25,
    },
    IBAN: {
      type: String,
      required: true,
    },
    expertise: {
      type: String,
      required: true,
    },
    taxId: {
      // ID Fiscal
      type: String,
      required: true,
    },
    CIN: {
      type: String,
      required: true,
    },
    ICE: {
      type: String,
      required: true,
    },
    professionalId: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    businessName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    timeUnit: {
      type: Number,
      default: 60,
    },
    price: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isTroubled: {
      type: Boolean,
      default: false,
    },
    isValidated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Consultant = model("Consultant", consultantSchema);

export default Consultant;
