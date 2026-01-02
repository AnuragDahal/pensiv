// src/hooks/useArticle.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "@/store/auth-store";
import { ArticleResponse } from "@/types/article";
import axios from "axios";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/** Hook return shape */
export interface UseArticleResult {
  data?: ArticleResponse;
  loading: boolean;
  error?: string;
  /** Refresh the article (e.g. after a like) */
  refetch: () => void;
  togglePostLikes: (id: string) => void;
  toggleCommentLike: (commentId: string) => void;
}

/**
 * Fetch a single article by its slug or Mongo `_id`.
 * The hook automatically maps the backend response to the TS types above.
 */
export const useArticle = (slug: string): UseArticleResult => {
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
  const queryClient = useQueryClient();

  // Use React Query to fetch article data (will use prefetched data if available)
  const {
    data: articleData,
    isLoading: loading,
    error: queryError,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const resp = await axios.get<{ data: ArticleResponse }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return resp.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  });

  const data = articleData;

  const togglePostLikes = async (id: string) => {
    // Optimistic update using React Query
    const previousData = data;
    if (!previousData) return;

    const isLiked = previousData.likes.isLikedByUser;
    const newCount = isLiked ? previousData.likes.count - 1 : previousData.likes.count + 1;

    // Apply optimistic update to cache
    queryClient.setQueryData(["article", slug], {
      ...previousData,
      likes: {
        count: newCount,
        isLikedByUser: !isLiked,
      },
    });

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      // Revert on error
      queryClient.setQueryData(["article", slug], previousData);
      toast.error("Failed to toggle like");
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    const previousData = data;
    if (!previousData) return;

    // Helper to update a comment in the array
    const updateComment = (comments: any[]) =>
      comments.map(c => {
        if (c.id === commentId) {
          const isLiked = c.likes.isLikedByUser;
          return {
            ...c,
            likes: {
              count: isLiked ? c.likes.count - 1 : c.likes.count + 1,
              isLikedByUser: !isLiked
            }
          };
        }
        // Also check replies
        if (c.replies?.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r: any) => {
               if (r.id === commentId) {
                const isLiked = r.likes.isLikedByUser;
                return {
                  ...r,
                  likes: {
                    count: isLiked ? r.likes.count - 1 : r.likes.count + 1,
                    isLikedByUser: !isLiked
                  }
                };
              }
              return r;
            })
          };
        }
        return c;
      });

    // Apply optimistic update to cache
    queryClient.setQueryData(["article", slug], {
      ...previousData,
      comments: updateComment(previousData.comments)
    });

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      // Revert on error
      queryClient.setQueryData(["article", slug], previousData);
      toast.error("Failed to toggle comment like");
    }
  };

  return {
    data,
    loading,
    togglePostLikes,
    toggleCommentLike,
    error: queryError ? "Failed to load article" : undefined,
    refetch: () => {
      refetchQuery();
    },
  };
};
