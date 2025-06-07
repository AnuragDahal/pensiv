import mongoose, { Types } from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    ref: "Comment",
  },
  postImage: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: false,
  },
});

export const Post = mongoose.model("Post", postSchema);
