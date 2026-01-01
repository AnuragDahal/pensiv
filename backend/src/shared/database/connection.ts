import mongoose from "mongoose";
import { env } from "../../config/env";

let isConnected = false;

export const connect = async () => {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    // Mongoose maintains its own connection pool and reuses connections
    const connection = await mongoose.connect(env.MONGO_URI, {
      bufferCommands: false, // Disable buffering for serverless
    });

    isConnected = true;
    const host = connection.connection.host;
    console.log(`Connected to MongoDB at host: ${host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    isConnected = false;

    // Don't exit in serverless environments, throw error instead
    if (process.env.VERCEL || process.env.LAMBDA_TASK_ROOT) {
      throw error;
    } else {
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});
