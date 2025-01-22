import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "@/db/connect";
import authRouter from "@/routers/auth.routes";
import postRouter from "@/routers/posts.routes";
import { env } from "@/env";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:3000", `${env.FRONTEND_URL}`], // This is the frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use ("/api/posts", postRouter);

app.get("/", (req, res) => {
  res.send({ message: "Welcome!" });
});

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
