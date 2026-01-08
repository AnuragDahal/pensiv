import mongoose from "mongoose";
import { marked } from "marked";
import striptags from "striptags";
import { IPostModel } from "src/types/posts";

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
    coverImage: { type: String },
    content: { type: String, required: true },
    htmlContent: { type: String },
    tags: [{ type: String }],
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    embeddings: { type: [Number], select: false },

    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (__doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
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

// Text index for search functionality
postSchema.index(
  {
    title: "text",
    shortDescription: "text",
    content: "text",
    tags: "text",
    category: "text",
  },
  {
    // higher weights for more important fields
    weights: {
      title: 10,
      tags: 8,
      category: 6,
      shortDescription: 4,
      content: 1,
    },
    name: "ArticleSearchIndex",
  }
);

// Note: slug index is already created by unique: true on the slug field

// Generate embeddings for semantic search
postSchema.pre("save", async function (next) {
  // Only generate if title/content/desc changed or embeddings is missing
  if (
    this.isModified("title") ||
    this.isModified("content") ||
    this.isModified("shortDescription") ||
    !this.embeddings ||
    this.embeddings.length === 0
  ) {
    try {
      // Import dynamically to avoid circular dependency issues if any, though here it might be safe statically
      // but let's be safe. Wait, dynamic import in hook might be cleaner.
      // Actually static import is fine if structure allows.
      // Let's use dynamic import to be safe against initialization order
      const { generateEmbedding } = await import("../../chat/lib/gemini");
      
      const textToEmbed = `Title: ${this.title}\nDescription: ${this.shortDescription || ""}\nContent: ${extractText(this.content)}`;
      const embedding = await generateEmbedding(textToEmbed);
      
      if (embedding && embedding.length > 0) {
        this.embeddings = embedding;
      }
    } catch (error) {
      console.error("Failed to generate embedding for post:", this.title, error);
      // Don't block save on embedding failure
    }
  }
  next();
});

// Helper to extract text from markdown/html (simplified)
function extractText(content: string): string {
  if (!content) return "";
  // Check if content looks like HTML
  if (content.includes("<") && content.includes(">")) {
      return striptags(content);
  }
  // If markdown, marked.parse is async, so we might need to rely on the fact that 
  // we already strip tags in the shortDescription hook. 
  // Let's just use the raw content for now as embeddings handles it reasonably well, 
  // or use striptags(content) if it's already html. 
  // Since 'content' field in schema is markdown usually, and 'htmlContent' is generated.
  // Let's use clean text if possible.
  return content.substring(0, 8000); // Limit context window
}


export const Post = mongoose.model("Post", postSchema);
