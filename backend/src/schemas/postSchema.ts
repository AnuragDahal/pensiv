import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const createArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  category: z.string().nonempty("Category cannot be empty"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
  coverImage: z.string().url(),
});

export interface ICreateArticle extends z.infer<typeof createArticleSchema> {}
