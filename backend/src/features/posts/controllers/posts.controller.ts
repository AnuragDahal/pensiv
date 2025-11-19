import { API_RESPONSES } from "../../../constants/responses";
import { HTTP_STATUS_CODES } from "../../../constants/statusCodes";
import { APIError, asyncHandler } from "../../../shared/utils";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  togglePostReaction,
  updatePostById,
} from "../services/posts.service";
import { Post } from "../models/post.model";
import { sendResponse } from "../../../shared/services/response.service";
import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { Reaction } from "@/features/reaction/models/reaction-model";
import { Comments } from "@/features/comments/models/comment.model";

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
    const userId = req.user?._id; // May be undefined if not authenticated

    // 1. Fetch the post with author info
    const post = await getPostById(postId)
      .select("-__v")
      .populate("userId", "name email avatar bio");

    if (!post) {
      throw new APIError(
        API_RESPONSES.RESOURCE_NOT_FOUND,
        HTTP_STATUS_CODES.NOT_FOUND
      );
    }

    // 2. Get like count for this post
    const likesCount = await Reaction.countDocuments({
      post: postId,
      reactionType: "like",
    });

    // 3. Check if current user has liked this post (if authenticated)
    let isLikedByUser = false;
    if (userId) {
      const userLike = await Reaction.findOne({
        user: userId,
        post: postId,
        reactionType: "like",
      });
      isLikedByUser = !!userLike;
    }

    // 4. Fetch comments for this post with user info and populate replies
    const comments = await Comments.find({ postId })
      .populate("userId", "name email avatar")
      .populate("replies.userId", "name email avatar")
      .sort({ createdAt: -1 })
      .lean();

    // 5. Get like counts for each comment
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        const commentLikes = await Reaction.countDocuments({
          comment: comment._id,
          reactionType: "like",
        });

        let isLikedByUser = false;
        if (userId) {
          const userLike = await Reaction.findOne({
            user: userId,
            comment: comment._id,
            reactionType: "like",
          });
          isLikedByUser = !!userLike;
        }

        return {
          ...comment,
          likesCount: commentLikes,
          isLikedByUser,
        };
      })
    );

    // 6. Get recommended posts (same tags or same author, exclude current post)
    const recommendedPosts = await Post.find({
      _id: { $ne: postId },
      $or: [{ tags: { $in: post.tags } }, { userId: post.userId }],
    })
      .select("title slug tags isFeatured createdAt")
      .populate("userId", "name avatar")
      .limit(5)
      .sort({ createdAt: -1 })
      .lean();

    // 7. Increment view count
    await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

    // 8. Structure the response for easy frontend consumption
    const responseData = {
      post: {
        id: post._id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        htmlContent: post.htmlContent,
        tags: post.tags,
        isFeatured: post.isFeatured,
        views: post.views ?? 0 + 1,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.userId, // Populated with user info
      },
      likes: {
        count: likesCount,
        isLikedByUser, // true/false - for showing filled/outlined heart
      },
      comments: commentsWithLikes.map((comment) => ({
        id: comment._id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: comment.userId,
        likes: {
          count: comment.likesCount,
          isLikedByUser: comment.isLikedByUser,
        },
        replies: comment.replies.map((reply: any) => ({
          id: reply._id,
          content: reply.content,
          date: reply.date,
          author: reply.userId,
        })),
      })),
      recommended: recommendedPosts.map((p: any) => ({
        id: p._id,
        title: p.title,
        slug: p.slug,
        tags: p.tags,
        isFeatured: p.isFeatured,
        createdAt: p.createdAt,
        author: p.userId,
      })),
    };

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: responseData,
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
    const posts = await getAllPosts(filter)
      .select("-__v")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name email avatar replies",
        },
      })
      .populate("userId", "name email avatar bio")
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
