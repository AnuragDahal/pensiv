import { Comments } from "@/features/comments/models/comment.model";
import { Reaction } from "@/features/reaction/models/reaction-model";
import User from "@/features/auth/models/user.model";
import { IPostModelResponse } from "@/types/posts";
import { Types } from "mongoose";
import { Post } from "../models/post.model";

export const createPost = async (data: any) => {
  const post = await Post.create(data);
  return post;
};

export const getPostById = (id: string | Types.ObjectId) =>
  Post.findById(id)
    .populate({
      path: "comments",
      populate: [
        { path: "userId", select: "name email avatar" },
        {
          path: "replies",
          populate: { path: "userId", select: "name email avatar" },
        },
      ],
    })
    .populate("userId", "name email avatar");
export const getPostByIdForEdit = (id: string | Types.ObjectId) =>
  Post.findById(id);


export const getAllPosts = (filter = {}) =>
  Post.find(filter)
    .populate("userId", "name email avatar")
    .populate("comments");

/**
 * Enhanced search and filtering service.
 * Decisions on "WHERE to search" and "HOW to filter" are handled here.
 */
export const getFilteredArticles = async (query: {
  q?: string;
  category?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  userId?: string;
}) => {
  const {
    q,
    category,
    page = "1",
    limit = "10",
    sortBy,
    sortOrder = "desc",
    userId,
  } = query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // 1. Build Base Filter
  const mongoQuery: any = {};
  const filters: any[] = [];

  // Filter to show only published posts (exclude drafts from public endpoints)
  filters.push({ status: "published" });

  // 2. Handle Category Filter (when explicitly filtering by category)
  if (category && category !== "all") {
    filters.push({ category: { $regex: new RegExp(`^${category}$`, "i") } });
  }

  // Handle UserId Filter
  if (userId) {
    filters.push({ userId: Types.ObjectId.createFromHexString(userId) });
  }

  // 3. Handle Universal Search (q) - search across Title, Content, Tags, Category, and Author Name
  if (q) {
    // Find users matching search term for author search
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    }).select("_id");
    const matchedAuthorIds = users.map((u) => u._id);

    // Search across Title, Content, Tags, Category, and Author Name
    filters.push({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { userId: { $in: matchedAuthorIds } },
      ],
    });
  }

  // 4. Combine filters using $and if multiple conditions exist
  if (filters.length > 0) {
    mongoQuery.$and = filters;
  }

  // 5. Sorting logic
  const sort: any = {};
  const order = sortOrder === "asc" ? 1 : -1;
  if (sortBy) {
    sort[sortBy] = order;
  } else {
    // Default: prioritize isFeatured, then newest
    sort.isFeatured = -1;
    sort.createdAt = -1;
  }

  // 6. Execution
  const [posts, totalPosts] = await Promise.all([
    Post.find(mongoQuery)
      .populate("userId", "name avatar")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Post.countDocuments(mongoQuery),
  ]);

  const totalPages = Math.ceil(totalPosts / limitNum);

  const formatAuthor = (author: any) => {
    if (!author) return null;
    // If it's just an ID (not populated)
    if (typeof author === "string" || author instanceof Types.ObjectId) {
      return { id: author.toString(), name: "Anonymous", avatar: "" };
    }
    const { _id, id, ...rest } = author;
    return { id: (_id || id || "").toString(), ...rest };
  };

  return {
    posts: posts.map((post: any) => ({
      id: post._id,
      title: post.title,
      slug: post.slug,
      tags: post.tags,
      coverImage: post.coverImage,
      isFeatured: post.isFeatured,
      createdAt: post.createdAt,
      author: formatAuthor(post.userId),
      category: post.category,
      shortDescription: post.shortDescription,
      content: post.content,
    })),
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalPosts,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

export const getPostsByUserId = (userId: string | Types.ObjectId) =>
  Post.find({ userId })
    .populate("comments")
    .populate("userId", "name email avatar");


export const updatePostById = (
  id: string | Types.ObjectId,
  data: any
) => Post.findByIdAndUpdate(id, data, { new: true });

export const deletePost = (id: string | Types.ObjectId) =>
  Post.findByIdAndDelete(id);

export const togglePostReaction = async (
  postId: string,
  userId: string
): Promise<{ liked: boolean; likesCount: number }> => {
  // Use atomic findOneAndDelete to prevent race conditions
  const deletedLike = await Reaction.findOneAndDelete({
    user: userId,
    post: postId,
    reactionType: "like",
  });

  let liked = false;

  if (!deletedLike) {
    // Like didn't exist, so create it
    // Use try-catch to handle race condition where another request creates it first
    try {
      await Reaction.create({
        user: userId,
        post: postId,
        reactionType: "like",
      });
      liked = true;
    } catch (error: any) {
      // If duplicate key error (E11000), it means another request created it first
      // In this case, treat it as a successful like
      if (error.code === 11000) {
        liked = true;
      } else {
        throw error;
      }
    }
  }

  const likesCount = await Reaction.countDocuments({
    post: postId,
    reactionType: "like",
  });

  await Post.findByIdAndUpdate(postId, { likesCount });

  return {
    liked,
    likesCount,
  };
};

export const getPostBySlug = (slug: string) => Post.findOne({ slug });

export const buildFullPostResponse = async (
  postId: string,
  userId?: string
) => {
  const post = await getPostById(postId)
    .select("-__v")
    .populate("userId", "name email avatar bio")
    .lean();

  if (!post) return null;

  const likesCount = await Reaction.countDocuments({
    post: postId,
    reactionType: "like",
  });

  let isLikedByUser = false;
  if (userId) {
    const userLike = await Reaction.findOne({
      user: userId,
      post: postId,
      reactionType: "like",
    });
    isLikedByUser = !!userLike;
  }

  const comments = await Comments.find({ postId })
    .populate("userId", "name email avatar")
    .populate("replies.userId", "name email avatar")
    .sort({ createdAt: -1 })
    .lean();

  const commentsWithLikes = await Promise.all(
    comments.map(async (comment: any) => {
      const commentLikes = await Reaction.countDocuments({
        comment: comment._id,
        reactionType: "like",
      });

      let isLikedByUserComment = false;
      if (userId) {
        const userLike = await Reaction.findOne({
          user: userId,
          comment: comment._id,
          reactionType: "like",
        });
        isLikedByUserComment = !!userLike;
      }

      const repliesWithLikes = await Promise.all(
        (comment.replies || []).map(async (reply: any) => {
          const replyLikes = await Reaction.countDocuments({
            reply: reply._id,
            reactionType: "like",
          });

          let isLikedByUserReply = false;
          if (userId) {
            const userReplyLike = await Reaction.findOne({
              user: userId,
              reply: reply._id,
              reactionType: "like",
            });
            isLikedByUserReply = !!userReplyLike;
          }

          return {
            ...reply,
            likesCount: replyLikes,
            isLikedByUser: isLikedByUserReply,
          };
        })
      );

      return {
        ...comment,
        likesCount: commentLikes,
        isLikedByUser: isLikedByUserComment,
        replies: repliesWithLikes,
      };
    })
  );

  const recommendedPosts = await Post.find({
    _id: { $ne: postId },
    status: "published",
    $or: [{ tags: { $in: post.tags } }, { userId: post.userId }],
  })
    .select(
      "title slug tags isFeatured createdAt coverImage category shortDescription content"
    )
    .populate("userId", "name avatar")
    .limit(5)
    .sort({ createdAt: -1 })
    .lean();

  await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

  const formatAuthor = (author: any) => {
    if (!author) return null;
    // If it's just an ID (not populated)
    if (typeof author === "string" || author instanceof Types.ObjectId) {
      return { id: author.toString(), name: "Anonymous", avatar: "" };
    }
    const { _id, id, ...rest } = author;
    return { id: (_id || id || "").toString(), ...rest };
  };

  return {
    post: {
      id: post._id,
      title: post.title,
      slug: post.slug,
      shortDescription: post.shortDescription,
      coverImage: post.coverImage,
      content: post.content,
      htmlContent: post.htmlContent,
      tags: post.tags,
      isFeatured: post.isFeatured,
      views: (post.views ?? 0) + 1,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: formatAuthor(post.userId),
    },
    likes: {
      count: likesCount,
      isLikedByUser,
    },
    comments: commentsWithLikes.map((comment: any) => ({
      id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: formatAuthor(comment.userId),
      likes: {
        count: comment.likesCount,
        isLikedByUser: comment.isLikedByUser,
      },
      replies: comment.replies.map((reply: any) => ({
        id: reply._id,
        content: reply.content,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        likes: {
          count: reply.likesCount,
          isLikedByUser: reply.isLikedByUser,
        },
        author: formatAuthor(reply.userId),
      })),
    })),
    recommended: recommendedPosts.map((p: IPostModelResponse) => ({
      id: p._id,
      title: p.title,
      slug: p.slug,
      tags: p.tags,
      coverImage: p.coverImage,
      isFeatured: p.isFeatured,
      createdAt: p.createdAt,
      author: formatAuthor(p.userId),
      category: p.category,
      shortDescription: p.shortDescription,
      content: p.content,
    })),
  };
};

export const getRecentPosts = async (limit: number) => {
  const posts = await Post.find({ status: "published" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("userId", "name avatar")
    .lean();
  
  const formatAuthor = (author: any) => {
    if (!author) return null;
    // If it's just an ID (not populated)
    if (typeof author === "string" || author instanceof Types.ObjectId) {
      return { id: author.toString(), name: "Anonymous", avatar: "" };
    }
    const { _id, id, ...rest } = author;
    return { id: (_id || id || "").toString(), ...rest };
  };

  return {
    recentPosts: posts.map((post: IPostModelResponse) => ({
      id: post._id,
      title: post.title,
      slug: post.slug,
      tags: post.tags,
      coverImage: post.coverImage,
      isFeatured: post.isFeatured,
      createdAt: post.createdAt,
      author: formatAuthor(post.userId),
      category: post.category,
      shortDescription: post.shortDescription,
      content: post.content,
    })),
  };
};

export const getTopFeaturedPost = async () => {
  const topPosts = await Post.find({ status: "published" })
    .sort({ likesCount: -1, views: -1 })
    .limit(1);

  if (topPosts.length === 0) return { featuredPost: [] };

  const topPost = topPosts[0];

  if (!topPost.isFeatured) {
    await Post.updateMany({ isFeatured: true }, { isFeatured: false });
    await Post.findByIdAndUpdate(topPost._id, { isFeatured: true });
  }

  const post = await Post.findById(topPost._id)
    .populate("userId", "name avatar")
    .lean();

  if (!post) return { featuredPost: [] };

  const formatAuthor = (author: any) => {
    if (!author) return null;
    // If it's just an ID (not populated)
    if (typeof author === "string" || author instanceof Types.ObjectId) {
      return { id: author.toString(), name: "Anonymous", avatar: "" };
    }
    const { _id, id, ...rest } = author;
    return { id: (_id || id || "").toString(), ...rest };
  };

  return {
    featuredPost: [
      {
        id: post._id,
        title: post.title,
        slug: post.slug,
        tags: post.tags,
        coverImage: post.coverImage,
        isFeatured: true,
        createdAt: post.createdAt,
        author: formatAuthor(post.userId),
        category: post.category,
        shortDescription: post.shortDescription,
        content: post.content,
      },
    ],
  };
};
