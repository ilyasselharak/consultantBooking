import mongoose from "mongoose";

interface IUser {
  fullName: string;
  email: string;
  password: string;
  verified: boolean;
  token: string | null;
  expireDate: Date | null;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    expireDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
