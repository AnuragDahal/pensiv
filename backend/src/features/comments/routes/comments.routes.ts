import { Router } from "express";
import { zodValidator } from "../../../middlewares";
import {
  addNewComment,
  createCommentReply,
  deleteComment,
  getSingleComment,
  updateComment,
  updateCommentLikes
} from "../controllers/comments.controller";
import { commentSchema, replySchema } from "../schemas/comments.schemas";

const router = Router();

// router.get("/", getAllComments);
router.get("/:id", getSingleComment);
router.post("/", zodValidator(commentSchema), addNewComment);
router.put("/:id", zodValidator(commentSchema), updateComment);
router.patch('/:id/like',updateCommentLikes)
router.delete("/:id", deleteComment);
router.post("/reply/:id", zodValidator(replySchema), createCommentReply);

export default router;
