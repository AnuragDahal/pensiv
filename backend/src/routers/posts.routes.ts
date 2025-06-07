import { addNewPost, getSinglePost } from "@/controllers/posts.controller";
import { isAuthenticated } from "@/middlewares/authentication";
import { zodValidator } from "@/middlewares/zod";
import { createArticleSchema } from "@/schemas/postSchema";
import { Router } from "express";

const router = Router();

router.get("/:id", isAuthenticated, getSinglePost);
router.post(
  "/",
  isAuthenticated,
  zodValidator(createArticleSchema),
  addNewPost
);

export default router;
