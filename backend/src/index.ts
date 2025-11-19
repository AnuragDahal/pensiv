<<<<<<< Updated upstream
import { connect } from "@/db/connect";
import authRouter from "@/routers/auth.routes";
import postRouter from "@/routers/posts.routes";
=======
import "module-alias/register";
import { connect } from "./shared/database";
import { authRoutes, postsRoutes, fetchAllPosts } from "./features";
import { gracefulShutdown } from "./shared/database/gracefulShutdown";
>>>>>>> Stashed changes
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { corsOptions } from "./config/cors";
<<<<<<< Updated upstream
import { asyncHandler } from "./helpers/handler";
=======
import { asyncHandler } from "./shared/utils";
import { isAuthenticated } from "./middlewares";
import { commentsRoutes } from "./features/comments";

// Types are loaded automatically by TypeScript - no need to import
>>>>>>> Stashed changes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.get(
  "/",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    res.send("Hello, World!");
  })
);

connect()
  .then(() => {
<<<<<<< Updated upstream
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
=======
    // public route to fetch all posts
    // This route should be accessible without authentication
    app.get("/api/posts", fetchAllPosts);

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
>>>>>>> Stashed changes
  })
  .catch((error: Error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
