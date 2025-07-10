import mongoose, { Types } from "mongoose";

const postSchema = new mongoose.Schema(
  {
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
    coverImage: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    likes: {
      type: Number,
      required: false,
      default: 0,
    },
    likedBy: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v; // Exclude version key
      },
    },
  }
);

export const Post = mongoose.model("Post", postSchema);
