import { Types } from "mongoose";

export interface IAuthor {
  id: string;
  name: string;
  avatar: string;
}
export interface IPostResponse {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: string;
  content: string;
  tags: string[];
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  author: IAuthor;
}

export interface IPostModel {
  userId: Types.ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: string;
  category: string;
  content: string;
  htmlContent?: string;
  likesCount?: number;
  dislikesCount?: number;
  tags: string[];
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPostModelResponse extends IPostModel {
  _id: Types.ObjectId;
}
