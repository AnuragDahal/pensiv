import "module-alias/register";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Post } from "../src/features/posts/models/post.model";

dotenv.config();

async function migratePostStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    // Find all posts without a status field or with null/undefined status
    const result = await Post.updateMany(
      {
        $or: [
          { status: { $exists: false } },
          { status: null },
          { status: undefined },
        ],
      },
      {
        $set: { status: "published" },
      }
    );

    console.log(`Migration complete: ${result.modifiedCount} posts updated to "published" status`);

    // Count posts by status for verification
    const draftCount = await Post.countDocuments({ status: "draft" });
    const publishedCount = await Post.countDocuments({ status: "published" });

    console.log(`\nCurrent status distribution:`);
    console.log(`- Draft: ${draftCount}`);
    console.log(`- Published: ${publishedCount}`);
    console.log(`- Total: ${draftCount + publishedCount}`);

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migratePostStatus();
