import "module-alias/register";
import { connect } from "./shared/database";
import { authRoutes, postsRoutes, commentsRoutes } from "./features";
import { gracefulShutdown } from "./shared/database/gracefulShutdown";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { corsOptions } from "./config/cors";
import { asyncHandler } from "./shared/utils";
import { isAuthenticated } from "./middlewares";

// Types are loaded automatically by TypeScript - no need to import

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection before mounting routes
connect()
  .then(() => {
    // Mount routes only after DB connection
    app.use("/api/auth", authRoutes);
    app.use("/api/posts", isAuthenticated, postsRoutes);
    app.use("/api/comments", isAuthenticated, commentsRoutes);

    app.get(
      "/",
      asyncHandler(async (_req: Request, res: Response): Promise<void> => {
        res.send("Hello, World!");
      })
    );
  })
  .catch((error: Error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Graceful shutdown for serverless (Vercel, etc.)
if (process.env.VERCEL || process.env.SERVERLESS) {
  ["SIGINT", "SIGTERM", "SIGUSR2"].forEach((signal) => {
    process.on(signal, async () => {
      await gracefulShutdown(signal);
      process.exit(0);
    });
  });
}
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

export default app;
