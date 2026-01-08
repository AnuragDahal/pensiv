import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    if (!text) return [];
    
    // Clean text to avoid issues with empty or malformed inputs
    const cleanText = text.replace(/\n/g, " ").trim();
    if (!cleanText) return [];

    const result = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: [
        {
          role: "user",
          parts: [{ text: cleanText }],
        },
      ],
    });

    // Handle potential response structure variations
    if (result && result.embeddings && result.embeddings.length > 0) {
      return result.embeddings[0].values || [];
    }
    
    return [];
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Return empty array to allow process to continue without crashing
    return [];
  }
};

export const generateChatResponse = async (
  prompt: string, 
  systemInstruction?: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use a newer model for better performance/cost
      config: {
        systemInstruction: systemInstruction,
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    if (response && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text || "";
      }
    }
    
    return "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};

