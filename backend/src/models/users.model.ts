import { IUserModel } from "@/types/user";
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    name: {
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
    avatar: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    otp: {
      type: Number,
      required: false,
    },
    verificationToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUserModel>("User", userSchema);
