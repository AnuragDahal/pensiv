import { Comments } from "../models/comment.model";
import { IComment } from "@/types/user";
import { Types } from "mongoose";

export const getComments = () => Comments.find();
export const getCommentById = (id: string | Types.ObjectId) =>
  Comments.findById(id);
export const createComment = (comment: IComment) => {
  const newComment = new Comments(comment);
  newComment.save();
  return newComment;
};
export const deleteCommentById = (id: string | Types.ObjectId) =>
  Comments.findByIdAndDelete(id);
export const updateCommentById = (
  id: string | Types.ObjectId,
  comment: IComment
) => {
  const updatedComment = Comments.findByIdAndUpdate(id, comment, { new: true });
  return updatedComment;
};
