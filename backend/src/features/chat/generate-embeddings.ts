import { connect } from "src/shared/database";
import mongoose from "mongoose";
import { Post } from "src/features/posts/models/post.model";
import dotenv from "dotenv";
import path from "path";

// Ensure env vars are loaded
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

async function generateEmbeddings() {
  try {
    await connect();
    console.log("Connected to database.");

    // Function to check if we can run
    const posts = await Post.find({
        status: "published" // Focus on published posts primarily
    });
    
    console.log(`Found ${posts.length} published posts. Checking for missing embeddings...`);
    
    let count = 0;
    for (const post of posts) {
      const postWithEmb = await Post.findById(post._id).select('+embeddings');
      
      if (!postWithEmb) continue;

      if (!postWithEmb.embeddings || postWithEmb.embeddings.length === 0) {
        console.log(`Generating embedding for: ${post.title}`);
        
        await postWithEmb.save();
        count++;
        
        // Rate limit protection
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`Processed ${count} posts.`);
  } catch (error) {
    console.error("Error generating embeddings:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

generateEmbeddings();
