import { Comments } from "../models/comment.model";
import { Post } from "../../posts/models/post.model";
import { IComment } from "@/types/user";
import { Types } from "mongoose";

export const getComments = () => Comments.find();
export const getCommentById = (id: string | Types.ObjectId) =>
  Comments.findById(id);
export const createComment = async (comment: IComment) => {
  const newComment = await Comments.create(comment);
  if (!newComment) {
    throw new Error("Comment creation failed");
  }

  // Add comment to post's comments array
  await Post.findByIdAndUpdate(comment.postId, {
    $push: { comments: newComment._id },
  });

  await newComment.save();
  return newComment;
};
export const deleteCommentById = async (id: string | Types.ObjectId) => {
  const comment = await Comments.findById(id);
  if (comment) {
    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: id },
    });
  }
  return Comments.findByIdAndDelete(id);
};
export const updateCommentById = (
  id: string | Types.ObjectId,
  comment: IComment
) => {
  const updatedComment = Comments.findByIdAndUpdate(id, comment, { new: true });
  return updatedComment;
};

export const getCommentsByPostId = (postId: string | Types.ObjectId) =>
  Comments.find({ postId }).populate("userId", "name email");

export const getCommentsByUserId = (userId: string | Types.ObjectId) =>
  Comments.find({ userId }).populate("postId", "title content");
