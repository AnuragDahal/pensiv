import { zodValidator } from "@/middlewares";
import { Router } from "express";
import { addNewPost, getSinglePost } from "../controllers/posts.controller";
import { postSchema } from "../schemas/posts.schemas";

const router = Router();

router.get("/:id", getSinglePost);
router.post("/", zodValidator(postSchema), addNewPost);

export default router;
