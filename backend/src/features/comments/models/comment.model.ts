import mongoose, { Schema, Types } from "mongoose";

const replySchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const commentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    postId: { type: Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    replies: [replySchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Comments = mongoose.model("Comment", commentSchema);
