// src/hooks/useArticle.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ArticleResponse } from "@/types/article";
import { useAuthStore } from "@/store/auth-store";

/** Hook return shape */
export interface UseArticleResult {
  data?: ArticleResponse;
  loading: boolean;
  error?: string;
  /** Refresh the article (e.g. after a like) */
  refetch: () => void;
}

/**
 * Fetch a single article by its slug or Mongo `_id`.
 * The hook automatically maps the backend response to the TS types above.
 */
export const useArticle = (slug: string): UseArticleResult => {
  const [data, setData] = useState<ArticleResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const resp = await axios.get<{ data: ArticleResponse }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // The backend already returns the shape we defined, so just set it.
      setData(resp.data.data);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ?? e.message ?? "Failed to load article"
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
