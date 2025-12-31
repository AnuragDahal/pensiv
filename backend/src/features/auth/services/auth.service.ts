import { Types } from "mongoose";
import { API_RESPONSES } from "../../../constants/responses";
import { HTTP_STATUS_CODES } from "../../../constants/statusCodes";
import { APIError } from "../../../shared";
import { IUser, UserWithId } from "../../../types/user";
import User from "../models/user.model";

export const getUsers = () => User.find();
export const getUserById = (id: string | Types.ObjectId) => User.findById(id);
export const createUser = async (data: IUser) => {
  const user = new User(data);
  const savedUser = await user.save();
  return { user: savedUser, userId: savedUser._id.toString() };
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
    if (error instanceof Error) {
      throw new Error("Error generating tokens: " + error.message);
    }
    throw new Error("Error generating tokens");
  }
};

export const getRefreshToken = async (userId: string | Types.ObjectId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.refreshToken;
};
export const validateRefreshToken = async (refreshToken: string) => {
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new APIError(
      API_RESPONSES.TOKEN_INVALID,
      HTTP_STATUS_CODES.UNAUTHORIZED
    );
  }
  return user;
};
export const getUserByRefreshToken = async (
  refreshToken: string
): Promise<UserWithId | null> => {
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new APIError(
      API_RESPONSES.TOKEN_INVALID,
      HTTP_STATUS_CODES.UNAUTHORIZED
    );
  }
  return user;
};

export const removeRefreshToken = async (userId: string | Types.ObjectId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
};

import { Post } from "../../posts/models/post.model";
import { Reaction } from "../../reaction/models/reaction-model";

export const getMeStats = async (userId: string | Types.ObjectId) => {
  const [postCount, userPosts] = await Promise.all([
    Post.countDocuments({ userId }),
    Post.find({ userId }).select("_id"),
  ]);

  const postIds = userPosts.map((post) => post._id);

  const totalLikes = await Reaction.countDocuments({
    post: { $in: postIds },
    reactionType: "like",
  });

  return {
    postCount,
    totalLikes,
    followersCount: 0,
  };
};

export const updateUser = async (
  userId: string | Types.ObjectId,
  data: Partial<IUser>
) => {
  return User.findByIdAndUpdate(userId, data, { new: true }).select(
    "-password -__v -refreshToken"
  );
};
