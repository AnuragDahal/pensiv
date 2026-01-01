import mongoose, { Mongoose } from "mongoose";
import { env } from "../../config/env";

// Declare global type for mongoose caching
declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

// Initialize cached connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connect = async () => {
  const MONGODB_URI = env.MONGO_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable"
    );
  }

  // Return cached connection if it exists
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  // If no cached promise exists, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering for serverless

      // Timeout configurations for serverless environment
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000, // Timeout initial connection after 10s

      // Connection pool settings optimized for serverless
      maxPoolSize: 10, // Limit connection pool size
      minPoolSize: 1, // Maintain at least 1 connection
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`Connected to MongoDB at host: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error so next invocation can retry
    cached.promise = null;
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }

  return cached.conn;
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
