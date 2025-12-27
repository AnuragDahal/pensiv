import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { API_RESPONSES } from "../../../constants/responses";
import { HTTP_STATUS_CODES } from "../../../constants/statusCodes";
import { sendResponse } from "../../../shared/services/response.service";
import { APIError, asyncHandler } from "../../../shared/utils";
import { Post } from "../models/post.model";
import type { SortOrder } from "mongoose";
import {
  buildFullPostResponse,
  createPost,
  getAllPosts,
  getFilteredArticles,
  getPostById,
  getPostBySlug,
  getPostsByUserId,
  getRecentPosts,
  getTopFeaturedPost,
  togglePostReaction,
  updatePostById,
} from "../services/posts.service";

interface Post {
  title: string;
  content: string;
  shortDescription: string;
  tags: string[];
  userId: string;
}

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
    const postId = req.params.id;
    const userId = req.user?._id?.toString(); // May be undefined if not authenticated

    const post = await buildFullPostResponse(postId, userId);
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
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name email avatar replies",
        },
      })
      .populate("userId", "name email avatar bio");
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
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name email avatar replies",
        },
      })
      .populate("userId", "name email avatar bio");

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

export const fetchAllPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query;

    // Backend decides: WHERE to search, HOW to filter, WHAT order to return
    const responseData = await getFilteredArticles(query);

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: responseData,
    });
  }
);

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await getPostById(req.params.id);
  if (!post) {
    throw new APIError(
      API_RESPONSES.RESOURCE_NOT_FOUND,
      HTTP_STATUS_CODES.NOT_FOUND
    );
  }

  await updatePostById(req.params.id, req.body);

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    message: API_RESPONSES.RESOURCE_UPDATED,
  });
});
export const updatePostReaction = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const postId = req.params.id;

    if (!userId) {
      throw new APIError(
        API_RESPONSES.UNAUTHORIZED,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Ensure post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }

    // Toggle the reaction
    const result = await togglePostReaction(postId, userId.toString());

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: result.liked ? "Post liked" : "Post unliked",
      data: {
        postId,
        likes: result.likesCount,
        isLiked: result.liked,
      },
    });
  }
);
export const getUserPostBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const userId = req.user?._id?.toString();

  const post = await getPostBySlug(slug);
  if (!post) {
    throw new APIError(API_RESPONSES.RESOURCE_NOT_FOUND, 404);
  }

  const responseData = await buildFullPostResponse(post._id.toString(), userId);

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    message: API_RESPONSES.RESOURCE_FETCHED,
    data: responseData,
  });
});

export const getHomePosts = asyncHandler(
  async (req: Request, res: Response) => {
    const recentPosts = await getRecentPosts(4);
    const featuredPost = await getTopFeaturedPost();
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: {
        ...recentPosts,
        ...featuredPost,
      },
    });
  }
);
