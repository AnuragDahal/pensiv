import { API_RESPONSES } from "../../../constants/responses";
import { HTTP_STATUS_CODES } from "../../../constants/statusCodes";
import { APIError, asyncHandler } from "../../../shared/utils";
import {
  createPost,
  getPostById,
  getPosts,
  getPostsByUserId,
} from "../services/posts.service";
import { Post } from "../models/post.model";
import { sendResponse } from "../../../shared/services/response.service";
import { Request, Response } from "express";
import { FilterQuery } from "mongoose";

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
    const post = await getPostById(req.params.id)
      .select("-__v")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name email avatar replies",
        },
      })
      .populate("userId", "name email avatar bio");
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
      });
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
          select: "name email",
        },
      });

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
    const { ...filters } = req.query;

    // Build filter object
    const filter: FilterQuery<typeof Post> = {};

    // Search functionality - search in title, content, and shortDescription
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { content: { $regex: filters.search, $options: "i" } },
        { shortDescription: { $regex: filters.search, $options: "i" } },
      ];
    }

    // Filter by tags
    if (filters.tags) {
      filter.tags = { $regex: filters.tags, $options: "i" };
    }

    // Build sort object
    const sort: any = {};
    if (filters.sortBy) {
      const order = filters.sortOrder === "desc" ? -1 : 1;
      sort[filters.sortBy as string] = order;
    } else {
      sort.createdAt = -1; // Default sort by creation date, newest first
    }

    // Pagination
    const pageNum = parseInt(filters.page as string, 10) || 1;
    const limitNum = parseInt(filters.limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum; // Execute query
    const posts = await getPosts(filter)
      .select("-__v")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("userId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    // Get total count for pagination
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limitNum);

    const responseData = {
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: responseData,
    });
  }
);
