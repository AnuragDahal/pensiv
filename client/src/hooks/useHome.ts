import { Article } from "@/types/article";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useHome = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article>(
    {} as Article
  );

  const homePage = useCallback(async () => {
    setLoading(loading);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/home`
      );
      setRecentArticles(response.data.data.recentPosts);
      setFeaturedArticle(response.data.data.featuredPost[0]);
      setLoading(!loading);
    } catch (error) {
      setError(error as string);
      setLoading(!loading);
    }
  }, [loading]);

  useEffect(() => {
    homePage();
  }, [homePage]);

  return {
    recentArticles,
    featuredArticle,
    loading,
    error,
    refetch: homePage,
  };
};
