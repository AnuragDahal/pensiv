import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  postImage: z.string().url("Invalid URL").optional(),
});
