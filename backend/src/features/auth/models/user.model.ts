import { IUserModel } from "../../../types/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../../../config/env";
import jwt from "jsonwebtoken";

export const userSchema = new mongoose.Schema<IUserModel>(
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
    bio: {
      type: String,
      required: false,
    },
    socialLinks: {
      github: {
        type: String,
        required: false,
      },
      linkedin: {
        type: String,
        required: false,
      },
      twitter: {
        type: String,
        required: false,
      },
      portfolio: {
        type: String,
        required: false,
      },
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
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v; // Exclude version key
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  if (!env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  if (!env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  return jwt.sign(
    {
      email: this.email,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const User = mongoose.model<IUserModel>("User", userSchema);
export default User;
