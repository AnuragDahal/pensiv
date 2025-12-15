import { Reaction } from "@/features/reaction/models/reaction-model";
import { Post } from "../models/post.model";
import { Types } from "mongoose";
import { Comments } from "@/features/comments/models/comment.model";

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

export const getAllPosts = (filter = {}) =>
  Post.find(filter)
    .populate("userId", "name email avatar")
    .populate("comments");

export const getPostsByUserId = (userId: string | Types.ObjectId) =>
  Post.find({ userId })
    .populate("comments")
    .populate("userId", "name email avatar");

export const updatePostById = (id: string | Types.ObjectId, data: any) =>
  Post.findByIdAndUpdate(id, data, { new: true });

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
  const post = (await getPostById(postId)
    .select("-__v")
    .populate("userId", "name email avatar bio")
    .lean()) as any;

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

  const formatAuthor = (author: any) => {
    if (!author) return null;
    const { _id, ...rest } = author;
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
    recommended: recommendedPosts.map((p: any) => ({
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
