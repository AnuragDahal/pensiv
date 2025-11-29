import { Comments } from "../models/comment.model";
import { Post } from "../../posts/models/post.model";
import { Reaction } from "../../reaction/models/reaction-model";
import { Types } from "mongoose";
import { IComment } from "../../../types/user";

// Create a new comment and attach to post
export const createComment = async (comment: IComment) => {
  const newComment = await Comments.create(comment);

  await Post.findByIdAndUpdate(comment.postId, {
    $push: { comments: newComment._id },
  });

  return newComment;
};

export const getCommentById = (id: string | Types.ObjectId) =>
  Comments.findById(id).populate("userId", "name avatar");

export const addReplyToComment = async (
  commentId: string,
  reply: { userId: string | Types.ObjectId; content: any }
) => {
  return Comments.findByIdAndUpdate(
    commentId,
    { $push: { replies: reply } },
    { new: true }
  ).populate("replies.userId", "name avatar");
};

// Like/unlike using Reaction model
export const toggleCommentReaction = async (
  commentId: string,
  userId: string
) => {
  const existing = await Reaction.findOne({
    user: userId,
    comment: commentId,
    reactionType: "like",
  });

  if (existing) {
    await Reaction.deleteOne({ _id: existing._id });
    return { liked: false };
  }

  await Reaction.create({
    user: userId,
    comment: commentId,
    reactionType: "like",
  });

  return { liked: true };
};
