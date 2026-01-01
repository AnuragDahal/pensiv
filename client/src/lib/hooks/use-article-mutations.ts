import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import type { ArticleFormData } from "@/lib/schemas";

export function useArticleMutations() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createArticle = async (data: ArticleFormData & { content: string }) => {
    setIsLoading(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.POSTS.LIST, data);

      toast.success("Article created successfully!");

      // Redirect based on status
      if (data.status === "draft") {
        router.push(ROUTES.DASHBOARD);
      } else {
        router.push(ROUTES.VIEW_ARTICLE(response.data.data.slug));
      }

      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create article";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateArticle = async (
    id: string,
    data: ArticleFormData & { content: string }
  ) => {
    setIsLoading(true);

    try {
      const response = await apiClient.put(API_ENDPOINTS.POSTS.SINGLE(id), data);

      toast.success("Article updated successfully!");

      // Redirect based on status
      if (data.status === "draft") {
        router.push(ROUTES.DASHBOARD);
      } else {
        router.push(ROUTES.VIEW_ARTICLE(response.data.data.slug));
      }

      return response.data.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update article";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    setIsLoading(true);

    try {
      await apiClient.delete(API_ENDPOINTS.POSTS.SINGLE(id));

      toast.success("Article deleted successfully!");
      router.push(ROUTES.MY_ARTICLES);

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete article";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const likeArticle = async (id: string) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.POSTS.LIKE(id));
      return response.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to like article";
      toast.error(message);
      throw error;
    }
  };

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    isLoading,
  };
}
