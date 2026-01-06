import { zodValidator } from "../../../middlewares/zod";
import { Router } from "express";
import {
  addNewPost,
  fetchAllPosts,
  getAllPostByUserId,
  getAllPostsOfAuthenticatedUser,
  getSinglePost,
  getPostForEdit,
  getUserPostBySlug,
  removePost,
  updatePost,
  updatePostReaction,
} from "../controllers/posts.controller";
import { postSchema, queryParams } from "../schemas/posts.schemas";

const router = Router();

// Note: GET / (fetchAllPosts) is defined as PUBLIC in index.ts
// All routes here require authentication via the isAuthenticated middleware applied in index.ts

router.get("/me", getAllPostsOfAuthenticatedUser);
router.get("/edit/:id", getPostForEdit);
router.get("/:id", getSinglePost);
router.put("/:id", zodValidator(postSchema), updatePost);
router.delete("/:id", removePost);
router.post("/", zodValidator(postSchema), addNewPost);
router.get("/author/:userId", getAllPostByUserId);
router.patch("/:id/like", updatePostReaction);
router.get("/slug/:slug", getUserPostBySlug);

export default router;
