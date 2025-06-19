import { zodValidator }  from "../../../middlewares/zod";
import { Router } from "express";
import {
  addNewPost,
  fetchAllPosts,
  getAllPostByUserId,
  getAllPostsOfAuthenticatedUser,
  getSinglePost,
} from "../controllers/posts.controller";
import { postSchema, queryParams } from "../schemas/posts.schemas";

const router = Router();

router.get("/", zodValidator(queryParams), fetchAllPosts);
router.get("/:id", getSinglePost);
router.post("/", zodValidator(postSchema), addNewPost);
router.get("/", getAllPostsOfAuthenticatedUser);
router.get("/:userId", getAllPostByUserId);

export default router;
