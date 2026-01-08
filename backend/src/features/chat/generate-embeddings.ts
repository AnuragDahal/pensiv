import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Ensure env vars are loaded FIRST
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Import after env is loaded
import { connect } from "../../shared/database";
import { Post } from "../posts/models/post.model";
import { generateEmbedding } from "./lib/gemini";

async function generateEmbeddingsForAllPosts() {
  try {
    await connect();
    console.log("Connected to database.");

    const posts = await Post.find({ status: "published" }).select('+embeddings title shortDescription content');

    console.log(`Found ${posts.length} published posts. Checking for missing embeddings...`);

    let generated = 0;
    let skipped = 0;
    let failed = 0;

    for (const post of posts) {
      if (post.embeddings && post.embeddings.length > 0) {
        console.log(`[SKIP] "${post.title}" already has embeddings`);
        skipped++;
        continue;
      }

      console.log(`[GENERATING] "${post.title}"...`);

      try {
        // Generate embedding directly
        const textToEmbed = `Title: ${post.title}\nDescription: ${post.shortDescription || ""}\nContent: ${(post.content || "").substring(0, 8000)}`;
        const embedding = await generateEmbedding(textToEmbed);

        if (embedding && embedding.length > 0) {
          // Update directly to avoid triggering pre-save hook again
          await Post.updateOne(
            { _id: post._id },
            { $set: { embeddings: embedding } }
          );
          console.log(`[SUCCESS] Generated embedding for "${post.title}" (${embedding.length} dimensions)`);
          generated++;
        } else {
          console.log(`[FAILED] No embedding returned for "${post.title}"`);
          failed++;
        }

        // Rate limit protection (Gemini free tier)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`[ERROR] Failed to generate embedding for "${post.title}":`, error);
        failed++;
        // Continue with next post
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log("\n--- Summary ---");
    console.log(`Generated: ${generated}`);
    console.log(`Skipped (already had embeddings): ${skipped}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${posts.length}`);
  } catch (error) {
    console.error("Error in generateEmbeddings:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

generateEmbeddingsForAllPosts();
