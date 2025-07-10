import { zodValidator } from "../../../middlewares/zod";
import { Router } from "express";
import {
  addNewPost,
  fetchAllPosts,
  getAllPostByUserId,
  getAllPostsOfAuthenticatedUser,
  getSinglePost,
  updatePost,
  updatePostLikes,
} from "../controllers/posts.controller";
import { postSchema, queryParams } from "../schemas/posts.schemas";

const router = Router();

router.get("/", zodValidator(queryParams), fetchAllPosts);
router.get("/:id", getSinglePost);
router.put("/:id", zodValidator(postSchema), updatePost);
router.post("/", zodValidator(postSchema), addNewPost);
router.get("/", getAllPostsOfAuthenticatedUser);
router.get("/:userId", getAllPostByUserId);
router.patch("/:id/like", updatePostLikes);

// public route to fetch all posts
// This route should be accessible without authentication
router.get("/posts", fetchAllPosts);

export default router;
