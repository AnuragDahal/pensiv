import { connect } from "@/shared/database";
import { authRoutes, postsRoutes, commentsRoutes } from "@/features";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { corsOptions } from "./config/cors";
import { asyncHandler } from "@/shared/utils";
import { isAuthenticated } from "./middlewares";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts",isAuthenticated, postsRoutes);
app.use("/api/comments",isAuthenticated, commentsRoutes);

app.get(
  "/",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    res.send("Hello, World!");
  })
);

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
