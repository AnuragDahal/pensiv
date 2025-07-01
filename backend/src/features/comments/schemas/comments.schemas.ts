import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  postId: z.string().min(1, "Post ID is required"),
});

export const replySchema = z.object({
  content: z.string().min(1, "Reply content is required"),
});
