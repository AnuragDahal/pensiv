import { generateEmbedding, generateChatResponse } from "../lib/gemini";
import { Post } from "../../posts/models/post.model";

// Calculate cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const getRelevantPosts = async (query: string, limit = 3) => {
  const queryEmbedding = await generateEmbedding(query);
  if (!queryEmbedding.length) return [];

  // Fetch all posts with embeddings
  // Note: For large datasets, use a vector DB. For small blog, this works.
  const posts = await Post.find({
      status: 'published'
  }).select('+embeddings title shortDescription slug');

  // Filter posts that actually have embeddings (in case schema change didn't catch all)
  const postsWithEmbeddings = posts.filter(p => p.embeddings && p.embeddings.length > 0);

  const scoredPosts = postsWithEmbeddings.map(post => {
    const similarity = cosineSimilarity(queryEmbedding, post.embeddings || []);
    return {
      post,
      score: similarity
    };
  });

  // Sort by similarity desc
  scoredPosts.sort((a, b) => b.score - a.score);

  return scoredPosts.slice(0, limit).map(item => item.post);
};

export const chatWithBlog = async (query: string) => {
  // 1. Get relevant posts
  const relevantPosts = await getRelevantPosts(query);

  // 2. Prepare context
  let context = "";
  if (relevantPosts.length > 0) {
    context = "Here are some relevant articles from the blog:\n\n";
    relevantPosts.forEach((post, index) => {
      context += `${index + 1}. Title: ${post.title}\n`;
      context += `   Description: ${post.shortDescription}\n`;
      context += `   Link: /article/${post.slug}\n\n`;
    });
  } else {
    context = "No specific articles found directly relevant to this query in the blog database.\n";
  }

  // 3. Construct System Prompt
  const systemPrompt = `You are a helpful AI assistant for a technical blog application called Pensiv.
  Your primary role is to help users find content within the blog and answer questions based on the provided articles.
  
  CONTEXT (Relevant Articles Found):
  ${context}
  
  INSTRUCTIONS:
  - If the user asks about a specific topic available in the CONTEXT, summarize it and provide the link.
  - If the user asks for recommendations, suggest the relevant articles from CONTEXT.
  - If the user's query is unrelated to the blog content, you can answer broadly but steer them back to the blog's topics.
  - Always be polite and concise.
  - Format your response in Markdown.
  `;

  // 4. Generate Response
  const response = await generateChatResponse(query, systemPrompt);
  
  return {
    response,
    relatedArticles: relevantPosts.map(p => ({
      title: p.title,
      slug: p.slug,
      description: p.shortDescription
    }))
  };
};
