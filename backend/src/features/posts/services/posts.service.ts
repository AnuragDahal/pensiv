// // import { Post } from "../models/post.model";
// // import { IPost } from "../../../types/user";
// // import { Types } from "mongoose";

// import { IPost } from "@/types/user";
// import { Post } from "../models/post.model";
// import { Types } from "mongoose";

// // export const getPosts = (filter: any = {}) => Post.find(filter);
// // export const getPostById = (id: string | Types.ObjectId) =>
// //   Post.findById(id).populate("comments");
// // export const getPostsByUserId = (userId: string | Types.ObjectId) =>
// //   Post.find({ userId }).populate("comments");
// // export const getAllPosts = () => Post.find().populate("comments");
// // export const createPost = async (post: IPost) => {
// //   const newPost = new Post(post);
// //   await newPost.save({ validateBeforeSave: false });
// //   return newPost;
// // };
// // export const deletePostById = (id: string | Types.ObjectId) =>
// //   Post.findByIdAndDelete(id);
// // export const updatePostById = (
// //   id: string | Types.ObjectId,
// //   post: Partial<IPost>
// // ) => Post.findByIdAndUpdate(id, post);

// export const getPosts = (filter = {}) =>
//   Post.find(filter).populate("userId", "name avatar");

// export const getPostById = (id: string | Types.ObjectId) =>
//   Post.findById(id)
//     .populate("userId", "name avatar")
//     .populate({
//       path: "comments",
//       populate: { path: "userId", select: "name avatar" },
//     });

// export const createPost = async (post: IPost) => {
//   const newPost = new Post(post);
//   await newPost.save();
//   return newPost;
// };

// export const updatePostById = (
//   id: string | Types.ObjectId,
//   post: Partial<IPost>
// ) => Post.findByIdAndUpdate(id, post, { new: true });

// export const deletePostById = (id: string | Types.ObjectId) =>
//   Post.findByIdAndDelete(id);
import { Reaction } from "@/features/reaction/models/reaction-model";
import { Post } from "../models/post.model";
import { Types } from "mongoose";

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
