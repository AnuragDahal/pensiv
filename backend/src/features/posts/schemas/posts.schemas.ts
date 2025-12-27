import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Invalid URL").optional(),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required"),
  category: z.string().min(1, "Category is required"),
  featured: z.boolean().optional(),
});

export const queryParams = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  q: z.string().optional(),
  category: z.string().optional(),
});

export type PostSchemaType = z.infer<typeof postSchema>;
export type QueryParamsType = z.infer<typeof queryParams>;
