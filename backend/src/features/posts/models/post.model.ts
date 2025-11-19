import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true }, // markdown raw text
    htmlContent: { type: String }, // store rendered HTML (optional but HIGHLY recommended)

    tags: [{ type: String }],

    // counts only (for speed)
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },

    // auto-featured or manually featured
    isFeatured: { type: Boolean, default: false },

    // for recommendation algorithm
    views: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v; // Exclude version key
      },
    },
  }
);
// Virtual for comments
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  options: { sort: { createdAt: -1 } }, // Sort comments by newest first
});

// Virtual for comment count
postSchema.virtual("commentsCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  count: true, // Just return the count
});

export const Post = mongoose.model("Post", postSchema);
