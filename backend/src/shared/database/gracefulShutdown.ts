import mongoose from "mongoose";

/**
 * Gracefully closes the MongoDB connection.
 * Suitable for serverless environments (like Vercel) where the process may be frozen or killed.
 */
export const gracefulShutdown = async (signal: string) => {
  try {
    await mongoose.connection.close();
    console.log(`MongoDB connection closed due to ${signal}`);
  } catch (err) {
    console.error("Error during MongoDB graceful shutdown:", err);
  }
};
