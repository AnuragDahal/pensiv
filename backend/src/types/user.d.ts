import { Types } from "mongoose";

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
