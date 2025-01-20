import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  comments: {
    type: Array,
    ref: "Comment",
    default: [],
  },
  postImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
});

export const Post = mongoose.model("Post", postSchema);