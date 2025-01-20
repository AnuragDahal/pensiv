import { Types } from "mongoose";
// {
//   avatar: {
//     type: String,
//     required: false,
//   },
//   accessToken: {
//     type: String,
//     required: false,
//   },
//   refreshToken: {
//     type: String,
//     required: false,
//   },
//   otp: {
//     type: Number,
//     required: false,
//   },
//   verificationToken: {
//     type: String,
//     required: false,
//   },
// },
// {
//   timestamps: true,
// }
// );
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
  comments: Array<string>;
  description: string;
  postImage: string;
  tags: string;
}

export interface IComment {
  userId: string | Types.ObjectId;
  comment: string;
  postId: string;
}

export interface ITag {
  name: string;
  posts: string[];
}
