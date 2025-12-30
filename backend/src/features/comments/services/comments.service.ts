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
  reply: { userId: string | Types.ObjectId; content: string }
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
  // First, check if this ID is a comment
  const comment = await Comments.findById(commentId);

  let isReply = false;
  const replyId = commentId;

  // If not found as a comment, search for it as a reply
  if (!comment) {
    const commentWithReply = await Comments.findOne({
      "replies._id": commentId,
    });

    if (!commentWithReply) {
      throw new Error("Comment or reply not found");
    }

    isReply = true;
  }

  // Use atomic findOneAndDelete to prevent race conditions
  const deletedReaction = await Reaction.findOneAndDelete({
    user: userId,
    ...(isReply ? { reply: replyId } : { comment: commentId }),
    reactionType: "like",
  });

  if (deletedReaction) {
    return { liked: false };
  }

  // Like didn't exist, so create it
  // Use try-catch to handle race condition where another request creates it first
  try {
    await Reaction.create({
      user: userId,
      ...(isReply ? { reply: replyId } : { comment: commentId }),
      reactionType: "like",
    });
    return { liked: true };
  } catch (error: any) {
    // If duplicate key error (E11000), it means another request created it first
    // In this case, treat it as a successful like
    if (error.code === 11000) {
      return { liked: true };
    }
    throw error;
  }
};
