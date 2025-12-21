import { Article } from "@/types/article";
import axios from "axios";
import { useEffect, useState } from "react";

export const useHome = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article>(
    {} as Article
  );

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/home`
      );
      setRecentArticles(response.data.data.recentPosts);
      setFeaturedArticle(response.data.data.featuredPost[0]);
      setLoading(false);
    } catch (error) {
      setError(error as string);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch with loading
    fetchData(true);

    // Background refresh every 10 minutes (no loading spinner)
    const interval = setInterval(() => {
      fetchData(false); // Silent refresh
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    recentArticles,
    featuredArticle,
    loading,
    error,
    refetch: () => fetchData(true),
  };
};
