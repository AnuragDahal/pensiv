import { addNewPost, getSinglePost } from "../controllers/posts.controller";
import { isAuthenticated, zodValidator } from "@/shared/middlewares";
import { postSchema } from "../schemas/posts.schemas";
import { Router } from "express";

const router = Router();

router.get("/:id", isAuthenticated, getSinglePost);
router.post("/", isAuthenticated, zodValidator(postSchema), addNewPost);

export default router;
