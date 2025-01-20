import { User, userSchema } from "@/models/users.model";
import { IUser } from "@/types/user";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { env } from "@/env";
import jwt from "jsonwebtoken";

export const getUsers = () => User.find();
export const getUserById = (id: string | Types.ObjectId) => User.findById(id);
export const createUser = async (data: IUser) => {
  const user = new User(data);
  await user.save();
  const savedUser = await getUserById(user._id).select("-password -__v -_id");
  return savedUser;
};

export const getUserByEmail = (email: string) => User.findOne({ email });
export const deleteUserById = (id: string) => User.findByIdAndDelete(id);
export const deleteUserByEmail = (email: string) =>
  User.findOneAndDelete({ email });

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
      expiresIn: "10h",
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
