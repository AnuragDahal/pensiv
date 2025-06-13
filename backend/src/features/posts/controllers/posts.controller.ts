import { API_RESPONSES } from "@/constants/responses";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import { APIError, asyncHandler } from "@/shared/utils";
import {
  createPost,
  getPostById,
  getPostsByUserId,
} from "../services/posts.service";
import { sendResponse } from "@/shared/services/response.service";
import { Request, Response } from "express";

export const addNewPost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new APIError(
      API_RESPONSES.UNAUTHORIZED,
      HTTP_STATUS_CODES.UNAUTHORIZED
    );
  }

  const postData = {
    ...req.body,
    userId: req.user._id,
  };

  const post = await createPost(postData);
  if (!post) {
    throw new APIError(
      API_RESPONSES.RESOURCE_CREATION_FAILED,
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.CREATED,
    message: API_RESPONSES.RESOURCE_CREATED,
    data: post,
  });
});

export const getSinglePost = asyncHandler(
  async (req: Request, res: Response) => {
    const post = await getPostById(req.params.id)
      .select("-__v")
      .populate("comments");
    if (!post) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: post,
    });
  }
);

export const getAllPostsOfAuthenticatedUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new APIError(
        API_RESPONSES.UNAUTHORIZED,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const posts = await getPostsByUserId(req.user._id)
      .select("-__v")
      .populate("comments");

    if (!posts || posts.length === 0) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: posts,
    });
  }
);

export const getAllPostByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) {
      throw new APIError(
        API_RESPONSES.BAD_REQUEST,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const posts = await getPostsByUserId(userId)
      .select("-__v")
      .populate("comments");

    if (!posts || posts.length === 0) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: posts,
    });
  }
);
