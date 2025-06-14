import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  postImage: z.string().url("Invalid URL").optional(),
});

export const queryParams = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type PostSchemaType = z.infer<typeof postSchema>;
export type QueryParamsType = z.infer<typeof queryParams>;
