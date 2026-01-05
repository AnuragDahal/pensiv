import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { useAuth } from "@/hooks/use-auth";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  coverImage?: string;
  category: string;
  tags: string[];
  views: number;
  likesCount: number;
  status: "draft" | "published";
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface DashboardStats {
  totalArticles: number;
  totalLikes: number;
  totalViews: number;
  engagementRate: number;
  monthlyGrowth: {
    articles: number;
    likes: number;
    views: number;
  };
}

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface Activity {
  id: string;
  type: "comment" | "like" | "publish";
  description: string;
  articleTitle?: string;
  timestamp: Date;
  icon: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentArticles: Article[];
  topArticles: Article[];
  categoryDistribution: CategoryDistribution[];
  recentActivity: Activity[];
}

export function useDashboardData() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = useCallback((articles: Article[]): DashboardStats => {
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalLikes = articles.reduce((sum, a) => sum + (a.likesCount || 0), 0);
    const engagementRate = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;

    // Calculate monthly growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentArticles = articles.filter(
      (a) => new Date(a.createdAt) >= thirtyDaysAgo
    );

    const recentViews = recentArticles.reduce(
      (sum, a) => sum + (a.views || 0),
      0
    );
    const recentLikes = recentArticles.reduce(
      (sum, a) => sum + (a.likesCount || 0),
      0
    );

    return {
      totalArticles: articles.length,
      totalLikes,
      totalViews,
      engagementRate: Math.round(engagementRate),
      monthlyGrowth: {
        articles: recentArticles.length,
        likes: recentLikes,
        views: recentViews,
      },
    };
  }, []);

  const calculateCategoryDistribution = useCallback(
    (articles: Article[]): CategoryDistribution[] => {
      const categoryMap = new Map<string, number>();

      articles.forEach((article) => {
        const category = article.category || "Uncategorized";
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const total = articles.length;
      return Array.from(categoryMap.entries())
        .map(([category, count]) => ({
          category,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
    },
    []
  );

  const generateMockActivity = useCallback(
    (articles: Article[]): Activity[] => {
      const activities: Activity[] = [];

      // Add recent publishes
      const recentPublishes = articles
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      recentPublishes.forEach((article) => {
        activities.push({
          id: `publish-${article.id}`,
          type: "publish",
          description: `Published "${article.title}"`,
          articleTitle: article.title,
          timestamp: new Date(article.createdAt),
          icon: "FileText",
        });
      });

      // Add mock likes (recent articles with likes)
      const articlesWithLikes = articles
        .filter((a) => a.likesCount > 0)
        .slice(0, 4);

      articlesWithLikes.forEach((article) => {
        activities.push({
          id: `like-${article.id}`,
          type: "like",
          description: `"${article.title}" received ${article.likesCount} likes`,
          articleTitle: article.title,
          timestamp: new Date(article.updatedAt || article.createdAt),
          icon: "Heart",
        });
      });

      // Sort by timestamp and limit to 10
      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);
    },
    []
  );

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all user articles
      const response = await apiClient.get(
        `/api/posts/me`
      );

      const articles: Article[] = response.data.data || [];

      // Calculate all metrics - even if empty
      const stats = calculateStats(articles);
      const recentArticles = articles
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      const topArticles = articles
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);
      const categoryDistribution = calculateCategoryDistribution(articles);
      const recentActivity = generateMockActivity(articles);

      setData({
        stats,
        recentArticles,
        topArticles,
        categoryDistribution,
        recentActivity,
      });
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);

      // For new users with no posts, treat as empty data instead of error
      if (err?.response?.status === 404 || err?.response?.data?.data?.length === 0) {
        setData({
          stats: {
            totalArticles: 0,
            totalLikes: 0,
            totalViews: 0,
            engagementRate: 0,
            monthlyGrowth: {
              articles: 0,
              likes: 0,
              views: 0,
            },
          },
          recentArticles: [],
          topArticles: [],
          categoryDistribution: [],
          recentActivity: [],
        });
        setError(null);
      } else {
        setError("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    calculateStats,
    calculateCategoryDistribution,
    generateMockActivity,
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
    user,
  };
}

