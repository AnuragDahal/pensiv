import { Request, Response } from "express";
import { API_RESPONSES } from "../../../constants/responses";
import { HTTP_STATUS_CODES } from "../../../constants/statusCodes";
import { getPostById } from "../../../features/posts";
import { sendResponse } from "../../../shared/services/response.service";
import { APIError, asyncHandler } from "../../../shared/utils";
import {
  createComment,
  deleteCommentById,
  getCommentById,
  updateCommentById
} from "../services/comments.service";

// export const getAllComments = asyncHandler(
//   async (req: Request, res: Response) => {
//     const comments = await getComments();

//     return sendResponse({
//       res,
//       status: HTTP_STATUS_CODES.OK,
//       data: comments,
//       message: API_RESPONSES.RESOURCE_FETCHED,
//     });
//   }
// );

export const getSingleComment = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const addNewComment = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new APIError(
        API_RESPONSES.UNAUTHORIZED,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const commentData = {
      ...req.body,
      userId: req.user._id,
    };

    const comment = await createComment(commentData);
    if (!comment) {
      throw new APIError(
        API_RESPONSES.RESOURCE_CREATION_FAILED,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    const post = await getPostById(req.body.postId);
    if (!post) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }
    post.comments.push(comment._id);
    await post.save();
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.CREATED,
      message: API_RESPONSES.RESOURCE_CREATED,
      data: comment,
    });
  }
);

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await getCommentById(req.params.id);
    if (!comment) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }

    const updatedComment = await updateCommentById(req.params.id, req.body);

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_UPDATED,
      data: updatedComment,
    });
  }
);

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await getCommentById(req.params.id);
    if (!comment) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }

    await deleteCommentById(req.params.id);

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_DELETED,
      data: null,
    });
  }
);
