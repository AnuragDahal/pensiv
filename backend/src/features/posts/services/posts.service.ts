import { Post } from "../models/post.model";
import { IPost } from "../../../types/user";
import { Types } from "mongoose";

export const getPosts = (filter: any = {}) => Post.find(filter);
export const getPostById = (id: string | Types.ObjectId) =>
  Post.findById(id).populate("comments");
export const getPostsByUserId = (userId: string | Types.ObjectId) =>
  Post.find({ userId }).populate("comments");
export const getAllPosts = () => Post.find().populate("comments");
export const createPost = async (post: IPost) => {
  const newPost = new Post(post);
  await newPost.save({ validateBeforeSave: false });
  return newPost;
};
export const deletePostById = (id: string | Types.ObjectId) =>
  Post.findByIdAndDelete(id);
export const updatePostById = (
  id: string | Types.ObjectId,
  post: Partial<IPost>
) => Post.findByIdAndUpdate(id, post);
