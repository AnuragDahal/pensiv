import { API_RESPONSES } from "../../../constants/responses";
import { HTTP_STATUS_CODES } from "../../../constants/statusCodes";
import { sendResponse } from "../../../shared/services/response.service";
import { APIError, asyncHandler } from "../../../shared/utils";
import { Comments } from "../models/comment.model";
import {
  addReplyToComment,
  createComment,
  getCommentById,
  toggleCommentReaction,
} from "../services/comments.service";
import { Request, Response } from "express";

export const addNewComment = asyncHandler(async (req:Request, res:Response) => {
  if (!req.user?._id) {
    throw new APIError(API_RESPONSES.UNAUTHORIZED, 401);
  }

  const commentData = {
    content: req.body.content,
    postId: req.body.postId,
    userId: req.user._id,
  };

  const comment = await createComment(commentData);

  return sendResponse({
    res,
    status: 201,
    message: "Comment added",
    data: comment,
  });
});

export const getSingleComment = asyncHandler(async (req:Request, res:Response) => {
  const comment = await getCommentById(req.params.id);
  
  if (!comment) {
    throw new APIError(
      API_RESPONSES.RESOURCE_NOT_FOUND,
      HTTP_STATUS_CODES.NOT_FOUND
    );
  }

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    message: API_RESPONSES.RESOURCE_FETCHED,
    data: comment,
  });
});

export const updateComment = asyncHandler(async (req:Request, res:Response) => {
  const comment = await getCommentById(req.params.id);
  
  if (!comment) {
    throw new APIError(
      API_RESPONSES.RESOURCE_NOT_FOUND,
      HTTP_STATUS_CODES.NOT_FOUND
    );
  }

  // Update the comment
  comment.content = req.body.content || comment.content;
  await comment.save();

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    message: API_RESPONSES.RESOURCE_UPDATED,
    data: comment,
  });
});

export const deleteComment = asyncHandler(async (req:Request, res:Response) => {
  const comment = await getCommentById(req.params.id);
  
  if (!comment) {
    throw new APIError(
      API_RESPONSES.RESOURCE_NOT_FOUND,
      HTTP_STATUS_CODES.NOT_FOUND
    );
  }

  await Comments.findByIdAndDelete(req.params.id);

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    message: API_RESPONSES.RESOURCE_DELETED,
    data: null,
  });
});

export const createCommentReply = asyncHandler(async (req:Request, res:Response) => {
  const comment = await getCommentById(req.params.id);

  if (!comment) {
    throw new APIError(API_RESPONSES.RESOURCE_NOT_FOUND, 404);
  }
  if (!req.user!._id || !req.body.content) {
    return sendResponse({ res, status: 400 });
  }

  const reply = {
    userId: req.user!._id,
    content: req.body.content,
  };

  const updated = await addReplyToComment(req.params.id, reply);

  return sendResponse({
    res,
    status: 201,
    message: "Reply added",
    data: updated,
  });
});

export const updateCommentLikes = asyncHandler(async (req:Request, res:Response) => {
  const userId = req.user!._id;
  const commentId = req.params.id;

  const result = await toggleCommentReaction(commentId, userId.toString());

  return sendResponse({
    res,
    status: 200,
    message: result.liked ? "Comment liked" : "Comment unliked",
    data: { isLiked: result.liked },
  });
});
