import { Comments } from "@/features/comments/models/comment.model";
import { Reaction } from "@/features/reaction/models/reaction-model";
import { IPostModelResponse } from "@/types/posts";
import { Types } from "mongoose";
import { Post } from "../models/post.model";

export const createPost = async (data: Record<string, number | null>) => {
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

export const getAllPosts = (filter = {}) =>
  Post.find(filter)
    .populate("userId", "name email avatar")
    .populate("comments");

export const getPostsByUserId = (userId: string | Types.ObjectId) =>
  Post.find({ userId })
    .populate("comments")
    .populate("userId", "name email avatar");

export const updatePostById = (
  id: string | Types.ObjectId,
  data: Record<string, number | null>
) => Post.findByIdAndUpdate(id, data, { new: true });

export const deletePost = (id: string | Types.ObjectId) =>
  Post.findByIdAndDelete(id);

export const togglePostReaction = async (
  postId: string,
  userId: string
): Promise<{ liked: boolean; likesCount: number }> => {
  const existingLike = await Reaction.findOne({
    user: userId,
    post: postId,
    reactionType: "like",
  });

  if (existingLike) {
    // Unlike: Remove the like
    await Reaction.deleteOne({ _id: existingLike._id });
  } else {
    // Like: Create new like
    await Reaction.create({
      user: userId,
      post: postId,
      reactionType: "like",
    });
  }

  // Get updated like count
  const likesCount = await Reaction.countDocuments({
    post: postId,
    reactionType: "like",
  });

  // Sync to Post model for fast sorting/filtering
  await Post.findByIdAndUpdate(postId, { likesCount });

  return {
    liked: !existingLike,
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

  // 2. Get like count
  const likesCount = await Reaction.countDocuments({
    post: postId,
    reactionType: "like",
  });

  // 3. Is liked by user?
  let isLikedByUser = false;
  if (userId) {
    const userLike = await Reaction.findOne({
      user: userId,
      post: postId,
      reactionType: "like",
    });
    isLikedByUser = !!userLike;
  }

  // 4. Comments + replies
  const comments = await Comments.find({ postId })
    .populate("userId", "name email avatar")
    .populate("replies.userId", "name email avatar")
    .sort({ createdAt: -1 })
    .lean();

  const commentsWithLikes = await Promise.all(
    comments.map(async (comment) => {
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

      // Process replies to get their likes
      const repliesWithLikes = await Promise.all(
        (comment.replies || []).map(async (reply: unknown) => {
          const typedReply = reply as {
            _id: Types.ObjectId;
            [key: string]: unknown;
          };
          const replyLikes = await Reaction.countDocuments({
            reply: typedReply._id,
            reactionType: "like",
          });

          let isLikedByUserReply = false;
          if (userId) {
            const userReplyLike = await Reaction.findOne({
              user: userId,
              reply: typedReply._id,
              reactionType: "like",
            });
            isLikedByUserReply = !!userReplyLike;
          }

          return {
            ...typedReply,
            likesCount: replyLikes,
            isLikedByUser: isLikedByUserReply,
          } as {
            _id: Types.ObjectId;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            userId: { _id: Types.ObjectId; [key: string]: unknown };
            likesCount: number;
            isLikedByUser: boolean;
            [key: string]: unknown;
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

  // 6. Recommended posts
  const recommendedPosts = await Post.find({
    _id: { $ne: postId },
    $or: [{ tags: { $in: post.tags } }, { userId: post.userId }],
  })
    .select(
      "title slug tags isFeatured createdAt coverImage category shortDescription content"
    )
    .populate("userId", "name avatar")
    .limit(5)
    .sort({ createdAt: -1 })
    .lean();

  // 7. Increment views
  await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

  const formatAuthor = (author: unknown) => {
    if (!author) return null;
    const authorObj = author as { _id: Types.ObjectId; [key: string]: unknown };
    const { _id, ...rest } = authorObj;
    return { id: _id, ...rest };
  };

  // final structured response
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
    comments: commentsWithLikes.map((comment) => ({
      id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: formatAuthor(comment.userId),
      likes: {
        count: comment.likesCount,
        isLikedByUser: comment.isLikedByUser,
      },
      replies: comment.replies.map((reply) => ({
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
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("userId", "name avatar")
    .lean();
  const formatAuthor = (author: unknown) => {
    if (!author) return null;
    const authorObj = author as { _id: Types.ObjectId; [key: string]: unknown };
    const { _id, ...rest } = authorObj;
    return { id: _id, ...rest };
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

// get the featured post via the likes and the views criteria
export const getTopFeaturedPost = async () => {
  // 1. Get the "calculated" top post based on metrics
  const topPosts = await Post.find()
    .sort({ likesCount: -1, views: -1 })
    .limit(1);

  if (topPosts.length === 0) return { featuredPost: [] };

  const topPost = topPosts[0];

  // 2. If this post isn't already the featured one in DB, sync it
  if (!topPost.isFeatured) {
    // Reset all posts that might be featured
    await Post.updateMany({ isFeatured: true }, { isFeatured: false });
    // Mark the new leader as featured
    await Post.findByIdAndUpdate(topPost._id, { isFeatured: true });
  }

  // 3. Return the populated response
  const post = await Post.findById(topPost._id)
    .populate("userId", "name avatar")
    .lean();

  if (!post) return { featuredPost: [] };

  const formatAuthor = (author: unknown) => {
    if (!author) return null;
    const authorObj = author as { _id: Types.ObjectId; [key: string]: unknown };
    const { _id, ...rest } = authorObj;
    return { id: _id, ...rest };
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
