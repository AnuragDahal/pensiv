import { z } from "zod";
import { ARTICLE_CATEGORIES, ARTICLE_STATUS } from "@/lib/constants";

/**
 * Centralized Zod validation schemas
 */

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// Article Schemas
export const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(ARTICLE_CATEGORIES as any, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  status: z
    .enum([ARTICLE_STATUS.DRAFT, ARTICLE_STATUS.PUBLISHED] as any)
    .default(ARTICLE_STATUS.PUBLISHED),
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  avatar: z.string().url("Invalid URL").optional(),
  socialLinks: z
    .object({
      github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
      linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
      twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
      portfolio: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
    })
    .optional(),
});

// Comment Schema
export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  postId: z.string().min(1, "Post ID is required"),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type ArticleFormData = z.infer<typeof articleSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
