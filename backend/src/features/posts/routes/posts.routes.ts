import { zodValidator } from "../../../middlewares/zod";
import { Router } from "express";
import {
  addNewPost,
  fetchAllPosts,
  getAllPostByUserId,
  getAllPostsOfAuthenticatedUser,
  getSinglePost,
  updatePost,
  updatePostReaction,
} from "../controllers/posts.controller";
import { postSchema, queryParams } from "../schemas/posts.schemas";

const router = Router();

router.get("/", zodValidator(queryParams), fetchAllPosts);
router.get("/:id", getSinglePost);
router.put("/:id", zodValidator(postSchema), updatePost);
router.post("/", zodValidator(postSchema), addNewPost);
router.get("/", getAllPostsOfAuthenticatedUser);
router.get("/:userId", getAllPostByUserId);
router.patch("/:id/like", updatePostReaction);


export default router;
