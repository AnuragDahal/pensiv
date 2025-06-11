import {
  getAllComments,
  getSingleComment,
  addNewComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller";
import { zodValidator } from "@/middlewares";
import { commentSchema } from "../schemas/comments.schemas";
import { Router } from "express";

const router = Router();

router.get("/", getAllComments);
router.get("/:id", getSingleComment);
router.post("/", zodValidator(commentSchema), addNewComment);
router.put("/:id", zodValidator(commentSchema), updateComment);
router.delete("/:id", deleteComment);

export default router;
