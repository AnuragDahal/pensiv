import User from "@/models/users.model";
import { IUser } from "@/types/user";
import { Types } from "mongoose";

export const getUsers = () => User.find();
export const getUserById = (id: string | Types.ObjectId) => User.findById(id);
export const createUser = async (data: IUser) => {
  const user = new User(data);
  await user.save({ validateBeforeSave: false });
  const savedUser = await getUserById(user._id).select("-password -__v -_id");
  return savedUser;
};

export const getUserByEmail = (email: string) => User.findOne({ email });
export const deleteUserById = (id: string) => User.findByIdAndDelete(id);
export const deleteUserByEmail = (email: string) =>
  User.findOneAndDelete({ email });
export const generateAccessAndRefreshToken = async (
  id: string | Types.ObjectId
) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error generating tokens");
  }
};
