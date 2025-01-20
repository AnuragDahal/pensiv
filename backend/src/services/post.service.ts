import { Post } from "@/models/post.models";
import { IPost } from "@/types/user";
import { Types } from "mongoose";

export const getPosts = () => Post.find();
export const getPostById = (id: string | Types.ObjectId) => Post.findById(id);
export const createPost = (post: IPost) => {
  const newPost = new Post(post);
  newPost.save();
  return newPost.isSelected("-__v ");
};
export const deletePostById = (id: string | Types.ObjectId) =>
  Post.findByIdAndDelete(id);
export const updatePostById = (
  id: string | Types.ObjectId,
  post: Partial<IPost>
) => Post.findByIdAndUpdate(id, post);
