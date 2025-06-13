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
  shortDescription: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: Types.ObjectId,
      ref: "Comment",
    },
  ],
  postImage: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: false,
  },
});

export const Post = mongoose.model("Post", postSchema);
