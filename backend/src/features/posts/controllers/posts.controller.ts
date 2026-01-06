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
  deletePost,
  getAllPosts,
  getFilteredArticles,
  getPostById,
  getPostByIdForEdit,
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

    // Allow searching and filtering for own posts
    // Default to 'all' status if not specified to show drafts + published
    const status = req.query.status ? String(req.query.status) : "all";
    const limit = req.query.limit ? String(req.query.limit) : "1000"; // Default to high limit if frontend expects all, or let frontend handle pagination
    
    const query = {
      ...req.query,
      userId: req.user._id.toString(),
      status,
      limit, // Pass the limit
    };

    const responseData = await getFilteredArticles(query as any);

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: responseData, // Now returns { posts, pagination }
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
    // Explicitly enforce published status for public search
    const query = { ...req.query, status: "published" };

    // Backend decides: WHERE to search, HOW to filter, WHAT order to return
    const responseData = await getFilteredArticles(query as any);

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: responseData,
    });
  }
);

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await getPostByIdForEdit(req.params.id);
  if (!post) {
    throw new APIError(
      API_RESPONSES.RESOURCE_NOT_FOUND,
      HTTP_STATUS_CODES.NOT_FOUND
    );
  }

  // SECURITY: Verify ownership
  if (post.userId.toString() !== req.user?._id.toString()) {
    throw new APIError(
      "You don't have permission to edit this post",
      HTTP_STATUS_CODES.FORBIDDEN
    );
  }

  // Prevent unpublishing: once published, cannot be changed back to draft
  if (post.status === "published" && req.body.status === "draft") {
    throw new APIError(
      "Published articles cannot be unpublished. You can only update the content.",
      HTTP_STATUS_CODES.BAD_REQUEST
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

export const getPostForEdit = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new APIError(
        API_RESPONSES.UNAUTHORIZED,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const post = await getPostByIdForEdit(req.params.id);
    if (!post) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }

    // Verify ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      throw new APIError(
        "You don't have permission to edit this post",
        HTTP_STATUS_CODES.FORBIDDEN
      );
    }

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: {
        id: post._id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        coverImage: post.coverImage,
        status: post.status,
      },
    });
  }
);

export const getUserPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  // Try to get user ID if authenticated, but don't fail if not
  const userId = req.user?._id?.toString();

  const post = await getPostBySlug(slug);
  if (!post) {
    throw new APIError(API_RESPONSES.RESOURCE_NOT_FOUND, 404);
  }

  // PRIVACY CHECK:
  // If the post is NOT published, only the author can see it.
  if (post.status !== "published") {
    if (!userId || post.userId.toString() !== userId) {
      throw new APIError(
        "This article is private or a draft.",
        HTTP_STATUS_CODES.FORBIDDEN
      );
    }
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

export const removePost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new APIError(
      API_RESPONSES.UNAUTHORIZED,
      HTTP_STATUS_CODES.UNAUTHORIZED
    );
  }

  const post = await getPostByIdForEdit(req.params.id);
  if (!post) {
    throw new APIError(
      API_RESPONSES.RESOURCE_NOT_FOUND,
      HTTP_STATUS_CODES.NOT_FOUND
    );
  }

  // SECURITY: Verify ownership
  if (post.userId.toString() !== req.user._id.toString()) {
    throw new APIError(
      "You don't have permission to delete this post",
      HTTP_STATUS_CODES.FORBIDDEN
    );
  }

  await deletePost(req.params.id);

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    message: API_RESPONSES.RESOURCE_DELETED,
  });
});
