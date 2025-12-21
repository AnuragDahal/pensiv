import mongoose from "mongoose";
import { marked } from "marked";
import striptags from "striptags";
import { IPostModel } from "@/types/posts";

const postSchema = new mongoose.Schema<IPostModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    shortDescription: { type: String },
    slug: { type: String, unique: true },
    category: { type: String },
    coverImage: { type: String }, // newly added field
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
// generate a short description from the content

postSchema.pre("save", async function (next) {
  //create shortDescription if missing
  if (!this.shortDescription) {
    const md = this.content || "";

    // Convert markdown -> HTML
    const html = await marked.parse(md);

    // Remove HTML tags => pure text
    const cleanText = striptags(html);

    // Create safe short description
    this.shortDescription = cleanText.substring(0, 150).trim() + "...";
  }

  next();
});
// generate unique slug from title even if the title is same
postSchema.pre("save", async function (next) {
  if (!this.slug) {
    this.slug = this.title.replace(/\s/g, "-").toLowerCase();
    const existingPost = await Post.findOne({ slug: this.slug });
    if (existingPost) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }
  next();
});

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

// index for the slug
postSchema.index({ slug: 1 });

export const Post = mongoose.model("Post", postSchema);
