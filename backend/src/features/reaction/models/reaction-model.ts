import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  reactionType: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Ensure one reaction per user per post (only for post reactions)
reactionSchema.index(
  { user: 1, post: 1 },
  {
    unique: true,
    partialFilterExpression: {
      post: { $exists: true, $type: "objectId" },
    },
  }
);

// Ensure one reaction per user per comment (only for comment reactions)
reactionSchema.index(
  { user: 1, comment: 1 },
  {
    unique: true,
    partialFilterExpression: {
      comment: { $exists: true, $type: "objectId" },
    },
  }
);

// Performance: Count likes/dislikes on posts
reactionSchema.index({ post: 1, reactionType: 1 });

// Performance: Count likes/dislikes on comments
reactionSchema.index({ comment: 1, reactionType: 1 });

// Performance: Get all user reactions
reactionSchema.index({ user: 1 });

// Validate: Either post or comment must be present (not both)
reactionSchema.pre("save", function (next) {
  const hasPost = this.post != null;
  const hasComment = this.comment != null;

  if (hasPost === hasComment) {
    return next(
      new Error(
        "Reaction must have either post or comment, not both or neither"
      )
    );
  }

  next();
});

export const Reaction = mongoose.model("Reaction", reactionSchema);
