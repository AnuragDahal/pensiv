import {
  getAllComments,
  getSingleComment,
  addNewComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller";
import { isAuthenticated, zodValidator } from "@/middlewares";
import { commentSchema } from "../schemas/comments.schemas";
import { Router } from "express";

const router = Router();

router.get("/", getAllComments);
router.get("/:id", getSingleComment);
router.post("/", isAuthenticated, zodValidator(commentSchema), addNewComment);
router.put("/:id", isAuthenticated, zodValidator(commentSchema), updateComment);
router.delete("/:id", isAuthenticated, deleteComment);

export default router;
