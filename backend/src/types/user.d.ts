import { Types } from "mongoose";
export interface IUserModel {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  accessToken?: string;
  refreshToken?: string;
  otp?: number;
  verificationToken?: string;
  isPasswordCorrect(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IPost {
  userId: string | Types.ObjectId;
  title: string;
  shortdescription: string;
  comments?: Array<string>;
  content: string;
  postImage: string;
  tags?: string;
}

export interface IComment {
  userId: string | Types.ObjectId;
  content: string;
  postId: string;
}

export interface ITag {
  name: string;
  posts: string[];
}
