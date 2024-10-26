import { Schema, model } from "mongoose";

interface IUser {
  fullName: string;
  email: string;
  password: string;
  role:  "Customer" | "Consultant";
  verified: boolean;
  token: string | null;
  expireDate: Date | null;
  image: {
    url: string | null;
    public_id: string | null;
  };
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Customer", "Consultant"],
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
    image: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
