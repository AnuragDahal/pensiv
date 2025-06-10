import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const createArticleFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  category: z.string().nonempty("Category cannot be empty"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image must be less than 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .png, .webp files are allowed",
    })
    .optional(),
});

export type CreateArticleFormSchema = z.infer<typeof createArticleFormSchema>;
