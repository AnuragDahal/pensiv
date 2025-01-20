import { Post } from "@/models/post.models";
import { IPost } from "@/types/user";
import { Types } from "mongoose";

export const getPosts = () => Post.find();
export const getPostById = (id: string | Types.ObjectId) => Post.findById(id);
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
