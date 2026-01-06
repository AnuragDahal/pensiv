/// <reference path="./types/express.d.ts" />
import { connect } from "./shared/database";
import {
  authRoutes,
  postsRoutes,
  fetchAllPosts,
  getHomePosts,
  getUserPostBySlug,
} from "./features";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { corsOptions } from "./config/cors";
import { asyncHandler } from "./shared/utils";
import { isAuthenticated, optionalAuth } from "./middlewares";
import { commentsRoutes } from "./features/comments";

// Note: dotenv.config() is called in config/env.ts - no need to call again

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Database connection middleware - ensures connection before each request
app.use(async (req: Request, res: Response, next) => {
  try {
    await connect();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// Routes - must be defined synchronously for Vercel
app.get("/", asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  res.send("Hello, World!");
}));

// Public routes (no authentication required)
app.get("/api/posts", fetchAllPosts); // Public search/list
app.get("/api/posts/home", getHomePosts); // Public home posts
app.get("/api/posts/slug/:slug", optionalAuth, getUserPostBySlug); // Public post view (optional auth for likes)

// Auth routes (handles its own authentication internally)
app.use("/api/auth", authRoutes);

// Protected routes (authentication required)
app.use("/api/posts", isAuthenticated, postsRoutes); // All other post operations
app.use("/api/comments", isAuthenticated, commentsRoutes);

// Only start server if not in serverless environment (for local development)
if (!process.env.VERCEL && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
